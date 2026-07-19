'use client';

import { useEffect, useState } from 'react';
import { snapToGrid } from '@/lib/grid-snap';

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

/**
 * True once the element with the given id has scrolled to within `bufferPx`
 * of the viewport top. Used to disengage `position: fixed` elements (like
 * the Hero frame) from their "always on" inspection UI once the next
 * section has effectively taken over the viewport — a plain
 * `IntersectionObserver` can't tell us this because a fixed element never
 * actually leaves the viewport itself.
 */
export function useElementReachedTop(elementId: string, bufferPx = 96): boolean {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const el = document.getElementById(elementId);
      const next = el ? el.getBoundingClientRect().top <= bufferPx : false;
      setReached((prev) => (prev === next ? prev : next));
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
  }, [elementId, bufferPx]);

  return reached;
}

export function useShellInlineStart(): number {
  const [inlineStart, setInlineStart] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let lastValue = 0;

    const measure = () => {
      const shell = document.querySelector('.site-shell');
      const grid =
        (shell?.querySelector('.site-grid') as HTMLElement | null) ??
        (document.querySelector('.site-grid') as HTMLElement | null);

      let next: number | null = null;

      if (grid) {
        next = grid.getBoundingClientRect().left + window.scrollX;
      } else if (shell instanceof HTMLElement) {
        const styles = getComputedStyle(shell);
        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        next = shell.getBoundingClientRect().left + paddingLeft + window.scrollX;
      }

      if (next === null) {
        if (lastValue !== 0) {
          lastValue = 0;
          setInlineStart(0);
        }
        return;
      }

      const snapped = snapToGrid(next);

      if (snapped !== lastValue) {
        lastValue = snapped;
        setInlineStart(snapped);
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
    document.querySelectorAll('.site-shell, .site-grid').forEach((node) => ro.observe(node));

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
