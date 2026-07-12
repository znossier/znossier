'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useScrollPeek } from '@/hooks/useScrollPeek';
import { useFinePointer } from '@/hooks/useFinePointer';
import { InspectionPeekProvider } from '@/components/InspectionPeekContext';

export type SectionVariant = 'canvas' | 'subtle' | 'footer';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  variant?: SectionVariant;
  children: ReactNode;
  inspectOnEnter?: boolean;
};

const variantClass: Record<SectionVariant, string> = {
  canvas: 'section--canvas',
  subtle: 'section--subtle',
  footer: 'section--footer',
};

export function Section({
  variant = 'canvas',
  className,
  children,
  inspectOnEnter = true,
  ...props
}: SectionProps) {
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
      ref={sectionRef}
      className={cn(
        'section',
        variantClass[variant],
        showSectionPeek && scrollPeeking && 'section--inspecting',
        className
      )}
      {...props}
    >
      {showSectionPeek && <div className="section-inspection-bounds" aria-hidden />}
      <InspectionPeekProvider peeking={showSectionPeek && scrollPeeking}>
        {children}
      </InspectionPeekProvider>
    </section>
  );
}
