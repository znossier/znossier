/**
 * Single 24px lattice painted once for the entire page — not per-`.section`.
 * Sections used to each paint their own copy of this pattern (with a runtime
 * `GridPhaseSync` correction to keep the seams between them aligned, since every
 * section's own local (0,0) rarely landed on a true 24px multiple of the page).
 * That's gone: one absolutely-positioned layer spanning the full document height
 * can't ever drift out of phase with itself, because there's only one of it.
 */
export function WorkspaceGrid() {
  return <div className="workspace-grid-overlay" aria-hidden />;
}
