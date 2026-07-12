'use client';

import { useEffect, useState } from 'react';
import { GRID_COLUMNS, type ResponsiveGridBoundaries } from '@/lib/grid';
import { guttersFromBoundaries, type GridGutter } from '@/lib/spacing-metrics';

function resolveGutters(boundaries?: ResponsiveGridBoundaries): GridGutter[] {
  if (!boundaries) return [];

  if (typeof window === 'undefined') {
    return guttersFromBoundaries(boundaries.mobile ?? [], GRID_COLUMNS.mobile);
  }

  if (window.matchMedia('(min-width: 1024px)').matches && boundaries.desktop?.length) {
    return guttersFromBoundaries(boundaries.desktop, GRID_COLUMNS.desktop);
  }

  if (window.matchMedia('(min-width: 640px)').matches && boundaries.tablet?.length) {
    return guttersFromBoundaries(boundaries.tablet, GRID_COLUMNS.tablet);
  }

  return guttersFromBoundaries(boundaries.mobile ?? [], GRID_COLUMNS.mobile);
}

export function useGridGutters(boundaries?: ResponsiveGridBoundaries) {
  const [gutters, setGutters] = useState<GridGutter[]>(() => resolveGutters(boundaries));

  useEffect(() => {
    const update = () => setGutters(resolveGutters(boundaries));
    update();

    const mediaQueries = [
      window.matchMedia('(min-width: 1024px)'),
      window.matchMedia('(min-width: 640px)'),
    ];
    mediaQueries.forEach((mediaQuery) => mediaQuery.addEventListener('change', update));
    window.addEventListener('resize', update);

    return () => {
      mediaQueries.forEach((mediaQuery) => mediaQuery.removeEventListener('change', update));
      window.removeEventListener('resize', update);
    };
  }, [boundaries]);

  return gutters;
}
