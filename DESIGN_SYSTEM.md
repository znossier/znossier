# Design System — Figma Workspace

The portfolio is styled as an inspectable **Figma workspace**: rulers, canvas dot grid, column guides, frame selection, spacing highlights, and flat minimal UI surfaces.

**Tokens:** [`app/globals.css`](app/globals.css) · **Mirror:** [`lib/design-tokens.ts`](lib/design-tokens.ts) · **Contract:** [`lib/theme-contract.ts`](lib/theme-contract.ts)

## Theme philosophy

| Layer | Treatment |
|-------|-----------|
| **Canvas** | Near-black `#0a0a0a` with subtle 16px cyan dot grid on `body` |
| **Ink** | Warm white `#f0ece4` |
| **Accent** | Cyan `#58bfe8` — rulers, WIP ribbon, selection borders, dimensions, grid guides |
| **Spacing** | Magenta `#ff4fa3` — padding/gap fills; cyan for column gutters |
| **Controls** | Flat panels with simple borders; no elevated shell chrome |
| **Hero** | Panel-framed copy + portrait frame; cyan gutter labels on inspect |

**Not this theme:** mission control, blueprint/ASCII paper, generic editorial magazine, heavy inset shadows, grid overlays on nav/ribbon bars.

Dark-only at `:root` (`forcedTheme="dark"`). `[data-theme="dark"]` kept for compatibility.

## Layout foundation

All section content aligns to a single margin rail via `.site-shell`.

| Token | Purpose |
|-------|---------|
| `--site-padding-inline` | Horizontal padding (1rem → 1.5rem → 2rem) |
| `--layout-shell-max` / `--site-max-width` | Max content width (`88rem`) |
| `--layout-inline-start` | Computed left edge of shell content (padding + centering) |
| `--ruler-size` | Ruler track width/height (`14px`) |
| `--section-padding-inline` | Alias of shell padding for cell padding |

**Grid columns:** 6 (mobile) → 8 (tablet) → 24 (desktop). Boundaries in [`lib/grid.ts`](lib/grid.ts) (`HOME_SECTION_BOUNDARIES`).

**Standard section composition:**

```
Section (surface + scroll peek)
  └── SectionLayout (SectionGridLines + site-shell)
        └── SpacingGuide (gutters + labels on inspect)
              └── site-section-grid (single grid per section)
```

Shared grid guide rendering: [`components/GridGuideLayer.tsx`](components/GridGuideLayer.tsx) — used by `SectionGridLines` and `GridOverlay`. Mobile guides no longer double-inset padding inside `.site-shell`.

**Full-bleed exceptions:** Tech Stack marquee rows (`-mx-[var(--site-padding-inline)]` inside a `col-span-full` cell), Process horizontal scroll track (`site-track-pad`), hero background textures.

## Grid enforcement

**Rule:** Every home section child must use column spans from [`lib/grid-spans.ts`](lib/grid-spans.ts) that match `HOME_SECTION_BOUNDARIES` in [`lib/grid.ts`](lib/grid.ts). No ad-hoc `max-width`, negative margins, or absolute positioning that breaks shell alignment.

| Do | Don't |
|----|-------|
| `Section` → `SectionLayout` → `SpacingGuide` → `site-section-grid` | Sibling grids in one section |
| `gridSpans.*` for desktop column placement | Hand-rolled `lg:[grid-column:…]` per file |
| Scroll hints / CTAs as grid cells (`gridSpans.hero.scrollHint`) | `absolute bottom-0 right-0` for layout |
| Internal cell padding via `--section-padding-inline` | Extra horizontal padding on `.site-shell` children |
| Full-bleed via `-mx-[var(--site-padding-inline)]` on `col-span-full` only | Arbitrary `-mx` on content blocks |

**Navigation grid (desktop):** logo cols 1–2, links cols 9–16, controls cols 21–24.

**Section headings:** align to column 1; no extra `padding-inline-start` on sticky labels. Kicker + title sit flush with grid left edge; track line extends to the right within the heading row.

## Surface rhythm

Alternating black canvas stripes (square grid) and dark grey stripes (dot grid):

