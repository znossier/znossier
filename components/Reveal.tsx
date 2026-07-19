'use client';

import { motion, useInView, type HTMLMotionProps } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EASE_PRECISION, MOTION, REVEAL_VIEWPORT } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type RevealDirection = 'up' | 'left' | 'right';

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
};

function getInitial(direction: RevealDirection) {
  switch (direction) {
    case 'left':
      return { opacity: 0, x: -24, y: 0 };
    case 'right':
      return { opacity: 0, x: 24, y: 0 };
    default:
      return { opacity: 0, x: 0, y: 24 };
  }
}

function getVisibleState() {
  return { opacity: 1, x: 0, y: 0 };
}

function isNodeInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top < vh * 0.94 && rect.bottom > vh * 0.06;
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const [mountRevealed, setMountRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion || mountRevealed) return;
    const node = ref.current;
    // One-time DOM measurement: reveal immediately if already in view on mount,
    // since useInView only fires on a subsequent scroll-triggered intersection change.
    if (node && isNodeInViewport(node)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMountRevealed(true);
    }
  }, [reducedMotion, mountRevealed]);

  const visible = reducedMotion || mountRevealed || inView;

  if (reducedMotion) {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      initial={getInitial(direction)}
      animate={visible ? getVisibleState() : getInitial(direction)}
      transition={{ duration: MOTION.duration.reveal, ease: EASE_PRECISION, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
