'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@/lib/useDraggable';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VinylPlayerSimpleProps {
  playlistId: string;
  className?: string;
}

export function VinylPlayerSimple({ playlistId, className }: VinylPlayerSimpleProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLIFrameElement | null>(null);

  const {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
    handleTouchStart,
  } = useDraggable({
    initialPosition: {
      x: typeof window !== 'undefined' ? window.innerWidth - 420 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight - 200 : 0,
    },
    storageKey: 'vinyl-player-position',
  });

  // Set element ref for draggable
  useEffect(() => {
    if (playerRef.current && elementRef) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = playerRef.current;
    }
  }, [elementRef]);

  const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}`;

  // Detect theme for Spotify embed
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const finalEmbedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${isDarkTheme ? '1' : '0'}&t=0`;

  return (
    <>

      {/* Vinyl Player Widget */}
      <motion.div
        ref={playerRef}
        className={cn(
          'fixed z-50 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl',
          'overflow-hidden select-none',
          'w-[380px] max-w-[calc(100vw-2rem)]',
          isDragging && 'cursor-grabbing',
          !isDragging && 'cursor-grab',
          className
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Spotify link */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
            Now Playing
          </div>
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-link hover:text-link/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Spotify</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Spotify Embed Player - Compact version showing track info and controls */}
        <div 
          className="px-6 pb-6"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <iframe
            ref={embedRef}
            title="Spotify Embed Player"
            src={finalEmbedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg border-0"
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
