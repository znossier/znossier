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
  
  const lastMoveTime = useRef<number>(0);
  
  // Lighter spring config for better performance
  const springConfig = { damping: 30, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now();
    // Throttle to ~60fps (16.67ms)
    if (now - lastMoveTime.current < 16.67) return;
    lastMoveTime.current = now;

    cursorX.set(e.clientX - 16);
    cursorY.set(e.clientY - 16);
    
    if (!isVisible) {
      setIsVisible(true);
    }
  }, [cursorX, cursorY, isVisible]);

  useEffect(() => {
    if (isTouchDevice) return;

    // Single mousemove listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Check for project card hover and interactive elements
    const handleDocumentMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest('[data-project-card="interactive"]');
      
      if (projectCard) {
        setIsProjectHover(true);
      } else {
        setIsProjectHover(false);
      }
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
    };
  }, [handleMouseMove, isTouchDevice]);

  if (isTouchDevice || !isVisible || !isProjectHover) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        willChange: 'transform',
      }}
    >
      <motion.div
        className="flex h-9 min-w-20 items-center justify-center border border-foreground/55 bg-background/88 px-3 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"
        animate={{
          scale: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
      >
        <span className="text-[0.62rem] font-mono uppercase tracking-[0.2em] text-foreground">Open</span>
      </motion.div>
    </motion.div>
  );
}
