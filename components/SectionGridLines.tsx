'use client';

import { GridGuideLayer } from '@/components/GridGuideLayer';
import type { ResponsiveGridBoundaries } from '@/lib/grid';

export function SectionGridLines({
  boundaries,
}: {
  boundaries?: ResponsiveGridBoundaries;
}) {
  return (
    <GridGuideLayer
      boundaries={boundaries}
      className="site-grid-lines-layer z-0 sm:z-0"
    />
  );
}
