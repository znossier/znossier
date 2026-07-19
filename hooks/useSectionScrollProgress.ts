'use client';

import { useEffect } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

function readChromeTop(): number {
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

/**
 * Scroll progress for a tall pinned section (e.g. Process horizontal scrub).
 * Pin starts when the section top hits `--chrome-top`; distance matches the
 * sticky viewport (`innerHeight - chromeTop`) so progress hits 1 as the section unlocks.
 */
export function useSectionScrollProgress(
  targetRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const target = targetRef.current;
      if (!target) return;

      const pinOffset = readChromeTop();
      const stickyViewport = Math.max(1, window.innerHeight - pinOffset);
      const scrollableDistance = target.offsetHeight - stickyViewport;
      if (scrollableDistance <= 0) {
        progress.set(0);
        return;
      }

      const rectTop = target.getBoundingClientRect().top;
      if (rectTop > pinOffset) {
        progress.set(0);
        return;
      }

      const next = Math.min(1, Math.max(0, (pinOffset - rectTop) / scrollableDistance));
      progress.set(next);
    };

    update();

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    window.lenis?.on('scroll', update);

    const resizeObserver = new ResizeObserver(update);
    if (targetRef.current) resizeObserver.observe(targetRef.current);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.lenis?.off('scroll', update);
      resizeObserver.disconnect();
    };
  }, [enabled, progress, targetRef]);

  return progress;
}
