'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_PRECISION, MOTION } from '@/lib/motion';
import { MeasurementLabel } from '@/components/MeasurementLabel';

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

const CAP = 5;

function DimensionEndCaps({
  direction,
  color,
}: {
  direction: 'horizontal' | 'vertical';
  color: string;
}) {
  const capStyle = { backgroundColor: color };

  if (direction === 'horizontal') {
    return (
      <>
        <span
          className="absolute left-0 top-1/2 w-px -translate-y-1/2"
          style={{ ...capStyle, height: CAP }}
          aria-hidden
        />
        <span
          className="absolute right-0 top-1/2 w-px -translate-y-1/2"
          style={{ ...capStyle, height: CAP }}
          aria-hidden
        />
      </>
    );
  }

  return (
    <>
      <span
        className="absolute left-1/2 top-0 h-px -translate-x-1/2"
        style={{ ...capStyle, width: CAP }}
        aria-hidden
      />
      <span
        className="absolute bottom-0 left-1/2 h-px -translate-x-1/2"
        style={{ ...capStyle, width: CAP }}
        aria-hidden
      />
    </>
  );
}

function labelPositionStyle(
  direction: 'horizontal' | 'vertical',
  placement: 'outside-start' | 'outside-end'
): React.CSSProperties {
  if (direction === 'horizontal') {
    if (placement === 'outside-start') {
      return { left: '50%', bottom: 'calc(100% + 4px)', transform: 'translateX(-50%)' };
    }
    return { left: '50%', top: 'calc(100% + 4px)', transform: 'translateX(-50%)' };
  }

  if (placement === 'outside-start') {
    return { right: 'calc(100% + 5px)', top: '50%', transform: 'translateY(-50%)' };
  }
  return { left: 'calc(100% + 5px)', top: '50%', transform: 'translateY(-50%)' };
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

  return (
    <motion.div
      aria-hidden
      className={cn('measurement-overlay pointer-events-none z-[6]', className)}
      style={style}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: MOTION.duration.fade, ease: EASE_PRECISION }}
    >
      <div className={cn('relative', isHorizontal ? 'h-4 w-full' : 'h-full w-4')}>
        <motion.div
          style={{
            backgroundColor: lineColor,
            ...(isHorizontal ? { originX: 0.5 } : { originY: 0.5 }),
          }}
          initial={false}
          animate={
            isHorizontal
              ? { scaleX: visible ? 1 : 0, opacity: visible ? 0.7 : 0 }
              : { scaleY: visible ? 1 : 0, opacity: visible ? 0.7 : 0 }
          }
          transition={{ duration: MOTION.duration.draw, ease: EASE_PRECISION }}
          className={
            isHorizontal
              ? 'absolute left-0 right-0 top-1/2 h-px -translate-y-1/2'
              : 'absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2'
          }
        />

        <DimensionEndCaps direction={direction} color={lineColor} />

        {showLabel && value && (
          <MeasurementLabel
            value={value}
            color={color}
            variant="tooltip"
            visible={visible}
            className="absolute"
            style={labelPositionStyle(direction, resolvedPlacement)}
          />
        )}
      </div>
    </motion.div>
  );
}
