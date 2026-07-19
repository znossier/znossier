/**
 * Grid layout validation — run via `npm run validate:grid`
 */
import {
  HOME_LAYOUTS,
  deriveBoundaries,
  deriveSpans,
  validateLayout,
  cellsToBoundaries,
  GRID_COLUMNS,
  type GridBreakpoint,
} from '../lib/grid-layout';
import { gridSpans } from '../lib/grid-spans';

const errors = validateLayout();

// grid-spans.ts literals must match deriveSpans() (Tailwind JIT requires literal strings)
const derived = deriveSpans();
for (const [section, cells] of Object.entries(derived)) {
  const literal = gridSpans[section as keyof typeof gridSpans];
  if (!literal && Object.keys(cells).length === 0) continue;
  if (!literal) {
    errors.push(`${section}: missing from grid-spans.ts`);
    continue;
  }
  for (const [cell, cls] of Object.entries(cells)) {
    const literalCls = literal[cell as keyof typeof literal];
    if (literalCls !== cls) {
      errors.push(
        `${section}.${cell}: grid-spans mismatch\n    literal:  ${literalCls}\n    derived:  ${cls}`
      );
    }
  }
}

for (const [section, def] of Object.entries(HOME_LAYOUTS)) {
  for (const bp of Object.keys(GRID_COLUMNS) as GridBreakpoint[]) {
    const explicit = def.boundaries?.[bp];
    if (!explicit) continue;
    const cellEdges = cellsToBoundaries(def.cells, bp);
    for (const b of explicit) {
      if (b !== 0 && b !== GRID_COLUMNS[bp] && !cellEdges.includes(b)) {
        const hasCells = Object.values(def.cells).some((r) => bp in r && r[bp] != null);
        if (hasCells) {
          errors.push(
            `${section}@${bp}: guide boundary ${b} missing from cell edges [${cellEdges.join(', ')}]`
          );
        }
      }
    }
  }
}

const boundaries = deriveBoundaries();

const sectionsWithCells = ['hero', 'works', 'expertise', 'about', 'footer', 'nav'] as const;

for (const section of sectionsWithCells) {
  if (!boundaries[section]?.desktop?.length) {
    errors.push(`${section}: missing desktop boundaries`);
  }
}

if (errors.length > 0) {
  console.error('Grid validation failed:\n');
  for (const err of errors) {
    console.error(`  ✗ ${err}`);
  }
  process.exit(1);
}

console.log('Grid validation passed.');
console.log(`  Sections: ${Object.keys(HOME_LAYOUTS).length}`);
console.log(`  Boundary sets: ${Object.keys(boundaries).length}`);
console.log(`  grid-spans literals in sync with HOME_LAYOUTS`);
