export const GRID_COLUMNS = {
  mobile: 6,
  tablet: 8,
  desktop: 24,
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
  works: {
    mobile: [0, 1, 5, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 11, 13, GRID_COLUMNS.desktop],
  },
  expertise: {
    mobile: [0, 1, 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 6, GRID_COLUMNS.desktop],
  },
  process: {
    mobile: [0, 1, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, GRID_COLUMNS.desktop],
  },
  techStack: {
    mobile: [0, 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, GRID_COLUMNS.desktop],
  },
  about: {
    mobile: [0, 2, 4, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, 11, 13, GRID_COLUMNS.desktop],
  },
  footer: {
    mobile: [0, 3, GRID_COLUMNS.mobile],
    tablet: [0, 4, GRID_COLUMNS.tablet],
    desktop: [0, 8, 16, GRID_COLUMNS.desktop],
  },
} satisfies Record<string, ResponsiveGridBoundaries>;
