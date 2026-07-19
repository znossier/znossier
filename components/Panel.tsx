import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PanelProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md';
  framed?: boolean;
};

const paddingClass = {
  none: '',
  sm: 'site-cell-pad',
  md: 'site-cell-pad',
};

export function Panel({
  children,
  className,
  padding = 'none',
  framed = true,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        'panel',
        framed && 'relative',
        paddingClass[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
