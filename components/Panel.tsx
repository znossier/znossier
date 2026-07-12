import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PanelProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md';
  framed?: boolean;
};

const paddingClass = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-4 sm:p-6 md:p-8',
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
