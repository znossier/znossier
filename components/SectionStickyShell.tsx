'use client';

import type { ReactNode } from 'react';
import { SectionLayout } from '@/components/SectionLayout';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/lib/utils';

type SectionStickyShellProps = {
  sectionId: string;
  headingId?: string;
  title: ReactNode;
  children: ReactNode;
  /** Extra classes on the gray figma panel */
  panelClassName?: string;
  /** Extra classes on the sticky shell (SectionLayout) */
  className?: string;
  /** Panel aria label */
  panelLabel?: string;
  /** Enable nested overflow scroll + Lenis prevent (Works / Expertise / About) */
  scrollable?: boolean;
};

/**
 * Viewport-locked section chrome: heading badge stays pinned while the gray
 * panel fills the remaining viewport (24px gap).
 */
export function SectionStickyShell({
  sectionId,
  headingId,
  title,
  children,
  panelClassName,
  className,
  panelLabel,
  scrollable = false,
}: SectionStickyShellProps) {
  return (
    <SectionLayout
      sectionId={sectionId}
      className={cn(
        'section-sticky-shell sticky top-[var(--chrome-top)] flex h-[calc(100svh-var(--chrome-top))] w-full flex-col',
        className
      )}
    >
      <div className="section-figma-stack section-sticky-stack flex min-h-0 flex-1 flex-col">
        <div className="section-sticky-heading flex-shrink-0">
          <SectionHeading id={headingId} title={title} />
        </div>

        <div
          className={cn(
            'section-figma-panel section-sticky-panel flex min-h-0 flex-1 flex-col',
            scrollable && 'section-sticky-panel--scroll',
            panelClassName
          )}
          data-lenis-prevent={scrollable ? true : undefined}
          aria-label={panelLabel}
        >
          {children}
        </div>
      </div>
    </SectionLayout>
  );
}
