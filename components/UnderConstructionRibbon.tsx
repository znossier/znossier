'use client';

export function UnderConstructionRibbon() {
  const messages = [
    'This portfolio is under construction',
    'New case studies and work coming soon',
    'Some sections and links are still in progress',
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div
        className="construction-ribbon pointer-events-auto flex h-[var(--ribbon-height)] w-full items-center"
        role="status"
        aria-label="Work in progress"
      >
        <span className="construction-ribbon-badge shrink-0 px-3 sm:px-4">WIP</span>
        <div
          className="construction-ribbon-track min-w-0 flex-1 overflow-hidden"
          aria-label="Site status: under construction"
        >
          <div className="flex animate-marquee-left gap-6 whitespace-nowrap pr-4 sm:gap-8 sm:pr-6 lg:pr-8">
            {Array.from({ length: 5 }).map((_, outerIndex) =>
              messages.map((message, innerIndex) => (
                <span key={`${outerIndex}-${innerIndex}`} className="flex items-center gap-2">
                  <span className="construction-ribbon-message">{message}</span>
                  <span className="construction-ribbon-separator" aria-hidden>
                    /
                  </span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
