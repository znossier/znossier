'use client';

import { SectionGridLines } from '@/components/SectionGridLines';
import { SectionLayout } from '@/components/SectionLayout';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { mediaQueries } from '@/lib/breakpoints';
import { mockProcessSteps } from '@/lib/mock-data';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, memo, type CSSProperties } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/Reveal';
import { SpacingGuide } from '@/components/SpacingGuide';
import { InspectionPeekProvider } from '@/components/InspectionPeekContext';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useScrollPeek } from '@/hooks/useScrollPeek';
import { cn } from '@/lib/utils';

const WRAPPER_HEIGHT_VH_DESKTOP = 400;
const WRAPPER_HEIGHT_VH_MOBILE = 250;
const PROCESS_CARD_SPAN = 8;
const PROCESS_GAP_SPAN = 1;
const PROCESS_SECTION_BUFFER_PX = 220;
const PROCESS_MOBILE_BUFFER_PX = 160;

const ProcessCard = memo(function ProcessCard({
  step,
  variant = 'scroll',
  stepIndex,
  totalSteps,
}: {
  step: (typeof mockProcessSteps)[0];
  variant?: 'scroll' | 'grid' | 'vertical';
  stepIndex?: number;
  totalSteps?: number;
}) {
  const isScroll = variant === 'scroll';
  const isVertical = variant === 'vertical';
  const showStepIndicator = isVertical && stepIndex != null && totalSteps != null && totalSteps > 0;
  const sizeClass =
    isScroll
      ? 'h-[min(28rem,calc(100svh-var(--chrome-top)-5rem))] min-h-[21rem] w-[calc(var(--site-grid-col-width)*5)] min-w-[17rem] flex-shrink-0 sm:h-[440px] sm:w-[calc(var(--site-grid-col-width)*4)] sm:min-w-0 md:h-[480px] md:w-[calc(var(--site-grid-col-width)*3.5)] lg:w-[var(--process-card-width)] lg:max-w-none'
      : isVertical
        ? 'min-h-0'
        : 'min-h-[220px] md:min-h-[240px]';

  const bodyOverflowClass = isVertical
    ? 'overflow-visible'
    : isScroll
      ? 'overflow-visible md:overflow-y-auto'
      : '';

  return (
    <WorkspaceFrame
      inspectMode="hover"
      showSpacing
      showPadding
      panelClassName={`relative flex flex-col overflow-hidden p-5 sm:p-6 md:p-8 ${sizeClass}`}
      aria-label={`${step.title}: ${step.description}`}
    >
      {showStepIndicator && (
        <span className="type-label mb-2 flex-shrink-0" aria-hidden>
          Step {stepIndex} of {totalSteps}
        </span>
      )}
      <h3 className="type-title mb-4 flex-shrink-0">{step.title}</h3>
      <p className={`type-body-lg mb-14 min-h-0 flex-1 ${bodyOverflowClass}`}>
        {step.description}
      </p>
      <span
        className="pointer-events-none absolute bottom-0 right-0 translate-x-[4%] translate-y-[7%] select-none font-mono text-6xl font-bold uppercase tracking-[-0.06em] text-faint sm:text-7xl md:text-7xl"
        aria-hidden
      >
        {step.number}
      </span>
    </WorkspaceFrame>
  );
});

