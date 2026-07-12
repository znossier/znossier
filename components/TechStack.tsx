'use client';

import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import { SectionLayout } from '@/components/SectionLayout';
import { SpacingGuide } from '@/components/SpacingGuide';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { mockTechStack } from '@/lib/mock-data';
import { Reveal } from '@/components/Reveal';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { memo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Single scale for every logo so they all render the same size */
const LOGO_BOX_SCALE = 0.82;

interface LogoCardProps {
  item: (typeof mockTechStack)[0];
  reduceMotion: boolean;
}

const LogoCard = memo(function LogoCard({ item, reduceMotion }: LogoCardProps) {
  return (
    <div className="group flex flex-shrink-0 px-1.5 md:px-2" title={item.name}>
      <WorkspaceFrame
        inspectMode="hover"
        showDimensions={false}
        showSpacing={false}
        variant="flat"
        panelClassName="tech-stack-card relative z-10 flex h-20 w-20 flex-col sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
      >
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
        >
          <div className="flex w-full flex-col items-center transition-transform duration-200 ease-out md:group-hover:-translate-y-1.5">
            {item.logo ? (
              <div className="relative flex aspect-square h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12 max-h-full max-w-full">
                <div
                  className="relative aspect-square shrink-0"
                  style={{
                    width: `${((item.logoScale ?? 1) * LOGO_BOX_SCALE * 100).toFixed(0)}%`,
                    height: `${((item.logoScale ?? 1) * LOGO_BOX_SCALE * 100).toFixed(0)}%`,
                  }}
                >
                  <div
                    className={`relative h-full w-full ${item.monochrome ? 'logo-monochrome' : ''} ${item.logoClassName ?? ''}`}
                  >
                    <Image
                      src={item.logo}
                      alt={item.name}
                      fill
                      className="object-contain aspect-square"
                      sizes="(max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <span className="type-body text-sm font-medium">
                {item.name.charAt(0)}
              </span>
            )}
            <span
              className="type-label mt-1 w-full min-w-0 px-1 text-center leading-tight line-clamp-2 md:absolute md:left-0 md:right-0 md:top-full md:mt-1.5 md:px-2 md:text-xs md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
              aria-hidden
            >
              {item.name}
            </span>
          </div>
        </motion.div>
      </WorkspaceFrame>
    </div>
  );
});

interface MarqueeRowProps {
  items: typeof mockTechStack;
  direction: 'left' | 'right';
  reduceMotion: boolean;
}

function MarqueeRow({ items, direction, reduceMotion }: MarqueeRowProps) {
  const duplicated = [...items, ...items];
  const animationClass =
    reduceMotion ? '' : direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="tech-stack-marquee-row relative overflow-hidden py-2 md:py-6">
      <div className={`flex w-max flex-nowrap ps-[var(--site-padding-inline)] ${animationClass}`}>
        {duplicated.map((item, index) => (
          <LogoCard
            key={`${item.id}-${index}`}
            item={item}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

function StaticTechGrid({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="site-grid gap-3 md:gap-4">
      {mockTechStack.map((item) => (
        <div key={item.id} className="col-span-3 sm:col-span-2 lg:col-span-3">
          <LogoCard item={item} reduceMotion={reduceMotion} />
        </div>
      ))}
    </div>
  );
}

export function TechStack() {
  const reduceMotion = useReducedMotion();

  const mid = Math.ceil(mockTechStack.length / 2);
  const row1 = mockTechStack.slice(0, mid);
  const row2 = mockTechStack.slice(mid);

  return (
    <Section id="tech-stack" variant="canvas">
      <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.techStack}>
        <SpacingGuide
          showGutters
          showLabels
          sectionBoundaries={HOME_SECTION_BOUNDARIES.techStack}
          className="site-section-grid"
        >
          <Reveal className="col-span-full">
            <SectionHeading kicker="04 — Stack" surfaceClassName="section-heading-sticky">
              Tech Stack
            </SectionHeading>
          </Reveal>

          <div className="col-span-full">
            {reduceMotion ? (
              <div className="tech-stack-bleed mt-6 md:mt-8">
                <StaticTechGrid reduceMotion={reduceMotion} />
              </div>
            ) : (
              <div className="tech-stack-bleed -mx-[var(--site-padding-inline)] mt-6 md:mt-8">
                <MarqueeRow items={row1} direction="left" reduceMotion={reduceMotion} />
                <MarqueeRow items={row2} direction="right" reduceMotion={reduceMotion} />
              </div>
            )}
          </div>
        </SpacingGuide>
      </SectionLayout>
    </Section>
  );
}
