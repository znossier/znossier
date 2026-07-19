'use client';

import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { SectionLayout } from '@/components/SectionLayout';
import { SocialLinks } from '@/components/SocialLinks';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { getHeroPortraitObjectPosition } from '@/lib/hero-portrait';
import { layoutClass } from '@/lib/grid-layout';
import type { AboutContent, ContactContent } from '@/lib/site-content';
import { smoothScrollTo, cn } from '@/lib/utils';
import { mediaQueries } from '@/lib/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useElementReachedTop } from '@/hooks/useScrollOffset';

/** Always resolve a portrait src — never blank the hero if CMS omits the asset. */
const FALLBACK_PORTRAIT = '/zeina-photo.jpg';

function HeroPortraitFrame({
  image,
  objectPosition,
  className,
  inspectable = true,
  inFocus = true,
}: {
  image: string;
  objectPosition: string;
  className?: string;
  inspectable?: boolean;
  inFocus?: boolean;
}) {
  const isLg = useMediaQuery(mediaQueries.lg);
  const src = FALLBACK_PORTRAIT;
  void image;

  // Sized box owns the photo (background + img). Inspection chrome overlays only.
  return (
    <div
      className={cn('hero-portrait-slot', className)}
      style={{ backgroundImage: `url(${src})`, backgroundPosition: objectPosition }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={720}
        height={480}
        decoding="async"
        fetchPriority="high"
        className="hero-portrait-image"
        style={{ objectPosition }}
      />
      {inspectable && isLg && (
        <WorkspaceFrame
          inspectMode={inFocus ? 'always' : 'off'}
          inspectDepth="full"
          frameLabel="Portrait"
          showDimensions
          showMeasurementLines
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
  const isSm = useMediaQuery(mediaQueries.sm);
  const viewportWidth = isLg ? 1280 : isSm ? 768 : 640;
  const portraitObjectPosition = getHeroPortraitObjectPosition(viewportWidth);
  const worksReachedTop = useElementReachedTop('works', 220);
  const heroInFocus = !worksReachedTop;
  const portraitSrc = FALLBACK_PORTRAIT;

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
          objectPosition={portraitObjectPosition}
          className="absolute inset-0"
          inspectable={false}
        />
        <div className="hero-portrait-scrim absolute inset-0" aria-hidden />
      </div>

      <SectionLayout>
        <div className="site-grid relative z-[2] min-h-[calc(100svh-var(--chrome-top)-(var(--grid-unit)*7))] w-full items-end pb-[var(--grid-unit)] sm:items-center lg:min-h-[calc(100vh-(var(--grid-unit)*8))] lg:grid-rows-[1fr_auto] lg:items-center lg:pb-0">
          <Reveal className={cn('hero-copy-shell relative overflow-visible pt-[calc(var(--grid-unit)*2)] lg:row-start-1 lg:pt-0', layoutClass('hero', 'copy'))}>
            <WorkspaceFrame
              inspectMode={isLg && heroInFocus ? 'always' : 'off'}
              inspectDepth="full"
              frameLabel="Intro"
              showDimensions
              showMeasurementLines
              showSpacing={false}
              showGaps={false}
              showSelectionOutline={false}
              measurementPlacement="outside"
              variant="bare"
              className="hero-copy relative h-full overflow-visible"
              panelClassName="hero-copy-panel"
            >
              <div className="grid-text-stack-wide">
                <div className="grid-text-stack">
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
                </div>

                <div className="hero-actions flex flex-wrap items-center sm:flex-nowrap">
                  <Button
                    onClick={() => smoothScrollTo('works')}
                    variant="inverted"
                    className="min-h-12"
                    aria-label="Scroll to works section"
                  >
                    View Work
                  </Button>
                  <SocialLinks socialLinks={contact.socialLinks} inverted className="shrink-0" />
                </div>
              </div>
            </WorkspaceFrame>
          </Reveal>

          {/* Desktop portrait */}
          <div
            className={cn(
              'relative z-[3] hidden min-h-[var(--hero-portrait-height)] w-full min-w-0 overflow-visible pt-[calc(var(--grid-unit)*2)] lg:row-span-2 lg:block lg:self-center lg:pt-0 lg:justify-self-stretch',
              layoutClass('hero', 'portrait')
            )}
          >
            <HeroPortraitFrame
              image={portraitSrc}
              objectPosition={portraitObjectPosition}
              inFocus={heroInFocus}
            />
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
