import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  children,
  title,
  kicker,
  className,
  surfaceClassName,
}: {
  id?: string;
  children?: ReactNode;
  title?: ReactNode;
  /** Mono layer label above the title — e.g. "01 — Projects" */
  kicker?: ReactNode;
  className?: string;
  surfaceClassName?: string;
}) {
  const label = children ?? title;

  return (
    <div className={cn('section-heading', className)}>
      <div className={cn('section-heading-label', surfaceClassName)}>
        {kicker ? (
          <p className="section-heading-kicker type-meta" aria-hidden>
            {kicker}
          </p>
        ) : null}
        <div className="section-heading-title-row">
          <span className="section-heading-slash" aria-hidden>
            /
          </span>
          <h2 id={id} className="type-section">
            {label}
          </h2>
        </div>
      </div>
      <div className="section-heading-track" aria-hidden />
    </div>
  );
}
