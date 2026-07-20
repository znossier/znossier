'use client';

import { Section } from '@/components/Section';
import { SectionStickyShell } from '@/components/SectionStickyShell';
import { SectionHeading } from '@/components/SectionHeading';
import { SectionLayout } from '@/components/SectionLayout';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { getDefaultServiceVisual, ServiceVisualArtifact } from '@/components/ServiceVisualArtifact';
import { mediaQueries } from '@/lib/breakpoints';
import type { Service } from '@/lib/site-content';
import { Reveal } from '@/components/Reveal';
import { memo, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ServiceCard = memo(function ServiceCard({
  service,
  index,
  sticky = false,
}: {
  service: Service;
  index: number;
  sticky?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={
        sticky
          ? {
              // Stable stack order only — never boost on hover (that pinned the
              // hovered card while siblings scrolled underneath).
              zIndex: index + 1,
              position: 'sticky',
              top: `calc(var(--grid-unit) + ${index * 24}px)`,
            }
          : undefined
      }
      className={sticky ? 'pb-px' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <WorkspaceFrame
        inspectMode="hover"
        inspectDepth={hovered ? 'full' : 'outline'}
        frameLabel={service.number}
        showDimensions={hovered}
        showMeasurementLines={hovered}
        measurementPlacement="outside"
        variant="figma"
        panelClassName="relative h-auto min-h-0 overflow-visible p-[calc(var(--grid-unit)*2)] lg:min-h-[calc(var(--grid-unit)*13)]"
        className="card-lift relative overflow-visible"
      >
        <div className="grid h-full grid-cols-1 gap-[var(--grid-unit)] text-left lg:grid-cols-[1fr_var(--expertise-visual-width)] lg:items-start lg:gap-[calc(var(--grid-unit)*2)]">
          <div className="flex min-w-0 flex-col justify-center gap-[var(--grid-unit)]">
            <div className="type-meta text-[var(--figma-meta)]">{service.number}</div>
            <h3 className="type-expertise-title">{service.title}</h3>
            <p className="expertise-card-body">{service.description}</p>
          </div>
          <div
            className="service-visual-demo relative h-[var(--expertise-visual-height)] w-full lg:h-[var(--expertise-visual-height)] lg:w-[var(--expertise-visual-width)] lg:max-w-[var(--expertise-visual-width)] lg:shrink-0"
            aria-hidden
          >
            <ServiceVisualArtifact visual={service.visual ?? getDefaultServiceVisual(index)} />
          </div>
        </div>
      </WorkspaceFrame>
    </div>
  );
});

export function Services({ services }: { services: Service[] }) {
  const isDesktop = useMediaQuery(mediaQueries.lg);

  const cards = (
    // Figma 400:7157: cards are 1200px wide (50U), inset 48px (2U) from the
    // section's left edge — not stretched to the full 1320px content box.
    <div className="flex flex-col gap-[calc(var(--grid-unit)*2)] pt-[var(--frame-tab-clearance)] lg:ml-[calc(var(--grid-unit)*2)] lg:w-[calc(var(--grid-unit)*50)] lg:max-w-[calc(var(--grid-unit)*50)] lg:gap-[calc(var(--grid-unit)*4)]">
      {services.map((service, index) =>
        isDesktop ? (
          <ServiceCard key={service.id} service={service} index={index} sticky />
        ) : (
          <Reveal key={service.id} delay={index * 0.08}>
            <ServiceCard service={service} index={index} />
          </Reveal>
        )
      )}
    </div>
  );

  if (!isDesktop) {
    return (
      <Section id="expertise" variant="canvas" inspectOnEnter>
        <SectionLayout sectionId="expertise">
          <div className="section-figma-stack">
            <Reveal>
              <SectionHeading title="02 - Expertise" />
            </Reveal>
            <div className="section-figma-panel">{cards}</div>
          </div>
        </SectionLayout>
      </Section>
    );
  }

  return (
    <Section id="expertise" variant="canvas" inspectOnEnter className="section--sticky-lock py-0">
      <SectionStickyShell
        sectionId="expertise"
        title="02 - Expertise"
        panelLabel="Expertise"
      >
        {cards}
      </SectionStickyShell>
    </Section>
  );
}