| Section | Class | Background | Grid texture |
|---------|-------|------------|--------------|
| Hero | full bleed | `#0a0a0a` | Square lines + ambient light |
| Works | `subtle` | `#141414` | 16px dots |
| Services | `canvas` | `#0a0a0a` | Square lines |
| Process | `subtle` | `#141414` | 16px dots |
| Tech Stack | `canvas` | `#0a0a0a` | Square lines |
| About | `subtle` | `#141414` | 16px dots |
| Footer | `footer` | `#0a0a0a` | Square lines |

**Ambient lighting:** `.section--canvas::after` and `.section--subtle::after` add low-opacity cyan radial washes. Distinct from hero `.hero-vignette` / `.hero-ambient-light`.

**Shell bars (nav, WIP ribbon, detail nav):** flat — no grid texture overlays.

## Workspace grid textures

| Pattern | Opacity token | Use |
|---------|---------------|-----|
| Square lines | `--section-grid-square-opacity` (~28%) | Canvas sections, hero, footer |
| Dot grid | `--section-grid-dot-opacity` (~24%) | Body, subtle sections |
| Column guides | `--grid-line-color` at ~42% layer opacity | `SectionGridLines`, `GridOverlay` |

| Surface | Grid |
|---------|------|
| `body` | Dot grid, 16px |
| `.hero-canvas-grid` | Square lines (elevated opacity) |
| `.section--canvas`, `.section--footer` | Square lines via `::before` |
| `.section--subtle` | Dot grid via `::before` |
| `.workspace-grid-dots-fill` on panels | Dot grid, 8px |

## Inspection UI

| Component | Role |
|-----------|------|
| `DesignRulers` | Scroll-synced cyan ticks; origin square; horizontal zero aligned to shell left (`lg+`, home only) |
| `GridOverlay` | Full-viewport column guides on home; magenta center line at `lg+` |
| `GridGuideLayer` | Shared line renderer for section guides + overlay |
| `SectionGridLines` | Per-section column guides from `HOME_SECTION_BOUNDARIES` |
| `SelectionOutline` | Cyan 1px frame + square corner handles |
| `SpacingGuide` | Magenta padding/gap fills; cyan gutter fills with pixel labels |
| `MeasurementOverlay` | Cyan dimension lines with arrow caps |
| `WorkspaceFrame` | Card/panel frame with optional spacing + dimensions |

Mounted from `AppShell` on non-studio routes.

### Rulers

- Corner origin square (`14×14px`) — horizontal and vertical tracks do not overlap
- Horizontal track starts at `--ruler-size`; vertical track starts below chrome + ruler
- Ticks scroll-sync via `useScrollOffset`; horizontal zero at `.site-shell` left edge
- Labels at 128px intervals with padding to prevent clipping

### Spacing highlight rules

| Context | Fills | Labels | Trigger |
|---------|-------|--------|---------|
| Hero copy/portrait gutter | Cyan | Yes | Fine pointer always; scroll peek on touch |
| Section column splits (Works, About, Services, Footer) | Cyan | Yes | Hover / scroll peek |
| Flex gaps in framed panels (cards, hero copy) | Magenta | Yes when ≥8px | Hover / scroll peek |
| Nav/footer link stacks | Magenta | Tooltip | Hover |
| Tech stack tiles | Off | Off | Outline only on hover |
| Marquee / full-bleed | Off | Off | Never |

Inline gap/gutter labels use dark pill styling (`.spacing-zone-label--inline`). Tooltips use `.measurement-tooltip` with matching border treatment.

## Section layouts (desktop `lg+`)

| Section | Boundaries | Layout |
|---------|------------|--------|
| Hero | `[0, 8, 11, 24]` | Copy cols 1–8, portrait 11–24, gutter cols 9–10 labeled |
| Works | `[0, 11, 13, 24]` | Alternating 11-col cards; guides at cols 11 and 13 |
| Services | `[0, 6, 24]` | Heading cols 1–5, cards cols 7–24 |
| Process | `[0, 24]` | Full-width scroll track (special case) |
| Tech Stack | `[0, 24]` | Heading in shell grid; marquee in `tech-stack-bleed` below |
| About | `[0, 11, 13, 24]` | Bio cols 1–11, experience cols 14–24 |
| Footer | `[0, 8, 16, 24]` | Row 1: back-to-top cols 17–24; Row 2: three 8-col zones |

