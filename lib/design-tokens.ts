/**
 * Design Tokens — mirrors live CSS custom properties in app/globals.css
 * See DESIGN_SYSTEM.md for usage guidelines.
 */

/**
 * Design token mirror — see DESIGN_SYSTEM.md and lib/theme-contract.ts
 * for the three-layer workspace theme contract (always / hero-only / hover).
 */
export const designTokens = {
  typography: {
    fontFamily: {
      primary: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-geist-mono)', 'monospace'],
      display: ['var(--font-oswald)', 'var(--font-geist-sans)', 'sans-serif'],
    },
    scale: {
      display: 'clamp(2.3rem, 5.8vw, 4.15rem)',
      title: 'clamp(1.24rem, 2.4vw, 1.9rem)',
      titleSm: 'clamp(0.97rem, 1.6vw, 1.18rem)',
      section: 'clamp(1.08rem, 2.1vw, 1.52rem)',
      heading: 'clamp(0.97rem, 1.6vw, 1.04rem)',
      body: '0.875rem',
      bodyLg: '1rem',
      label: '0.72rem',
      meta: '0.62rem',
      measurement: '0.6rem',
    },
  },

  colors: {
    background: '#0a0a0a',
    foreground: '#f0ece4',
    footerBackground: '#0a0a0a',
    sectionAccent: '#141414',
    surfaceElevated: '#111111',
    utilityCyan: '#58bfe8',
    utilityMagenta: '#ff4fa3',
    accent: '#58bfe8',
    link: '#58bfe8',
    border: '#2a2a2a',
  },

  semantic: {
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      muted: 'var(--text-muted)',
      faint: 'var(--text-faint)',
      onMedia: 'var(--text-on-media)',
      onMediaMuted: 'var(--text-on-media-muted)',
      onMediaSubtle: 'var(--text-on-media-subtle)',
    },
    surface: {
      canvas: 'var(--surface-canvas)',
      subtle: 'var(--surface-subtle)',
      panel: 'var(--surface-panel)',
      media: 'var(--surface-media)',
    },
    border: {
      default: 'var(--border-default)',
      subtle: 'var(--border-subtle)',
    },
    utility: {
      cyan: 'var(--utility-cyan)',
      magenta: 'var(--utility-magenta)',
      label: 'var(--utility-label)',
    },
    accentMuted: 'var(--accent-muted)',
    mediaImageFilter: 'var(--media-image-filter)',
    mediaPlaceholder: 'var(--media-placeholder-bg)',
  },

  controls: {
    border: 'var(--control-border)',
    borderHover: 'var(--control-border-hover)',
    borderActive: 'var(--control-border-active)',
    shellSurface: 'var(--shell-surface)',
    shellAccentLine: 'var(--shell-accent-line)',
    rulerSurface: 'var(--ruler-surface)',
  },

  layout: {
    shellMax: 'var(--layout-shell-max)',
    siteMaxWidth: 'var(--site-max-width)',
    paddingInline: 'var(--site-padding-inline)',
    inlineStart: 'var(--layout-inline-start)',
    rulerSize: 'var(--ruler-size)',
    sectionPaddingInline: 'var(--section-padding-inline)',
    gridColumns: {
      mobile: 'var(--site-grid-columns-mobile)',
      tablet: 'var(--site-grid-columns-tablet)',
      desktop: 'var(--site-grid-columns-desktop)',
    },
  },

  workspaceGrid: {
    lineColor: 'var(--workspace-grid-line-color)',
    dotColor: 'var(--workspace-grid-dot-color)',
    linesSize: 'var(--workspace-grid-lines-size)',
    dotsSize: 'var(--workspace-grid-dots-size)',
    dotsSizeLg: 'var(--workspace-grid-dots-size-lg)',
    dotsFillOpacity: 'var(--workspace-grid-dots-fill-opacity)',
    columnGuideColor: 'var(--grid-line-color)',
  },

  sections: {
    order: ['hero', 'works', 'services', 'process', 'techStack', 'about', 'footer'] as const,
    variants: {
      hero: null,
      works: 'subtle',
      services: 'canvas',
      process: 'subtle',
      techStack: 'canvas',
      about: 'subtle',
      footer: 'footer',
    },
  },

  motion: {
    easePrecision: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    duration: {
      flash: '0.4s',
      draw: '0.6s',
      fade: '0.35s',
      reveal: '0.45s',
      slow: '0.8s',
    },
  },

  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      precision: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  },
};
