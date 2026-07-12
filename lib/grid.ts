export const GRID_COLUMNS = {
  mobile: 6,
  tablet: 8,
  desktop: 24,
} as const;

/** Mirrors layout CSS custom properties in app/globals.css */
export const LAYOUT = {
  shellMax: 'var(--layout-shell-max)',
  paddingInline: 'var(--site-padding-inline)',
  inlineStart: 'var(--layout-inline-start)',
  rulerSize: 'var(--ruler-size)',
  sectionPaddingInline: 'var(--section-padding-inline)',
} as const;

export type GridBreakpoint = keyof typeof GRID_COLUMNS;

export type ResponsiveGridBoundaries = Partial<Record<GridBreakpoint, number[]>>;

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

export const HOME_SECTION_BOUNDARIES = {
  hero: {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet / 2, GRID_COLUMNS.tablet],
    desktop: [0, 8, 11, GRID_COLUMNS.desktop],
  },
  works: {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 11, 13, GRID_COLUMNS.desktop],
  },
  expertise: {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 6, GRID_COLUMNS.desktop],
  },
  process: {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, GRID_COLUMNS.desktop],
  },
  techStack: {
    mobile: [0, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, GRID_COLUMNS.desktop],
  },
  about: {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 11, 13, GRID_COLUMNS.desktop],
  },
  footer: {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, 4, GRID_COLUMNS.tablet],
    desktop: [0, 8, 16, GRID_COLUMNS.desktop],
  },
  detail: {
    mobile: [0, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 8, 16, GRID_COLUMNS.desktop],
  },
} satisfies Record<string, ResponsiveGridBoundaries>;
