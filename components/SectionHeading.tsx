import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  children,
  title,
  className,
  surfaceClassName,
}: {
  id?: string;
  children?: ReactNode;
  title?: ReactNode;
  className?: string;
  surfaceClassName?: string;
}) {
  const label = title ?? children;

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
