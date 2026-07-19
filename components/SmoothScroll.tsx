'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    if (typeof window !== 'undefined') {
      window.lenis = lenis;
      // BootLoader may lock before Lenis exists — honor boot lock on init
      if (document.documentElement.classList.contains('boot-locked')) {
        lenis.stop();
      }
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (typeof window !== 'undefined') {
        delete window.lenis;
      }
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
