'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mediaQueries } from '@/lib/breakpoints';

export function useFinePointer() {
  return useMediaQuery(mediaQueries.finePointer);
}
