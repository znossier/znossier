import type { Metadata } from 'next';
import { Button } from '@/components/Button';

export const metadata: Metadata = {
  title: '404 — Page not found',
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-canvas px-6 py-24 text-center text-primary">
      <span className="type-label text-muted">Error 404</span>
      <h1 className="type-display text-4xl sm:text-5xl">Frame not found</h1>
      <p className="type-body-lg max-w-md text-secondary">
        This page has moved, been renamed, or never existed on this canvas.
      </p>
      <Button href="/" variant="accent" className="mt-2">
        Back to home
      </Button>
    </main>
  );
}
