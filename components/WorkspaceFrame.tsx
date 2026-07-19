'use client';

import { useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Panel } from '@/components/Panel';
import { MeasurementLabel } from '@/components/MeasurementLabel';
import { formatMeasurementPx, MeasurementOverlay } from '@/components/MeasurementOverlay';
import { SelectionOutline } from '@/components/SelectionOutline';
import { SpacingGuide } from '@/components/SpacingGuide';
import { useElementMetrics } from '@/hooks/useElementMetrics';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollPeek } from '@/hooks/useScrollPeek';
import { mediaQueries } from '@/lib/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import type { InspectMode } from '@/lib/theme-contract';

export type InspectDepth = 'full' | 'outline';

export type WorkspaceFrameProps = ComponentPropsWithoutRef<'div'> & {
  inspectMode?: InspectMode;
  inspectDepth?: InspectDepth;
  frameLabel?: string;
  showDimensions?: boolean;
  showMeasurementLines?: boolean;
  showSpacing?: boolean;
  showPadding?: boolean;
  /** Magenta flex/grid gap zones — off by default; enable for Works-style deep inspect */
  showGaps?: boolean;
  showLabels?: boolean;
  /** Cyan selection border + corner handles */
  showSelectionOutline?: boolean;
  /**
   * Always show frameLabel: dim resting text when inactive, cyan Frame Name
   * chip when active (Figma Works/Process default states).
   */
  showRestingLabel?: boolean;
  measurementPlacement?: 'outside' | 'inside';
  variant?: 'panel' | 'flat' | 'bare' | 'figma';
  panelClassName?: string;
  children: ReactNode;
};

