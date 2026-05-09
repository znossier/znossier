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
  includeImplicitEdges = true,
}: {
  columns: number;
  boundaries?: number[];
  className?: string;
  includeImplicitEdges?: boolean;
}) {
  const linePositions = includeImplicitEdges
    ? getGridLinePositions(boundaries, columns)
    : Array.from(
        new Set(
          boundaries?.map((value) => Math.max(0, Math.min(columns, value))) ?? []
        )
      ).sort((left, right) => left - right);

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
  const mobileBoundaries = boundaries?.mobile;
  const mobileCenterBoundary = mobileBoundaries?.includes(GRID_COLUMNS.mobile / 2)
    ? [GRID_COLUMNS.mobile / 2]
    : undefined;
  const mobileRailBoundaries = mobileBoundaries?.filter(
    (boundary) => boundary !== GRID_COLUMNS.mobile / 2
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 sm:hidden" aria-hidden>
        <div className="site-shell relative h-full">
          <LineLayer
            columns={GRID_COLUMNS.mobile}
            boundaries={mobileCenterBoundary}
            includeImplicitEdges={false}
            className="absolute inset-y-0 left-[var(--site-padding-inline)] right-[var(--site-padding-inline)]"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 sm:z-0" aria-hidden>
        <div className="site-shell relative h-full">
          <LineLayer
            columns={GRID_COLUMNS.mobile}
            boundaries={mobileRailBoundaries}
            className="absolute inset-y-0 left-[var(--site-padding-inline)] right-[var(--site-padding-inline)] sm:hidden"
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
    </>
  );
}