export function Process() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const showSectionPeek = !finePointer;
  const scrollPeeking = useScrollPeek(wrapperRef, {
    threshold: 0.12,
    dwellMs: 900,
    enabled: showSectionPeek && !reduceMotion,
    resetOnExit: true,
  });
  const isDesktop = useMediaQuery(mediaQueries.lg);
  const [maxScroll, setMaxScroll] = useState(0);
  const [wrapperHeightPx, setWrapperHeightPx] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [hintDismissed, setHintDismissed] = useState(false);
  const totalSteps = mockProcessSteps.length;

  const { scrollYProgress } = useScroll(
    hasMounted && !reduceMotion
      ? {
          target: wrapperRef,
          offset: ['start start', 'end end'],
        }
      : undefined
  );

  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -Math.max(0, maxScroll)]
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = Math.min(totalSteps - 1, Math.floor(latest * totalSteps));
    setActiveStep((prev) => (prev === step ? prev : step));
    if (latest > 0.02) setHintDismissed((prev) => (prev ? prev : true));
  });

  const processTrackVars = {
    '--process-col-width':
      'calc(min(100vw - (2 * var(--site-padding-inline)), var(--site-max-width)) / var(--site-grid-columns-desktop))',
    '--process-card-width':
      `calc(var(--process-col-width) * ${PROCESS_CARD_SPAN})`,
    '--process-track-gap':
      `calc(var(--site-grid-col-width) * 0.5)`,
  } as CSSProperties;

  const desktopTrackVars = {
    ...processTrackVars,
    '--process-track-gap': `calc(var(--process-col-width) * ${PROCESS_GAP_SPAN})`,
  } as CSSProperties;

  useEffect(() => {
    if (reduceMotion || !hasMounted) return;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (track && viewport) {
        const trackWidth = track.offsetWidth;
        const viewportWidth = viewport.offsetWidth;
        const nextMaxScroll = Math.max(0, trackWidth - viewportWidth);
        setMaxScroll((prev) => (prev === nextMaxScroll ? prev : nextMaxScroll));
        const nextHeight =
          window.innerHeight
          + nextMaxScroll
          + (isDesktop ? PROCESS_SECTION_BUFFER_PX : PROCESS_MOBILE_BUFFER_PX);
        setWrapperHeightPx((prev) => (prev === nextHeight ? prev : nextHeight));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [reduceMotion, isDesktop, hasMounted]);

  if (reduceMotion) {
    return (
      <Section
        id="process"
        variant="subtle"
        aria-labelledby="process-heading"
      >
        <SectionLayout boundaries={HOME_SECTION_BOUNDARIES.process}>
          <SpacingGuide
            showGaps
            showGutters
            showLabels
            sectionBoundaries={HOME_SECTION_BOUNDARIES.process}
            className="site-section-grid"
          >
            <Reveal className="col-span-full mb-10 md:mb-12">
              <SectionHeading id="process-heading" kicker="03 — Workflow" surfaceClassName="section-heading-sticky">
                My Process
              </SectionHeading>
            </Reveal>
            <div className="col-span-full" aria-label="Process steps">
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                {mockProcessSteps.map((step, index) => (
                  <Reveal key={step.id} delay={index * 0.04}>
                    <ProcessCard step={step} variant="grid" />
                  </Reveal>
                ))}
              </div>
            </div>
          </SpacingGuide>
        </SectionLayout>
      </Section>
    );
  }

  const fallbackWrapperHeight = isDesktop ? WRAPPER_HEIGHT_VH_DESKTOP : WRAPPER_HEIGHT_VH_MOBILE;

  return (
    <section
      id="process"
      ref={wrapperRef}
      style={{ height: wrapperHeightPx ? `${wrapperHeightPx}px` : `${fallbackWrapperHeight}vh` }}
      className={cn(
        'section section--subtle relative z-20 py-0',
        showSectionPeek && scrollPeeking && 'section--inspecting'
      )}
      aria-labelledby="process-heading"
    >
      {showSectionPeek && <div className="section-inspection-bounds" aria-hidden />}
      <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.process} />
      <InspectionPeekProvider peeking={showSectionPeek && scrollPeeking}>
      <div className="sticky top-[var(--chrome-top)] flex h-[calc(100svh-var(--chrome-top))] w-full flex-col pb-[calc(var(--mobile-bottom-controls)+1.5rem)] lg:pb-0">
        <div className="site-shell relative z-10 flex-shrink-0 pt-5 pb-3 md:pb-6 lg:pt-6 lg:pb-10">
          <SpacingGuide
            showGaps
            showGutters
            showLabels={finePointer || scrollPeeking}
            sectionBoundaries={HOME_SECTION_BOUNDARIES.process}
            className="site-section-grid gap-y-3"
          >
            <Reveal className="col-span-full">
              <SectionHeading id="process-heading" kicker="03 — Workflow" surfaceClassName="section-heading-sticky">
                My Process
              </SectionHeading>
            </Reveal>
            <div className="col-span-full flex items-center justify-between gap-4">
              {!hintDismissed ? (
                <p className="type-meta text-muted lg:hidden">Scroll to explore</p>
              ) : (
                <span className="lg:hidden" aria-hidden />
              )}
              <p
                aria-live="polite"
                className="type-label ms-auto tabular-nums text-muted"
                aria-label={`Step ${activeStep + 1} of ${totalSteps}`}
              >
                {String(activeStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
              </p>
            </div>
          </SpacingGuide>
        </div>
        <div
          ref={viewportRef}
          className="process-scroll-fade flex min-h-0 w-full flex-1 items-center overflow-hidden lg:items-end"
          style={isDesktop ? desktopTrackVars : processTrackVars}
          aria-label="Process steps"
        >
          <motion.div
            ref={trackRef}
            style={{ x: translateX, willChange: 'transform' }}
            className="site-track-pad flex w-max items-center gap-[var(--process-track-gap)] py-4 md:py-6 lg:items-end lg:gap-[var(--process-track-gap)] lg:pt-8 lg:pb-6"
            aria-hidden={false}
          >
            {mockProcessSteps.map((step) => (
              <ProcessCard key={step.id} step={step} />
            ))}
          </motion.div>
        </div>
      </div>
      </InspectionPeekProvider>
    </section>
  );
}
