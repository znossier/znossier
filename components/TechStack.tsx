'use client';

import { Section } from '@/components/Section';
import { SectionStickyShell } from '@/components/SectionStickyShell';
import { SectionHeading } from '@/components/SectionHeading';
import { SectionLayout } from '@/components/SectionLayout';
import { mockTechStack } from '@/lib/mock-data';
import { Reveal } from '@/components/Reveal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { mediaQueries } from '@/lib/breakpoints';
import Image from 'next/image';
import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { SelectionOutline } from '@/components/SelectionOutline';

const LOGO_BOX_SCALE = 0.82;

interface LogoCardProps {
  item: (typeof mockTechStack)[0];
  /** Duplicate tiles inside the marquee loop are decorative — the real list is announced once elsewhere */
  decorative?: boolean;
}

const LogoCard = memo(function LogoCard({ item, decorative = false }: LogoCardProps) {
  const logoScale = (item.logoScale ?? 1) * LOGO_BOX_SCALE;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group tech-stack-item"
      role={decorative ? undefined : 'listitem'}
      aria-hidden={decorative || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tech-stack-card">
        {item.logo ? (
          <div className="tech-stack-logo-slot">
            <div
              className="tech-stack-logo-box relative"
              style={{
                width: `${(logoScale * 100).toFixed(0)}%`,
                height: `${(logoScale * 100).toFixed(0)}%`,
              }}
            >
              <div
                className={cn(
                  'relative h-full w-full',
                  item.monochrome && 'logo-monochrome',
                  item.logoClassName
                )}
              >
                <Image
                  src={item.logo}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="48px"
                />
              </div>
            </div>
          </div>
        ) : (
          <span className="type-title text-lg">{item.name.charAt(0)}</span>
        )}

        <span className="tech-stack-card-label" aria-hidden>
          {item.name}
        </span>
      </div>

      {/* Outside the card so corner nodes aren't clipped by tile overflow */}
      <SelectionOutline visible={hovered} showCorners className="tech-stack-selection" />
      {!decorative && <span className="sr-only">{item.name}</span>}
    </div>
  );
});

function StaticTechGrid() {
  return (
    <div className="tech-stack-static-grid" role="list" aria-label="Tech stack logos">
      {mockTechStack.map((item) => (
        <LogoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

interface MarqueeRowProps {
  items: typeof mockTechStack;
  reverse?: boolean;
}

/** Track holds the row twice back-to-back — the loop only has to travel -50% to repeat seamlessly */
function MarqueeRow({ items, reverse = false }: MarqueeRowProps) {
  const looped = [...items, ...items];

  return (
    <div className="tech-stack-marquee-row">
      <div
        className={cn('tech-stack-marquee-track', reverse && 'tech-stack-marquee-track--reverse')}
      >
        {looped.map((item, index) => (
          <LogoCard key={`${item.id}-${index}`} item={item} decorative />
        ))}
      </div>
    </div>
  );
}

function TechMarquee() {
  const mid = Math.ceil(mockTechStack.length / 2);
  const row1 = mockTechStack.slice(0, mid);
  const row2 = mockTechStack.slice(mid);

  return (
    <div className="tech-stack-marquee-rows">
      {/* Real, non-duplicated list announced once for assistive tech; the rows above are aria-hidden */}
      <ul className="sr-only" aria-label="Tech stack logos">
        {mockTechStack.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <MarqueeRow items={row1} />
      <MarqueeRow items={row2} reverse />
    </div>
  );
}

export function TechStack() {
  const isDesktop = useMediaQuery(mediaQueries.lg);
  const reduceMotion = useReducedMotion();
  const panel = reduceMotion ? <StaticTechGrid /> : <TechMarquee />;

  if (!isDesktop) {
    return (
      <Section id="tech-stack" variant="canvas" inspectOnEnter>
        <SectionLayout sectionId="tech-stack">
          <div className="section-figma-stack">
            <Reveal>
              <SectionHeading title="04 - Tech Stack" />
            </Reveal>
            <div className="section-figma-panel tech-stack-panel overflow-hidden">{panel}</div>
          </div>
        </SectionLayout>
      </Section>
    );
  }

  return (
    <Section id="tech-stack" variant="canvas" inspectOnEnter className="section--sticky-lock py-0">
      <SectionStickyShell
        sectionId="tech-stack"
        title="04 - Tech Stack"
        panelClassName="tech-stack-panel min-h-0 flex-1 overflow-hidden"
        panelLabel="Tech stack"
      >
        {panel}
      </SectionStickyShell>
    </Section>
  );
}
