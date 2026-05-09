import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  children,
  title,
  className,
}: {
  id?: string;
  children?: ReactNode;
  title?: ReactNode;
  className?: string;
  surfaceClassName?: string;
}) {
  const label = children ?? title;

  return (
    <div className={cn('relative flex min-w-0 items-center gap-4 overflow-hidden md:gap-5', className)}>
      <div className="relative z-10 shrink-0">
        <div className="relative flex items-center gap-4 pe-4 md:gap-5 md:pe-5">
          <span className="shrink-0 font-mono text-[1.05rem] font-bold leading-none text-link md:text-[1.15rem]" aria-hidden>
            /
          </span>
          <h2 id={id} className="editorial-kicker shrink-0 text-foreground/68">
            {label}
          </h2>
        </div>
      </div>
      <div className="editorial-rule relative z-10 min-w-0 flex-1" aria-hidden />
    </div>
  );
}
