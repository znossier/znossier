'use client';

import { usePathname } from 'next/navigation';
import { BootLoader } from '@/components/BootLoader';
import { Cursor } from '@/components/Cursor';
import { DesignRulers } from '@/components/DesignRulers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SmoothScroll } from '@/components/SmoothScroll';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <BootLoader />
      <SmoothScroll>
        <div className="canvas-grid-overlay" aria-hidden />
        <DesignRulers />
        <Cursor />
        {children}
      </SmoothScroll>
    </ErrorBoundary>
  );
}
