import type { ReactNode } from 'react';
import { SectionGridLines } from '@/components/SectionGridLines';
import type { ResponsiveGridBoundaries } from '@/lib/grid';
import { cn } from '@/lib/utils';

export function SectionLayout({
  boundaries,
  children,
  className,
}: {
  boundaries?: ResponsiveGridBoundaries;
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      {boundaries ? <SectionGridLines boundaries={boundaries} /> : null}
      <div className={cn('site-shell relative z-10', className)}>{children}</div>
    </>
  );
}
