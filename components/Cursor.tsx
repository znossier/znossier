'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mediaQueries } from '@/lib/breakpoints';

const CURSOR_TARGETS = [
  '[data-project-card="interactive"]',
  '.workspace-frame',
  '.flat-control',
  '.inspectable',
  'nav[aria-label="Main navigation"] a',
  'footer a',
  'footer button',
].join(',');

type HoverReadout = {
  label: string;
  variant: 'dimension' | 'action';
};

function resolveActionLabel(target: HTMLElement): string | null {
  if (target.closest('[data-project-card="interactive"]')) return 'ACCESS';
  if (target.closest('.workspace-frame')) return 'INSPECT';
  if (target.closest('.flat-control, .inspectable')) return 'INTERACT';
  if (target.closest('nav[aria-label="Main navigation"] a, footer a, footer button')) return 'NAVIGATE';
  return null;
}

function resolveInspectableElement(target: HTMLElement): HTMLElement | null {
  return target.closest('.workspace-frame, .inspectable') as HTMLElement | null;
}

function formatDimensions(element: HTMLElement): string | null {
  const { width, height } = element.getBoundingClientRect();
  const w = Math.round(width);
  const h = Math.round(height);
  if (w <= 0 || h <= 0) return null;
  return `${w}×${h}`;
}

function resolveHoverReadout(target: HTMLElement): HoverReadout | null {
  const interactive = target.closest(CURSOR_TARGETS) as HTMLElement | null;
  if (!interactive) return null;

  const inspectable = resolveInspectableElement(interactive);
  if (inspectable) {
    const dimensions = formatDimensions(inspectable);
    if (dimensions) return { label: dimensions, variant: 'dimension' };
  }

  const action = resolveActionLabel(interactive);
  if (!action) return null;
  return { label: action, variant: 'action' };
}

function useCursorPosition(reducedMotion: boolean) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const cursorXSpring = useSpring(cursorX, { damping: 30, stiffness: 400 });
  const cursorYSpring = useSpring(cursorY, { damping: 30, stiffness: 400 });
  const trailXSpring = useSpring(trailX, { damping: 42, stiffness: 160 });
  const trailYSpring = useSpring(trailY, { damping: 42, stiffness: 160 });

  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const flushMove = useCallback(() => {
    rafRef.current = null;
    const point = pendingRef.current;
    if (!point) return;

    cursorX.set(point.x);
    cursorY.set(point.y);
    trailX.set(point.x);
    trailY.set(point.y);
  }, [cursorX, cursorY, trailX, trailY]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      pendingRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(flushMove);
    },
    [flushMove]
  );

  const x: MotionValue<number> = reducedMotion ? cursorX : cursorXSpring;
  const y: MotionValue<number> = reducedMotion ? cursorY : cursorYSpring;
  const trailMotionX: MotionValue<number> = reducedMotion ? cursorX : trailXSpring;
  const trailMotionY: MotionValue<number> = reducedMotion ? cursorY : trailYSpring;

  return {
    x,
    y,
    trailMotionX,
    trailMotionY,
    handleMouseMove,
    rafRef,
  };
}

export function Cursor() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isLargeScreen = useMediaQuery(mediaQueries.lg);
  const blendWithRulers = isHome && isLargeScreen;

  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hoverReadout, setHoverReadout] = useState<HoverReadout | null>(null);

  const { x, y, trailMotionX, trailMotionY, handleMouseMove, rafRef } =
    useCursorPosition(reducedMotion);

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (event: MouseEvent) => {
      handleMouseMove(event);
      setIsVisible(true);
    };

    const onDown = () => setIsPressed(true);
    const onUp = () => setIsPressed(false);

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setHoverReadout(resolveHoverReadout(target));
    };

    const onOut = (event: MouseEvent) => {
      const related = event.relatedTarget as HTMLElement | null;
      if (related?.closest(CURSOR_TARGETS)) return;
      setHoverReadout(null);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [finePointer, handleMouseMove, rafRef]);

  if (!finePointer || !isVisible) return null;

  return (
    <>
      {!reducedMotion && (
        <motion.div
          aria-hidden
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{ x: trailMotionX, y: trailMotionY }}
        >
          <div className="cursor-trail-host">
            <span className="cursor-trail" aria-hidden />
          </div>
        </motion.div>
      )}

      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x, y }}
      >
        <div className="cursor-root">
        {hoverReadout && <div className="cursor-hover-ring" aria-hidden />}

        <motion.div
          className="cursor-reticle"
          data-blend-rulers={blendWithRulers ? '' : undefined}
          data-hover={hoverReadout ? '' : undefined}
          data-pressed={isPressed ? '' : undefined}
          animate={{ scale: isPressed ? 0.88 : 1 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="cursor-reticle-arm cursor-reticle-arm--horizontal" aria-hidden />
          <span className="cursor-reticle-arm cursor-reticle-arm--vertical" aria-hidden />
          <span className="cursor-reticle-corner cursor-reticle-corner--tl" aria-hidden />
          <span className="cursor-reticle-corner cursor-reticle-corner--tr" aria-hidden />
          <span className="cursor-reticle-corner cursor-reticle-corner--bl" aria-hidden />
          <span className="cursor-reticle-corner cursor-reticle-corner--br" aria-hidden />
        </motion.div>

        {hoverReadout && (
          <div
            className="cursor-readout"
            data-variant={hoverReadout.variant}
            aria-hidden
          >
            {hoverReadout.label}
          </div>
        )}
        </div>
      </motion.div>
    </>
  );
}
