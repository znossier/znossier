'use client';

import { VinylPlayer } from './VinylPlayer';

/** Playlist ID from Spotify (e.g. from https://open.spotify.com/playlist/XXXXX). Required in production: set NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID in your hosting env. */
const DEFAULT_PLAYLIST_ID = '5hLoNXwLDhfzloOzaqs1X9';

export function VinylPlayerWrapper() {
  const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID ?? DEFAULT_PLAYLIST_ID;

  return <VinylPlayer playlistId={playlistId} />;
}
