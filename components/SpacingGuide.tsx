'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { measureSpacingRects, type SpacingRect } from '@/lib/spacing-metrics';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useInspectionPeek } from '@/components/InspectionPeekContext';
import { SpacingFill, SpacingLabelOnly } from '@/components/SpacingFill';

export type SpacingGuideProps = {
  /** Magenta padding inset zones */
  showPadding?: boolean;
  /** Magenta gaps between flex/grid children */
  showGaps?: boolean;
  /** Numeric labels inside gap zones */
  showLabels?: boolean;
  /** Colored fill zones (padding/gap). Labels can render without fills. */
  showFills?: boolean;
  /**
   * Gate for whether the magenta fills are actually shown, on top of the
   * pointer/peek-based measurement gate. Defaults to `true` (always show once
   * measured) — pass the owning frame's own hover/active state to make the
   * highlight hover-triggered instead of persistent.
   */
  active?: boolean;
  /** Skip scale-in animation — use for always-on inspect (Hero) */
  instantFills?: boolean;
  className?: string;
  children: React.ReactNode;
};

const SpacingOverlay = memo(function SpacingOverlay({
  rects,
  showPadding,
  showGaps,
  showLabels,
  showFills,
  visible,
  instantFills,
}: {
  rects: SpacingRect[];
  showPadding: boolean;
  showGaps: boolean;
  showLabels: boolean;
  showFills: boolean;
  visible: boolean;
  instantFills?: boolean;
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
        if (rect.kind === 'gutter') return null;
        if (!showFills && !showLabels) return null;

        const key = `${rect.kind}-${rect.side ?? rect.axis}-${Math.round(rect.x)}-${Math.round(rect.y)}-${index}`;

        if (!showFills) {
          return showLabels ? <SpacingLabelOnly key={key} rect={rect} /> : null;
        }

        return (
          <SpacingFill
            key={key}
            rect={rect}
            showLabel={showLabels}
            instant={instantFills}
          />
        );
      })}
    </div>
  );
});

/** Figma-style spacing — magenta padding/gaps */
export function SpacingGuide({
  showPadding = true,
  showGaps = true,
  showLabels = true,
  showFills = true,
  active = true,
  instantFills = false,
  className,
  children,
}: SpacingGuideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [rects, setRects] = useState<SpacingRect[]>([]);
  const finePointer = useFinePointer();
  const sectionPeeking = useInspectionPeek();
  // Measure whenever the overlay can show (`active`) so always-on frames
  // (Hero Intro) don't wait for fine-pointer or a scroll peek.
  const measureEnabled = (active || finePointer || sectionPeeking) && (showFills || showLabels);

  useEffect(() => {
    if (!measureEnabled) return;

    const container = ref.current;
    if (!container) return;

    const measureNow = () => {
      setRects(measureSpacingRects(container, []));
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

    Array.from(container.querySelectorAll<HTMLElement>('*'))
      .filter((child) => child.dataset.spacingOverlay !== 'true')
      .forEach((child) => resizeObserver.observe(child));

    window.addEventListener('resize', scheduleMeasure);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [measureEnabled, showPadding, showGaps, showLabels, showFills]);

  const overlayVisible = measureEnabled && active && rects.length > 0;

  return (
    <div ref={ref} className={cn('spacing-guide relative', className)}>
      {children}
      {measureEnabled && (
        <SpacingOverlay
          rects={rects}
          showPadding={showPadding}
          showGaps={showGaps}
          showLabels={showLabels}
          showFills={showFills}
          visible={overlayVisible}
          instantFills={instantFills}
        />
      )}
    </div>
  );
}
