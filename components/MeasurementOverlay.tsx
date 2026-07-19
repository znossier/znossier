'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_PRECISION, MOTION } from '@/lib/motion';

export type MeasurementOverlayProps = {
  direction: 'horizontal' | 'vertical';
  value: string;
  color?: 'cyan' | 'magenta';
  visible?: boolean;
  showLabel?: boolean;
  /** Flip label to the opposite side of the measurement line */
  labelPlacement?: 'auto' | 'outside-start' | 'outside-end';
  className?: string;
  style?: React.CSSProperties;
};

/** Normalize overlay values to Figma-style `312px` (never bare numbers). */
export function formatMeasurementPx(value: string | number): string {
  const raw = String(value).trim();
  if (!raw) return raw;
  if (/^\d+(\.\d+)?px$/i.test(raw)) {
    return `${Math.round(parseFloat(raw))}px`;
  }
  const match = raw.match(/^(\d+(?:\.\d+)?)/);
  if (!match) return raw;
  return `${Math.round(parseFloat(match[1]))}px`;
}

function DimensionEndCaps({
  direction,
  color,
}: {
  direction: 'horizontal' | 'vertical';
  color: string;
}) {
  if (direction === 'horizontal') {
    return (
      <>
        <span className="measurement-cap measurement-cap--h-start" style={{ color }} aria-hidden />
        <span className="measurement-cap measurement-cap--h-end" style={{ color }} aria-hidden />
      </>
    );
  }

  return (
    <>
      <span className="measurement-cap measurement-cap--v-start" style={{ color }} aria-hidden />
      <span className="measurement-cap measurement-cap--v-end" style={{ color }} aria-hidden />
    </>
  );
}

function labelPositionClass(
  direction: 'horizontal' | 'vertical',
  placement: 'outside-start' | 'outside-end'
): string {
  if (direction === 'horizontal') {
    return placement === 'outside-start'
      ? 'measurement-ruler-label--h-start'
      : 'measurement-ruler-label--h-end';
  }
  return placement === 'outside-start'
    ? 'measurement-ruler-label--v-start'
    : 'measurement-ruler-label--v-end';
}

export function MeasurementOverlay({
  direction,
  value,
  color = 'cyan',
  visible = true,
  showLabel = true,
  labelPlacement = 'auto',
  className,
  style,
}: MeasurementOverlayProps) {
  const lineColor = color === 'cyan' ? 'var(--utility-cyan)' : 'var(--utility-magenta)';
  const isHorizontal = direction === 'horizontal';
  const resolvedPlacement =
    labelPlacement === 'auto'
      ? isHorizontal
        ? 'outside-start'
        : 'outside-end'
      : labelPlacement;
  const displayValue = formatMeasurementPx(value);

  return (
    <motion.div
      aria-hidden
      className={cn(
        'measurement-overlay pointer-events-none z-[6]',
        isHorizontal ? 'measurement-overlay--horizontal' : 'measurement-overlay--vertical',
        className
      )}
      style={style}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: MOTION.duration.fade, ease: EASE_PRECISION }}
    >
      <div className={cn('measurement-ruler', isHorizontal ? 'measurement-ruler--h' : 'measurement-ruler--v')}>
        <motion.div
          className={cn(
            'measurement-ruler-line',
            isHorizontal ? 'measurement-ruler-line--h' : 'measurement-ruler-line--v'
          )}
          style={{
            backgroundColor: lineColor,
            ...(isHorizontal ? { originX: 0.5 } : { originY: 0.5 }),
          }}
          initial={false}
          animate={
            isHorizontal
              ? { scaleX: visible ? 1 : 0, opacity: visible ? 1 : 0 }
              : { scaleY: visible ? 1 : 0, opacity: visible ? 1 : 0 }
          }
          transition={{ duration: MOTION.duration.draw, ease: EASE_PRECISION }}
        />

        <DimensionEndCaps direction={direction} color={lineColor} />

        {showLabel && displayValue && (
          <motion.span
            className={cn(
              'measurement-ruler-label',
              color === 'magenta' && 'measurement-ruler-label--magenta',
              labelPositionClass(direction, resolvedPlacement)
            )}
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: MOTION.duration.fade, ease: EASE_PRECISION }}
          >
            {displayValue}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
