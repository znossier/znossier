'use client';

import { useEffect, useState } from 'react';

type ScrollOffset = {
  x: number;
  y: number;
};

export function useScrollOffset(): ScrollOffset {
  const [offset, setOffset] = useState<ScrollOffset>({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      setOffset({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    const lenis = window.lenis;
    lenis?.on('scroll', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      lenis?.off('scroll', scheduleUpdate);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return offset;
}

export function useShellInlineStart(): number {
  const [inlineStart, setInlineStart] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let lastValue = 0;

    const measure = () => {
      const shell = document.querySelector('.site-shell');
      if (!shell) {
        if (lastValue !== 0) {
          lastValue = 0;
          setInlineStart(0);
        }
        return;
      }
      const next = shell.getBoundingClientRect().left + window.scrollX;
      if (next !== lastValue) {
        lastValue = next;
        setInlineStart(next);
      }
    };

    const scheduleMeasure = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    const lenis = window.lenis;
    lenis?.on('scroll', scheduleMeasure);

    const ro = new ResizeObserver(scheduleMeasure);
    const shell = document.querySelector('.site-shell');
    if (shell) ro.observe(shell);
    return () => {
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      lenis?.off('scroll', scheduleMeasure);
      ro.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return inlineStart;
}
