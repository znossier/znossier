'use client';

import { createContext, useContext, type ReactNode } from 'react';

const InspectionPeekContext = createContext(false);

export function InspectionPeekProvider({
  peeking,
  children,
}: {
  peeking: boolean;
  children: ReactNode;
}) {
  return (
    <InspectionPeekContext.Provider value={peeking}>{children}</InspectionPeekContext.Provider>
  );
}

export function useInspectionPeek() {
  return useContext(InspectionPeekContext);
}
