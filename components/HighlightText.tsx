import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Simple text wrapper without scroll-triggered animations.
 */
export function HighlightText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('inline-block', className)}>
      {children}
    </span>
  );
}
