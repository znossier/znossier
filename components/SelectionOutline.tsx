'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { transitionOverlay } from '@/lib/motion';

const HANDLE =
  'absolute h-1.5 w-1.5 border border-[var(--utility-cyan)] bg-[var(--background)]';

export function SelectionOutline({
  visible = true,
  showAnchor = false,
  showCorners = true,
  hideTopLeftCorner = false,
  className,
}: {
  visible?: boolean;
  showAnchor?: boolean;
  /** When false, render border only (section-level frames). */
  showCorners?: boolean;
  /** Hide the top-left handle when a frame tab occupies that corner */
  hideTopLeftCorner?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn('selection-outline pointer-events-none absolute inset-0', className)}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={transitionOverlay}
    >
      <div className="absolute inset-0 border border-[var(--utility-cyan)] opacity-90" />
      {showCorners && !hideTopLeftCorner && (
        <span className={cn(HANDLE, 'left-0 top-0 -translate-x-1/2 -translate-y-1/2')} />
      )}
      {showCorners && (
        <span className={cn(HANDLE, 'right-0 top-0 translate-x-1/2 -translate-y-1/2')} />
      )}
      {showCorners && (
        <span className={cn(HANDLE, 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2')} />
      )}
      {showCorners && (
        <span className={cn(HANDLE, 'bottom-0 right-0 translate-x-1/2 translate-y-1/2')} />
      )}
      {showAnchor && (
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--utility-cyan)] opacity-80" />
      )}
    </motion.div>
  );
}
