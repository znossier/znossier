'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRECISION, MOTION } from '@/lib/motion';

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
  variant: 'action';
};

function resolveFrameLabel(target: HTMLElement): string | null {
  const frame = target.closest('.workspace-frame') as HTMLElement | null;
  if (!frame) return null;
  const named = frame.getAttribute('data-frame-label')?.trim();
  if (!named) return null;
  return named.toUpperCase();
}

function resolveActionLabel(target: HTMLElement): string | null {
  if (target.closest('[data-project-card="interactive"]')) return 'OPEN';
  if (target.closest('[data-cursor="navigate"], nav[aria-label="Main navigation"] a, footer a, footer button')) {
    return 'NAVIGATE';
  }
  if (target.closest('[data-cursor="link"]')) return 'LINK';
  if (target.closest('.flat-control, .inspectable, button, a')) return 'INTERACT';
  if (target.closest('.workspace-frame')) return 'INSPECT';
  return null;
}

function resolveFrameDimensions(target: HTMLElement): string | null {
  const frame = target.closest('.workspace-frame') as HTMLElement | null;
  if (!frame) return null;
  const w = frame.getAttribute('data-frame-width');
  const h = frame.getAttribute('data-frame-height');
  if (!w || !h) return null;
  return `${w}×${h}`;
}

function resolveHoverReadout(target: HTMLElement): HoverReadout | null {
  const interactive = target.closest(CURSOR_TARGETS) as HTMLElement | null;
  if (!interactive) return null;

  // Prefer action verbs for links/cards; otherwise show the frame name
  if (interactive.closest('[data-project-card="interactive"]')) {
    return { label: 'OPEN', variant: 'action' };
  }

  if (
    interactive.closest(
      '[data-cursor="navigate"], nav[aria-label="Main navigation"] a, footer a, footer button'
    )
  ) {
    return { label: 'NAVIGATE', variant: 'action' };
  }

  // Brief inspector readout: live W×H on workspace frames
  const dims = resolveFrameDimensions(interactive);
  if (dims && interactive.closest('.workspace-frame')) {
    return { label: dims, variant: 'action' };
  }

  const frameLabel = resolveFrameLabel(interactive);
  if (frameLabel) {
    return { label: frameLabel, variant: 'action' };
  }

  const action = resolveActionLabel(interactive);
  if (!action) return null;
  return { label: action, variant: 'action' };
}

function useCursorPosition() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const flushMove = useCallback(() => {
    rafRef.current = null;
    const point = pendingRef.current;
    if (!point) return;
    cursorX.set(point.x);
    cursorY.set(point.y);
  }, [cursorX, cursorY]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      pendingRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(flushMove);
    },
    [flushMove]
  );

  return { x: cursorX, y: cursorY, handleMouseMove, rafRef };
}

/** Figma collaborator cursor — arrow + label badge (cyan idle / magenta actions) */
function CursorPointer({ pressed }: { pressed: boolean }) {
  return (
    <svg
      className="cursor-pointer"
      width="18"
      height="18"
      viewBox="0 0 18.1212 18.212"
      fill="none"
      aria-hidden
      style={{ transform: pressed ? 'scale(0.92)' : undefined }}
    >
      <path
        d="M7.17683 17.1095L0.58682 1.90176C0.231819 1.08253 1.04678 0.244086 1.87577 0.575679L16.9925 6.62238C17.8682 6.97265 17.8166 8.22927 16.9152 8.50663L11.4732 10.1811C11.1498 10.2806 10.8987 10.5368 10.8058 10.8622L9.05591 16.9866C8.79794 17.8895 7.55021 17.9711 7.17683 17.1095Z"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
}

export function Cursor() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hoverReadout, setHoverReadout] = useState<HoverReadout | null>(null);

  const { x, y, handleMouseMove, rafRef } = useCursorPosition();

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
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      const pendingFrame = rafRef.current;
      if (pendingFrame !== null) {
        window.cancelAnimationFrame(pendingFrame);
      }
    };
  }, [finePointer, handleMouseMove, rafRef]);

  if (!finePointer || !isVisible) return null;

  const badgeLabel = hoverReadout?.label ?? 'YOU';
  const accent = hoverReadout ? 'action' : 'cyan';

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x, y }}
    >
      <div className="cursor-root" data-accent={accent}>
        <CursorPointer pressed={isPressed} />

        <AnimatePresence mode="wait">
          <motion.div
            key={badgeLabel}
            className="cursor-badge"
            data-variant={hoverReadout?.variant ?? 'identity'}
            aria-hidden
            initial={reducedMotion ? false : { opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: MOTION.duration.cursor, ease: EASE_PRECISION }}
          >
            {badgeLabel}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
