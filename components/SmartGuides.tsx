'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_PRECISION, MOTION } from '@/lib/motion';

export function SmartGuides({
  visible = false,
  type = 'center',
  className,
}: {
  visible?: boolean;
  type?: 'center' | 'edge-h' | 'edge-v';
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn('smart-guides pointer-events-none absolute inset-0', className)}
      initial={false}
      animate={{ opacity: visible ? 0.8 : 0 }}
      transition={{ duration: MOTION.duration.flash, ease: EASE_PRECISION }}
    >
      {type === 'center' && (
        <>
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--utility-magenta)]" />
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[var(--utility-magenta)]" />
        </>
      )}
      {type === 'edge-h' && (
        <div className="absolute left-0 right-0 top-0 h-px bg-[var(--utility-magenta)]" />
      )}
      {type === 'edge-v' && (
        <div className="absolute bottom-0 left-0 top-0 w-px bg-[var(--utility-magenta)]" />
      )}
    </motion.div>
  );
}
