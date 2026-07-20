'use client';

import { usePathname } from 'next/navigation';
import { BootLoader } from '@/components/BootLoader';
import { Cursor } from '@/components/Cursor';
import { DesignRulers } from '@/components/DesignRulers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SmoothScroll } from '@/components/SmoothScroll';
import { UnderConstructionRibbon } from '@/components/UnderConstructionRibbon';
import { UnderConstructionScreen } from '@/components/UnderConstructionScreen';
import { WorkspaceGrid } from '@/components/WorkspaceGrid';
import { isSiteUnderConstruction } from '@/lib/site-gate';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');
  const underConstruction = isSiteUnderConstruction();

  if (isStudioRoute) {
    return <>{children}</>;
  }

  if (underConstruction) {
    return (
      <ErrorBoundary>
        <BootLoader />
        <SmoothScroll>
          <Cursor />
          <UnderConstructionScreen />
        </SmoothScroll>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <UnderConstructionRibbon />
      <BootLoader />
      <WorkspaceGrid />
      <SmoothScroll>
        <DesignRulers />
        <Cursor />
        {children}
      </SmoothScroll>
    </ErrorBoundary>
  );
}
