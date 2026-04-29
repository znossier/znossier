'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/lib/theme';
import { Cursor } from '@/components/Cursor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GridOverlay } from '@/components/GridOverlay';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UnderConstructionRibbon } from '@/components/UnderConstructionRibbon';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <ErrorBoundary>
        <UnderConstructionRibbon />
        <SmoothScroll>
          <GridOverlay />
          <Cursor />
          {children}
        </SmoothScroll>
        <ThemeToggle variant="fab" />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
