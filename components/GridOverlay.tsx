'use client';

import { usePathname } from 'next/navigation';
import { GRID_COLUMNS, getGridLinePositions } from '@/lib/grid';

function OverlayLayer({
  columns,
  className,
  opacity,
  showPlusMarkers,
}: {
  columns: number;
  className?: string;
  opacity: number;
  showPlusMarkers: boolean;
}) {
  const positions = getGridLinePositions(undefined, columns);

  return (
    <div className={className}>
      {positions.map((position) => (
        <div
          key={`${columns}-${position}`}
          className="absolute inset-y-0 border-l border-foreground/8"
          style={{
            left: `calc(${(position / columns) * 100}% - 0.5px)`,
            opacity,
          }}
        >
          {showPlusMarkers && (
            <span
              className="absolute -top-px left-1/2 -translate-x-1/2 text-[10px] font-mono leading-none text-foreground/30"
              aria-hidden
            >
              +
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function GridOverlay({
  opacity = 1,
  showPlusMarkers = false,
  className = '',
}: {
  opacity?: number;
  showPlusMarkers?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 ${isHome ? 'top-[100svh]' : 'top-0'} z-[0] ${className}`}
      aria-hidden
    >
      <div className="site-shell relative h-full">
        <OverlayLayer
          columns={GRID_COLUMNS.mobile}
          opacity={opacity}
          showPlusMarkers={showPlusMarkers}
          className="absolute inset-0 sm:hidden"
        />
        <OverlayLayer
          columns={GRID_COLUMNS.tablet}
          opacity={opacity}
          showPlusMarkers={showPlusMarkers}
          className="absolute inset-0 hidden sm:block lg:hidden"
        />
        <OverlayLayer
          columns={GRID_COLUMNS.desktop}
          opacity={opacity}
          showPlusMarkers={showPlusMarkers}
          className="absolute inset-0 hidden lg:block"
        />
      </div>
    </div>
  );
}
