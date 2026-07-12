'use client';

import { GridOverlayLayer } from '@/components/GridGuideLayer';
import { mediaQueries } from '@/lib/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function GridOverlay({
  opacity = 1,
  showPlusMarkers = false,
  showAlignmentGuides = false,
  className = '',
}: {
  opacity?: number;
  showPlusMarkers?: boolean;
  showAlignmentGuides?: boolean;
  className?: string;
}) {
  const isDesktop = useMediaQuery(mediaQueries.lg);
  const effectiveOpacity = isDesktop ? opacity : opacity * 0.6;
  const effectivePlusMarkers = isDesktop && showPlusMarkers;
  const effectiveAlignmentGuides = isDesktop && showAlignmentGuides;

  return (
    <div
      className={`grid-overlay-home pointer-events-none fixed z-[6] ${className}`}
      aria-hidden
    >
      <GridOverlayLayer
        opacity={effectiveOpacity}
        showPlusMarkers={effectivePlusMarkers}
        showAlignmentGuides={effectiveAlignmentGuides}
        className="h-full"
      />
    </div>
  );
}
