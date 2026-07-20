/**
 * Single source of truth for home-page grid layout.
 *
 * Convention: boundary value N = vertical guide line at the start of column N+1
 * (i.e. after column N). A cell `{ start: 11, span: 14 }` contributes boundary
 * `10` on its left edge and `24` on its right.
 */

export const GRID_COLUMNS = {
  mobile: 6,
  tablet: 8,
  desktop: 24,
} as const;

/** Hero portrait desktop frame — 30×20 grid units (720×480 at 24px baseline). */
export const HERO_PORTRAIT_WIDTH_UNITS = 30;
export const HERO_PORTRAIT_HEIGHT_UNITS = 20;

export type GridBreakpoint = keyof typeof GRID_COLUMNS;

export type GridCellDef = {
  start: number;
  span: number;
  rowStart?: number;
  /** Extra Tailwind classes (justify-self, hidden, flex, etc.) */
  extraClasses?: string;
};

export type ResponsiveCells = Partial<Record<GridBreakpoint, GridCellDef>>;

export type SectionLayoutDef = {
  cells: Record<string, ResponsiveCells>;
  /**
   * Explicit guide-line boundaries per breakpoint. When omitted, derived from
   * all cell edges via `cellsToBoundaries`.
   */
  boundaries?: Partial<Record<GridBreakpoint, number[]>>;
};

/** Collect every vertical guide line implied by a set of cells. */
export function cellsToBoundaries(
  cells: Record<string, ResponsiveCells>,
  breakpoint: GridBreakpoint
): number[] {
  const columns = GRID_COLUMNS[breakpoint];
  const edges = new Set<number>([0, columns]);

  for (const responsive of Object.values(cells)) {
    const cell = responsive[breakpoint];
    if (!cell) continue;
    edges.add(cell.start - 1);
    edges.add(cell.start + cell.span - 1);
  }

  return Array.from(edges).sort((a, b) => a - b);
}

/** Tailwind grid-column classes for a responsive cell definition. */
export function cellToClass(responsive: ResponsiveCells): string {
  const parts: string[] = [];

  const mobile = responsive.mobile;
  const tablet = responsive.tablet;
  const desktop = responsive.desktop;

  // Default: full width below lg unless a mobile/tablet cell is defined
  if (!mobile && !tablet && desktop) {
    parts.push('col-span-full');
  } else if (mobile) {
    if (mobile.span === GRID_COLUMNS.mobile) {
      parts.push('col-span-full');
    } else if (mobile.start === 1 && mobile.span === 1) {
      parts.push('col-span-1');
    } else {
      parts.push(`[grid-column:${mobile.start}/span_${mobile.span}]`);
    }
  } else {
    parts.push('col-span-full');
  }

  if (tablet) {
    parts.push(`sm:[grid-column:${tablet.start}/span_${tablet.span}]`);
  }

  if (desktop) {
    parts.push(`lg:[grid-column:${desktop.start}/span_${desktop.span}]`);
    if (desktop.rowStart !== undefined) {
      parts.push(`lg:row-start-${desktop.rowStart}`);
    }
  }

  const extra =
    responsive.desktop?.extraClasses ??
    responsive.tablet?.extraClasses ??
    responsive.mobile?.extraClasses;
  if (extra) {
    parts.push(extra);
  }

  return parts.join(' ');
}

function fullWidthBoundaries(): Partial<Record<GridBreakpoint, number[]>> {
  return {
    mobile: [0, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet],
    desktop: [0, GRID_COLUMNS.desktop],
  };
}

function halfSplitBoundaries(): Partial<Record<GridBreakpoint, number[]>> {
  return {
    mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
    tablet: [0, GRID_COLUMNS.tablet / 2, GRID_COLUMNS.tablet],
  };
}

