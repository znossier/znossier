'use client';

/**
 * Site-wide vertical line grid overlay.
 * Spans the viewport, aligns with content (max-w-7xl), provides structural visual guide.
 * Use pointer-events: none so it doesn't block interactions.
 */
export function GridOverlay({
  columns = 12,
  opacity = 0.15,
  showPlusMarkers = true,
  className = '',
}: {
  columns?: number;
  opacity?: number;
  showPlusMarkers?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1] ${className}`}
      aria-hidden
    >
      {/* Grid aligned to content width (max-w-7xl) */}
      <div className="mx-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="grid h-full gap-4 sm:gap-6 md:gap-8"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="relative border-r border-foreground/20">
              {/* + marker at top of column */}
              {showPlusMarkers && (
                <span
                  className="absolute -top-px left-1/2 -translate-x-1/2 text-[10px] font-mono leading-none text-foreground/40"
                  aria-hidden
                >
                  +
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
