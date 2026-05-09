'use client';

import { useTheme } from 'next-themes';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useHasMounted } from '@/hooks/useHasMounted';

type ThemeToggleVariant = 'switch' | 'fab';

const TRACK_WIDTH = 132;
const TRACK_HEIGHT = 40;
const TRACK_PADDING = 4;
const EDGE_RADIUS = 2;
const INNER_RADIUS = Math.max(0, EDGE_RADIUS - 1);
const GLOSS_RADIUS = Math.max(0, EDGE_RADIUS - 2);
const THUMB_WIDTH = (TRACK_WIDTH - TRACK_PADDING * 2) / 2;
const THUMB_HEIGHT = TRACK_HEIGHT - TRACK_PADDING * 2;
const THUMB_TRAVEL = TRACK_WIDTH - TRACK_PADDING * 2 - THUMB_WIDTH;
const LABEL_TOP = TRACK_PADDING;
const LABEL_HEIGHT = THUMB_HEIGHT;
const LABEL_WIDTH = THUMB_WIDTH;
const LABEL_FONT_SIZE = '0.95rem';
const RIGHT_SLOT_LEFT = TRACK_PADDING + THUMB_TRAVEL;
const LIGHT_FAB_BACKGROUND = '#FFFFFF';
const LIGHT_TRACK_BACKGROUND = '#F2F4F7';
const LIGHT_LABEL_COLOR = '#68707C';

