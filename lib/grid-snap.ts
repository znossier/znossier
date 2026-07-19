/** Half-step of the 24px baseline — matches `--workspace-grid-dots-size` */
export const WORKSPACE_GRID_DOT_SIZE = 12;

/** Matches `--grid-unit` / `--workspace-grid-lines-size` (24px baseline) */
export const WORKSPACE_GRID_LINE_SIZE = 24;

export function snapToGrid(value: number, unit = WORKSPACE_GRID_DOT_SIZE): number {
  return Math.round(value / unit) * unit;
}

export type SnappableBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export function snapBoundsToGrid<T extends SnappableBounds>(
  bounds: T,
  unit = WORKSPACE_GRID_DOT_SIZE
): T {
  const left = snapToGrid(bounds.left, unit);
  const top = snapToGrid(bounds.top, unit);
  const right = snapToGrid(bounds.right, unit);
  const bottom = snapToGrid(bounds.bottom, unit);

  return {
    ...bounds,
    left,
    top,
    right: Math.max(right, left + unit),
    bottom: Math.max(bottom, top + unit),
    width: Math.max(unit, right - left),
    height: Math.max(unit, bottom - top),
  };
}
