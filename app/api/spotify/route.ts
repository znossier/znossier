import { NextRequest, NextResponse } from 'next/server';

// In-memory token cache (in production, consider using Redis or similar)
let tokenCache: {
  access_token: string;
  expires_at: number;
} | null = null;

async function getAccessToken(): Promise<string> {
  // Check if cached token is still valid (with 5 minute buffer)
  if (tokenCache && tokenCache.expires_at > Date.now() + 5 * 60 * 1000) {
    return tokenCache.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  // Get new token using Client Credentials flow
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify token request failed: ${error}`);
  }

  const data = await response.json();
  
  // Cache the token
  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in * 1000),
  };

  return data.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (endpoint === 'token') {
      const token = await getAccessToken();
      return NextResponse.json({ access_token: token });
    }

    if (endpoint === 'playlist') {
      const playlistId = searchParams.get('playlistId');
      if (!playlistId) {
        return NextResponse.json(
          { error: 'playlistId is required' },
          { status: 400 }
        );
      }

      const token = await getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json(
          { error: `Spotify API error: ${error}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
