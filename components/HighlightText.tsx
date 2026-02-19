import type { ReactNode } from 'react';

/**
 * Simple text wrapper without scroll-triggered animations.
 */
export function HighlightText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
