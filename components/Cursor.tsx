'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isProjectHover, setIsProjectHover] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const rafRef = useRef<number>();
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
    // Check if device is touch-enabled
    const checkTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(checkTouch);
    
    if (checkTouch) return;

    // Single mousemove listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Check for project card hover and interactive elements
    const handleDocumentMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest('[data-project-card]');
      const isInteractive = target.matches('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"]), .cursor-pointer');
      
      if (projectCard) {
        setIsProjectHover(true);
        setIsHovering(true);
      } else if (isInteractive) {
        setIsHovering(true);
        setIsProjectHover(false);
      } else {
        setIsHovering(false);
        setIsProjectHover(false);
      }
    };

    const handleDocumentMouseOut = () => {
      setIsHovering(false);
      setIsProjectHover(false);
    };

    document.addEventListener('mouseover', handleDocumentMouseOver, { passive: true });
    document.addEventListener('mouseout', handleDocumentMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleDocumentMouseOver);
      document.removeEventListener('mouseout', handleDocumentMouseOut);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        willChange: 'transform',
      }}
    >
      {isProjectHover ? (
        // Filled circle with "view" text for project cards
        <motion.div
          className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        >
          <span className="text-xs font-medium text-background">view</span>
        </motion.div>
      ) : (
        // Outlined circle with blur effect - thinner border, bigger circle
        <motion.div
          className={`rounded-full border border-foreground -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isHovering ? 'w-8 h-8' : 'w-7 h-7'
          }`}
          style={{
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            willChange: 'transform',
            borderWidth: '1px',
          }}
          animate={{
            scale: isHovering ? 1.15 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
    </motion.div>
  );
}
