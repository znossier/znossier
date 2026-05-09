'use client';

import { SectionHeading } from '@/components/SectionHeading';
import { SectionGridLines } from '@/components/SectionGridLines';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { mockTechStack } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, memo } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Single scale for every logo so they all render the same size */
const LOGO_BOX_SCALE = 0.82;

interface LogoCardProps {
  item: (typeof mockTechStack)[0];
  reduceMotion: boolean;
}

const LogoCard = memo(function LogoCard({ item, reduceMotion }: LogoCardProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardHover = () => {
    requestAnimationFrame(() => {
      const label = labelRef.current;
      const card = cardRef.current;
      if (!label || !card) return;
      const cardRect = card.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const labelParent = label.parentElement;
      const parentRect = labelParent?.getBoundingClientRect();
      const ingestUrl = process.env.NEXT_PUBLIC_ANALYTICS_INGEST_URL;
      if (ingestUrl) {
        fetch(ingestUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'TechStack.tsx:handleCardHover',
            message: 'hover dimensions',
            data: {
              name: item.name,
              labelWidth: labelRect.width,
              cardWidth: cardRect.width,
              parentWidth: parentRect?.width,
              labelScrollWidth: label.scrollWidth,
              labelClientWidth: label.clientWidth,
            },
            timestamp: Date.now(),
            hypothesisId: 'H1',
          }),
        }).catch((e) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('TechStack analytics request failed', e);
          }
        });
      }
    });
  };

  return (
    <div
      className="group flex flex-shrink-0 px-1.5 md:px-2"
      title={item.name}
      onMouseEnter={handleCardHover}
    >
      <motion.div
        ref={cardRef}
        className="surface-raised relative z-10 flex h-20 w-20 flex-col border border-border/90 shadow-[0_12px_26px_rgba(17,17,17,0.06)] transition-[box-shadow,border-color,transform] duration-300 ease-out hover:border-foreground/55 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 dark:bg-section-accent/92 dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:hover:border-link/40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={
          reduceMotion
            ? undefined
            : { y: -2, boxShadow: '0 10px 24px -10px rgba(0,0,0,0.35)' }
        }
      >
        {/* Desktop: logo centered; hover = smooth push-up + label fade-in. Mobile: logo + label block centered. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="flex w-full flex-col items-center transition-transform duration-200 ease-out md:group-hover:-translate-y-1.5"
          >
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
                    className={`relative h-full w-full ${item.monochrome ? 'dark:invert' : ''} ${item.logoClassName ?? ''}`}
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
              <span className="text-sm font-medium text-foreground/68">
                {item.name.charAt(0)}
              </span>
            )}
            {/* Up to 2 lines everywhere so names like Figma / TypeScript show in full; ellipsis only if longer */}
            <span
              ref={labelRef}
              className="mt-1 w-full min-w-0 px-1 text-center text-[9px] font-medium leading-tight text-foreground/70 line-clamp-2 sm:text-[10px] md:absolute md:left-0 md:right-0 md:top-full md:mt-1.5 md:px-2 md:text-xs md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
              aria-hidden
            >
              {item.name}
            </span>
          </div>
        </div>
      </motion.div>
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
      <div className={`flex w-max flex-nowrap ps-[var(--site-padding-inline)] lg:ps-0 ${animationClass}`}>
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

export function TechStack() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const mid = Math.ceil(mockTechStack.length / 2);
  const row1 = mockTechStack.slice(0, mid);
  const row2 = mockTechStack.slice(mid);

  return (
    <section
      id="tech-stack"
      className="relative z-20 border-t border-border/90 bg-section-accent py-[var(--mobile-section-padding)] md:py-20 lg:py-24 dark:bg-background"
    >
      <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.techStack} />
      <div className="relative z-10 mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
        <div className="site-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="col-span-full mb-10 md:mb-12 lg:col-span-full"
          >
            <SectionHeading surfaceClassName="bg-section-accent dark:bg-background">Tech Stack</SectionHeading>
          </motion.div>
        </div>

        <div className="-mx-[var(--site-padding-inline)] lg:mx-0">
          <MarqueeRow items={row1} direction="left" reduceMotion={reduceMotion} />
          <MarqueeRow items={row2} direction="right" reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}
