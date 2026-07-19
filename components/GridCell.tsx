import { layoutClass, type HomeLayoutSection } from '@/lib/grid-layout';
import { cn } from '@/lib/utils';
import type { ElementType, ReactNode } from 'react';

type GridCellProps<T extends ElementType = 'div'> = {
  section: HomeLayoutSection;
  cell: string;
  children: ReactNode;
  className?: string;
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * Grid-placed cell derived from HOME_LAYOUTS — single source of truth for column spans.
 */
export function GridCell<T extends ElementType = 'div'>({
  section,
  cell,
  className,
  children,
  as,
  ...props
}: GridCellProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp className={cn(layoutClass(section, cell), className)} {...props}>
      {children}
    </Comp>
  );
}
