/** Precision easing — no bounce, no overshoot */
export const EASE_PRECISION = [0.25, 0.1, 0.25, 1] as const;

export const MOTION = {
  duration: {
    /** Micro interactions — hover, focus rings */
    hover: 0.18,
    /** Inspection overlays, labels, outlines */
    overlay: 0.2,
    /** Standard fade / opacity transitions */
    fade: 0.35,
    /** Scroll reveals, section entrances */
    reveal: 0.42,
    /** Ruler crosshair, guide flashes */
    flash: 0.35,
    /** Draw / line animations */
    draw: 0.5,
    /** Stagger delay between siblings */
    stagger: 0.05,
  },
  ease: EASE_PRECISION,
} as const;

/** Viewport config — bottom-only margin avoids top-edge false negatives (hero, footer) */
export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -8% 0px' as const,
};

export const revealFadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION.duration.reveal, ease: EASE_PRECISION },
};

export const revealInView = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: REVEAL_VIEWPORT,
  transition: { duration: MOTION.duration.reveal, ease: EASE_PRECISION },
};

export const transitionHover = {
  duration: MOTION.duration.hover,
  ease: EASE_PRECISION,
} as const;

export const transitionOverlay = {
  duration: MOTION.duration.overlay,
  ease: EASE_PRECISION,
} as const;

export const transitionReveal = {
  duration: MOTION.duration.reveal,
  ease: EASE_PRECISION,
} as const;
