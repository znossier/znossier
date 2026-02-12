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
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:28',message:'extractTrackInfo called',data:{hasRef:!!embedRef.current},timestamp:Date.now(),runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
      // #endregion
      try {
        const iframeDoc = embedRef.current?.contentDocument || embedRef.current?.contentWindow?.document;
        if (!iframeDoc) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:31',message:'Cannot access iframe document',data:{hasRef:!!embedRef.current},timestamp:Date.now(),runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
          // #endregion
          return;
        }

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
            // #region agent log
            fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:56',message:'Found track name element',data:{selector,text,currentName:trackInfo.name,willUpdate:text!==trackInfo.name&&text.length>0},timestamp:Date.now(),runId:'run1',hypothesisId:'H7'})}).catch(()=>{});
            // #endregion
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
            // #region agent log
            fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:68',message:'Found artist element',data:{selector,text,currentArtist:trackInfo.artist,willUpdate:text!==trackInfo.artist&&text.length>0},timestamp:Date.now(),runId:'run1',hypothesisId:'H7'})}).catch(()=>{});
            // #endregion
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

        // Only update if we found new info
        const shouldUpdate = trackName !== trackInfo.name || artist !== trackInfo.artist || imageUrl !== trackInfo.imageUrl;
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:96',message:'Track info extraction result',data:{trackName,artist,imageUrl,currentName:trackInfo.name,currentArtist:trackInfo.artist,currentImage:trackInfo.imageUrl,shouldUpdate},timestamp:Date.now(),runId:'run1',hypothesisId:'H8'})}).catch(()=>{});
        // #endregion
        if (shouldUpdate) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:100',message:'Updating track info state',data:{trackName,artist,imageUrl},timestamp:Date.now(),runId:'run1',hypothesisId:'H8'})}).catch(()=>{});
          // #endregion
          setTrackInfo({
            name: trackName,
            artist: artist,
            imageUrl: imageUrl,
          });
        }
      } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:104',message:'CORS error in extractTrackInfo',data:{error:String(e)},timestamp:Date.now(),runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
        // #endregion
        // CORS restrictions - silently fail
      }
    };

    // Use MutationObserver to watch for DOM changes
    try {
      const iframeDoc = embedRef.current.contentDocument || embedRef.current.contentWindow?.document;
      if (iframeDoc) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:110',message:'Setting up MutationObserver',data:{hasBody:!!iframeDoc.body,hasDocElement:!!iframeDoc.documentElement},timestamp:Date.now(),runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
        // #endregion
        observer = new MutationObserver(() => {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:113',message:'MutationObserver callback fired',data:{},timestamp:Date.now(),runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
          // #endregion
          extractTrackInfo();
        });

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
    } catch (e) {
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSpotifyTrackInfo.ts:128',message:'MutationObserver setup failed, using interval only',data:{error:String(e)},timestamp:Date.now(),runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
      // #endregion
      // CORS restrictions - fallback to periodic checks only
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
