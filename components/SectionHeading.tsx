import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  children,
  title,
  /** @deprecated Use title for single-line headings e.g. "01 - Projects" */
  kicker,
  className,
  surfaceClassName,
}: {
  id?: string;
  children?: ReactNode;
  title?: ReactNode;
  kicker?: ReactNode;
  className?: string;
  surfaceClassName?: string;
}) {
  const label = title ?? children ?? kicker;

  return (
    <div className={cn('section-heading', className)}>
      <div className={cn('section-heading-label', surfaceClassName)}>
        <h2 id={id} className="type-section section-heading-title">
          {label}
        </h2>
      </div>
    </div>
  );
}
