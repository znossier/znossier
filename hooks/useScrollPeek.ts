'use client';

import { useEffect, useState, type RefObject } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type ScrollPeekOptions = {
  threshold?: number;
  dwellMs?: number;
  enabled?: boolean;
  rootMargin?: string;
  resetOnExit?: boolean;
};

export function useScrollPeek(
  ref: RefObject<HTMLElement | null>,
  {
    threshold = 0.25,
    dwellMs = 900,
    enabled = true,
    rootMargin,
    resetOnExit = true,
  }: ScrollPeekOptions = {}
) {
  const reducedMotion = useReducedMotion();
  const [peeking, setPeeking] = useState(false);

  useEffect(() => {
    if (!enabled || reducedMotion) {
      // Reset any stale "peeking" state left over from before this became disabled.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPeeking(false);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPeeking(true);
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => setPeeking(false), dwellMs);
          return;
        }

        if (resetOnExit) {
          clearTimeout(timeoutId);
          setPeeking(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [ref, threshold, dwellMs, enabled, rootMargin, resetOnExit, reducedMotion]);

  return enabled && !reducedMotion ? peeking : false;
}