export function WorkspaceFrame({
  inspectMode = 'hover',
  inspectDepth = 'full',
  frameLabel,
  showDimensions = true,
  showMeasurementLines = true,
  showSpacing = false,
  showPadding = false,
  showGaps = false,
  showLabels,
  showSelectionOutline = true,
  showRestingLabel = false,
  measurementPlacement = 'inside',
  variant = 'panel',
  className,
  panelClassName,
  children,
  ...props
}: WorkspaceFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const finePointer = useFinePointer();
  const isDesktop = useMediaQuery(mediaQueries.lg);
  const { metrics, measure } = useElementMetrics();
  const reducedMotion = useReducedMotion();

  const isOutlineOnly = inspectDepth === 'outline';
  const effectiveShowSpacing = showSpacing && !isOutlineOnly;
  const effectiveShowPadding = showPadding && !isOutlineOnly;
  const isOff = inspectMode === 'off' || !isDesktop;
  const isAlways = inspectMode === 'always' && isDesktop;
  const scrollPeeking = useScrollPeek(frameRef, {
    enabled: !finePointer && !isOff,
    threshold: 0.35,
    dwellMs: 900,
    resetOnExit: true,
  });
  const active =
    !isOff && ((isAlways && finePointer) || (finePointer && (hovered || focused)) || scrollPeeking);
  const spacingLabelsOn = showLabels === false ? false : (isAlways && finePointer) || active;
  const showDimensionUi =
    !isOutlineOnly && showDimensions && active && metrics && isDesktop;
  const showDimensionLineUi = showDimensionUi && showMeasurementLines && !reducedMotion;
  const outsideMeasurements = measurementPlacement === 'outside';
  const showInnerPill =
    showDimensionUi && (!showMeasurementLines || !outsideMeasurements || reducedMotion);

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

  const isFigma = variant === 'figma';
  const surfaceClass =
    variant === 'flat'
      ? cn('flat-surface relative overflow-hidden', panelClassName)
      : isFigma
        ? cn('figma-surface relative overflow-hidden', panelClassName)
        : cn('relative overflow-visible', panelClassName);

  // The className the surface element would normally carry — background, border,
  // and (crucially) the padding/flex-layout classes from `panelClassName`.
  const surfaceWrapperClass =
    variant === 'bare'
      ? panelClassName
      : variant === 'flat'
        ? surfaceClass
        : isFigma
          ? cn('relative', surfaceClass)
          : cn('panel relative', surfaceClass);

  // When spacing guides are on, `SpacingGuide` must sit at the exact same DOM
  // level the surface classes are applied to — otherwise padding reads as 0
  // (measured on the wrong element) and any `flex`/`grid` layout in
  // `panelClassName` loses its children as direct flex/grid items.
  const content = effectiveShowSpacing ? (
    <SpacingGuide
      showPadding={effectiveShowPadding}
      showGaps={showGaps}
      showLabels={spacingLabelsOn}
      active={active}
      instantFills={isAlways}
      className={surfaceWrapperClass}
    >
      {children}
    </SpacingGuide>
  ) : (
    children
  );

  // Figma Frame Name (352:301) — cyan chip when active; optional dim resting label
  const usesFrameTab = Boolean(frameLabel);
  const showFrameLabel = Boolean(frameLabel) && (active || showRestingLabel);
  const horizontalMeasureClass = 'measurement-overlay--outside-framed';

  return (
    <div
      ref={frameRef}
      data-inspect-depth={inspectDepth}
      data-frame-label={frameLabel || undefined}
      data-frame-width={metrics?.width ? Math.round(metrics.width) : undefined}
      data-frame-height={metrics?.height ? Math.round(metrics.height) : undefined}
      className={cn(
        'workspace-frame relative',
        active && 'workspace-frame--active',
        isOutlineOnly && 'workspace-frame--outline-only',
        scrollPeeking && !finePointer && 'workspace-frame--scroll-peek',
        isFigma && 'workspace-frame--figma',
        showRestingLabel && 'workspace-frame--resting-label',
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
      <SelectionOutline
        visible={active && showSelectionOutline}
        hideTopLeftCorner={usesFrameTab && active}
        className="z-[5]"
      />

      {showFrameLabel && (
        <span
          className={cn(
            'frame-label pointer-events-none absolute',
            active ? 'frame-tab' : 'frame-label--resting'
          )}
          aria-hidden
        >
          {frameLabel}
        </span>
      )}

      {showInnerPill && (
        <MeasurementLabel
          value={`${formatMeasurementPx(metrics!.width)} × ${formatMeasurementPx(metrics!.height)}`}
          color="cyan"
          variant="tooltip"
          visible
          labelOpacity={isAlways && !hovered ? 0.55 : 1}
          className={cn(
            'absolute z-[6]',
            variant === 'flat' ? 'bottom-1 right-1' : 'bottom-2.5 right-4'
          )}
        />
      )}

      {showDimensionLineUi && (
        <>
          <MeasurementOverlay
            direction="horizontal"
            value={`${metrics!.width}`}
            color="cyan"
            visible
            showLabel={outsideMeasurements}
            labelPlacement="outside-start"
            className={cn(
              'absolute left-0 right-0 z-[6]',
              horizontalMeasureClass
            )}
          />
          <MeasurementOverlay
            direction="vertical"
            value={`${metrics!.height}`}
            color="cyan"
            visible
            showLabel={outsideMeasurements}
            labelPlacement="outside-end"
            className={cn(
              'absolute bottom-0 top-0 z-[6]',
              outsideMeasurements ? '-right-8' : '-right-6'
            )}
          />
        </>
      )}

      {effectiveShowSpacing ? (
        content
      ) : variant === 'bare' || isFigma ? (
        <div
          className={cn(
            'relative h-full w-full',
            isFigma ? cn(surfaceClass, panelClassName) : panelClassName
          )}
        >
          {content}
        </div>
      ) : variant === 'flat' ? (
        <div className={surfaceClass}>{content}</div>
      ) : (
        <Panel className={surfaceClass}>{content}</Panel>
      )}
    </div>
  );
}
