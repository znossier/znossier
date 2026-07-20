'use client';

import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { SectionLayout } from '@/components/SectionLayout';
import { SocialLinks } from '@/components/SocialLinks';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { layoutClass } from '@/lib/grid-layout';
import type { AboutContent, ContactContent } from '@/lib/site-content';
import { smoothScrollTo, cn } from '@/lib/utils';
import { mediaQueries } from '@/lib/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useElementReachedTop } from '@/hooks/useScrollOffset';

function HeroPortraitFrame({
  image,
  className,
  inspectable = true,
  inFocus = true,
}: {
  image?: string;
  className?: string;
  inspectable?: boolean;
  inFocus?: boolean;
}) {
  const isLg = useMediaQuery(mediaQueries.lg);

  // Outer slot is grid-locked (720×480) with overflow visible so PORTRAIT chrome
  // (label, rulers, corner handles) can sit outside the photo. The image is clipped
  // by `.hero-portrait-media` only. No CMS photo? Slot fill is the placeholder —
  // never point an <img> at a hard-coded local path that doesn't ship in /public.
  return (
    <div className={cn('hero-portrait-slot', className)}>
      <div className="hero-portrait-media">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            width={720}
            height={480}
            decoding="async"
            fetchPriority="high"
            className="hero-portrait-image"
          />
        )}
      </div>
      {inspectable && isLg && (
        <WorkspaceFrame
          inspectMode={inFocus ? 'always' : 'off'}
          inspectDepth="full"
          frameLabel="Portrait"
          showDimensions
          showMeasurementLines
          showSelectionOutline
          showSpacing={false}
          showGaps={false}
          measurementPlacement="outside"
          variant="figma"
          className="hero-portrait-inspect"
          panelClassName="hero-portrait-inspect-surface"
          aria-hidden
        >
          <span className="sr-only">Portrait</span>
        </WorkspaceFrame>
      )}
    </div>
  );
}

export function Hero({
  about,
  contact,
}: {
  about: AboutContent;
  contact: ContactContent;
}) {
  const isLg = useMediaQuery(mediaQueries.lg);
  const worksReachedTop = useElementReachedTop('works', 220);
  const heroInFocus = !worksReachedTop;
  const portraitSrc = about.image;

  return (
    <Section
      id="home"
      variant="canvas"
      className="hero-section relative inset-x-0 top-0 flex min-h-[100svh] items-center overflow-x-hidden lg:min-h-screen lg:overflow-visible"
    >
      <h1 className="sr-only">
        {about.name} — {about.title}
      </h1>

      <div className="hero-edge-fade pointer-events-none absolute inset-0 z-0" aria-hidden />

      {/* Mobile / tablet backdrop portrait — above section wash, under copy */}
      <div
        className="hero-portrait-backdrop pointer-events-none absolute inset-y-0 right-0 z-[1] w-[62%] sm:w-[52%] lg:hidden"
        aria-hidden
      >
        <HeroPortraitFrame
          image={portraitSrc}
          className="absolute inset-0"
          inspectable={false}
        />
        <div className="hero-portrait-scrim absolute inset-0" aria-hidden />
      </div>

      <SectionLayout>
        <div className="site-grid relative z-[2] min-h-[calc(100svh-var(--chrome-top)-(var(--grid-unit)*7))] w-full items-end pb-[var(--grid-unit)] sm:items-center lg:min-h-[calc(100vh-(var(--grid-unit)*8))] lg:grid-rows-[1fr_auto] lg:items-start lg:pb-0">
          <div className={cn('hero-copy-shell relative overflow-visible pt-[calc(var(--grid-unit)*2)] lg:row-start-1 lg:pt-0', layoutClass('hero', 'copy'))}>
            <WorkspaceFrame
              inspectMode={isLg && heroInFocus ? 'always' : 'off'}
              inspectDepth="full"
              frameLabel="Intro"
              showDimensions
              showMeasurementLines
              showSpacing
              showGaps
              showPadding={false}
              showSelectionOutline={false}
              measurementPlacement="outside"
              variant="bare"
              className="hero-copy relative overflow-visible"
              panelClassName="hero-copy-panel"
            >
              <div className="grid-text-stack hero-intro-stack">
                <h2 className="type-display hero-name">
                  {about.name.includes(' ') ? (
                    <>
                      <span className="block">{about.name.split(' ')[0]}</span>
                      <span className="block">{about.name.split(' ').slice(1).join(' ')}</span>
                    </>
                  ) : (
                    about.name
                  )}
                </h2>
                <p className="hero-role">{about.title}</p>
                <div className="hero-actions flex flex-nowrap items-center gap-[var(--grid-unit)]">
                  <Button
                    onClick={() => smoothScrollTo('works')}
                    variant="inverted"
                    className="hero-view-work h-12 min-h-12 shrink-0"
                    aria-label="Scroll to works section"
                  >
                    View Work
                  </Button>
                  <SocialLinks socialLinks={contact.socialLinks} inverted bare />
                </div>
              </div>
            </WorkspaceFrame>
          </div>

          {/* Desktop portrait */}
          <div
            className={cn(
              'relative z-[3] hidden min-h-[var(--hero-portrait-height)] w-full min-w-0 overflow-visible pt-[calc(var(--grid-unit)*2)] lg:row-span-2 lg:block lg:self-start lg:pt-0 lg:justify-self-stretch',
              layoutClass('hero', 'portrait')
            )}
          >
            <HeroPortraitFrame image={portraitSrc} inFocus={heroInFocus} />
          </div>

          <a
            href="#works"
            onClick={(event) => {
              event.preventDefault();
              smoothScrollTo('works');
            }}
            className={layoutClass('hero', 'scrollHint')}
            aria-label="Scroll to works section"
          >
            Scroll to see more
            <svg className="scroll-hint-icon h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 5v13m0 0l-5-5m5 5l5-5" />
            </svg>
          </a>
        </div>
      </SectionLayout>
    </Section>
  );
}
