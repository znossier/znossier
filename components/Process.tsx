'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { Section } from '@/components/Section';
import { SectionStickyShell } from '@/components/SectionStickyShell';
import { SectionLayout } from '@/components/SectionLayout';
import { SectionHeading } from '@/components/SectionHeading';
import { WorkspaceFrame } from '@/components/WorkspaceFrame';
import { Reveal } from '@/components/Reveal';
import { mediaQueries } from '@/lib/breakpoints';
import { mockProcessSteps } from '@/lib/mock-data';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress';
import { cn } from '@/lib/utils';

/** Sticky viewport height ≈ 100svh − chrome; vertical travel ≈ horizontal overflow */
function readChromeTopPx(): number {
  if (typeof window === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--chrome-top').trim();
  if (!raw) return 0;
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;top:${raw}`;
  document.body.appendChild(probe);
  const px = probe.offsetTop;
  probe.remove();
  return px;
}

const ProcessCard = memo(function ProcessCard({
  step,
  variant = 'scroll',
  active = false,
}: {
  step: (typeof mockProcessSteps)[0];
  variant?: 'scroll' | 'grid' | 'vertical';
  active?: boolean;
}) {
  const isScroll = variant === 'scroll';
  const isVertical = variant === 'vertical';

  return (
    <WorkspaceFrame
      inspectMode={active ? 'always' : 'hover'}
      inspectDepth="outline"
      frameLabel={`PROCESS-${step.number}`}
      showRestingLabel
      showDimensions={false}
      showMeasurementLines={false}
      variant="figma"
      panelClassName={cn(
        'process-card-surface site-cell-pad relative flex flex-col justify-between overflow-hidden',
        isScroll &&
          'h-full min-h-0 w-[var(--process-card-width)] min-w-[var(--process-card-width)] flex-shrink-0',
        isVertical && 'min-h-[calc(var(--grid-unit)*14)] w-full',
        variant === 'grid' && 'min-h-[calc(var(--grid-unit)*14)] w-full'
      )}
      className={cn(
        'process-card overflow-visible',
        isScroll && 'process-card-scroll',
        active && 'process-card--active'
      )}
      aria-label={`${step.title}: ${step.description}`}
      aria-current={active ? 'step' : undefined}
    >
      <div className="relative z-[1] flex min-h-0 flex-col gap-[var(--grid-unit)] overflow-hidden">
        <h3 className="type-title">{step.title}</h3>
        <p className="type-body-lg max-w-none text-[var(--figma-meta)]">{step.description}</p>
      </div>
      <span className="process-card-number" aria-hidden>
        {step.number}
      </span>
    </WorkspaceFrame>
  );
});

function ProcessStack({ variant }: { variant: 'grid' | 'vertical' }) {
  return (
    <Section id="process" variant="canvas" inspectOnEnter aria-labelledby="process-heading">
      <SectionLayout sectionId="process">
        <div className="section-figma-stack">
          <Reveal>
            <SectionHeading id="process-heading" title="03 - My Process" />
          </Reveal>
          <div className="section-figma-panel" aria-label="Process steps">
            <div
              className={cn(
                'flex flex-col gap-[calc(var(--grid-unit)*2)]',
                variant === 'grid' && 'md:grid md:grid-cols-2'
              )}
            >
              {mockProcessSteps.map((step, index) => (
                <Reveal key={step.id} delay={index * 0.04}>
                  <ProcessCard step={step} variant={variant} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </SectionLayout>
    </Section>
  );
}

export function Process() {
  const wrapperRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery(mediaQueries.lg);
  const [maxScroll, setMaxScroll] = useState(0);
  const [wrapperHeightPx, setWrapperHeightPx] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = mockProcessSteps.length;

  const scrollEnabled = hasMounted && !reduceMotion && isDesktop;
  const scrollYProgress = useSectionScrollProgress(wrapperRef, scrollEnabled);

  const translateX = useTransform(scrollYProgress, [0, 1], [0, -Math.max(0, maxScroll)]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = Math.min(totalSteps - 1, Math.floor(latest * totalSteps));
    setActiveStep((prev) => (prev === step ? prev : step));
  });

  useEffect(() => {
    if (reduceMotion || !hasMounted || !isDesktop) return;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const nextMaxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxScroll((prev) => (prev === nextMaxScroll ? prev : nextMaxScroll));

      const chromeTop = readChromeTopPx();
      const stickyViewport = Math.max(0, window.innerHeight - chromeTop);
      const nextHeight = Math.ceil(stickyViewport + nextMaxScroll);
      setWrapperHeightPx((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    measure();
    const trackEl = trackRef.current;
    const viewportEl = viewportRef.current;
    const ro = new ResizeObserver(measure);
    if (trackEl) ro.observe(trackEl);
    if (viewportEl) ro.observe(viewportEl);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [reduceMotion, isDesktop, hasMounted]);

  if (reduceMotion) {
    return <ProcessStack variant="grid" />;
  }

  if (!isDesktop) {
    return <ProcessStack variant="vertical" />;
  }

  return (
    <Section
      id="process"
      ref={wrapperRef}
      variant="canvas"
      inspectOnEnter
      className="section--process section--sticky-lock py-0"
      style={{
        height: wrapperHeightPx
          ? `${wrapperHeightPx}px`
          : 'calc(100svh - var(--chrome-top))',
      }}
      aria-labelledby="process-heading"
    >
      <SectionStickyShell
        sectionId="process"
        headingId="process-heading"
        title="03 - My Process"
        panelClassName="process-figma-panel"
        panelLabel="Process steps"
      >
        <div className="mb-[var(--grid-unit)] flex flex-shrink-0 items-center justify-end">
          <p
            aria-live="polite"
            className="type-meta tabular-nums text-[var(--figma-meta)]"
            aria-label={`Step ${activeStep + 1} of ${totalSteps}`}
          >
            {String(activeStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
          </p>
        </div>

        <div
          ref={viewportRef}
          className="process-scroll-viewport relative min-h-0 w-full flex-1"
        >
          <motion.div
            ref={trackRef}
            style={{ x: translateX }}
            className="process-scroll-track relative w-max gap-[var(--process-track-gap)]"
          >
            {mockProcessSteps.map((step, index) => (
              <ProcessCard key={step.id} step={step} active={index === activeStep} />
            ))}
          </motion.div>
        </div>
      </SectionStickyShell>
    </Section>
  );
}
