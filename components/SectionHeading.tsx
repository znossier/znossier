import type { ReactNode } from 'react';

export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/50"
        aria-hidden
      />
      <h2
        id={id}
        className="text-xs md:text-sm uppercase tracking-widest font-medium text-foreground/50"
      >
        {children}
      </h2>
    </div>
  );
}
