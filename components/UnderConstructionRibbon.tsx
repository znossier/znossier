'use client';

export function UnderConstructionRibbon() {
  const messages = [
    'This portfolio is under construction',
    'New case studies and work coming soon',
    'Some sections and links are still in progress',
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-[60] pointer-events-none">
      {/* Fixed h-8 (32px) so it butts exactly against nav (top-8) with no gap on any viewport */}
      <div className="pointer-events-auto w-full h-8 flex items-center bg-foreground text-background text-[10px] sm:text-xs font-mono uppercase tracking-[0.24em]">
        <div className="overflow-hidden w-full flex-1 min-w-0" aria-label="Site status: under construction">
          <div className="flex gap-8 animate-marquee-left whitespace-nowrap px-4 sm:px-6 lg:px-8">
            {Array.from({ length: 5 }).map((_, outerIndex) =>
              messages.map((message, innerIndex) => (
                <span key={`${outerIndex}-${innerIndex}`} className="flex items-center gap-2">
                  <span>{message}</span>
                  <span aria-hidden>•</span>
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

