'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isProjectHover, setIsProjectHover] = useState(false);
  const isTouchDevice = useMediaQuery('(pointer: coarse)', true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const springConfig = { damping: 30, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const flushMove = useCallback(() => {
    rafRef.current = null;
    const point = pendingRef.current;
    if (!point) return;

    cursorX.set(point.x - 16);
    cursorY.set(point.y - 16);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      pendingRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(flushMove);
    },
    [flushMove]
  );

  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleDocumentMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const projectCard = target.closest('[data-project-card="interactive"]');
      setIsProjectHover(Boolean(projectCard));
    };

    const handleDocumentMouseOut = () => {
      setIsProjectHover(false);
    };

    document.addEventListener('mouseover', handleDocumentMouseOver, { passive: true });
    document.addEventListener('mouseout', handleDocumentMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleDocumentMouseOver);
      document.removeEventListener('mouseout', handleDocumentMouseOut);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, isTouchDevice]);

  if (isTouchDevice || !isVisible || !isProjectHover) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <motion.div
        className="flex h-9 min-w-20 items-center justify-center border px-3 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"
        style={{
          borderColor: 'var(--cursor-badge-border)',
          backgroundColor: 'var(--cursor-badge-bg)',
        }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
      >
        <span className="type-meta text-primary">ACCESS</span>
      </motion.div>
    </motion.div>
  );
}
