'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { transitionOverlay } from '@/lib/motion';

export type MeasurementColor = 'cyan' | 'magenta';

export type MeasurementLabelProps = {
  value: string | number;
  color?: MeasurementColor;
  variant?: 'inline' | 'tooltip';
  visible?: boolean;
  labelOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
};

const colorClass: Record<MeasurementColor, string> = {
  cyan: 'measurement-tooltip--cyan',
  magenta: 'measurement-tooltip--magenta',
};

export function MeasurementLabel({
  value,
  color = 'cyan',
  variant = 'tooltip',
  visible = true,
  labelOpacity = 1,
  className,
  style,
}: MeasurementLabelProps) {
  const display = String(value);
  const hasPxUnit = /\dpx/i.test(display);

  return (
    <motion.span
      aria-hidden
      className={cn(
        'measurement-text pointer-events-none select-none whitespace-nowrap',
        variant === 'tooltip' ? cn('measurement-tooltip', colorClass[color]) : 'measurement-label',
        hasPxUnit && 'measurement-text--unit',
        className
      )}
      style={style}
      initial={false}
      animate={{ opacity: visible ? labelOpacity : 0, y: visible ? 0 : 4 }}
      transition={transitionOverlay}
    >
      {display}
    </motion.span>
  );
}
