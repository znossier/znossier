'use client';

import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { SectionLayout } from '@/components/SectionLayout';
import { SocialLinks } from '@/components/SocialLinks';
import { SpacingGuide } from '@/components/SpacingGuide';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { InspectionPeekProvider } from '@/components/InspectionPeekContext';
import { getHeroPortraitObjectPosition } from '@/lib/hero-portrait';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { gridSpans } from '@/lib/grid-spans';
import type { AboutContent, ContactContent } from '@/lib/site-content';
import { smoothScrollTo, cn } from '@/lib/utils';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useScrollPeek } from '@/hooks/useScrollPeek';
import { mediaQueries } from '@/lib/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Image from 'next/image';
import { useRef } from 'react';

function HeroPortraitFrame({
  image,
  objectPosition,
  className,
  inspectable = true,
}: {
  image: string;
  objectPosition: string;
  className?: string;
  inspectable?: boolean;
}) {
  const portrait = (
    <div className="hero-portrait-fill absolute inset-0 overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="hero-portrait-image object-cover"
        style={{ objectPosition }}
        sizes="(max-width: 1023px) 55vw, 42vw"
      />
      <div className="hero-portrait-shine pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );

  if (!inspectable) {
    return (
      <div className={`hero-portrait-frame relative h-full w-full ${className ?? ''}`}>
        {portrait}
      </div>
    );
  }

  return (
    <WorkspaceFrame
      inspectMode="always"
      frameLabel="portrait · fill"
      frameLabelClassName="frame-label--media"
      showDimensions
      showMeasurementLines
      variant="bare"
      className={className}
      panelClassName="hero-portrait-frame relative h-full w-full"
    >
      {portrait}
    </WorkspaceFrame>
  );
}

export function Hero({
  about,
  contact,
}: {
  about: AboutContent;
  contact: ContactContent;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const finePointer = useFinePointer();
  const showSectionPeek = !finePointer;
  const scrollPeeking = useScrollPeek(heroRef, {
    threshold: 0.15,
    dwellMs: 900,
    enabled: showSectionPeek,
    resetOnExit: true,
  });
  const isLg = useMediaQuery(mediaQueries.lg);
  const isSm = useMediaQuery(mediaQueries.sm);
  const viewportWidth = isLg ? 1280 : isSm ? 768 : 640;
  const portraitObjectPosition = getHeroPortraitObjectPosition(viewportWidth);

  return (
    <section
      ref={heroRef}
      id="home"
      className={cn(
        'hero-section section relative inset-x-0 top-0 z-[5] flex min-h-[100svh] items-center overflow-x-hidden pb-24 pt-[calc(var(--chrome-top)+1.25rem)] sm:pt-[calc(var(--chrome-top)+1.75rem)] md:pb-16 lg:fixed lg:min-h-screen lg:overflow-visible lg:pb-10 lg:pt-[calc(var(--chrome-top)+1rem)] xl:pb-16',
        showSectionPeek && scrollPeeking && 'section--inspecting'
      )}
    >
      {showSectionPeek && <div className="section-inspection-bounds" aria-hidden />}
      <div className="hero-canvas-grid workspace-grid-lines pointer-events-none absolute inset-0 -z-20" aria-hidden />
      <div className="hero-vignette pointer-events-none absolute inset-0 -z-[19]" aria-hidden />
      <div className="hero-ambient-light pointer-events-none absolute inset-0 -z-[18]" aria-hidden />

      {about.image && (
        <div className="hero-portrait-backdrop pointer-events-none absolute inset-y-0 right-0 -z-10 w-[62%] sm:w-[52%] lg:hidden" aria-hidden>
          <HeroPortraitFrame
            image={about.image}
            objectPosition={portraitObjectPosition}
            className="absolute inset-0"
            inspectable={false}
          />
          <div className="hero-portrait-scrim absolute inset-0" aria-hidden />
        </div>
      )}

      <div className="hero-fade-left pointer-events-none absolute inset-0 -z-[9]" aria-hidden />
      <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 -z-[9] h-[30vh]" aria-hidden />

      <InspectionPeekProvider peeking={showSectionPeek && scrollPeeking}>
        <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.hero}>
          <SpacingGuide
            showGaps
            showGutters
            showLabels={finePointer || scrollPeeking}
            sectionBoundaries={HOME_SECTION_BOUNDARIES.hero}
            className="site-grid min-h-[calc(100svh-var(--chrome-top)-7rem)] w-full items-end pb-2 sm:items-center lg:min-h-[calc(100vh-8rem)] lg:items-center lg:pb-0"
          >
            <Reveal className={cn('hero-copy-shell relative overflow-visible', gridSpans.hero.copy)}>
              <WorkspaceFrame
                inspectMode="always"
                frameLabel="hero · intro"
                showDimensions
                showMeasurementLines
                showSpacing
                showPadding
                variant="panel"
                className="hero-copy relative h-full"
                panelClassName="hero-copy-panel px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7"
              >
                <div className="hero-copy-accent pointer-events-none absolute inset-y-5 left-0 w-px sm:inset-y-6 lg:inset-y-7" aria-hidden />

                <h1 className="sr-only">
                  {about.name} — {about.title}
                </h1>

                <div className="flex flex-col gap-5 sm:gap-6">
                  <p className="hero-kicker type-meta">Portfolio — workspace</p>

                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="type-display hero-name">{about.name}</h2>
                    <p className="hero-role type-label">{about.title}</p>
                  </div>

                  <div className="hero-actions flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
                    <Button
                      onClick={() => smoothScrollTo('works')}
                      variant="accent"
                      className="type-meta min-h-11 px-4 py-2"
                      aria-label="Scroll to works section"
                    >
                      View Work
                    </Button>
                    <SocialLinks socialLinks={contact.socialLinks} className="shrink-0" />
                  </div>
                </div>
              </WorkspaceFrame>
            </Reveal>

            {about.image && (
              <Reveal delay={0.12} className={cn('relative hidden lg:block lg:self-center', gridSpans.hero.portrait)}>
                <div className="hero-portrait-glow pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10" aria-hidden />
                <HeroPortraitFrame
                  image={about.image}
                  objectPosition={portraitObjectPosition}
                  className="relative h-[min(68vh,42rem)] overflow-visible"
                />
              </Reveal>
            )}

            <a
              href="#works"
              onClick={(event) => {
                event.preventDefault();
                smoothScrollTo('works');
              }}
              className={cn(
                'scroll-hint type-meta hidden items-center justify-end gap-2 self-end text-right transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent lg:inline-flex',
                gridSpans.hero.scrollHint
              )}
              aria-label="Scroll to works section"
            >
              Scroll to see more
              <svg className="scroll-hint-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 5v13m0 0l-5-5m5 5l5-5" />
              </svg>
            </a>
          </SpacingGuide>
        </SectionLayout>
      </InspectionPeekProvider>
    </section>
  );
}
