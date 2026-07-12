'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  measureSpacingRects,
  type GridGutter,
  type SpacingRect,
} from '@/lib/spacing-metrics';
import { useGridGutters } from '@/hooks/useGridGutters';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useInspectionPeek } from '@/components/InspectionPeekContext';
import { SpacingFill, SpacingLabelOnly } from '@/components/SpacingFill';
import type { ResponsiveGridBoundaries } from '@/lib/grid';

export type SpacingGuideProps = {
  /** Magenta padding inset zones */
  showPadding?: boolean;
  /** Magenta gaps between flex/grid children */
  showGaps?: boolean;
  /** Cyan alignment gutters between grid columns */
  showGutters?: boolean;
  /** Numeric labels inside gap/gutter zones */
  showLabels?: boolean;
  /** Colored fill zones (padding/gap/gutter). Labels can render without fills. */
  showFills?: boolean;
  /** Explicit grid column gutters */
  gutters?: GridGutter[];
  /** Responsive section boundaries → auto gutters on desktop splits */
  sectionBoundaries?: ResponsiveGridBoundaries;
  className?: string;
  children: React.ReactNode;
};

const SpacingOverlay = memo(function SpacingOverlay({
  rects,
  showPadding,
  showGaps,
  showGutters,
  showLabels,
  showFills,
  visible,
}: {
  rects: SpacingRect[];
  showPadding: boolean;
  showGaps: boolean;
  showGutters: boolean;
  showLabels: boolean;
  showFills: boolean;
  visible: boolean;
}) {
  return (
    <div
      data-spacing-overlay="true"
      aria-hidden
      className={cn(
        'spacing-overlay pointer-events-none absolute inset-0 z-[1]',
        visible && 'spacing-overlay--visible'
      )}
    >
      {rects.map((rect, index) => {
        if (rect.kind === 'padding' && !showPadding) return null;
        if (rect.kind === 'gap' && !showGaps) return null;
        if (rect.kind === 'gutter' && !showGutters) return null;
        if (!showFills && !showLabels) return null;

        const key = `${rect.kind}-${rect.side ?? rect.axis}-${Math.round(rect.x)}-${Math.round(rect.y)}-${index}`;

        if (!showFills) {
          return showLabels ? <SpacingLabelOnly key={key} rect={rect} /> : null;
        }

        return <SpacingFill key={key} rect={rect} showLabel={showLabels} />;
      })}
    </div>
  );
});

/** Figma-style spacing — magenta padding/gaps, cyan grid gutters */
export function SpacingGuide({
  showPadding = true,
  showGaps = true,
  showGutters = false,
  showLabels = true,
  showFills = true,
  gutters,
  sectionBoundaries,
  className,
  children,
}: SpacingGuideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [rects, setRects] = useState<SpacingRect[]>([]);
  const boundaryGutters = useGridGutters(sectionBoundaries);
  const activeGutters = gutters ?? boundaryGutters;
  const finePointer = useFinePointer();
  const sectionPeeking = useInspectionPeek();
  const measureEnabled = (finePointer || sectionPeeking) && (showFills || showLabels);

  useEffect(() => {
    if (!measureEnabled) {
      setRects([]);
      return;
    }

    const container = ref.current;
    if (!container) return;

    const measureNow = () => {
      setRects(measureSpacingRects(container, showGutters ? activeGutters : []));
    };

    const scheduleMeasure = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        measureNow();
      });
    };

    measureNow();

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(container);

    Array.from(container.children)
      .filter((child): child is HTMLElement => child instanceof HTMLElement && child.dataset.spacingOverlay !== 'true')
      .forEach((child) => resizeObserver.observe(child));

    window.addEventListener('resize', scheduleMeasure);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [activeGutters, showGutters, measureEnabled, showPadding, showGaps, showLabels, showFills]);

  const overlayVisible = measureEnabled && rects.length > 0;

  return (
    <div ref={ref} className={cn('spacing-guide relative', className)}>
      {children}
      {measureEnabled && (
        <SpacingOverlay
          rects={rects}
          showPadding={showPadding}
          showGaps={showGaps}
          showGutters={showGutters}
          showLabels={showLabels}
          showFills={showFills}
          visible={overlayVisible}
        />
      )}
    </div>
  );
}
