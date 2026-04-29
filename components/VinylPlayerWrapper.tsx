'use client';

import dynamic from 'next/dynamic';

/** Playlist ID from Spotify (e.g. from https://open.spotify.com/playlist/XXXXX). Required in production: set NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID in your hosting env. */
const DEFAULT_PLAYLIST_ID = '5hLoNXwLDhfzloOzaqs1X9';
const VINYL_PLAYER_ENABLED = false;

const VinylPlayer = dynamic(() => import('./VinylPlayer').then((m) => ({ default: m.VinylPlayer })), {
  ssr: false,
});

export function VinylPlayerWrapper() {
  if (!VINYL_PLAYER_ENABLED) {
    return null;
  }

  const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID ?? DEFAULT_PLAYLIST_ID;

  return <VinylPlayer playlistId={playlistId} />;
}
