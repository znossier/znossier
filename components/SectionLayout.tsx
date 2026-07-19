'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Site shell rail for section content. `sectionId` kept for call-site clarity. */
export function SectionLayout({
  children,
  className,
}: {
  sectionId?: string;
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('site-shell z-10', className)}>{children}</div>;
}
