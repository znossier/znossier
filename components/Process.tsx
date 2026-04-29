'use client';

import { SectionHeading } from '@/components/SectionHeading';
import { SectionGridLines } from '@/components/SectionGridLines';
import { HOME_SECTION_BOUNDARIES } from '@/lib/grid';
import { mockProcessSteps } from '@/lib/mock-data';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, memo, type CSSProperties } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const WRAPPER_HEIGHT_VH = 400;
const PROCESS_CARD_SPAN = 8;
const PROCESS_GAP_SPAN = 1;
const PROCESS_SECTION_BUFFER_PX = 220;

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
  return (
    <article
      className={`editorial-panel surface-raised relative flex flex-col overflow-hidden border border-border/95 shadow-[0_18px_46px_rgba(0,0,0,0.08)] dark:bg-background dark:shadow-[0_18px_46px_rgba(0,0,0,0.3)] ${
        isScroll
          ? 'h-[400px] w-[88vw] flex-shrink-0 p-5 sm:h-[440px] sm:w-[calc((100vw-3rem)/1.5)] sm:p-6 md:h-[480px] md:w-[calc((100vw-5rem)/2)] md:p-8 lg:w-[var(--process-card-width)] lg:max-w-none'
            : isVertical
              ? 'min-h-0 p-5 sm:p-6 md:p-8'
            : 'min-h-[220px] p-5 sm:p-6 md:min-h-[240px] md:p-8'
      }`}
      aria-label={`${step.title}: ${step.description}`}
    >
      {showStepIndicator && (
        <span className="editorial-kicker mb-2 flex-shrink-0 text-foreground/58" aria-hidden>
          Step {stepIndex} of {totalSteps}
        </span>
      )}
      <h3 className="mb-4 flex-shrink-0 font-mono text-[1.55rem] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground sm:text-[1.9rem]">
        {step.title}
      </h3>
      <p
        className={`mb-14 min-h-0 flex-1 text-sm leading-relaxed text-foreground/78 sm:text-base ${
          isVertical ? 'overflow-visible' : 'overflow-y-auto'
        }`}
      >
        {step.description}
      </p>
      {/* Oversized number clipped at bottom-right edge */}
      <span
        className="pointer-events-none absolute bottom-0 right-0 translate-x-[4%] translate-y-[7%] select-none font-mono text-6xl font-bold uppercase tracking-[-0.06em] text-foreground/22 sm:text-7xl md:text-7xl"
        aria-hidden
      >
        {step.number}
      </span>
    </article>
  );
});

export function Process() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [maxScroll, setMaxScroll] = useState(0);
  const [wrapperHeightPx, setWrapperHeightPx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll(
    hasMounted && !reduceMotion && isDesktop
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

  const desktopTrackVars = {
    '--process-col-width':
      'calc(min(100vw - (2 * var(--site-padding-inline)), var(--site-max-width)) / var(--site-grid-columns-desktop))',
    '--process-card-width':
      `calc(var(--process-col-width) * ${PROCESS_CARD_SPAN})`,
    '--process-track-gap':
      `calc(var(--process-col-width) * ${PROCESS_GAP_SPAN})`,
  } as CSSProperties;

  useEffect(() => {
    if (reduceMotion || !isDesktop || !hasMounted) return;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (track && viewport) {
        const trackWidth = track.offsetWidth;
        const viewportWidth = viewport.offsetWidth;
        const nextMaxScroll = Math.max(0, trackWidth - viewportWidth);
        setMaxScroll(nextMaxScroll);
        setWrapperHeightPx(window.innerHeight + nextMaxScroll + PROCESS_SECTION_BUFFER_PX);
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

  if (reduceMotion || !isDesktop) {
    return (
      <section
        id="process"
        className="relative z-20 border-t border-border/90 bg-section-accent py-[var(--mobile-section-padding)] md:py-20 lg:py-24 dark:bg-background"
        aria-labelledby="process-heading"
      >
        <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.process} />
        <div className="site-grid relative z-10 mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-padding-inline)] lg:px-0">
          <div className="mb-10 [grid-column:1/span_5] md:mb-12 lg:col-span-full">
            <SectionHeading id="process-heading" surfaceClassName="bg-section-accent dark:bg-background">My Process</SectionHeading>
          </div>
          <div
            className="-mx-[var(--site-padding-inline)] [grid-column:1/span_6] overflow-x-auto px-[var(--site-padding-inline)] pb-2 [scrollbar-width:none] lg:col-span-full [&::-webkit-scrollbar]:hidden"
            aria-label="Process steps"
          >
            <div className="flex w-max snap-x snap-mandatory gap-4 md:grid md:w-auto md:grid-cols-2 md:gap-6">
              {mockProcessSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="w-[calc(var(--site-grid-col-width)*5)] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, delay: index * 0.04 }}
                >
                  <ProcessCard step={step} variant="grid" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      id="process"
      ref={wrapperRef}
      style={{ height: wrapperHeightPx ? `${wrapperHeightPx}px` : `${WRAPPER_HEIGHT_VH}vh` }}
      className="relative z-20 border-t border-border/90 bg-section-accent dark:bg-background"
      aria-labelledby="process-heading"
    >
      <SectionGridLines boundaries={HOME_SECTION_BOUNDARIES.process} />
      <div className="sticky h-[calc(100vh-7rem)] w-full flex flex-col pb-32 md:pb-0" style={{ top: 112 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-[var(--site-max-width)] flex-shrink-0 px-0 pt-6 pb-8 md:pb-10"
        >
          <SectionHeading id="process-heading" surfaceClassName="bg-section-accent dark:bg-background">My Process</SectionHeading>
        </motion.div>
        <div
          ref={viewportRef}
          className="process-scroll-fade flex min-h-0 w-full flex-1 items-end overflow-hidden"
          style={desktopTrackVars}
          aria-label="Process steps"
        >
          <motion.div
            ref={trackRef}
            style={{ x: translateX }}
            className="site-track-pad flex w-max items-end pt-8 pb-6 lg:gap-[var(--process-track-gap)]"
            aria-hidden={false}
          >
            {mockProcessSteps.map((step) => (
              <ProcessCard key={step.id} step={step} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
