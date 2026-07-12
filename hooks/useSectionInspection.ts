'use client';

import type { RefObject } from 'react';
import { useScrollPeek } from '@/hooks/useScrollPeek';

/** @deprecated Prefer useScrollPeek with options object */
export function useSectionInspection(
  ref: RefObject<HTMLElement | null>,
  threshold = 0.25,
  enabled = true
) {
  return useScrollPeek(ref, { threshold, dwellMs: 1000, enabled });
}
