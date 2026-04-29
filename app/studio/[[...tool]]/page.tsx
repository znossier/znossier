'use client';

import { NextStudio } from 'next-sanity/studio';
import { hasSanityConfig } from '@/lib/sanity';
import config from '@/sanity.config';

export default function StudioPage() {
  if (!hasSanityConfig) {
    return (
      <main className="min-h-screen bg-[#111111] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">
            Studio setup required
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Sanity environment variables are missing.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/72">
            Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
            to your local environment, then reload `/studio`.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
