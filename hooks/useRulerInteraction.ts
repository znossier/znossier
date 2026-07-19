'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { snapBoundsToGrid, snapToGrid } from '@/lib/grid-snap';

const HOME_SECTION_IDS = [
  'home',
  'works',
  'expertise',
  'process',
  'tech-stack',
  'about',
  'footer',
] as const;

export type RulerTargetBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  source: 'frame' | 'inspectable' | 'section';
};

export type SectionBand = {
  id: string;
  top: number;
};

export type RulerCoords = {
  /** Document X relative to the `.site-grid` left edge (content margin) */
  x: number;
  /** Document Y relative to vertical ruler origin */
  y: number;
};

export type RulerInteractionState = {
  cursor: { clientX: number; clientY: number } | null;
  coords: RulerCoords | null;
  target: RulerTargetBounds | null;
  sectionBands: SectionBand[];
  interactive: boolean;
  reducedMotion: boolean;
};

function toTargetBounds(
  element: HTMLElement,
  source: RulerTargetBounds['source']
): RulerTargetBounds {
  const rect = element.getBoundingClientRect();
  const left = rect.left + window.scrollX;
  const top = rect.top + window.scrollY;
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  return snapBoundsToGrid({
    left,
    right: left + width,
    top,
    bottom: top + height,
    width,
    height,
    source,
  });
}

function isRulerChrome(element: Element | null): boolean {
  return Boolean(element?.closest('.design-rulers'));
}

function isNavChrome(element: Element | null): boolean {
  return Boolean(element?.closest('nav[aria-label="Main navigation"]'));
}

function findInspectionTarget(x: number, y: number, finePointer: boolean): HTMLElement | null {
  const stack = document.elementsFromPoint(x, y).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );

  for (const el of stack) {
    if (isRulerChrome(el) || isNavChrome(el)) continue;

    const frame = el.closest('.workspace-frame') as HTMLElement | null;
    if (frame?.classList.contains('workspace-frame--active')) {
      return frame;
    }

    const inspectable = el.closest('.inspectable') as HTMLElement | null;
    if (inspectable) return inspectable;
  }

  if (finePointer) {
    for (const el of stack) {
      if (isRulerChrome(el) || isNavChrome(el)) continue;
      const section = el.closest('.section[id]') as HTMLElement | null;
      if (section) return section;
    }
  }

  for (const el of stack) {
    const section = el.closest('.section--inspecting[id]') as HTMLElement | null;
    if (section) return section;
  }

  return null;
}

function measureSectionBands(): SectionBand[] {
  return HOME_SECTION_IDS.flatMap((id) => {
    const el = document.getElementById(id);
    if (!el) return [];
    const rect = el.getBoundingClientRect();
    return [{ id, top: snapToGrid(rect.top + window.scrollY) }];
  });
}

function measureScrollPeekTarget(): RulerTargetBounds | null {
  const section = document.querySelector('.section--inspecting[id]') as HTMLElement | null;
  if (!section) return null;
  return toTargetBounds(section, 'section');
}

export function useRulerInteraction({
  enabled,
  shellInlineStart,
  verticalOrigin,
}: {
  enabled: boolean;
  shellInlineStart: number;
  verticalOrigin: number;
}) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<RulerInteractionState>({
    cursor: null,
    coords: null,
    target: null,
    sectionBands: [],
    interactive: false,
    reducedMotion: false,
  });

  const shellOriginRef = useRef(shellInlineStart);
  const verticalOriginRef = useRef(verticalOrigin);
  const rafRef = useRef<number | null>(null);
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    shellOriginRef.current = shellInlineStart;
    verticalOriginRef.current = verticalOrigin;
  }, [shellInlineStart, verticalOrigin]);

  const measureBands = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sectionBands: measureSectionBands(),
    }));
  }, []);

  const flushPointer = useCallback(() => {
    rafRef.current = null;
    const point = pendingPointerRef.current;
    if (!point) return;

    const { x, y } = point;
    const docX = x + window.scrollX;
    const docY = y + window.scrollY;
    const targetEl = findInspectionTarget(x, y, finePointer);

    let target: RulerTargetBounds | null = null;
    if (targetEl) {
      if (targetEl.classList.contains('workspace-frame')) {
        target = toTargetBounds(targetEl, 'frame');
      } else if (targetEl.classList.contains('inspectable')) {
        target = toTargetBounds(targetEl, 'inspectable');
      } else {
        target = toTargetBounds(targetEl, 'section');
      }
    }

    setState((prev) => ({
      ...prev,
      cursor: { clientX: x, clientY: y },
      coords: {
        x: snapToGrid(docX - shellOriginRef.current),
        y: snapToGrid(docY - verticalOriginRef.current),
      },
      target,
      interactive: finePointer,
      reducedMotion,
    }));
  }, [finePointer, reducedMotion]);

  const schedulePointer = useCallback(
    (x: number, y: number) => {
      pendingPointerRef.current = { x, y };
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(flushPointer);
    },
    [flushPointer]
  );

  useEffect(() => {
    if (!enabled) return;

    // Initial DOM measurement on setup — section positions can't be known until mount/layout.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measureBands();
    if (!finePointer) {
      const peekTarget = measureScrollPeekTarget();
      setState((prev) => ({
        ...prev,
        target: peekTarget,
        interactive: false,
        reducedMotion,
      }));
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      schedulePointer(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      pendingPointerRef.current = null;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const peekTarget = finePointer ? null : measureScrollPeekTarget();
      setState((prev) => ({
        ...prev,
        cursor: null,
        coords: null,
        target: peekTarget,
        interactive: finePointer,
        reducedMotion,
      }));
    };

    const handleLayoutChange = () => {
      measureBands();
      if (pendingPointerRef.current) {
        schedulePointer(pendingPointerRef.current.x, pendingPointerRef.current.y);
        return;
      }

      if (!finePointer) {
        const peekTarget = measureScrollPeekTarget();
        setState((prev) => ({
          ...prev,
          target: peekTarget,
          interactive: false,
          reducedMotion,
        }));
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleLayoutChange, { passive: true });
    window.addEventListener('resize', handleLayoutChange);

    const lenis = window.lenis;
    lenis?.on('scroll', handleLayoutChange);

    let mutationObserver: MutationObserver | null = null;
    if (!finePointer) {
      mutationObserver = new MutationObserver(handleLayoutChange);
      mutationObserver.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleLayoutChange);
      window.removeEventListener('resize', handleLayoutChange);
      lenis?.off('scroll', handleLayoutChange);
      mutationObserver?.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, finePointer, measureBands, reducedMotion, schedulePointer]);

  // `interactive`/`reducedMotion` mirror live input values directly — no need to store
  // (and re-sync via effect) a derived copy of them in `state`.
  return { ...state, interactive: finePointer, reducedMotion };
}
