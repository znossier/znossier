/** Canonical responsive breakpoints — align Tailwind, CSS @media, and useMediaQuery. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export const mediaQueries = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  finePointer: '(hover: hover) and (pointer: fine)',
  coarsePointer: '(pointer: coarse)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const;
