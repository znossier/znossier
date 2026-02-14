'use client';

import { useState, useEffect, RefObject } from 'react';

interface TrackInfo {
  name: string;
  artist: string;
  imageUrl: string | null;
}

export function useSpotifyTrackInfo(
  embedRef: RefObject<HTMLIFrameElement>,
  defaultName: string = 'Lock In',
  defaultArtist: string = 'zoz'
): TrackInfo {
  const [trackInfo, setTrackInfo] = useState<TrackInfo>({
    name: defaultName,
    artist: defaultArtist,
    imageUrl: null,
  });

  useEffect(() => {
    if (!embedRef.current) return;

    let observer: MutationObserver | null = null;
    let checkInterval: NodeJS.Timeout | null = null;

    const extractTrackInfo = () => {
      try {
        const iframeDoc = embedRef.current?.contentDocument || embedRef.current?.contentWindow?.document;
        if (!iframeDoc) return;

        // Try to find track name and artist
        // Spotify embed structure may vary, so we try multiple selectors
        const trackNameSelectors = [
          '[data-testid="entityTitle"]',
          '[data-testid="context-item-info-title"]',
          'a[href*="/track/"]',
          '.track-name',
          '[class*="track"] [class*="title"]',
        ];

        const artistSelectors = [
          '[data-testid="context-item-info-artist"]',
          'a[href*="/artist/"]',
          '.artist-name',
          '[class*="artist"]',
        ];

        let trackName = defaultName;
        let artist = defaultArtist;
        let imageUrl: string | null = null;

        // Try to find track name
        for (const selector of trackNameSelectors) {
          const element = iframeDoc.querySelector(selector);
          if (element) {
            const text = element.textContent?.trim();
            if (text && text.length > 0 && text !== trackInfo.name) {
              trackName = text;
              break;
            }
          }
        }

        // Try to find artist
        for (const selector of artistSelectors) {
          const element = iframeDoc.querySelector(selector);
          if (element) {
            const text = element.textContent?.trim();
            if (text && text.length > 0 && text !== trackInfo.artist) {
              artist = text;
              break;
            }
          }
        }

        // Try to find album art
        const imageSelectors = [
          'img[src*="i.scdn.co"]',
          'img[src*="spotifycdn"]',
          'img[alt*="album"]',
          'img[alt*="cover"]',
          '[class*="image"] img',
        ];

        for (const selector of imageSelectors) {
          const img = iframeDoc.querySelector(selector) as HTMLImageElement;
          if (img && img.src && img.src.includes('scdn.co')) {
            imageUrl = img.src;
            break;
          }
        }

        const shouldUpdate = trackName !== trackInfo.name || artist !== trackInfo.artist || imageUrl !== trackInfo.imageUrl;
        if (shouldUpdate) {
          setTrackInfo({
            name: trackName,
            artist: artist,
            imageUrl: imageUrl,
          });
        }
      } catch {
        // CORS prevents iframe document access in most embeds; ignore
      }
    };

    // Use MutationObserver to watch for DOM changes
    try {
      const iframeDoc = embedRef.current.contentDocument || embedRef.current.contentWindow?.document;
      if (iframeDoc) {
        observer = new MutationObserver(() => extractTrackInfo());

        observer.observe(iframeDoc.body || iframeDoc.documentElement, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['src', 'alt', 'href'],
        });

        // Also check periodically as fallback
        checkInterval = setInterval(extractTrackInfo, 2000);
      }
    } catch {
      checkInterval = setInterval(extractTrackInfo, 2000);
    }

    // Initial check
    setTimeout(extractTrackInfo, 1000);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [embedRef, defaultName, defaultArtist, trackInfo.name, trackInfo.artist, trackInfo.imageUrl]);

  return trackInfo;
}
