'use client';

import { mockProcessSteps } from '@/lib/mock-data';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const WRAPPER_HEIGHT_VH = 400;
const CARD_MIN_WIDTH = 400;
const CARD_GAP_PX = 24;

function ProcessCard({ step }: { step: (typeof mockProcessSteps)[0] }) {
  return (
    <article
      className="flex-shrink-0 border border-border rounded-lg p-6 md:p-8 flex flex-col bg-background min-h-[280px] md:min-h-[320px]"
      style={{ minWidth: CARD_MIN_WIDTH }}
      aria-label={`${step.title}: ${step.description}`}
    >
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
        {step.title}
      </h3>
      <p className="text-sm md:text-base text-foreground/70 leading-relaxed flex-1">
        {step.description}
      </p>
      <span
        className="text-6xl md:text-7xl font-bold text-foreground/20 mt-4 select-none"
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
          <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-12">
            <div className="w-12 md:w-16 border-t border-border" />
            <h2
              id="process-heading"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
            >
              My Process
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProcessSteps.map((step) => (
              <ProcessCard key={step.id} step={step} />
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
    >
      <div className="sticky top-0 h-screen w-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 pt-16 md:pt-20 pb-8 md:pb-10 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl w-full flex items-center gap-4 md:gap-6">
            <div className="w-12 md:w-16 border-t border-border" />
            <h2
              id="process-heading"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
            >
              My Process
            </h2>
          </div>
        </motion.div>
        <div
          ref={viewportRef}
          className="flex-1 min-h-0 w-full overflow-hidden"
          aria-label="Process steps"
        >
          <motion.div
            ref={trackRef}
            style={{ x: translateX }}
            className="flex gap-6 w-max h-full items-stretch pb-8"
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
