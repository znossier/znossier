import { deriveBoundaries } from '@/lib/grid-layout';

export { GRID_COLUMNS, type GridBreakpoint } from '@/lib/grid-layout';

/** Mirrors layout CSS custom properties in app/globals.css */
export const LAYOUT = {
  shellMax: 'var(--layout-shell-max)',
  paddingInline: 'var(--site-padding-inline)',
  inlineStart: 'var(--layout-inline-start)',
  rulerSize: 'var(--ruler-size)',
  sectionPaddingInline: 'var(--cell-padding-inline)',
  gridUnit: 'var(--grid-unit)',
} as const;

export type ResponsiveGridBoundaries = Partial<
  Record<import('@/lib/grid-layout').GridBreakpoint, number[]>
>;

function normalizeBoundaries(boundaries: number[] | undefined, totalColumns: number) {
  const safeBoundaries = boundaries?.length
    ? boundaries
    : Array.from({ length: totalColumns + 1 }, (_, index) => index);

  return Array.from(
    new Set(
      safeBoundaries
        .map((value) => Math.max(0, Math.min(totalColumns, Math.round(value))))
        .concat([0, totalColumns])
    )
  ).sort((left, right) => left - right);
}

export function getGridLinePositions(
  boundaries: number[] | undefined,
  totalColumns: number
) {
  return normalizeBoundaries(boundaries, totalColumns);
}

/** Derived from HOME_LAYOUTS — do not edit by hand. */
export const HOME_SECTION_BOUNDARIES = deriveBoundaries() satisfies Record<
  string,
  ResponsiveGridBoundaries
>;
