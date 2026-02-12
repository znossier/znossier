import { NextRequest, NextResponse } from 'next/server';

const MAX_ARTIST_LENGTH = 80;
const MIN_ARTIST_LENGTH = 1;

function sanitizeArtist(s: string | null | undefined): string | null {
  if (s == null || typeof s !== 'string') return null;
  const trimmed = s.replace(/\s+/g, ' ').trim();
  if (trimmed.length < MIN_ARTIST_LENGTH || trimmed.length > MAX_ARTIST_LENGTH) return null;
  if (trimmed.toLowerCase() === 'spotify') return null; // never use brand as artist
  if (/[\x00-\x1f\x7f]/.test(trimmed)) return null; // control chars
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes('spotify.com')) return null;
  if (/^[^\w\s\u00c0-\u024f'-]+$/i.test(trimmed)) return null; // only symbols
  return trimmed;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trackId = searchParams.get('trackId');
  const trackName = searchParams.get('name') ?? '';

  if (!trackId) {
    return NextResponse.json({ error: 'trackId is required' }, { status: 400 });
  }

  let artist: string | null = null;

  try {
    // 0) Optional: Spotify Web API (clean artist names) when env is set
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (clientId && clientSecret) {
      try {
        const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          },
          body: 'grant_type=client_credentials',
        });
        if (tokenRes.ok) {
          const tokenData = (await tokenRes.json()) as { access_token?: string };
          const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          if (trackRes.ok) {
            const trackData = (await trackRes.json()) as { artists?: { name?: string }[] };
            const first = trackData.artists?.[0]?.name;
            if (first) {
              artist = sanitizeArtist(first) ?? null;
            }
          }
        }
      } catch {
        // ignore, fall through to scraping
      }
    }

    // 1) Try Spotify track page HTML (and __NEXT_DATA__)
    if (!artist) {
      const response = await fetch(`https://open.spotify.com/track/${trackId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
    });

    if (response.ok) {
      const html = await response.text();

      // Prefer __NEXT_DATA__: get artist from the track entity for this trackId, not first artist in page
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
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
            const matchesTrack = (typeof id === 'string' && id === trackId) ||
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
          artist = sanitizeArtist(findTrackArtist(data, 0)) ?? null;
          if (!artist) {
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
            artist = sanitizeArtist(findArtist(data)) ?? null;
          }
        } catch {
          // ignore
        }
      }
      // Prefer artist near this track in raw HTML (avoids first "artists" being playlist/Spotify)
      if (!artist) {
        const trackInHtml = html.indexOf(`spotify:track:${trackId}`);
        if (trackInHtml !== -1) {
          const after = html.slice(trackInHtml, trackInHtml + 2500);
          const nearMatch = after.match(/"artists":\s*\[\s*\{\s*"name":\s*"((?:[^"\\]|\\.)+)"/);
          if (nearMatch) artist = sanitizeArtist(nearMatch[1].replace(/\\u0022/g, '"').trim()) ?? null;
        }
      }
      if (!artist) {
        const artistsMatch = html.match(/"artists":\s*\[\s*\{\s*"name":\s*"((?:[^"\\]|\\.)+)"/);
        if (artistsMatch) {
          artist = sanitizeArtist(artistsMatch[1].replace(/\\u0022/g, '"').trim()) ?? null;
        }
      }
      if (!artist && nextDataMatch) {
        const jsonStr = nextDataMatch[1];
        const idx = jsonStr.indexOf(`spotify:track:${trackId}`);
        if (idx !== -1) {
          const after = jsonStr.slice(idx, idx + 2000);
          const nameMatch = after.match(/"artists":\s*\[\s*\{\s*"name":\s*"((?:[^"\\]|\\.)+)"/);
          if (nameMatch) artist = sanitizeArtist(nameMatch[1].replace(/\\u0022/g, '"').trim()) ?? null;
        }
      }
      if (!artist) {
        const byArtistMatch = html.match(/"byArtist":\s*\{\s*"name":\s*"((?:[^"\\]|\\.)+)"/);
        if (byArtistMatch) {
          artist = sanitizeArtist(byArtistMatch[1].replace(/\\u0022/g, '"').trim()) ?? null;
        }
      }
      if (!artist) {
        const linkMatch = html.match(/spotify\.com\/artist\/[a-zA-Z0-9]+["'][^>]*>([^<]{1,100})</);
        if (linkMatch && linkMatch[1].length > 0 && linkMatch[1].length < 80) {
          artist = sanitizeArtist(linkMatch[1].trim()) ?? null;
        }
      }
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
          }
        }
      } catch {
        // ignore
      }
    }
  } catch (error) {
    console.error('Error fetching track artist:', error);
  }

  return NextResponse.json({ artist });
}
