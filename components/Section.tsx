'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useRef } from 'react';
import { InspectionPeekProvider } from '@/components/InspectionPeekContext';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useScrollPeek } from '@/hooks/useScrollPeek';
import { cn } from '@/lib/utils';

export type SectionVariant = 'canvas' | 'subtle' | 'footer';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  variant?: SectionVariant;
  children: ReactNode;
  /** Touch/coarse: brief inspection peek for nested card frames */
  inspectOnEnter?: boolean;
};

const variantClass: Record<SectionVariant, string> = {
  canvas: 'section--canvas',
  subtle: 'section--subtle',
  footer: 'section--footer',
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    variant = 'canvas',
    className,
    children,
    inspectOnEnter = false,
    id,
    ...props
  },
  forwardedRef
) {
  const sectionRef = useRef<HTMLElement>(null);
  const finePointer = useFinePointer();

  const scrollPeeking = useScrollPeek(sectionRef, {
    threshold: 0.2,
    dwellMs: 900,
    enabled: inspectOnEnter && !finePointer,
    resetOnExit: true,
  });
  const showSectionPeek = inspectOnEnter && !finePointer;

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      id={id}
      className={cn(
        'section',
        variantClass[variant],
        showSectionPeek && scrollPeeking && 'section--inspecting',
        className
      )}
      {...props}
    >
      <InspectionPeekProvider peeking={showSectionPeek && scrollPeeking}>
        {children}
      </InspectionPeekProvider>
    </section>
  );
});
