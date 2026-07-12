'use client';

import { GRID_COLUMNS, getGridLinePositions, type ResponsiveGridBoundaries } from '@/lib/grid';
import { cn } from '@/lib/utils';

function LineLayer({
  columns,
  boundaries,
  className,
  includeImplicitEdges = true,
  opacity = 1,
  showPlusMarkers = false,
  showAlignmentGuides = false,
}: {
  columns: number;
  boundaries?: number[];
  className?: string;
  includeImplicitEdges?: boolean;
  opacity?: number;
  showPlusMarkers?: boolean;
  showAlignmentGuides?: boolean;
}) {
  const linePositions = includeImplicitEdges
    ? getGridLinePositions(boundaries, columns)
    : Array.from(
        new Set(
          boundaries?.map((value) => Math.max(0, Math.min(columns, value))) ?? []
        )
      ).sort((left, right) => left - right);

  const centerPositions = showAlignmentGuides ? [columns / 2] : [];
  const edgePositions = showAlignmentGuides ? getGridLinePositions([0, columns], columns) : [];

  return (
    <div className={className}>
      {linePositions.map((position) => {
        const isCenter = centerPositions.includes(position);
        return (
          <div
            key={`${columns}-${position}`}
            className="absolute inset-y-0 border-l border-[color:var(--grid-line-color)]"
            style={{
              left: `calc(${(position / columns) * 100}% - 0.5px)`,
              opacity: isCenter ? 0.5 : opacity * 0.85,
              borderColor: isCenter ? 'var(--utility-magenta)' : undefined,
            }}
          >
            {showPlusMarkers && (
              <span
                className="measurement-text absolute -top-px left-1/2 -translate-x-1/2 leading-none"
                style={{
                  color: isCenter ? 'var(--utility-magenta)' : 'var(--utility-cyan)',
                  opacity: 0.65,
                }}
                aria-hidden
              >
                +
              </span>
            )}
          </div>
        );
      })}
      {showAlignmentGuides &&
        edgePositions.map((position) => (
          <div
            key={`edge-${columns}-${position}`}
            className="absolute inset-x-0 border-t border-[var(--utility-magenta)]"
            style={{
              top: position === 0 ? 0 : undefined,
              bottom: position === columns ? 0 : undefined,
              opacity: 0.08,
              height: position === 0 || position === columns ? 1 : undefined,
            }}
          />
        ))}
    </div>
  );
}

export function GridGuideLayer({
  boundaries,
  opacity = 1,
  showPlusMarkers = false,
  showAlignmentGuides = false,
  className,
}: {
  boundaries?: ResponsiveGridBoundaries;
  opacity?: number;
  showPlusMarkers?: boolean;
  showAlignmentGuides?: boolean;
  className?: string;
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
      <div className={cn('pointer-events-none absolute inset-0 sm:hidden', className)} aria-hidden>
        <div className="site-shell relative h-full">
          <LineLayer
            columns={GRID_COLUMNS.mobile}
            boundaries={mobileCenterBoundary}
            includeImplicitEdges={false}
            opacity={opacity}
            className="absolute inset-0"
          />
        </div>
      </div>
      <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
        <div className="site-shell relative h-full">
          <LineLayer
            columns={GRID_COLUMNS.mobile}
            boundaries={mobileRailBoundaries}
            opacity={opacity}
            className="absolute inset-0 sm:hidden"
          />
          <LineLayer
            columns={GRID_COLUMNS.tablet}
            boundaries={boundaries?.tablet}
            opacity={opacity}
            className="absolute inset-0 hidden sm:block lg:hidden"
          />
          <LineLayer
            columns={GRID_COLUMNS.desktop}
            boundaries={boundaries?.desktop}
            opacity={opacity}
            showPlusMarkers={showPlusMarkers}
            showAlignmentGuides={showAlignmentGuides}
            className="absolute inset-0 hidden lg:block"
          />
        </div>
      </div>
    </>
  );
}

export function GridOverlayLayer({
  opacity = 1,
  showPlusMarkers = false,
  showAlignmentGuides = false,
  className,
}: {
  opacity?: number;
  showPlusMarkers?: boolean;
  showAlignmentGuides?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
      <div className="site-shell relative h-full">
        <LineLayer
          columns={GRID_COLUMNS.mobile}
          boundaries={[0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile]}
          opacity={opacity}
          showPlusMarkers={showPlusMarkers}
          showAlignmentGuides={showAlignmentGuides}
          className="absolute inset-0 sm:hidden"
        />
        <LineLayer
          columns={GRID_COLUMNS.tablet}
          boundaries={[0, GRID_COLUMNS.tablet / 2, GRID_COLUMNS.tablet]}
          opacity={opacity}
          showPlusMarkers={showPlusMarkers}
          showAlignmentGuides={showAlignmentGuides}
          className="absolute inset-0 hidden sm:block lg:hidden"
        />
        <LineLayer
          columns={GRID_COLUMNS.desktop}
          boundaries={[0, GRID_COLUMNS.desktop / 2, GRID_COLUMNS.desktop]}
          opacity={opacity}
          showPlusMarkers={showPlusMarkers}
          showAlignmentGuides={showAlignmentGuides}
          className="absolute inset-0 hidden lg:block"
        />
      </div>
    </div>
  );
}
