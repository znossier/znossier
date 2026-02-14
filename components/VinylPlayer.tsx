'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Decode common HTML entities that can appear in scraped data
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function looksLikeSaneArtist(s: string): boolean {
  const t = decodeHtmlEntities(s).trim();
  if (t.length < 1 || t.length > 50) return false;
  if (/^[\d\s\-_.,]+$/.test(t)) return false;
  if (/[\x00-\x1f\x7f]/.test(t)) return false;
  if (/https?:\/\//i.test(t) || /spotify\.com/i.test(t)) return false;
  if (/\\u[0-9a-f]{4}/i.test(t)) return false;
  if (/[<>\[\]{}]/.test(t)) return false;
  if (/^[^\p{L}\p{N}\s\-'",.&()]+$/u.test(t)) return false;
  if (!/\p{L}/u.test(t)) return false;
  const lower = t.toLowerCase();
  if (lower === 'spotify' || lower === 'null' || lower === 'undefined' || lower === 'unknown') return false;
  if (/^[\s\W]+$/.test(t)) return false;
  return true;
}

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

const SPOTIFY_EMBED_RADIUS = '0.75rem';

// One in-flight metadata fetch per trackId across all VinylPlayer instances
const fetchTrackMetadataInFlight = new Map<string, { promise: Promise<void>; id: number }>();
let _fetchTrackMetadataId = 0;

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
  const [dominantColor, setDominantColor] = useState<string>('#2a1810'); // default vinyl-ish brown
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  // Mobile: swipe-down to close expanded sheet
  const sheetDragY = useMotionValue(0);

  // Mobile: single default position (aligned with theme FAB: same bottom, left of FAB)
  const MOBILE_DEFAULT_LEFT = 16;
  const MOBILE_DEFAULT_BOTTOM = 24;
  const MOBILE_BAR_W = 200;
  const MOBILE_BAR_H = 52;
  const [mobileFloatLeft, setMobileFloatLeft] = useState(MOBILE_DEFAULT_LEFT);
  const [mobileFloatBottom, setMobileFloatBottom] = useState(MOBILE_DEFAULT_BOTTOM);
  const floatX = useMotionValue(0);
  const floatY = useMotionValue(0);
  type DockEdge = 'left' | 'right' | 'top' | 'bottom' | null;
  const [mobileDock, setMobileDock] = useState<DockEdge>(null);

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
                fetchTrackMetadata(trackId);
              }
            }
          }
          
          // Handle playback_started event (only for track URIs, not playlist)
          if (event.data.type === 'playback_started' && event.data.payload?.playingURI?.startsWith('spotify:track:')) {
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

  // Load Spotify iframe API and create controller for play/pause
  useEffect(() => {
    if (!embedContainerRef.current) return;

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
              el.style.borderRadius = SPOTIFY_EMBED_RADIUS;
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

  // Fetch track metadata from Spotify oEmbed API and track page (one in-flight per trackId app-wide)
  const fetchTrackMetadata = async (trackId: string) => {
    const existing = fetchTrackMetadataInFlight.get(trackId);
    if (existing) {
      await existing.promise;
      return;
    }
    const id = ++_fetchTrackMetadataId;
    const promise = (async () => {
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
            if (looksLikeSaneArtist(possibleArtist) && possibleArtist.toLowerCase() !== 'spotify') {
              artist = possibleArtist;
            }
          }
        }
      }

      // Use API artist only when source is 'webapi' (canonical); scrape/musicbrainz can return wrong artist for same trackId
      try {
        const artistResponse = await fetch(`/api/spotify-track?trackId=${trackId}&name=${encodeURIComponent(name)}`);
        if (artistResponse.ok) {
          const data = await artistResponse.json();
          const apiArtist = data.artist ?? null;
          const apiSource = data.source ?? null;
          if (apiSource === 'webapi' && typeof apiArtist === 'string' && looksLikeSaneArtist(apiArtist)) {
            artist = apiArtist;
          }
        }
      } catch {
        // ignore; fall back to oEmbed artist or "Spotify"
      }

      const cleanedArtist = decodeHtmlEntities(artist);
      const finalArtist =
        cleanedArtist !== 'Unknown' && looksLikeSaneArtist(cleanedArtist)
          ? cleanedArtist
          : 'Spotify';
      const resolvedName = decodeHtmlEntities(name) || name;
      setTrackInfo((prev) => {
        const newArtist = finalArtist !== 'Spotify' ? finalArtist : (prev.name === resolvedName ? prev.artist : 'Spotify');
        return {
          name: resolvedName,
          imageUrl,
          artist: newArtist,
        };
      });
    } catch (error) {
      console.error('Failed to fetch track metadata:', error);
    } finally {
      const entry = fetchTrackMetadataInFlight.get(trackId);
      if (entry && entry.id === id) fetchTrackMetadataInFlight.delete(trackId);
    }
    })();
    fetchTrackMetadataInFlight.set(trackId, { promise, id });
    await promise;
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

  const togglePlayPause = () => {
    setHasUserInteracted(true);
    setIsInteractingWithEmbed(true);
    if (!isHovered) setIsHovered(true);
    const controller = embedControllerRef.current;
    if (!controller) {
      const iframe = embedWrapperRef.current?.querySelector('iframe');
      if (iframe) (iframe as HTMLIFrameElement).focus();
      return;
    }
    // Chrome blocks autoplay until user gesture; first interaction unlocks and starts playback
    if (!hasUserInteracted) {
      try {
        controller.resume();
      } catch {
        // ignore
      }
      return;
    }
    controller.togglePlay();
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

  // Reset sheet drag when closing
  useEffect(() => {
    if (!isHovered) {
      sheetDragY.set(0);
    }
  }, [isHovered, sheetDragY]);

  return (
    <>
      {/* Mobile bottom sheet backdrop — only when widget is expanded and not docked */}
      {isMobile && isHovered && !mobileDock && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          style={{ pointerEvents: 'auto' }}
          onClick={() => setIsHovered(false)}
          onTouchEnd={(e) => e.target === e.currentTarget && setIsHovered(false)}
          aria-hidden
        />
      )}

      {/* Mobile docked: show only the pull-out tab */}
      {isMobile && mobileDock && (
        <motion.button
          type="button"
          className={cn(
            'fixed z-50 rounded-r-lg rounded-l-none rounded-t-lg rounded-b-lg flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 min-w-[44px] min-h-[44px]',
            isDark ? 'focus:ring-white/30' : 'focus:ring-black/20 text-neutral-700'
          )}
          style={{
            width: mobileDock === 'left' || mobileDock === 'right' ? 36 : 48,
            height: mobileDock === 'left' || mobileDock === 'right' ? 72 : 44,
            ...(mobileDock === 'left' ? { left: 0, top: '50%', transform: 'translateY(-50%)', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}),
            ...(mobileDock === 'right' ? { right: 0, top: '50%', transform: 'translateY(-50%)', borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {}),
            ...(mobileDock === 'top' ? { top: 0, left: '50%', transform: 'translateX(-50%)', borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {}),
            ...(mobileDock === 'bottom' ? { bottom: 'env(safe-area-inset-bottom, 0px)', left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}),
            background: isDark
              ? 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isDark
              ? '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
              : '0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
            border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.08)',
          }}
          onClick={() => {
            setMobileDock(null);
            floatX.set(0);
            floatY.set(0);
            setMobileFloatLeft(MOBILE_DEFAULT_LEFT);
            setMobileFloatBottom(MOBILE_DEFAULT_BOTTOM);
          }}
          aria-label="Show player"
          whileTap={{ scale: 0.96 }}
        >
          {mobileDock === 'left' && <ChevronRight className={cn('w-4 h-4', isDark ? 'text-white/70' : 'text-neutral-600')} />}
          {mobileDock === 'right' && <ChevronLeft className={cn('w-4 h-4', isDark ? 'text-white/70' : 'text-neutral-600')} />}
          {mobileDock === 'top' && <ChevronDown className={cn('w-4 h-4', isDark ? 'text-white/70' : 'text-neutral-600')} />}
          {mobileDock === 'bottom' && <ChevronUp className={cn('w-4 h-4', isDark ? 'text-white/70' : 'text-neutral-600')} />}
        </motion.button>
      )}

      {/* Main widget: hidden when mobile + docked */}
      {!(isMobile && mobileDock) && (
      <motion.div
        ref={widgetRef}
        role="region"
        aria-label="Spotify music player"
        className={cn(
          'fixed z-50',
          !isMobile && 'left-[2rem] bottom-[2rem]',
          isMobile && isHovered && 'inset-x-0 bottom-0',
          isMobile && !isHovered && 'w-[min(200px,calc(100vw-5rem))]',
          'px-4 pt-3 md:px-0 md:pt-0',
          'pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-0',
          'max-w-[calc(100vw-2rem)] md:max-w-none',
          isMobile && isHovered && 'rounded-t-xl',
          className
        )}
        style={
          isMobile && !isHovered
            ? {
                left: mobileFloatLeft,
                bottom: mobileFloatBottom,
                x: floatX,
                y: floatY,
                touchAction: 'none',
              }
            : undefined
        }
        drag={isMobile && !isHovered}
        dragConstraints={isMobile && !isHovered ? { left: -400, right: 400, top: -400, bottom: 400 } : false}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={(_e, info) => {
          if (!isMobile || isHovered) return;
          const vw = typeof window !== 'undefined' ? window.innerWidth : 375;
          const vh = typeof window !== 'undefined' ? window.innerHeight : 667;
          const barW = MOBILE_BAR_W;
          const barH = MOBILE_BAR_H;
          const finalLeft = mobileFloatLeft + info.offset.x;
          const finalBottom = mobileFloatBottom - info.offset.y;
          const toLeft = finalLeft;
          const toRight = vw - finalLeft - barW;
          const toBottom = finalBottom;
          const toTop = vh - (finalBottom + barH);
          const snapThreshold = 72;
          if (toLeft < snapThreshold && toLeft <= Math.min(toRight, toTop, toBottom)) {
            setMobileDock('left');
            setIsHovered(false);
            setMobileFloatLeft(MOBILE_DEFAULT_LEFT);
            setMobileFloatBottom(MOBILE_DEFAULT_BOTTOM);
            floatX.set(0);
            floatY.set(0);
          } else if (toRight < snapThreshold && toRight <= Math.min(toLeft, toTop, toBottom)) {
            setMobileDock('right');
            setIsHovered(false);
            setMobileFloatLeft(MOBILE_DEFAULT_LEFT);
            setMobileFloatBottom(MOBILE_DEFAULT_BOTTOM);
            floatX.set(0);
            floatY.set(0);
          } else if (toBottom < snapThreshold && toBottom <= Math.min(toLeft, toRight, toTop)) {
            setMobileDock('bottom');
            setIsHovered(false);
            setMobileFloatLeft(MOBILE_DEFAULT_LEFT);
            setMobileFloatBottom(MOBILE_DEFAULT_BOTTOM);
            floatX.set(0);
            floatY.set(0);
          } else if (toTop < snapThreshold && toTop <= Math.min(toLeft, toRight, toBottom)) {
            setMobileDock('top');
            setIsHovered(false);
            setMobileFloatLeft(MOBILE_DEFAULT_LEFT);
            setMobileFloatBottom(MOBILE_DEFAULT_BOTTOM);
            floatX.set(0);
            floatY.set(0);
          } else {
            setMobileFloatLeft(MOBILE_DEFAULT_LEFT);
            setMobileFloatBottom(MOBILE_DEFAULT_BOTTOM);
            floatX.set(0);
            floatY.set(0);
          }
        }}
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
              ? { width: '100%', height: isHovered ? 420 : MOBILE_BAR_H }
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

        {/* Main card - mobile expanded: swipe down to close. Glassy bg, theme-aware. */}
        <motion.div
          className="rounded-xl relative overflow-hidden backdrop-blur-xl"
          style={{
            background: isDark
              ? 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 100%)',
            boxShadow: isDark
              ? `inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)`
              : `inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)`,
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)',
            ...(isMobile && isHovered ? { y: sheetDragY } : {}),
          }}
          drag={isMobile && isHovered ? 'y' : false}
          dragConstraints={isMobile && isHovered ? { top: 0, bottom: 0 } : undefined}
          dragElastic={0.15}
          onDragEnd={(_e, info) => {
            if (!isMobile || !isHovered) return;
            const close = info.offset.y > 60 || info.velocity.y > 200;
            if (close) {
              setIsHovered(false);
            }
            animate(sheetDragY, 0, { type: 'spring', stiffness: 400, damping: 35 });
          }}
          animate={{
            padding: isMobile && !isHovered ? '0.375rem 0.5rem' : isHovered ? '1rem' : '0.875rem',
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Glass shine overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl opacity-40"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          <div className="relative z-10 flex flex-col h-full min-h-0">
            {/* Vinyl + Track Info Row - compact on mobile collapsed */}
            <div
              className={cn(
                'flex items-center flex-shrink-0 py-0.5',
                isMobile && !isHovered ? 'min-h-0 gap-2' : 'min-h-[64px] gap-3'
              )}
            >
              {/* Vinyl Player - scaled down on mobile collapsed to fit small bar */}
              <motion.div
                className={cn(
                  'relative flex-shrink-0 cursor-pointer',
                  isMobile && !isHovered ? 'w-[50px] h-[39px] overflow-hidden' : 'w-[84px] h-16'
                )}
                onClick={togglePlayPause}
                whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                style={{
                  boxShadow: isPlaying
                    ? (isDark ? '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' : '0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)')
                    : (isDark ? '0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)' : '0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)'),
                }}
              >
                <div
                  className={cn(isMobile && !isHovered && 'absolute left-0 top-0')}
                  style={
                    isMobile && !isHovered
                      ? { width: 84, height: 64, minWidth: 84, minHeight: 64, transform: 'scale(0.6)', transformOrigin: 'left top' }
                      : undefined
                  }
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

                {/* Play/Pause - 18px glassy circle, 44px tap target */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className={cn(
                    'absolute z-40 group flex items-center justify-center',
                    'left-[26px] top-[30px] -translate-x-1/2 -translate-y-1/2',
                    'w-8 h-8',
                    'rounded-full focus:outline-none focus:ring-2',
                    isDark ? 'focus:ring-white/30' : 'focus:ring-black/20'
                  )}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                      'bg-white/10 group-hover:bg-white/20 backdrop-blur-md',
                      'border border-white/20 shadow-sm',
                      'transition-colors'
                    )}
                  >
                    {isPlaying ? (
                      <Pause className={cn('w-3.5 h-3.5', isDark ? 'text-white' : 'text-neutral-800')} />
                    ) : (
                      <Play className={cn('w-3.5 h-3.5 ml-0.5', isDark ? 'text-white' : 'text-neutral-800')} />
                    )}
                  </span>
                </motion.button>
                </div>
              </motion.div>

              {/* Track Info - tap to expand on mobile. Chevron on same row, right-aligned when expanded. */}
              <div
                className="flex-1 min-w-0 flex items-center gap-2 min-h-[44px] cursor-pointer touch-manipulation"
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
                <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5 min-w-0">
                  <div
                    className={cn(
                      'font-semibold truncate leading-tight',
                      isMobile && !isHovered ? 'text-xs' : 'text-sm',
                      isDark ? 'text-white' : 'text-neutral-900'
                    )}
                  >
                    {trackInfo.name}
                  </div>
                  <div
                    className={cn(
                      'truncate leading-tight mt-0.5',
                      isMobile && !isHovered ? 'text-[10px]' : 'text-xs',
                      isDark ? 'text-white/50' : 'text-neutral-500'
                    )}
                  >
                    {trackInfo.artist}
                  </div>
                </div>
                {/* Mobile expanded: chevron right-aligned on same row (collapse affordance) */}
                {isMobile && isHovered && (
                  <span className={cn('flex-shrink-0 w-8 h-8 flex items-center justify-center -mr-0.5', isDark ? 'text-white/50' : 'text-neutral-500')} aria-hidden>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Spotify Embed Player - Always rendered, visibility controlled. Mobile: bottom sheet with drag handle. */}
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? 'auto' : 0,
                marginTop: isHovered ? (isMobile ? '0.25rem' : '0.75rem') : 0,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                'overflow-hidden flex flex-col',
                isMobile && isHovered ? 'flex-1 min-h-0 gap-1' : 'gap-3'
              )}
              style={{
                visibility: isHovered ? 'visible' : 'hidden',
                pointerEvents: isHovered ? 'auto' : 'none',
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: SPOTIFY_EMBED_RADIUS,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {isMobile && isHovered && (
                <div
                  className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-manipulation flex-shrink-0 min-h-[44px] items-center -mt-0.5"
                  onClick={() => setIsHovered(false)}
                  aria-label="Close player"
                >
                  <div className={cn('w-10 h-1 rounded-full', isDark ? 'bg-white/25' : 'bg-black/20')} />
                </div>
              )}
              {/* Spotify Embed - iframe styled in JS for rounded corners. The "Get Spotify" / CTA overlay is rendered by Spotify inside the iframe and cannot be disabled via the embed API. */}
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
                className="w-full relative overflow-hidden"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: SPOTIFY_EMBED_RADIUS,
                  clipPath: `inset(0 round ${SPOTIFY_EMBED_RADIUS})`,
                  WebkitClipPath: `inset(0 round ${SPOTIFY_EMBED_RADIUS})`,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                <div
                  ref={embedContainerRef}
                  className="w-full h-[152px] min-h-[152px]"
                  style={{ background: 'rgba(0,0,0,0.15)' }}
                  aria-label="Spotify Embed Player"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
      )}
    </>
  );
}
