'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mediaQueries } from '@/lib/breakpoints';

export function useReducedMotion() {
  return useMediaQuery(mediaQueries.reduceMotion);
}