Footer uses one `site-section-grid` with `SpacingGuide`; wrapped in `Section variant="footer"`.

## Hero

- Copy: `WorkspaceFrame variant="panel"` with `inspectMode="always"` on fine pointer
- Portrait: framed with dimensions on inspect
- `SpacingGuide` on hero grid shows gutter pixel labels between copy and portrait
- Grid line opacity matches other sections (~42%)
- `GridOverlay` covers full viewport on home (includes hero zone)

## Theme contract (enforcement)

Three layers — apply in order.

### Layer 1 — Workspace (always on)

| Element | Rule |
|---------|------|
| Body | 16px dot grid |
| Home | `DesignRulers` + `GridOverlay` (full viewport) |
| Every home section | `SectionGridLines` via `SectionLayout` |
| Canvas / footer | Square-line grid + ambient `::after` |
| Subtle sections | Dot grid + ambient `::after` |
| Cards / panels | `.panel` + `.workspace-grid-dots-fill` |

### Layer 2 — Frame borders

| Element | Rule |
|---------|------|
| Borders | `--border-subtle` at rest; `--utility-cyan` on hover/focus |
| Measurements | `.measurement-text` only |

### Layer 3 — Inspection

| Context | Fine pointer | Coarse pointer |
|---------|--------------|----------------|
| **Hero frames** | `inspectMode="always"` | Scroll peek ~900ms |
| **Other frames** | Hover / focus | Scroll peek per frame |
| **Section gutters** | Labels + fills on hover | Section scroll peek |

### Component decision tree

```
Section layout?     → SectionLayout (GridGuideLayer + site-shell)
Card / panel frame? → WorkspaceFrame
Flat tile (tech)?   → WorkspaceFrame variant="flat", outline only
Footer?             → Section variant="footer" + SpacingGuide grid
Measurements?       → MeasurementLabel / MeasurementOverlay
Section gutters?    → SpacingGuide showGutters showLabels
```

### Do / Don't

| Do | Don't |
|----|-------|
| Single `site-section-grid` per section | Sibling grids for heading + content |
| `GridGuideLayer` for all guide overlays | Per-component line math |
| Hero: `inspectMode="always"` + panel copy | Bare hero text without frame |
| Gutter labels on inspect | Always-on labels everywhere |
| `npm run dev:webpack` if Turbopack cache corrupts | Parallel `dev` + `build` |

## Text hierarchy

| Class | Role |
|-------|------|
| `.type-display` | Hero name |
| `.type-title` | Card titles |
| `.type-label` | Kickers, nav |
| `.type-meta` | Dates, tags |

Semantic: `.text-secondary`, `.text-muted`, `.text-faint`, `.text-on-media`

## Flat controls

- `.flat-control` — square, flat, simple border
- `.flat-control-accent` — primary CTA with cyan border
- `.panel` — bordered frame surfaces with dot grid fill
- `.editorial-nav-shell` — flat nav bar

## Motion

Shared tokens in [`lib/motion.ts`](lib/motion.ts) · CSS `--motion-ease-precision` · `Reveal` component.

| Token | Duration | Use |
|-------|----------|-----|
| `hover` | 0.18s | Hover states, card overlays, link color |
| `overlay` | 0.2s | Inspection outlines, measurement labels, section bounds |
| `fade` | 0.35s | Ruler fade-in, general opacity |
| `reveal` | 0.42s | Scroll reveals, section entrances |
| `stagger` | 0.05s | Sibling reveal delay |

**Principles**

