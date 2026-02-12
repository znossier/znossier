'use client';

import { VinylPlayer } from './VinylPlayer';

export function VinylPlayerWrapper() {
  const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
  
  if (!playlistId) {
    return null;
  }

  return <VinylPlayer playlistId={playlistId} />;
}
