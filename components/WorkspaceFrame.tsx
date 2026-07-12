'use client';

import { useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Panel } from '@/components/Panel';
import { MeasurementLabel } from '@/components/MeasurementLabel';
import { MeasurementOverlay } from '@/components/MeasurementOverlay';
import { SelectionOutline } from '@/components/SelectionOutline';
import { SpacingGuide } from '@/components/SpacingGuide';
import { useElementMetrics } from '@/hooks/useElementMetrics';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollPeek } from '@/hooks/useScrollPeek';
import { cn } from '@/lib/utils';
import type { InspectMode } from '@/lib/theme-contract';

export type WorkspaceFrameProps = ComponentPropsWithoutRef<'div'> & {
  inspectMode?: InspectMode;
  frameLabel?: string;
  showDimensions?: boolean;
  /** Cyan dimension extension lines (W×H pill still shown when showDimensions) */
  showMeasurementLines?: boolean;
  showSpacing?: boolean;
  showPadding?: boolean;
  /** Override label visibility; defaults to true when inspectMode is always */
  showLabels?: boolean;
  variant?: 'panel' | 'flat' | 'bare';
  frameLabelClassName?: string;
  panelClassName?: string;
  children: ReactNode;
};

export function WorkspaceFrame({
  inspectMode = 'hover',
  frameLabel,
  showDimensions = true,
  showMeasurementLines = true,
  showSpacing = false,
  showPadding = false,
  showLabels,
  variant = 'panel',
  frameLabelClassName,
  className,
  panelClassName,
  children,
  ...props
}: WorkspaceFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const finePointer = useFinePointer();
  const { metrics, measure } = useElementMetrics();
  const reducedMotion = useReducedMotion();

  const isOff = inspectMode === 'off';
  const isAlways = inspectMode === 'always';
  const scrollPeeking = useScrollPeek(frameRef, {
    enabled: !finePointer && !isOff,
    threshold: 0.35,
    dwellMs: 900,
    resetOnExit: true,
  });
  const active =
    !isOff && ((isAlways && finePointer) || (finePointer && (hovered || focused)) || scrollPeeking);
  const spacingLabelsOn = showLabels === false ? false : (isAlways && finePointer) || active;
  const showDimensionUi = showDimensions && active && metrics;
  const showDimensionLineUi = showDimensionUi && showMeasurementLines && !reducedMotion;

  const measureNow = useCallback(() => {
    if (frameRef.current) measure(frameRef.current);
  }, [measure]);

  useEffect(() => {
    if (isOff || !active) return;

    measureNow();
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measureNow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measureNow, isOff, active]);

  const surfaceClass =
    variant === 'flat'
      ? cn('flat-surface workspace-grid-dots-fill relative overflow-hidden', panelClassName)
      : cn('workspace-grid-dots-fill relative overflow-hidden', panelClassName);

  const content =
    showSpacing ? (
      <SpacingGuide
        showPadding={showPadding}
        showGaps
        showLabels={spacingLabelsOn}
        className="h-full"
      >
        {children}
      </SpacingGuide>
    ) : (
      children
    );

  return (
    <div
      ref={frameRef}
      className={cn(
        'workspace-frame relative',
        active && 'workspace-frame--active',
        scrollPeeking && !finePointer && 'workspace-frame--scroll-peek',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
      {...props}
    >
      <SelectionOutline visible={active} className="z-[5]" />

      {frameLabel && active && (
        <span
          className={cn(
            'frame-label pointer-events-none absolute z-[6]',
            frameLabelClassName ??
              (variant === 'bare'
                ? 'frame-label--anchored-top'
                : variant === 'flat'
                  ? 'left-1 top-1 opacity-70'
                  : 'right-4 top-2.5 hidden opacity-80 sm:block'),
            isAlways && !frameLabelClassName && variant === 'panel' && 'opacity-45'
          )}
          aria-hidden
        >
          {frameLabel}
        </span>
      )}

      {showDimensionUi && (
        <>
          <MeasurementLabel
            value={`${metrics.width} × ${metrics.height}`}
            color="cyan"
            variant="tooltip"
            visible
            labelOpacity={isAlways && !hovered ? 0.55 : 1}
            className={cn(
              'absolute z-[6]',
              variant === 'flat' ? 'bottom-1 right-1' : 'bottom-2.5 right-4'
            )}
          />
          {showDimensionLineUi && (
            <>
              <MeasurementOverlay
                direction="horizontal"
                value={`${metrics.width} px`}
                color="cyan"
                visible
                showLabel={false}
                labelPlacement="outside-start"
                className={cn(
                  'absolute left-0 right-0 z-[6]',
                  frameLabel ? '-top-10' : '-top-6'
                )}
              />
              <MeasurementOverlay
                direction="vertical"
                value={`${metrics.height} px`}
                color="cyan"
                visible
                labelPlacement="outside-end"
                className="absolute -right-6 bottom-0 top-0 z-[6]"
              />
            </>
          )}
        </>
      )}

      {variant === 'bare' ? (
        <div className={cn('relative', panelClassName)}>{content}</div>
      ) : variant === 'flat' ? (
        <div className={surfaceClass}>{content}</div>
      ) : (
        <Panel className={surfaceClass}>{content}</Panel>
      )}
    </div>
  );
}
