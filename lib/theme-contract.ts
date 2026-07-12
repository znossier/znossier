/**
 * Figma workspace theme contract — when to apply each visual layer.
 * See DESIGN_SYSTEM.md for full documentation.
 */

export const themeContract = {
  /** Layer 1: always visible, subtle — never block content */
  workspaceAlways: [
    'body dot grid',
    'DesignRulers + GridOverlay (home, full viewport)',
    'SectionGridLines per section',
    'section--canvas / section--footer square grid',
    'section--subtle dot grid',
    'panel dot grid (.workspace-grid-dots-fill)',
    'section ambient lighting (::after radial washes)',
  ],

  /** Layer 3: fine pointer — hover/focus; hero frames always-on */
  hoverInspection: [
    'SelectionOutline on hover/focus',
    'dimensions + spacing labels on hover/focus',
    'frame labels on hover/focus',
    'Hero frames: inspectMode always on fine pointer',
  ],

  /** Layer 3: coarse pointer — scroll peek ~900ms, section + frames */
  scrollPeekInspection: [
    'Section bounds + grid emphasis via useScrollPeek on Section',
    'WorkspaceFrame outline + label per frame in viewport',
    'SpacingGuide fills during section peek (InspectionPeekContext)',
    'Hero + Process raw sections use same peek provider',
  ],

  /** Section gutters: fills + numeric labels on inspect */
  sectionGutters: {
    showGutters: true,
    showLabels: true,
    heroException: 'Hero copy/portrait gutter labels visible on fine pointer or scroll peek',
  },

  components: {
    cardFrame: 'WorkspaceFrame',
    sectionShell: 'SectionLayout',
    gridGuides: 'GridGuideLayer',
    measurementTypography: 'measurement-text',
    scrollPeekHook: 'useScrollPeek',
    inspectionPeekContext: 'InspectionPeekProvider',
  },
} as const;

export type InspectMode = 'always' | 'hover' | 'off';