export const HOME_LAYOUTS = {
  hero: {
    cells: {
      copy: {
        tablet: { start: 1, span: 4 },
        desktop: { start: 1, span: 8 },
      },
      portrait: {
        desktop: {
          start: 11,
          span: 14,
          /* Slot self-aligns with margin-inline-start:auto — avoid justify-self-end (collapses width to 0) */
          extraClasses: 'w-full min-w-0',
        },
      },
      scrollHint: {
        desktop: {
          start: 1,
          span: 8,
          rowStart: 2,
          extraClasses:
            'scroll-hint type-meta hidden lg:inline-flex items-center justify-start gap-2 self-end text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        },
      },
    },
    boundaries: {
      ...halfSplitBoundaries(),
      desktop: [0, 8, 10, GRID_COLUMNS.desktop],
    },
  },
  works: {
    cells: {
      heading: {
        desktop: { start: 1, span: GRID_COLUMNS.desktop },
      },
      cardLeft: {
        desktop: { start: 1, span: 11 },
      },
      cardRight: {
        desktop: { start: 14, span: 11 },
      },
      loadMore: {
        desktop: { start: 12, span: 2 },
      },
    },
    boundaries: {
      ...halfSplitBoundaries(),
      tablet: [0, GRID_COLUMNS.tablet],
      desktop: [0, 11, 13, GRID_COLUMNS.desktop],
    },
  },
  expertise: {
    cells: {
      heading: {
        desktop: { start: 1, span: GRID_COLUMNS.desktop },
      },
      cards: {
        desktop: { start: 1, span: GRID_COLUMNS.desktop },
      },
    },
    boundaries: {
      ...halfSplitBoundaries(),
      tablet: [0, GRID_COLUMNS.tablet],
      desktop: [0, GRID_COLUMNS.desktop],
    },
  },
  process: {
    cells: {},
    boundaries: {
      ...halfSplitBoundaries(),
      tablet: [0, GRID_COLUMNS.tablet],
      desktop: [0, GRID_COLUMNS.desktop],
    },
  },
  techStack: {
    cells: {},
    boundaries: fullWidthBoundaries(),
  },
  about: {
    cells: {
      intro: {
        desktop: { start: 1, span: 11 },
      },
      experience: {
        desktop: { start: 14, span: 11 },
      },
    },
    boundaries: {
      ...halfSplitBoundaries(),
      tablet: [0, GRID_COLUMNS.tablet],
      desktop: [0, 11, 13, GRID_COLUMNS.desktop],
    },
  },
  footer: {
    cells: {
      utilitySpacerLeft: {
        desktop: {
          start: 1,
          span: 8,
          rowStart: 1,
        },
      },
      utilitySpacerRight: {
        desktop: {
          start: 9,
          span: 8,
          rowStart: 1,
        },
      },
      utility: {
        desktop: {
          start: 17,
          span: 8,
          rowStart: 1,
        },
      },
      nav: {
        desktop: { start: 1, span: 8, rowStart: 2 },
      },
      contact: {
        desktop: { start: 9, span: 8, rowStart: 2 },
      },
      connect: {
        desktop: { start: 17, span: 8, rowStart: 2 },
      },
    },
    boundaries: {
      mobile: [0, GRID_COLUMNS.mobile / 2, GRID_COLUMNS.mobile],
      tablet: [0, 4, GRID_COLUMNS.tablet],
      desktop: [0, 8, 16, GRID_COLUMNS.desktop],
    },
  },
  nav: {
    cells: {
      logo: {
        mobile: { start: 1, span: 1, extraClasses: 'justify-self-start' },
        desktop: { start: 1, span: 2, extraClasses: 'justify-self-start' },
      },
      links: {
        desktop: {
          start: 15,
          span: 6,
          extraClasses:
            'hidden lg:flex items-center justify-end gap-[calc(var(--grid-unit)*2)]',
        },
      },
      controls: {
        mobile: { start: 6, span: 1 },
        tablet: { start: 8, span: 1 },
        desktop: { start: 21, span: 4 },
      },
    },
  },
  detail: {
    cells: {},
    boundaries: {
      mobile: [0, GRID_COLUMNS.mobile],
      tablet: [0, GRID_COLUMNS.tablet],
      desktop: [0, 8, 16, GRID_COLUMNS.desktop],
    },
  },
} satisfies Record<string, SectionLayoutDef> as Record<string, SectionLayoutDef>;

export type HomeLayoutSection = keyof typeof HOME_LAYOUTS;
export type HomeLayoutKey<S extends HomeLayoutSection> = keyof (typeof HOME_LAYOUTS)[S]['cells'];

/** Derive section guide boundaries from layout definitions (for tooling / docs). */
export function deriveBoundaries(
  layouts: Record<string, SectionLayoutDef> = HOME_LAYOUTS
): Record<string, Partial<Record<GridBreakpoint, number[]>>> {
  const result: Record<string, Partial<Record<GridBreakpoint, number[]>>> = {};

  for (const [section, def] of Object.entries(layouts)) {
    if (def.boundaries) {
      result[section] = def.boundaries;
      continue;
    }

    const derived: Partial<Record<GridBreakpoint, number[]>> = {};
    for (const bp of Object.keys(GRID_COLUMNS) as GridBreakpoint[]) {
      derived[bp] = cellsToBoundaries(def.cells, bp);
    }
    result[section] = derived;
  }

  return result;
}

/** Derive Tailwind span class strings from layout definitions. */
export function deriveSpans(
  layouts: Record<string, SectionLayoutDef> = HOME_LAYOUTS
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  for (const [section, def] of Object.entries(layouts)) {
    result[section] = {};
    for (const [key, responsive] of Object.entries(def.cells)) {
      if (section === 'works' && key === 'heading') {
        result[section][key] = 'col-span-full';
        continue;
      }
      if (section === 'nav' && key === 'controls') {
        const parts = ['flex items-center justify-end gap-3'];
        if (responsive.mobile) parts.unshift(`col-start-${responsive.mobile.start}`);
        if (responsive.tablet) parts.push(`sm:col-start-${responsive.tablet.start}`);
        if (responsive.desktop) {
          parts.push(
            `lg:[grid-column:${responsive.desktop.start}/span_${responsive.desktop.span}]`
          );
        }
        result[section][key] = parts.join(' ');
        continue;
      }
      result[section][key] = cellToClass(responsive);
    }
  }

  return result;
}

export function validateLayout(layouts: Record<string, SectionLayoutDef> = HOME_LAYOUTS): string[] {
  const errors: string[] = [];

  for (const [section, def] of Object.entries(layouts)) {
    for (const bp of Object.keys(GRID_COLUMNS) as GridBreakpoint[]) {
      const columns = GRID_COLUMNS[bp];

      for (const [cellKey, responsive] of Object.entries(def.cells)) {
        const cell = responsive[bp];
        if (!cell) continue;

        if (cell.start < 1 || cell.start > columns) {
          errors.push(`${section}.${cellKey}@${bp}: start ${cell.start} out of range 1–${columns}`);
        }
        if (cell.start + cell.span - 1 > columns) {
          errors.push(
            `${section}.${cellKey}@${bp}: end column ${cell.start + cell.span - 1} exceeds ${columns}`
          );
        }
      }

      const explicit = def.boundaries?.[bp];
      if (explicit) {
        const cellEdges = cellsToBoundaries(def.cells, bp);
        for (const boundary of explicit) {
          if (boundary !== 0 && boundary !== columns && !cellEdges.includes(boundary)) {
            const hasCells = Object.values(def.cells).some((r) => r[bp]);
            if (hasCells) {
              errors.push(
                `${section}@${bp}: boundary ${boundary} not implied by cell edges [${cellEdges.join(', ')}]`
              );
            }
          }
        }
      }
    }
  }

  return errors;
}

import { gridSpans } from '@/lib/grid-spans';

/** Resolve a layout path like `hero.copy` to a Tailwind class string. */
export function layoutClass(section: HomeLayoutSection, cell: string): string {
  const sectionSpans = gridSpans[section as keyof typeof gridSpans];
  if (!sectionSpans) {
    throw new Error(`Unknown layout section: ${section}`);
  }
  const cls = sectionSpans[cell as keyof typeof sectionSpans];
  if (!cls) {
    throw new Error(`Unknown layout cell: ${section}.${cell}`);
  }
  return cls;
}
