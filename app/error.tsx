'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Route error boundary caught:', error);
    }
  }, [error]);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-canvas px-6 py-24 text-center text-primary">
      <span className="type-label text-muted">Error</span>
      <h1 className="type-display text-4xl sm:text-5xl">Something broke the layout</h1>
      <p className="type-body-lg max-w-md text-secondary">
        An unexpected error occurred while rendering this page. You can try again or head back home.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="accent">
          Try again
        </Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </main>
  );
}
