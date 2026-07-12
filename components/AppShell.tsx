'use client';

import { usePathname } from 'next/navigation';
import { Cursor } from '@/components/Cursor';
import { DesignRulers } from '@/components/DesignRulers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GridOverlay } from '@/components/GridOverlay';
import { SmoothScroll } from '@/components/SmoothScroll';
import { UnderConstructionRibbon } from '@/components/UnderConstructionRibbon';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');
  const isHomeRoute = pathname === '/';

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <UnderConstructionRibbon />
      <SmoothScroll>
        <DesignRulers />
        {isHomeRoute ? (
          <GridOverlay opacity={1.15} showPlusMarkers showAlignmentGuides />
        ) : null}
        <Cursor />
        {children}
      </SmoothScroll>
    </ErrorBoundary>
  );
}
