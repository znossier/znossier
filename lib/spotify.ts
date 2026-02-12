'use client';

// Spotify API Types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

export interface SpotifyPlaylistResponse {
  tracks: {
    items: Array<{
      track: SpotifyTrack | null;
    }>;
  };
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// API Client Functions
export async function getSpotifyToken(): Promise<string> {
  const response = await fetch('/api/spotify?endpoint=token');
  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }
  const data = await response.json();
  return data.access_token;
}

export async function getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
  const response = await fetch(`/api/spotify?endpoint=playlist&playlistId=${playlistId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch playlist tracks');
  }
  
  const data: SpotifyPlaylistResponse = await response.json();
  return data.tracks.items
    .map((item) => item.track)
    .filter((track): track is SpotifyTrack => track !== null);
}

export async function getTrackDetails(trackId: string): Promise<SpotifyTrack> {
  const response = await fetch(`/api/spotify/track/${trackId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch track details');
  }
  
  return response.json();
}

// Format duration from milliseconds to MM:SS
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
