'use client';

import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import { SectionLayout } from '@/components/SectionLayout';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { gridSpans } from '@/lib/grid-spans';
import { mediaQueries } from '@/lib/breakpoints';
import type { Service } from '@/lib/site-content';
import { Reveal } from '@/components/Reveal';
import { SpacingGuide } from '@/components/SpacingGuide';
import { cn } from '@/lib/utils';
import { memo, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const NAV_OFFSET = 'calc(var(--chrome-top) + 1rem)';
const CARD_STACK_OFFSET_PX = 16;
const DESKTOP_CARD_HEIGHT_PX = 320;

const ServiceCard = memo(function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery(mediaQueries.lg);

  const zIndex = index + 1;
  const stickyTop = `calc(${NAV_OFFSET} + ${index * CARD_STACK_OFFSET_PX}px)`;

  return (
    <div
      ref={cardRef}
      style={
        isDesktop
          ? {
              zIndex,
              position: 'sticky',
              top: stickyTop,
            }
          : undefined
      }
      className={isDesktop ? 'mb-4 md:mb-5' : undefined}
    >
      <WorkspaceFrame
        inspectMode="hover"
        frameLabel={`expertise / ${service.number}`}
        showSpacing
        showPadding
        panelClassName="relative h-full md:h-[320px]"
        className="relative"
      >
        <div className="relative z-[2] grid h-full grid-cols-6 gap-x-3 gap-y-4 p-5 text-left sm:p-6 md:grid-cols-[auto_1fr] md:gap-x-8 md:gap-y-0 md:p-8">
          <div className="type-label self-start [grid-column:1/span_1] md:[grid-column:auto]">
            {service.number}
          </div>
          <div className="flex min-w-0 flex-col justify-start gap-4 [grid-column:2/span_5] md:[grid-column:auto] lg:justify-center">
            <h4 className="type-title">{service.title}</h4>
            <p className="type-body-lg max-w-xl">{service.description}</p>
          </div>
        </div>
      </WorkspaceFrame>
    </div>
  );
});

export function Services({ services }: { services: Service[] }) {
  const isDesktop = useMediaQuery(mediaQueries.lg);

  return (
    <Section
      id="expertise"
      variant="canvas"
    >
      <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.expertise}>
        <SpacingGuide
          showGaps
          showGutters
          showLabels
          sectionBoundaries={HOME_SECTION_BOUNDARIES.expertise}
          className="site-section-grid"
        >
          <Reveal className={gridSpans.expertise.heading}>
            <div
              className="section-heading-sticky relative z-10 py-3 lg:sticky"
              style={{ top: isDesktop ? NAV_OFFSET : undefined }}
            >
              <SectionHeading kicker="02 — Expertise" surfaceClassName="section-heading-sticky">Expertise</SectionHeading>
            </div>
          </Reveal>

          <div
            className={cn('relative', gridSpans.expertise.cards, isDesktop ? '' : 'flex flex-col gap-4')}
            style={isDesktop ? { minHeight: `${services.length * DESKTOP_CARD_HEIGHT_PX}px` } : undefined}
          >
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.08} flashGuides={index === 0}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </SpacingGuide>
      </SectionLayout>
    </Section>
  );
}