- Precision easing only — no bounce or overshoot (`cubic-bezier(0.25, 0.1, 0.25, 1)`)
- UI animations cap at ~0.5s; hover at 150–200ms
- `prefers-reduced-motion`: decorative motion off; functional state changes instant
- Scroll-linked motion uses `transform` only (Process track, ruler ticks, crosshair)
- Pointer tracking batched via `requestAnimationFrame` (cursor, rulers, spacing measure)
- Reveal viewport uses bottom-only margin (`REVEAL_VIEWPORT`) — avoids hero/footer invisible-on-load from symmetric negative margins
- Spacing overlays fade in (`spacing-overlay--visible`); fills animate via scale, not width/height
- `will-change` only on actively transforming layers (Process scroll track); not on static rulers

## Cohesion & interaction principles

The homepage should read as **one Figma canvas**, not independent blocks patched together.

### Visual rhythm

| Principle | Rule |
|-----------|------|
| **Stripe alternation** | Canvas (`#0a0a0a` + square grid) ↔ subtle (`#141414` + dot grid) across Hero → Works → Services → Process → Tech → About → Footer |
| **Ambient light** | Low-opacity cyan radial washes on every `.section--canvas` / `.section--subtle` via `::after`; hero uses dedicated vignette + ambient layers |
| **Typography** | Section kickers (`01 — …`) on every block; `.type-section` titles; mono labels for meta |
| **Chrome** | Flat borders (`--control-border`), cyan on hover/active; no elevated cards or heavy shadows |
| **Grid discipline** | One `.site-shell` rail; one `site-section-grid` per section; boundaries from `HOME_SECTION_BOUNDARIES` |

### Interaction language

| Surface | Hover / peek | Cursor feedback |
|---------|--------------|-----------------|
| Project cards | Cyan frame + title/link shift | Magenta dimensions + ring |
| `WorkspaceFrame` panels | Selection outline + dimensions | Magenta dimensions + ring |
| Buttons / flat controls | Cyan border wash | Action label (`INTERACT`) + ring |
| Nav / footer links | Ink lift + cyan underline | Action label (`NAVIGATE`) + ring |
| Section gutters | Cyan fills + pixel labels (hover or scroll peek) | — |
| Rulers (`lg+` home) | Crosshair + live coordinates synced to shell origin | Reticle fades to blend with ruler crosshair |

**Custom cursor** (`Cursor.tsx`, fine pointer only): 11px cyan reticle (crosshair + corner brackets), optional 3px trail dot, micro scale on click. `prefers-reduced-motion` disables trail and spring lag. Native cursor hidden via `html.custom-cursor-active`; text fields keep `cursor: text`.

### Motion tuning

- Reveal: `16px` Y offset, `0.45s`, precision easing — used by `Reveal` and card entrances
- No bounce or overshoot; reduced motion disables marquee, scroll-linked process, and dimension line draws
- Section scroll peek: ~900ms dwell before gutter labels appear on coarse pointers

### Full-bleed exceptions (intentional)

- Process horizontal scroll track (`site-track-pad`)
- Tech Stack marquee rows (`tech-stack-bleed`)
- Hero background textures (vignette, portrait backdrop on mobile)

These bleed past `.site-shell` but still inherit stripe texture and edge fades that match the workspace.

## Responsive & mobile

**Breakpoints:** [`lib/breakpoints.ts`](lib/breakpoints.ts)

| Token | Width | Grid columns |
|-------|-------|--------------|
| default | < 640px | 6 |
| `sm` | 640px+ | 8 |
| `lg` | 1024px+ | 24 |

Below `lg`: content uses `col-span-full`. Editorial spans apply at `lg+` only.

### Section mobile behavior

| Section | Mobile | Desktop (`lg+`) |
|---------|--------|-----------------|
| Hero | Overlay portrait, panel copy | Fixed hero, grid portrait |
| Works | Single-column stack | Alternating 11-col layout |
| Services | Card stack | Sticky overlapping cards |
| Tech Stack | Marquee (static grid if reduced motion) | Marquee rows |
| About | Stacked bio + experience | Two-column layout |
| Footer | Stacked cells + safe-area padding | Utility row + three columns |

### Touch & safe area

- Minimum target: **44×44px** (`min-h-11`)
- `--mobile-bottom-controls: env(safe-area-inset-bottom)` until `lg`
- `viewport-fit=cover` in layout
