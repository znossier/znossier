'use client';

import { useCallback, useState } from 'react';
import { measureElement, type ElementMetrics } from '@/lib/spacing-metrics';

export type { ElementMetrics } from '@/lib/spacing-metrics';
export { measureElement } from '@/lib/spacing-metrics';

export function useElementMetrics() {
  const [metrics, setMetrics] = useState<ElementMetrics | null>(null);

  const measure = useCallback((element: HTMLElement | null) => {
    if (!element) {
      setMetrics(null);
      return null;
    }
    const next = measureElement(element);
    setMetrics(next);
    return next;
  }, []);

  return { metrics, measure };
}
