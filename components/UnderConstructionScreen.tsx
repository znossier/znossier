'use client';

import { Button } from '@/components/Button';
import { mockContact } from '@/lib/mock-data';

const LINKEDIN = mockContact.socialLinks.find((l) => l.platform === 'LinkedIn')?.url;

export function UnderConstructionScreen() {
  return (
    <main
      id="main-content"
      className="construction-screen relative flex min-h-[100svh] flex-col items-center justify-center px-[var(--site-padding-inline)] py-24 text-center"
      role="main"
      aria-label="Portfolio under construction"
    >
      <div className="construction-screen-frame relative w-full max-w-xl">
        <span className="construction-screen-tab" aria-hidden>
          WIP
        </span>

        <div className="construction-screen-body">
          <span className="construction-screen-handle construction-screen-handle--tl" aria-hidden />
          <span className="construction-screen-handle construction-screen-handle--tr" aria-hidden />
          <span className="construction-screen-handle construction-screen-handle--bl" aria-hidden />
          <span className="construction-screen-handle construction-screen-handle--br" aria-hidden />

          <span className="type-label text-muted">Status</span>
          <h1 className="construction-screen-title">Under construction</h1>
          <p className="type-body-lg mx-auto mt-[var(--grid-unit)] max-w-md text-secondary">
            This portfolio is being rebuilt. The canvas is open in Figma — check back soon, or reach out
            meanwhile.
          </p>

          <div className="mt-[calc(var(--grid-unit)*2)] flex flex-wrap items-center justify-center gap-3">
            <Button href={`mailto:${mockContact.email}`} variant="accent">
              Email Zeina
            </Button>
            {LINKEDIN && (
              <Button href={LINKEDIN} variant="secondary" aria-label="Zeina Nossier on LinkedIn">
                LinkedIn
              </Button>
            )}
          </div>
        </div>

        <span className="construction-screen-dim measurement-text" aria-hidden>
          1440 × 900
        </span>
      </div>
    </main>
  );
}