export function ThemeToggle({ variant = 'switch' }: { variant?: ThemeToggleVariant }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();

  const isDark = mounted ? resolvedTheme === 'dark' : true;
  const toggle = () => setTheme(isDark ? 'light' : 'dark');
  const pillX = isDark ? 0 : THUMB_TRAVEL;

  const trackTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.52,
        ease: [0.16, 1, 0.3, 1] as const,
      };

  const pillMotionTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        x: {
          type: 'spring' as const,
          stiffness: 260,
          damping: 27,
          mass: 0.92,
        },
        width: {
          duration: 0.46,
          ease: [0.16, 1, 0.3, 1] as const,
          times: [0, 0.56, 1],
        },
        scaleX: trackTransition,
        backgroundColor: trackTransition,
        boxShadow: trackTransition,
      };

  const labelTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1] as const,
      };

  if (!mounted) {
    if (variant === 'fab') {
      return (
        <div
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 h-12 w-12 md:hidden"
          style={{
            backgroundColor: '#0B0B0B',
            border: '1px solid rgba(245, 242, 236, 0.32)',
            boxShadow: '0 10px 18px rgba(0, 0, 0, 0.22)',
          }}
          aria-hidden
        />
      );
    }

    return (
      <div
        className="relative overflow-hidden"
        style={{
          height: TRACK_HEIGHT,
          width: TRACK_WIDTH,
          backgroundColor: '#121212',
          border: '1px solid rgba(245, 242, 236, 0.1)',
          boxShadow: '0 14px 34px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          borderRadius: EDGE_RADIUS,
        }}
        aria-hidden
      >
        <span
          className="absolute inset-[1px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 48%, rgba(0,0,0,0.12) 100%)',
            borderRadius: INNER_RADIUS,
          }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: TRACK_PADDING,
            height: THUMB_HEIGHT,
            width: THUMB_WIDTH,
            backgroundColor: '#F7F2EA',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255,255,255,0.82)',
            borderRadius: INNER_RADIUS,
          }}
        />
      </div>
    );
  }

  if (variant === 'fab') {
    return (
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        animate={{
          backgroundColor: isDark ? '#0B0B0B' : LIGHT_FAB_BACKGROUND,
          borderColor: isDark ? 'rgba(245, 242, 236, 0.34)' : 'rgba(17, 17, 17, 0.34)',
          color: isDark ? '#F5F2EC' : '#111111',
          boxShadow: isDark
            ? '0 10px 18px rgba(0, 0, 0, 0.26), inset 0 0 0 1px rgba(245, 242, 236, 0.05)'
            : '0 10px 18px rgba(17, 17, 17, 0.08), inset 0 0 0 1px rgba(17, 17, 17, 0.04)',
        }}
        transition={trackTransition}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex h-12 w-12 items-center justify-center border focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
        aria-label="Toggle theme"
      >
        <span className="pointer-events-none absolute left-1 top-1 h-1.5 w-1.5 border-l border-t border-current opacity-55" aria-hidden />
        <span className="pointer-events-none absolute right-1 top-1 h-1.5 w-1.5 border-r border-t border-current opacity-55" aria-hidden />
        <span className="pointer-events-none absolute bottom-1 left-1 h-1.5 w-1.5 border-b border-l border-current opacity-55" aria-hidden />
        <span className="pointer-events-none absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-current opacity-55" aria-hidden />
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.35}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden
          >
            <path
              strokeLinecap="butt"
              strokeLinejoin="miter"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.35}
            stroke="currentColor"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            className="h-5 w-5"
            aria-hidden
          >
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.978 }}
      animate={{
        backgroundColor: isDark ? '#121212' : LIGHT_TRACK_BACKGROUND,
        borderColor: isDark ? 'rgba(245, 242, 236, 0.1)' : 'rgba(17, 17, 17, 0.12)',
        boxShadow: isDark
          ? '0 14px 34px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
          : '0 14px 34px rgba(17, 17, 17, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.82)',
      }}
      transition={trackTransition}
      className="relative flex items-center overflow-hidden border backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ height: TRACK_HEIGHT, width: TRACK_WIDTH, borderRadius: EDGE_RADIUS }}
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDark}
    >
      <motion.span
        className="pointer-events-none absolute inset-[1px]"
        animate={{ opacity: isDark ? 0.86 : 1 }}
        transition={trackTransition}
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 44%, rgba(0,0,0,0.12) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.62) 44%, rgba(17,17,17,0.04) 100%)',
          borderRadius: INNER_RADIUS,
        }}
        aria-hidden
      />

      <span className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.span
          animate={{
            opacity: isDark ? 0.18 : 0.42,
            color: isDark ? '#F5F2EC' : LIGHT_LABEL_COLOR,
          }}
          transition={labelTransition}
          className="absolute flex items-center justify-center font-medium uppercase leading-none tracking-[0.04em]"
          style={{
            left: TRACK_PADDING,
            top: LABEL_TOP,
            width: LABEL_WIDTH,
            height: LABEL_HEIGHT,
            fontSize: LABEL_FONT_SIZE,
            fontFamily: 'var(--font-oswald), var(--font-geist-sans), sans-serif',
          }}
        >
          ON
        </motion.span>
        <motion.span
          animate={{
            opacity: isDark ? 0.42 : 0.18,
            color: isDark ? '#F5F2EC' : LIGHT_LABEL_COLOR,
          }}
          transition={labelTransition}
          className="absolute flex items-center justify-center font-medium uppercase leading-none tracking-[0.04em]"
          style={{
            left: RIGHT_SLOT_LEFT,
            top: LABEL_TOP,
            width: LABEL_WIDTH,
            height: LABEL_HEIGHT,
            fontSize: LABEL_FONT_SIZE,
            fontFamily: 'var(--font-oswald), var(--font-geist-sans), sans-serif',
          }}
        >
          OFF
        </motion.span>
      </span>

      <motion.div
        className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center"
        animate={{
          x: pillX,
          width: prefersReducedMotion ? THUMB_WIDTH : [THUMB_WIDTH, THUMB_WIDTH + 10, THUMB_WIDTH],
          scaleX: prefersReducedMotion ? 1 : [1, 1.035, 1],
          backgroundColor: isDark ? '#F7F2EA' : '#111111',
          boxShadow: isDark
            ? '0 10px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255,255,255,0.82)'
            : '0 12px 28px rgba(17, 17, 17, 0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        transition={pillMotionTransition}
        style={{
          left: TRACK_PADDING,
          height: THUMB_HEIGHT,
          width: THUMB_WIDTH,
          borderRadius: INNER_RADIUS,
          transformOrigin: isDark ? 'left center' : 'right center',
        }}
      >
        <motion.span
          className="pointer-events-none absolute inset-[1px]"
          animate={{ opacity: isDark ? 1 : 0.72 }}
          transition={trackTransition}
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 70%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 72%)',
            borderRadius: GLOSS_RADIUS,
          }}
          aria-hidden
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'on' : 'off'}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 5, scale: 0.975, filter: 'blur(6px)' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5, scale: 0.99, filter: 'blur(6px)' }}
            transition={labelTransition}
            className="relative z-10 font-medium uppercase leading-none tracking-[0.04em]"
            style={{
              color: isDark ? '#111111' : '#F5F2EC',
              fontSize: LABEL_FONT_SIZE,
              fontFamily: 'var(--font-oswald), var(--font-geist-sans), sans-serif',
            }}
          >
            {isDark ? 'ON' : 'OFF'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
