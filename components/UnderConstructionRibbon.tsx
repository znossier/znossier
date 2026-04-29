'use client';

export function UnderConstructionRibbon() {
  const messages = [
    'This portfolio is under construction',
    'New case studies and work coming soon',
    'Some sections and links are still in progress',
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="pointer-events-auto flex h-[var(--ribbon-height)] w-full items-center bg-foreground font-mono text-[9px] uppercase tracking-[0.16em] text-background sm:text-xs sm:tracking-[0.24em]">
        <div className="min-w-0 flex-1 overflow-hidden" aria-label="Site status: under construction">
          <div className="flex animate-marquee-left gap-6 whitespace-nowrap px-4 sm:gap-8 sm:px-6 lg:px-8">
            {Array.from({ length: 5 }).map((_, outerIndex) =>
              messages.map((message, innerIndex) => (
                <span key={`${outerIndex}-${innerIndex}`} className="flex items-center gap-2">
                  <span>{message}</span>
                  <span aria-hidden>/</span>
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
