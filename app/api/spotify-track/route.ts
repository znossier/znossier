import { NextRequest, NextResponse } from 'next/server';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
const trackCache = new Map<string, { artist: string | null; source: string; at: number }>();

// Serialize Spotify Web API requests to avoid 429 from parallel track calls
let spotifyQueue = Promise.resolve();

const MAX_ARTIST_LENGTH = 80;
const MIN_ARTIST_LENGTH = 1;

function sanitizeArtist(s: string | null | undefined): string | null {
  if (s == null || typeof s !== 'string') return null;
  const trimmed = s.replace(/\s+/g, ' ').trim();
  if (trimmed.length < MIN_ARTIST_LENGTH || trimmed.length > MAX_ARTIST_LENGTH) return null;
  if (trimmed.toLowerCase() === 'spotify') return null;
  if (/[\x00-\x1f\x7f]/.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes('spotify.com')) return null;
  if (/^[^\w\s\u00c0-\u024f'-]+$/i.test(trimmed)) return null;
  return trimmed;
}

function parseArtistFromMatch(match: RegExpMatchArray | null): string | null {
  if (!match?.[1]) return null;
  return sanitizeArtist(match[1].replace(/\\u0022/g, '"').trim()) ?? null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trackId = searchParams.get('trackId');
  const trackName = searchParams.get('name') ?? '';

  if (!trackId) {
    return NextResponse.json({ error: 'trackId is required' }, { status: 400 });
  }
  // Spotify track IDs are 22 alphanumeric chars; reject playlist URI or malformed
  const validTrackId = /^[a-zA-Z0-9]{22}$/.test(trackId);
  if (!validTrackId) {
    return NextResponse.json({ artist: null, source: null }, { status: 200 });
  }

  const cached = trackCache.get(trackId);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json({ artist: cached.artist, source: cached.source });
  }

  let artist: string | null = null;
  let source: 'webapi' | 'scrape' | 'musicbrainz' | null = null;

  try {
    // 0) Optional: Spotify Web API (canonical artist) when env is set — one request at a time to avoid 429
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (clientId && clientSecret) {
      const runWebApi = async (): Promise<void> => {
        const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          },
          body: 'grant_type=client_credentials',
        });
        if (!tokenRes.ok) return;
        const tokenData = (await tokenRes.json()) as { access_token?: string };
        const accessToken = tokenData.access_token;
        if (!accessToken) return;
        const TRACK_FETCH_MS = 12000;
        const withTimeout = (url: string, opts: RequestInit) => {
          const ac = new AbortController();
          const t = setTimeout(() => ac.abort(), TRACK_FETCH_MS);
          return fetch(url, { ...opts, signal: ac.signal }).finally(() => clearTimeout(t));
        };
        const trackOpts = { headers: { Authorization: `Bearer ${accessToken}` } };
        let trackRes = await withTimeout(`https://api.spotify.com/v1/tracks/${trackId}`, trackOpts);
        if (trackRes.status === 429) {
          const retryAfter = Math.max(5, parseInt(trackRes.headers.get('retry-after') ?? '5', 10) || 5);
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          trackRes = await withTimeout(`https://api.spotify.com/v1/tracks/${trackId}`, trackOpts);
        }
        if (trackRes.ok) {
          const trackData = (await trackRes.json()) as { artists?: { name?: string }[] };
          const first = trackData.artists?.[0]?.name;
          if (first) {
            artist = sanitizeArtist(first) ?? null;
            if (artist) source = 'webapi';
          }
        }
      };
      const prev = spotifyQueue;
      let resolve: () => void;
      spotifyQueue = new Promise<void>((r) => { resolve = r; });
      try {
        await prev;
        await runWebApi();
      } catch {
        // ignore, fall through to scraping
      } finally {
        resolve!();
      }
    }

    // 1) Spotify track page HTML and __NEXT_DATA__ (unreliable: can return wrong artist for same trackId)
    if (!artist) {
      const scrapeAc = new AbortController();
      const scrapeT = setTimeout(() => scrapeAc.abort(), 15000);
      const response = await fetch(`https://open.spotify.com/track/${trackId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html',
        },
        signal: scrapeAc.signal,
      }).finally(() => clearTimeout(scrapeT));

      if (response.ok) {
        const html = await response.text();
        const artistRegex = /"artists":\s*\[\s*\{\s*"name":\s*"((?:[^"\\]|\\.)+)"/;
        const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);

        if (nextDataMatch) {
          try {
            const data = JSON.parse(nextDataMatch[1]) as Record<string, unknown>;
            const trackUri = `spotify:track:${trackId}`;

            const findTrackArtist = (obj: unknown, depth: number): string | null => {
              if (!obj || typeof obj !== 'object' || depth > 25) return null;
              const o = obj as Record<string, unknown>;
              const uri = o.uri as string | undefined;
              const id = o.id as string | undefined;
              const isTrack = o.type === 'track' || (typeof uri === 'string' && uri.includes('track'));
              const matchesTrack =
                (typeof id === 'string' && id === trackId) ||
                (typeof uri === 'string' && (uri === trackUri || uri.endsWith(trackId)));
              if (isTrack && matchesTrack) {
                const artists = o.artists as { name?: string }[] | undefined;
                const first = artists?.[0]?.name;
                if (typeof first === 'string') return first;
              }
              for (const v of Object.values(o)) {
                if (Array.isArray(v)) {
                  for (const item of v) {
                    const found = findTrackArtist(item, depth + 1);
                    if (found) return found;
                  }
                } else {
                  const found = findTrackArtist(v, depth + 1);
                  if (found) return found;
                }
              }
              return null;
            };

            const findArtist = (obj: unknown): string | null => {
              if (!obj || typeof obj !== 'object') return null;
              const o = obj as Record<string, unknown>;
              if (o.artists && Array.isArray(o.artists)) {
                const first = (o.artists[0] as { name?: string } | undefined)?.name;
                if (typeof first === 'string') return first;
              }
              for (const v of Object.values(o)) {
                const found = findArtist(v);
                if (found) return found;
              }
              return null;
            };

            artist = sanitizeArtist(findTrackArtist(data, 0)) ?? null;
            if (!artist) artist = sanitizeArtist(findArtist(data)) ?? null;
            if (artist) source = 'scrape';
          } catch {
            // ignore parse errors
          }
        }

        if (!artist) {
          const trackInHtml = html.indexOf(`spotify:track:${trackId}`);
          if (trackInHtml !== -1) {
            const after = html.slice(trackInHtml, trackInHtml + 2500);
            artist = parseArtistFromMatch(after.match(artistRegex));
          }
        }
        if (!artist) artist = parseArtistFromMatch(html.match(artistRegex));
        if (!artist && nextDataMatch) {
          const jsonStr = nextDataMatch[1];
          const idx = jsonStr.indexOf(`spotify:track:${trackId}`);
          if (idx !== -1) artist = parseArtistFromMatch(jsonStr.slice(idx, idx + 2000).match(artistRegex));
        }
        if (!artist) artist = parseArtistFromMatch(html.match(/"byArtist":\s*\{\s*"name":\s*"((?:[^"\\]|\\.)+)"/));
        if (!artist) {
          const linkMatch = html.match(/spotify\.com\/artist\/[a-zA-Z0-9]+["'][^>]*>([^<]{1,100})</);
          if (linkMatch?.[1] && linkMatch[1].length > 0 && linkMatch[1].length < 80) {
            artist = sanitizeArtist(linkMatch[1].trim()) ?? null;
          }
        }
        if (artist && !source) source = 'scrape';
      }
    }

    // 2) Fallback: MusicBrainz search by track name (no API key required)
    if (!artist && trackName && trackName.length > 1) {
      try {
        const mbRes = await fetch(
          `https://musicbrainz.org/ws/2/recording/?query=recording:${encodeURIComponent(trackName)}&fmt=json&limit=1`,
          { headers: { 'User-Agent': 'VinylPlayer/1.0 (https://github.com)' } }
        );
        if (mbRes.ok) {
          const mb = (await mbRes.json()) as { recordings?: { 'artist-credit'?: { name?: string }[] }[] };
          const first = mb.recordings?.[0]?.['artist-credit']?.[0]?.name;
          if (first) {
            artist = sanitizeArtist(first) ?? null;
            if (artist) source = 'musicbrainz';
          }
        }
      } catch {
        // ignore
      }
    }
  } catch (error) {
    console.error('Error fetching track artist:', error);
  }

  if (source === 'webapi' && artist) {
    trackCache.set(trackId, { artist, source, at: Date.now() });
  }

  return NextResponse.json({ artist, source });
}
