'use client';

import { useCallback, useEffect, useState, type ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MeasurementOverlay } from '@/components/MeasurementOverlay';
import { MeasurementLabel } from '@/components/MeasurementLabel';
import { SelectionOutline } from '@/components/SelectionOutline';
import { SpacingFill } from '@/components/SpacingFill';
import { useElementMetrics } from '@/hooks/useElementMetrics';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { measureSpacingRects, type SpacingRect } from '@/lib/spacing-metrics';

export type InspectableProps = {
  children: ReactNode;
  showDimensions?: boolean;
  /** Magenta padding/gap highlights on hover */
  showSpacing?: boolean;
  showAnchor?: boolean;
  /** Faint outline always on; full intensity on hover */
  persistent?: boolean;
  className?: string;
};

export function Inspectable({
  children,
  showDimensions = true,
  showSpacing = false,
  showAnchor = false,
  persistent = true,
  className,
}: InspectableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [spacingRects, setSpacingRects] = useState<SpacingRect[]>([]);
  const { metrics, measure } = useElementMetrics();
  const reducedMotion = useReducedMotion();

  const measureNow = useCallback(() => {
    if (ref.current) measure(ref.current);
  }, [measure]);

  const handleEnter = useCallback(() => {
    measureNow();
    if (ref.current) {
      setSpacingRects(measureSpacingRects(ref.current));
    }
    setHovered(true);
  }, [measureNow]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setSpacingRects([]);
  }, []);

  useEffect(() => {
    measureNow();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measureNow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measureNow]);

  const active = hovered;
  const showFull = active;
  const showFaint = persistent && !active;

  return (
    <div
      ref={ref}
      className={cn('inspectable relative', className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}

      <SelectionOutline
        visible={showFull || showFaint}
        showAnchor={showAnchor && showFull}
        className={showFaint && !showFull ? '[&>div:first-child]:opacity-25' : undefined}
      />

      {showDimensions && metrics && showFull && (
        <>
          <MeasurementOverlay
            direction="horizontal"
            value=""
            showLabel={false}
            color="cyan"
            visible={!reducedMotion || showFull}
            className="absolute -top-6 left-0 right-0"
          />
          <MeasurementOverlay
            direction="vertical"
            value=""
            showLabel={false}
            color="cyan"
            visible={!reducedMotion || showFull}
            className="absolute -right-6 bottom-0 top-0"
          />
          <MeasurementLabel
            value={`${metrics.width}px × ${metrics.height}px`}
            color="cyan"
            variant="tooltip"
            visible={!reducedMotion || showFull}
            className="absolute -top-9 right-0 z-[6]"
          />
        </>
      )}

      {showSpacing && showFull && spacingRects.length > 0 && (
        <div data-spacing-overlay="true" aria-hidden className="spacing-overlay pointer-events-none absolute inset-0 z-[1]">
          {spacingRects.map((rect, index) => (
            <SpacingFill
              key={`${rect.kind}-${rect.side ?? rect.axis}-${index}`}
              rect={rect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Proximity-based inspection for hero cursor tracking */
export function useProximityInspection(
  containerRef: React.RefObject<HTMLElement | null>,
  targetRefs: React.RefObject<HTMLElement | null>[],
  threshold = 80
) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      let closest: number | null = null;
      let closestDist = threshold;

      targetRefs.forEach((targetRef, index) => {
        const el = targetRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    const handleLeave = () => setActiveIndex(null);

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, [containerRef, targetRefs, threshold]);

  return activeIndex;
}
