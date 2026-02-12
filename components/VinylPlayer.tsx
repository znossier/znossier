'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Spotify Embed Controller (from iframe API)
interface SpotifyEmbedController {
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  addListener: (event: string, cb: (e: { data?: { isPaused?: boolean; playingURI?: string } }) => void) => void;
}
interface SpotifyIFrameAPI {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
    __spotifyIframeAPI?: SpotifyIFrameAPI;
  }
}

interface VinylPlayerProps {
  playlistId: string;
  className?: string;
}

export function VinylPlayer({ playlistId, className }: VinylPlayerProps) {
  const embedContainerRef = useRef<HTMLDivElement | null>(null);
  const embedWrapperRef = useRef<HTMLDivElement | null>(null);
  const embedControllerRef = useRef<SpotifyEmbedController | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isInteractingWithEmbed, setIsInteractingWithEmbed] = useState(false);
  const rotation = useMotionValue(0);

  const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}`;
  const spotifyPlaylistUri = `spotify:playlist:${playlistId}`;

  // Track info state - updated via postMessage
  const [trackInfo, setTrackInfo] = useState({ name: 'Lock In', artist: 'zoz', imageUrl: null as string | null });
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const fetchInFlightRef = useRef<string | null>(null);
  const [dominantColor, setDominantColor] = useState<string>('#2a1810'); // default vinyl-ish brown
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Listen for postMessage from Spotify embed
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://open.spotify.com' && event.data) {
        try {
          // Spotify embed sends playback updates via postMessage with payload structure
          if (event.data.type === 'playback_update' && event.data.payload) {
            const payload = event.data.payload;
            const newIsPlaying = !payload.isPaused; // Invert isPaused to get isPlaying
            if (newIsPlaying !== isPlaying) {
              setIsPlaying(newIsPlaying);
            }
            
            // Store playingURI for track info
            if (payload.playingURI && payload.playingURI.startsWith('spotify:track:')) {
              const trackId = payload.playingURI.replace('spotify:track:', '');
            if (trackId !== currentTrackId) {
              setCurrentTrackId(trackId);
              // Fetch actual track metadata
              fetchTrackMetadata(trackId);
            }
            }
          }
          
          // Handle playback_started event
          if (event.data.type === 'playback_started' && event.data.payload?.playingURI) {
            const trackId = event.data.payload.playingURI.replace('spotify:track:', '');
            setCurrentTrackId(trackId);
            setIsPlaying(true);
            fetchTrackMetadata(trackId);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPlaying]);

  // Load Spotify iframe API and create controller so we can call play/pause from our button
  useEffect(() => {
    const container = embedContainerRef.current;
    if (!container) return;

    const initEmbed = (IFrameAPI: SpotifyIFrameAPI) => {
      window.__spotifyIframeAPI = IFrameAPI;
      if (!embedContainerRef.current) return;
      IFrameAPI.createController(
        embedContainerRef.current,
        {
          uri: spotifyPlaylistUri,
          width: '100%',
          height: 152,
        },
        (EmbedController) => {
          embedControllerRef.current = EmbedController;
          // Style the injected iframe so it has rounded corners (no white corners)
          const styleIframe = () => {
            const iframe = embedWrapperRef.current?.querySelector('iframe');
            if (iframe) {
              const el = iframe as HTMLIFrameElement;
              el.style.borderRadius = '0.5rem';
              el.style.overflow = 'hidden';
              return true;
            }
            return false;
          };
          if (!styleIframe()) setTimeout(styleIframe, 150);
          EmbedController.addListener('playback_update', (e) => {
            if (e.data?.isPaused !== undefined) {
              setIsPlaying(!e.data.isPaused);
            }
            if (e.data?.playingURI?.startsWith('spotify:track:')) {
              const trackId = e.data.playingURI.replace('spotify:track:', '');
              setCurrentTrackId(trackId);
              fetchTrackMetadata(trackId);
            }
          });
          EmbedController.addListener('playback_started', (e) => {
            if (e.data?.playingURI?.startsWith('spotify:track:')) {
              const trackId = e.data.playingURI.replace('spotify:track:', '');
              setCurrentTrackId(trackId);
              setIsPlaying(true);
              fetchTrackMetadata(trackId);
            }
          });
          // Best-effort autoplay (browsers may block until user gesture)
          try {
            EmbedController.resume();
          } catch {
            // ignore
          }
        }
      );
    };

    if (typeof window !== 'undefined' && window.__spotifyIframeAPI) {
      initEmbed(window.__spotifyIframeAPI);
    } else {
      window.onSpotifyIframeApiReady = initEmbed;
      const existing = document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // Script already there but API not stored (e.g. loaded before we set callback) - can't recover; rely on next mount
      }
    }

    return () => {
      window.onSpotifyIframeApiReady = undefined;
      embedControllerRef.current = null;
    };
  }, [spotifyPlaylistUri]);

  // First user interaction: start playback (unlocks autoplay) and mark interacted
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      try {
        embedControllerRef.current?.resume();
      } catch {
        // ignore
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Fetch track metadata from Spotify oEmbed API and track page
  const fetchTrackMetadata = async (trackId: string) => {
    if (fetchInFlightRef.current === trackId) return;
    fetchInFlightRef.current = trackId;
    try {
      // Fetch oEmbed for track name and image
      const oEmbedResponse = await fetch(
        `https://open.spotify.com/oembed?url=spotify:track:${trackId}&format=json`
      );

      let name = 'Unknown';
      let artist = 'Unknown';
      let imageUrl: string | null = null;
      let oembedTitle: string | null = null;

      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        oembedTitle = oEmbedData.title ?? null;
        name = oEmbedData.title || 'Unknown';
        imageUrl = oEmbedData.thumbnail_url || null;
        // Primary artist source: oEmbed title is often "Track Name – Artist" or "Track Name - Artist"
        if (oembedTitle) {
          const parts = oembedTitle.split(/\s*[–-]\s+/);
          if (parts.length >= 2) {
            const possibleArtist = parts[parts.length - 1].trim();
            if (possibleArtist.length > 0 && possibleArtist.length < 100 && !/https?:\/\//i.test(possibleArtist) && possibleArtist.toLowerCase() !== 'spotify') {
              artist = possibleArtist;
            }
          }
        }
      }

      // Override with API when it returns a valid artist (server scraping/Web API)
      try {
        const artistResponse = await fetch(`/api/spotify-track?trackId=${trackId}&name=${encodeURIComponent(name)}`);
        if (artistResponse.ok) {
          const artistData = await artistResponse.json();
          if (artistData.artist) artist = artistData.artist;
        }
      } catch {
        // keep artist from oEmbed title
      }

      const finalArtist = artist !== 'Unknown' ? artist : 'Spotify';
      setTrackInfo((prev) => ({
        name,
        imageUrl,
        artist: finalArtist !== 'Spotify' ? finalArtist : (prev.name === name ? prev.artist : 'Spotify'),
      }));
    } catch (error) {
      console.error('Failed to fetch track metadata:', error);
    } finally {
      if (fetchInFlightRef.current === trackId) fetchInFlightRef.current = null;
    }
  };

  // Pre-load playlist title/thumbnail on mount (playlist oEmbed is playlist name, not track)
  useEffect(() => {
    const loadPlaylistInfo = async () => {
      try {
        const response = await fetch(
          `https://open.spotify.com/oembed?url=${spotifyUrl}&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.title) {
            setTrackInfo((prev) => ({
              ...prev,
              name: data.title,
              artist: 'Spotify',
              imageUrl: data.thumbnail_url ?? prev.imageUrl,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load playlist info:', error);
      }
    };
    loadPlaylistInfo();
  }, [spotifyUrl]);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mobile layout: full-width bar below md (768px)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Handle rotation animation (disabled when prefers-reduced-motion)
  useEffect(() => {
    if (isPlaying && !reducedMotion) {
      const controls = animate(rotation, rotation.get() + 360, {
        duration: 3,
        ease: 'linear',
        repeat: Infinity,
      });
      return () => controls.stop();
    }
  }, [isPlaying, rotation, reducedMotion]);

  // Derive dominant color from track image for the disc
  useEffect(() => {
    if (!trackInfo.imageUrl) {
      setDominantColor('#2a1810');
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0;
        const step = 4;
        for (let i = 0; i < data.length; i += step) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        const n = (data.length / step);
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
        setDominantColor(hex);
      } catch {
        setDominantColor('#2a1810');
      }
    };
    img.onerror = () => setDominantColor('#2a1810');
    img.src = trackInfo.imageUrl;
  }, [trackInfo.imageUrl]);

  // Note: CORS prevents direct iframe access, so we rely on postMessage from Spotify embed
  // Playback state is updated via postMessage listener above

  const togglePlayPause = () => {
    setHasUserInteracted(true);
    setIsInteractingWithEmbed(true);
    if (!isHovered) {
      setIsHovered(true);
    }
    const controller = embedControllerRef.current;
    if (controller) {
      controller.togglePlay();
    } else {
      const iframe = embedWrapperRef.current?.querySelector('iframe');
      if (iframe) (iframe as HTMLIFrameElement).focus();
    }
  };

  // Mobile: tap outside widget to collapse when expanded
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!isHovered) return;
      const target = e.target as Node | null;
      // If target is not a Node (e.g. from cross-origin iframe), don't call contains(); treat as contained so we don't collapse
      const contained = target instanceof Node ? (widgetRef.current?.contains(target) ?? false) : true;
      if (widgetRef.current && !contained) {
        setIsHovered(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isHovered]);

  return (
    <motion.div
      ref={widgetRef}
      role="region"
      aria-label="Spotify music player"
      className={cn(
        'fixed z-50',
        'bottom-0 left-0 right-20 md:right-auto md:left-6 md:bottom-6 md:right-auto',
        'px-4 pt-3 md:px-0 md:pt-0',
        'pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-0',
        'max-w-[calc(100vw-2rem)] md:max-w-none',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={(e) => {
        if (isMobile) return;
        const relatedTarget = e.relatedTarget as HTMLElement;
        const isIframe = relatedTarget?.tagName === 'IFRAME';
        const embedContains = relatedTarget instanceof Node && !!embedWrapperRef.current?.contains(relatedTarget);
        if (isIframe || embedContains) return;
        setIsHovered(false);
      }}
    >
      {/* Main container: full width on mobile, animated size on desktop */}
      <motion.div
        className={cn('relative', isMobile && 'w-full')}
        animate={
          isMobile
            ? { width: '100%', height: isHovered ? 260 : 80 }
            : {
                width: isHovered ? 380 : 220,
                height: isHovered ? 260 : 80,
              }
        }
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          transformOrigin: isMobile ? 'center bottom' : 'left bottom',
        }}
      >
        {/* Shadow/glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
            filter: 'blur(12px)',
            transform: 'translateY(4px)',
            zIndex: -1,
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Main card */}
        <motion.div
          className="rounded-xl relative overflow-hidden backdrop-blur-xl"
          style={{
            background: 'linear-gradient(145deg, rgba(42,42,42,0.98) 0%, rgba(26,26,26,0.98) 50%, rgba(15,15,15,0.98) 100%)',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.6),
              0 8px 32px rgba(0,0,0,0.6),
              0 2px 8px rgba(0,0,0,0.4)
            `,
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          animate={{
            padding: isHovered ? '1rem' : '0.875rem',
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Shine overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl opacity-25"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Always visible: Vinyl + Track Info Row */}
            <div className="flex items-center gap-3 flex-shrink-0 h-full">
              {/* Vinyl Player - Reference: fixed album cover + rotating disc + fixed tonearm */}
              <motion.div
                className="relative flex-shrink-0 w-[84px] h-16 cursor-pointer"
                onClick={togglePlayPause}
                whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                style={{
                  boxShadow: isPlaying
                    ? '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)'
                    : '0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
              >
                {/* Rotating disc (under the cover) - color from track image */}
                <motion.div
                  className="absolute rounded-full overflow-hidden"
                  style={{
                    width: 60,
                    height: 60,
                    left: 24,
                    top: 2,
                    rotate: rotation,
                    zIndex: 0,
                    background: `
                      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, transparent 40%),
                      radial-gradient(circle at 70% 70%, rgba(0,0,0,0.4) 0%, transparent 40%),
                      radial-gradient(circle, ${dominantColor} 0%, ${dominantColor} 40%, rgba(0,0,0,0.85) 100%)
                    `,
                    boxShadow: `
                      inset 0 2px 4px rgba(255,255,255,0.08),
                      inset 0 -2px 4px rgba(0,0,0,0.6),
                      0 4px 12px rgba(0,0,0,0.7)
                    `,
                  }}
                >
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => {
                      const size = 15 + i * 4;
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full border border-white/10"
                          style={{
                            width: `${size}%`,
                            height: `${size}%`,
                            top: `${(100 - size) / 2}%`,
                            left: `${(100 - size) / 2}%`,
                            opacity: 0.35,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="rounded-full bg-black/4 border border-white/10"
                      style={{ width: '22%', height: '22%' }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black shadow-inner"
                    style={{ zIndex: 2 }}
                  />
                </motion.div>

                {/* Fixed square album cover on top (left) */}
                <div
                  className="absolute left-0 top-1 rounded-md overflow-hidden pointer-events-none z-10"
                  style={{
                    width: 52,
                    height: 52,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                  {trackInfo.imageUrl ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${trackInfo.imageUrl})`,
                          filter: 'contrast(1.05) brightness(0.96)',
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `
                            repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.04) 2px 4px),
                            repeating-linear-gradient(90deg, transparent 0 2px, rgba(0,0,0,0.04) 2px 4px)
                          `,
                          mixBlendMode: 'multiply',
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 bg-neutral-700"
                      style={{
                        background: 'linear-gradient(135deg, rgba(60,60,60,0.98) 0%, rgba(40,40,40,0.98) 100%)',
                      }}
                    />
                  )}
                </div>

                {/* Fixed tonearm (does not rotate) */}
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    top: 0,
                    right: 2,
                    width: 26,
                    height: 36,
                    transformOrigin: 'top right',
                    transform: 'rotate(-25deg)',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(220,220,220,0.95), rgba(140,140,140,1))',
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  />
                  <svg
                    className="absolute"
                    style={{ top: 2, right: 2, width: 18, height: 30 }}
                    viewBox="0 0 20 32"
                  >
                    <path
                      d="M 2 0 Q 8 8, 10 16 Q 12 24, 18 32"
                      stroke="url(#tonearmGrad)"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="tonearmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(200,200,200,0.95)" />
                        <stop offset="100%" stopColor="rgba(150,150,150,0.9)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1 rounded-sm bg-neutral-600"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.6)' }}
                  />
                </div>

                {/* Play/Pause - fixed on top, min 44px touch target for mobile */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40',
                    'min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center',
                    'bg-black/60 hover:bg-black/80 backdrop-blur-sm',
                    'transition-all focus:outline-none focus:ring-2 focus:ring-white/50',
                    'shadow-lg border border-white/10'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </motion.button>
              </motion.div>

              {/* Track Info - Always visible; tap to expand on mobile. Min 44px touch target. */}
              <div
                className="flex-1 min-w-0 flex flex-col justify-center px-1 min-h-[44px] cursor-pointer touch-manipulation flex items-center md:items-stretch"
                onClick={() => {
                  if (isMobile) {
                    setIsHovered((prev) => !prev);
                  } else if (!isHovered) {
                    setIsHovered(true);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isMobile) {
                      setIsHovered((prev) => !prev);
                    } else if (!isHovered) {
                      setIsHovered(true);
                    }
                  }
                }}
                aria-label={isMobile ? (isHovered ? 'Close player' : 'Expand player') : 'Expand player'}
              >
                <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
                  <div className="text-sm font-semibold text-white truncate leading-tight">
                    {trackInfo.name}
                  </div>
                  <div className="text-xs text-white/50 truncate leading-tight mt-0.5">
                    {trackInfo.artist}
                  </div>
                </div>
                {/* Mobile: explicit expand/collapse affordance */}
                {isMobile && (
                  <span className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 -mr-2 md:hidden" aria-hidden>
                    {isHovered ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Spotify Embed Player - Always rendered, visibility controlled */}
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? 'auto' : 0,
                marginTop: isHovered ? '0.75rem' : 0,
              }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-hidden"
              style={{
                visibility: isHovered ? 'visible' : 'hidden',
                pointerEvents: isHovered ? 'auto' : 'none',
                backgroundColor: '#1a1a1a',
                borderRadius: '0.5rem',
              }}
            >
              {/* Spotify Embed - iframe styled in JS for rounded corners */}
              <div
                ref={embedWrapperRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInteractingWithEmbed(true);
                }}
                onMouseEnter={() => setIsInteractingWithEmbed(true)}
                onMouseLeave={() => setIsInteractingWithEmbed(false)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full relative overflow-hidden rounded-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '0.5rem',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                <div
                  ref={embedContainerRef}
                  className="w-full h-[152px] min-h-[152px]"
                  style={{ backgroundColor: '#1a1a1a' }}
                  aria-label="Spotify Embed Player"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
