'use client';

import { SectionHeading } from '@/components/SectionHeading';
import { mockProcessSteps } from '@/lib/mock-data';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const WRAPPER_HEIGHT_VH = 400;

function ProcessCard({
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
      className={`flex flex-col bg-background border border-border rounded-lg overflow-hidden relative ${
        isScroll
          ? 'flex-shrink-0 w-[88vw] sm:w-[calc((100vw-3rem)/1.5)] md:w-[calc((100vw-5rem)/2)] lg:w-[calc((100vw-9rem)/2.5)] lg:max-w-[500px] h-[400px] sm:h-[440px] md:h-[480px] p-5 sm:p-6 md:p-8'
          : isVertical
            ? 'min-h-0 p-5 sm:p-6 md:p-8'
            : 'min-h-[240px] p-5 sm:p-6 md:p-8'
      }`}
      aria-label={`${step.title}: ${step.description}`}
    >
      {showStepIndicator && (
        <span className="text-xs font-medium text-foreground/50 mb-2 flex-shrink-0" aria-hidden>
          Step {stepIndex} of {totalSteps}
        </span>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex-shrink-0">
        {step.title}
      </h3>
      <p
        className={`text-sm sm:text-base text-foreground/70 leading-relaxed flex-1 min-h-0 mb-14 ${
          isVertical ? 'overflow-visible' : 'overflow-y-auto'
        }`}
      >
        {step.description}
      </p>
      {/* Oversized number clipped at bottom-right edge */}
      <span
        className="absolute bottom-0 right-0 text-7xl sm:text-8xl md:text-8xl font-bold text-foreground/15 select-none pointer-events-none translate-x-[8%] translate-y-[12%]"
        aria-hidden
      >
        {step.number}
      </span>
    </article>
  );
}

export function Process() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -Math.max(0, maxScroll)]
  );

  useEffect(() => {
    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mm.matches);
    const fn = () => setReduceMotion(mm.matches);
    mm.addEventListener('change', fn);
    return () => mm.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (track && viewport) {
        const trackWidth = track.offsetWidth;
        const viewportWidth = viewport.offsetWidth;
        setMaxScroll(Math.max(0, trackWidth - viewportWidth));
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
  }, [reduceMotion, mockProcessSteps.length]);

  if (reduceMotion) {
    return (
      <section
        id="process"
        className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background z-20"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto max-w-7xl w-full">
          <div className="mb-10 md:mb-12">
            <SectionHeading id="process-heading">My Process</SectionHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProcessSteps.map((step) => (
              <ProcessCard key={step.id} step={step} variant="grid" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      id="process"
      ref={wrapperRef}
      style={{ height: `${WRAPPER_HEIGHT_VH}vh` }}
      className="relative bg-background z-20"
      aria-labelledby="process-heading"
    >
      <div className="sticky top-20 h-[calc(100vh-5rem)] w-full flex flex-col pb-32 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 pt-6 pb-8 md:pb-10 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl w-full">
            <SectionHeading id="process-heading">My Process</SectionHeading>
          </div>
        </motion.div>
        <div
          ref={viewportRef}
          className="flex-1 min-h-0 w-full overflow-hidden flex items-end"
          aria-label="Process steps"
        >
          <motion.div
            ref={trackRef}
            style={{ x: translateX }}
            className="flex gap-6 sm:gap-8 md:gap-10 w-max items-end pl-4 sm:pl-6 lg:pl-8 xl:pl-[max(2rem,calc(2rem+(100vw-84rem)/2))] pr-4 sm:pr-6 lg:pr-8 pt-8 pb-6"
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
