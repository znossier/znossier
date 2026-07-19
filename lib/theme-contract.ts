/**
 * Figma workspace theme contract — when to apply each visual layer.
 * See DESIGN_SYSTEM.md for full documentation.
 */

export const themeContract = {
  /** Layer 1: always visible, subtle — never block content */
  workspaceAlways: [
    'single fixed .canvas-grid-overlay (24px gray Figma-style lattice)',
    'DesignRulers (home, lg+)',
    'opaque section bands — hero never shows through sticky shells',
  ],

  /** Layer 3: fine pointer — hover/focus; hero frames always-on */
  hoverInspection: [
    'SelectionOutline on hover/focus',
    'Figma Frame Name chip (352:301) 24px above frame',
    'dimension rulers clear of the frame name',
    'Hero frames: inspectMode always on fine pointer',
  ],

  /** Layer 3: coarse pointer — scroll peek ~900ms */
  scrollPeekInspection: [
    'WorkspaceFrame outline + label per frame in viewport',
    'SpacingGuide fills during section peek (InspectionPeekContext)',
  ],

  components: {
    cardFrame: 'WorkspaceFrame',
    sectionShell: 'SectionStickyShell / SectionLayout',
    measurementTypography: 'measurement-ruler-label',
    scrollPeekHook: 'useScrollPeek',
    inspectionPeekContext: 'InspectionPeekProvider',
  },
} as const;

export type InspectMode = 'always' | 'hover' | 'off';
