'use client';

import {
  GRID_COLUMNS,
  getGridLinePositions,
  type ResponsiveGridBoundaries,
} from '@/lib/grid';

function LineLayer({
  columns,
  boundaries,
  className,
}: {
  columns: number;
  boundaries?: number[];
  className?: string;
}) {
  const linePositions = getGridLinePositions(boundaries, columns);

  return (
    <div className={className}>
      {linePositions.map((position) => (
        <div
          key={`${columns}-${position}`}
          className="absolute inset-y-0 border-l border-foreground/8"
          style={{ left: `calc(${(position / columns) * 100}% - 0.5px)` }}
        />
      ))}
    </div>
  );
}

export function SectionGridLines({
  boundaries,
}: {
  boundaries?: ResponsiveGridBoundaries;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div className="site-shell relative h-full">
        <LineLayer
          columns={GRID_COLUMNS.mobile}
          boundaries={boundaries?.mobile}
          className="absolute inset-0 sm:hidden"
        />
        <LineLayer
          columns={GRID_COLUMNS.tablet}
          boundaries={boundaries?.tablet}
          className="absolute inset-0 hidden sm:block lg:hidden"
        />
        <LineLayer
          columns={GRID_COLUMNS.desktop}
          boundaries={boundaries?.desktop}
          className="absolute inset-0 hidden lg:block"
        />
      </div>
    </div>
  );
}
