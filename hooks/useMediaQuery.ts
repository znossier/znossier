'use client';

import { useCallback, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useMediaQuery(query: string, serverSnapshot = false) {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') return emptySubscribe();

      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', callback);

      return () => mediaQueryList.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return serverSnapshot;
    return window.matchMedia(query).matches;
  }, [query, serverSnapshot]);

  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
