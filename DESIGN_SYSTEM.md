# Design System — Figma Workspace

The portfolio is styled as an inspectable **Figma workspace**: rulers, always-on 24px square canvas grid, frame selection, spacing highlights, and flat minimal UI surfaces.

**Figma source of truth:** [Zeina Nossier — Desktop `351:658`](https://www.figma.com/design/2NERBh1syy9sgilPcn1qxz/%F0%9F%91%A9%F0%9F%8F%BB%E2%80%8D%F0%9F%92%BB-Zeina-Nossier?node-id=351-657) (Components `410:1793`).

**Tokens:** [`app/globals.css`](app/globals.css) · **Contract:** [`lib/theme-contract.ts`](lib/theme-contract.ts) · **Layouts:** [`lib/grid-layout.ts`](lib/grid-layout.ts)

## Theme philosophy

| Layer | Treatment |
|-------|-----------|
| **Canvas** | Near-black `#0a0a0a` with always-on 24px square grid |
| **Ink** | Warm white `#f0ece4` |
| **Accent** | Cyan `#58bfe8` — rulers, selection borders, dimensions |
| **Spacing** | Magenta `#ff4fa3` — padding/gap fills on inspect |
| **Controls** | Flat panels with simple borders; no elevated shell chrome |
| **Hero** | Intro + Portrait frames; inspect chrome settles when scrolled past |

**Not this theme:** mission control, blueprint/ASCII paper, generic editorial magazine, heavy inset shadows, purple gradients, glow orbs.

Dark-only at `:root`. No theme toggle.

## Layout foundation

All section content aligns to a single margin rail via `.site-shell`.

### Grid multiple contract (hard rule)

Baseline **U = 24px** (`--grid-unit` / `--workspace-grid-lines-size`). Every laid-out measure must be **`n×24` only** (n = 0,1,2,…): width, height, gap, margin, padding, Frame Name offsets, outside W×H clearance. Express as `calc(var(--grid-unit) * N)` — **no orphan px, no half-steps** (no `*2.5`, `12px` layout pads, etc.). Typography font-sizes may follow Figma type (e.g. 12px mono labels).

**Hover clearance:** Section / sticky panels reserve extra top inset (`padding-top` includes `--frame-tab-offset`) so Frame Name chips, resting labels, and outside dimensions never clip.

| Viewport | Page pad | Cell pad | Min control | Columns |
|----------|----------|----------|-------------|---------|
| Mobile (&lt;640) | **24** (1U) | 24 | **48×48** (2U) | 6 |
| Tablet (640–1023) | **24** | 24 | 48 | 8 |
| Desktop (`lg+`) | **72** (3U) | 24 | 48 | 24 |

| Token | Purpose |
|-------|---------|
| `--grid-unit` | 24px square baseline |
| `--site-padding-inline` | Page pad: 24 → 24 → 72 |
| `--cell-padding-inline` / `--cell-padding-block` | Always 24 (decoupled from page pad) |
| `--layout-shell-max` / `--site-max-width` | Max content width (`1440px`) |
| `--layout-inline-start` | Computed left edge of shell content (padding + centering) |
| `--ruler-size` | Ruler track (= `--grid-unit` = 24) |
| `--nav-shell-height` | 72 mobile / 96 desktop; `--chrome-top` includes ruler at `lg+` |
| `--hero-portrait-width` / `--hero-portrait-height` | 720×480 (30U × 20U) |
| `--works-card-media-height` | 312 (13U) |
| `--process-card-width` / `--process-card-height` | 480×384 (20U × 16U) |
| `--tech-tile-size` | 192 (8U) |

**Grid columns:** 6 (mobile) → 8 (tablet) → 24 (desktop). Layout definitions live in [`lib/grid-layout.ts`](lib/grid-layout.ts) (`HOME_LAYOUTS`); boundaries derive to [`lib/grid.ts`](lib/grid.ts) (`HOME_SECTION_BOUNDARIES`) and Tailwind classes to [`lib/grid-spans.ts`](lib/grid-spans.ts). Run `npm run validate:grid` to assert all three stay in sync.

**Boundary convention:** value `N` = vertical guide at the start of column `N + 1` (after column `N`). A cell `{ start: 11, span: 14 }` contributes boundary `10` on its left edge.

**Components:** use [`GridCell`](components/GridCell.tsx) or `layoutClass('hero', 'copy')` from `grid-layout` — never hand-roll `lg:[grid-column:…]` in section files.

**Guide lines:** [`GridGuideLayer`](components/GridGuideLayer.tsx) renders lines as `.site-grid` items (same grid mechanism as content), not absolute percentages — so overlays cannot drift from content edges.

**Standard section composition (inspect ladder):**

```
Hero intro (editorial on grid):
  Plain typography in grid cell — no WorkspaceFrame, no spacing overlays

Hero portrait (desktop hover outline):
  WorkspaceFrame inspectMode="hover" inspectDepth="outline" — corner nodes + frame tab only

Works (hover full inspect):
  SectionLayout persistentGuides + WorkspaceFrame inspectDepth="full"

Expertise cards (hover outline → full on hover):
  Default outline; promotes to full W×H + measurement lines on hover
  frameLabel uses service number (01), not title

Process / Tech Stack (hover outline only):
  WorkspaceFrame inspectDepth="outline" — frame tab + corner nodes, no spacing fills

About CV panel (hover full inspect):
  WorkspaceFrame inspectDepth="full" on experience list — W×H updates on row expand

About intro / Footer (editorial):
  Panel surfaces only — no WorkspaceFrame

Mobile (present mode):
  No custom cursor, no outside measurements; hero portrait inspectMode="off"
```

Hero column guides limited to content boundaries `[8, 10]` on desktop (not full section edges).

Section column guides fade in on enter for sections below Works; Works keeps `persistentGuides`.

`WorkspaceFrame` hard-disables `showSpacing` / `showPadding` when `inspectDepth="outline"`. Frame tab hides when outside measurement lines are active (avoids tab/ruler collision).

Global workspace chrome (home only): `DesignRulers` (section band ticks always visible) + `GridOverlay` edge/center only (`[0, 12, 24]`) at reduced opacity in [`AppShell`](components/AppShell.tsx). Section-specific column splits come from `SectionGridLines` via `SectionLayout` — not duplicated in the global overlay.

Shared grid guide rendering: [`components/GridGuideLayer.tsx`](components/GridGuideLayer.tsx) — used by hero `SectionGridLines` and global `GridOverlay`.

**Full-bleed exceptions:** Process horizontal scroll track (`site-track-pad`) at `lg+`, hero background textures. Tech Stack is a contained auto-fit grid (no marquee).

### Atmosphere (secondary layer)

Figma is flatter; the live site keeps soft ambient washes + selective dotted fills — dialed down so the 24px square baseline stays primary.

| Keep | Skip |
|------|------|
| Soft cyan radials on canvas/subtle sections (~50–60% prior opacity) | Loud multi-layer washes over content |
| `.workspace-grid-dots-fill` on Works/Expertise/Process cards, tech tiles, service artifact wells | Body-wide dots, nav, footer, hero bare copy |
| Hero edge fade for copy-on-media | Ambient on nav / footer |

Tune intensity via `--ambient-cyan-*` and `--workspace-grid-dots-fill-opacity` only.

## Grid enforcement

**Rule:** Every home section child must use [`GridCell`](components/GridCell.tsx) / `layoutClass()` backed by [`lib/grid-layout.ts`](lib/grid-layout.ts). Tailwind literals in [`lib/grid-spans.ts`](lib/grid-spans.ts) must match `HOME_LAYOUTS` (validated by `npm run validate:grid`). No ad-hoc `max-width`, negative margins, or absolute positioning that breaks shell alignment.

| Do | Don't |
|----|-------|
| Hero intro: plain text on grid canvas | WorkspaceFrame + always-on spacing on hero copy |
| Hero portrait: hover outline only | Always-on full inspect bleeding into Works |
| Works cards: `inspectDepth="full"` hover measurements | Plain `Panel` without hover frame nodes |
| Expertise: sticky cards as direct flex siblings (no Reveal wrapper on lg) | Reveal wrapper breaking sticky stack |
| Expertise/Process/Tech: `inspectDepth="outline"` without spacing fills | Nested SpacingGuide inside WorkspaceFrame |
| About CV: `WorkspaceFrame inspectDepth="full"` on experience panel | Plain Panel without hover W×H |
| Every home section: `SectionLayout` + `HOME_SECTION_BOUNDARIES` | Ad-hoc boundaries or missing section grid lines |
| `GridCell` / `layoutClass()` for column placement | Hand-rolled `lg:[grid-column:…]` per file |
| Global overlay: edge + center only (`[0, 12, 24]`) | Triple-stacked 11/13 lines in global + section overlays |
| Scroll hints / CTAs as grid cells (`gridSpans.hero.scrollHint`) | `absolute bottom-0 right-0` for layout |
| Internal cell padding via `--section-padding-inline` | Extra horizontal padding on `.site-shell` children |
| Full-bleed via `-mx-[var(--site-padding-inline)]` on `col-span-full` only | Arbitrary `-mx` on content blocks |

**Navigation grid (desktop):** logo col 1 (`justify-self: start`, flush with shell left edge), links cols 9–16, controls cols 21–24.

**Section headings:** single-line format — `01 — Selected Works` via `SectionHeading title="…"`; align to column 1; track line extends right within the heading row.

## Surface rhythm

Body carries the always-on **24px square** lattice. Sections may add a light local square overlay or soft wash; panel dots are local only.

| Section | Class | Background | Texture |
|---------|-------|------------|---------|
| Hero | full bleed | `#0a0a0a` | Square lines (`.hero-canvas-grid`) + edge fade |
| Works | `subtle` | `#141414` | Soft wash; card panels get dots |
| Expertise | `canvas` | `#0a0a0a` | Soft wash; card panels + artifact wells get dots |
| Process | `subtle` | `#141414` | Sticky-shell squares at `lg+`; card panels get dots |
| Tech Stack | `canvas` | `#0a0a0a` | Soft wash; tiles get dots |
| About | `subtle` | `#141414` | Soft wash |
| Footer | `footer` | `#0a0a0a` | Flat chrome (no dots) |

**Ambient lighting:** reduced via `--ambient-cyan-*` tokens. Hero uses `.hero-edge-fade` for readable copy over media.

**Shell bars (nav, detail nav):** flat — no grid texture overlays.

## Workspace grid textures

| Pattern | Opacity token | Use |
|---------|---------------|-----|
| Square lines | `--section-grid-square-opacity` (~28%) | Canvas sections, hero, footer |
| Dot grid | `--section-grid-dot-opacity` (~24%) | Body, subtle sections |
| Column guides | `--grid-line-color` at ~42% layer opacity | `SectionGridLines`, `GridOverlay` |

| Surface | Grid |
|---------|------|
| `body` | Square lines, 24px (always on) |
| `.hero-canvas-grid` | Square lines (elevated opacity) |
| `.section--canvas`, `.section--footer` | Square lines via `::before` |
| `.section--subtle` | Square lines via `::before` (72% opacity) |
| `.workspace-grid-dots-fill` on panels | Dot grid, 12px |

## Inspection UI

| Component | Role |
|-----------|------|
| `DesignRulers` | Scroll-synced cyan ticks; section band markers always visible; edge markers on frame hover |
| `GridOverlay` | Edge + center column guides only (`[0, 12, 24]`); decorative workspace chrome |
| `GridGuideLayer` | Shared line renderer for section guides + overlay |
| `SectionGridLines` | Per-section column guides from `HOME_SECTION_BOUNDARIES` |
| `SelectionOutline` | Cyan 1px frame + square corner handles |
| `SpacingGuide` | Magenta padding/gap fills; cyan gutter fills with pixel labels |
| `MeasurementOverlay` | Cyan dimension lines with arrow caps; `labelPlacement="outside-*"` for hero/cards |
| `WorkspaceFrame` | Card/panel frame with `variant="figma"` (hero) or hover inspect on cards |
| `Cursor` | Figma collaborator cursor: cyan arrow + badge (`YOU` idle; OPEN / W×H / INSPECT on target) |

Mounted from `AppShell` on non-studio routes.

### Rulers

- Corner origin square (`14×14px`) — horizontal and vertical tracks do not overlap
- Horizontal track starts at `--ruler-size`; vertical track starts below chrome + ruler
- Ticks scroll-sync via `useScrollOffset`; horizontal zero at `.site-shell` left edge
- **Section band ticks** always visible on vertical ruler for all home sections (Works → Footer)
- Edge markers appear when hovering any `.workspace-frame`
- Labels at 192px intervals (8 × 24px baseline) with padding to prevent clipping
- Ruler crosshair disabled (contextual cursor handles pointer feedback)

### Spacing highlight rules

| Context | Fills | Labels | Trigger |
|---------|-------|--------|---------|
| Hero copy/portrait gutter | Cyan | Yes | Fine pointer always; scroll peek on touch |
| Section column splits (Works, About, Services, Footer) | Cyan | Yes | Hover / scroll peek |
| Flex gaps in framed panels (cards, hero copy) | Magenta | Yes when ≥8px | Hover / scroll peek |
| Nav/footer link stacks | Magenta | Tooltip | Hover |
| Tech stack tiles | Off | Off | Outline only on hover |
| Marquee / full-bleed | Off | Off | Never |

Inline gap/gutter labels use plain `.measurement-text` (no pill/box). Padding/gap fills use stacked rgba bands so corners compound where bands overlap. Tooltips use `.measurement-tooltip` with matching border treatment.

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

- Copy + portrait: `WorkspaceFrame variant="figma"` with `measurementPlacement="outside"`
- Frame tab labels: **Intro**, **Portrait** (`.frame-tab`, outside top-left — not inside panel chrome)
- Single 1px frame border + `SelectionOutline` corner nodes; no nested Panel border
- No portfolio kicker or role dash pseudo-element
- `GridOverlay` edge/center guides only; section splits from `SectionGridLines`

## Theme contract (enforcement)

Three layers — apply in order.

### Layer 1 — Workspace (always on)

| Element | Rule |
|---------|------|
| Body / viewport | Fixed `.canvas-grid-overlay` + body fallback |
| Sections / cards / panels | Same 24px lattice in `background-image` (under text & media) |
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
| **Cards / components** (Works, Expertise, Process, About, Experience, Hero panels) | Hover: tab + outline + W×H | Scroll peek via section `inspectOnEnter` |
| **Whole sections** | No frame chrome / no W×H (Figma: heading chip only) | — |
| **Section gutters** | Labels + fills when card frame active | Section scroll peek |

### Component decision tree

```
Section layout?     → SectionLayout sectionId="…" + HOME_SECTION_BOUNDARIES (auto)
Section heading?    → SectionHeading chip (not section W×H chrome)
Interactive card?   → WorkspaceFrame inspectMode="hover" + SelectionOutline + measurements
Hero panels?        → WorkspaceFrame variant="figma" / bare; measurementPlacement="outside"
Flat tile (tech)?   → CSS hover border + label (optional WorkspaceFrame later)
Footer?             → Section variant="footer" + SectionLayout sectionId="footer"
Measurements?       → Cards/components only (MeasurementOverlay); never whole sections
Cursor?             → Cursor (cyan arrow + badge); contextual label by hover target
```

### Do / Don't

| Do | Don't |
|----|-------|
| Single `site-section-grid` per section | Sibling grids for heading + content |
| `GridGuideLayer` for all guide overlays | Per-component line math |
| Hero: `inspectMode="always"` + panel copy | Bare hero text without frame |
| Gutter labels on inspect | Always-on labels everywhere |
| `npm run dev:webpack` if Turbopack cache corrupts | Parallel `dev` + `build` |
| For per-instance position/padding overrides on a `<section>`, check whether a plain `.section`/`.section--*` rule in `globals.css` already sets that property | Assume a single-class Tailwind utility (`lg:fixed`, `pb-10`, `py-0`) on the element will win — unlayered custom CSS is emitted after Tailwind's utilities, so at equal specificity it wins by source order regardless of the class list. If you need to override, either target a more-specific selector (`.hero-section.section`) or restate the real value directly in the custom rule (see `.section--footer`, `.section.py-0`) |

## Text hierarchy

| Class | Role |
|-------|------|
| `.type-display` | Hero name |
| `.type-title` | Card titles |
| `.type-label` | Kickers, nav |
| `.type-meta` | Dates, tags |

Semantic: `.text-secondary`, `.text-muted`, `.text-faint`, `.text-on-media`

## Flat controls

Figma Button `352:414` / Icon Button `352:458`:

| State | Border | Background | Text / icon |
|-------|--------|------------|-------------|
| Default | `#6b6b6b` (1.5px text / 1px icon) | transparent | `#dedede` |
| Hover | `#58bfe8` | `rgba(88,191,232,0.2)` | `#ffffff` |
| Pressed | `#58bfe8` | `rgba(88,191,232,0.5)` | `#ffffff` |

- `.flat-control` — text button (48h, px-16 py-12, Geist Mono 12 Medium, tracking 4px)
- `.flat-control-icon` — 48×48 icon button (1px border)
- `.flat-control-accent` — default cyan border (same hover/pressed fills)
- `.panel` — bordered frame surfaces with dot grid fill
- `.editorial-nav-shell` — flat nav bar

## Project Type (Figma `398:7046`)

| Type | Order | Copy |
|------|-------|------|
| External Link (Default) | label → `open_in_new` icon | `EXTERNAL LINK` |
| Case Study | `folder_open` icon → label | `CASE STUDY` |

Geist Mono Regular 12 / tracking 2px / `#a8a8a8` (`--figma-meta`). Height 24, gap 8. Color does not change on card hover.

## Card hover states (Figma)

Shared pattern for Project Card, Expertise, Process, Tech Stack, About Me, Experience:

| Layer | Default | Hover |
|-------|---------|-------|
| Surface | `#0f0f0f`, no cyan edge | Solid `1px #58bfe8` border |
| Titles / body | White / `#a8a8a8` | **Unchanged** (no cyan text) |
| Frame tab | Rest label | Active chip + corner nodes (inspect chrome) |
| Tech label | Hidden | Visible `#a8a8a8` |

No translateY lift. Title/meta recolor on hover is incorrect.

## Motion

Shared tokens in [`lib/motion.ts`](lib/motion.ts) · CSS `--motion-ease-precision` · `Reveal` component.

| Token | Duration | Use |
|-------|----------|-----|
| `hover` | 0.18s | Hover states, card overlays, link color |
| `overlay` | 0.2s | Inspection outlines, measurement labels, section bounds |
| `fade` | 0.35s | Ruler fade-in, general opacity |
| `reveal` | 0.42s | Scroll reveals, section entrances |
| `flash` | 0.35s | Ruler crosshair, guide flashes |
| `draw` | 0.5s | Dimension line / draw-in animations |
| `stagger` | 0.05s | Sibling reveal delay |
| `menu` | 0.28s | Mobile menu open/close |
| `cursor` | 0.12s | Custom cursor badge + press scale |

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
| Project cards | Cyan frame + corner nodes + outside W×H + blur reveal + `.card-lift` elevation | `OPEN` readout |
| Services cards | Same frame treatment + `.card-lift` elevation | `INSPECT` readout |
| Expertise / Process / Tech tiles | Outline + frame tab on hover only (no corner handles — `workspace-frame--outline-only`) | `INSPECT` readout |
| `WorkspaceFrame` (hero) | Always-on outside measurements | `INSPECT` readout |
| Buttons / flat controls | Cyan border wash | `INTERACT` + ring |
| Nav / footer links | Ink lift + cyan underline/hover | `NAVIGATE` + ring |
| Section gutters | Cyan fills + pixel labels (hover or scroll peek) | — |
| Rulers (`lg+` home) | Section bands always on; edge markers on frame hover | Reticle snaps to pointer (no trail) |

**Custom cursor** (`Cursor.tsx`, fine pointer only): Figma-style collaborator pointer — cyan arrow with white stroke + cyan pill badge (`YOU` at rest; swaps to OPEN / W×H / INSPECT / … on targets). Tip sits on the pointer position; badge offsets bottom-right. `prefers-reduced-motion` disables decorative motion. Native cursor hidden via `html.custom-cursor-active`; text fields keep `cursor: text`.

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

- Minimum target: **48×48px** (`min-h-12` / `h-12 w-12`) — 2× grid unit; never 44
- `--mobile-bottom-controls: env(safe-area-inset-bottom)` until `lg`
- `viewport-fit=cover` in layout

## Changelog

### 2026-07 — Production polish redesign

Production-readiness and visual-elevation pass; no content or section-order changes.

- **Removed** the "under construction" ribbon and its layout reservation (`--ribbon-height: 0`); site now reads as complete, not WIP.
- **Fixed** figma-variant frame borders on Works/Services/Process cards (`.figma-surface`) and `.project-preview-frame` — hover/focus border feedback was previously invisible (`border-color` set with no `border-width`).
- **Wired** proper OG/Twitter image (`1200×630`), full favicon/manifest icon set, and `robots.ts` disallow for `/studio` + `/api`.
- **Added** on-brand `not-found.tsx` and `error.tsx` boundaries.
- **Hardened accessibility**: Lenis smooth scroll now gates on `prefers-reduced-motion`; mobile nav has a focus trap + focus restore; `text-faint` swapped for `text-muted` on categories/meta/labels that failed AA contrast; footer links meet 48×48px tap targets; Services heading corrected to `<h3>`.
- **Consistency**: Hero CTA and Services demo buttons normalized to the standard `Button` component; hardcoded motion durations replaced with `lib/motion.ts` tokens (added `menu`, `cursor`); `workspace-frame--outline-only` given real styling (hides corner handles, dims border) instead of being dead CSS.
- **Elevation**: added `.card-lift` hover/focus elevation to Works/Services cards, a curated gradient overlay on project preview images, refined cursor reticle contrast, and real section-shaped skeleton loading states (`SectionSkeleton.tsx`) replacing bare `min-h-[40vh]` placeholders.
- **Resilience**: `lib/projects.ts` now falls back to local mock projects (adapted to the `Project` shape) if Sanity is unreachable or empty; `Works.tsx` has a designed empty state for the zero-projects case; `Services.tsx` derives a rotating default visual (component-spec / type-scale / tool-grid) when Sanity services lack a `visual` field.

### 2026-07 — Grid cleanup & magenta restoration

- **Grid**: home-page shell edges no longer double-drawn — `GridGuideLayer`/`SectionGridLines` gained an `includeShellEdges` prop, off by default for home sections (the fixed `GridOverlay` already owns those), on for `ProjectDetailPage` (no page-level overlay there).
- **Magenta**: restored to match the intent already documented in the table above (persistent in Hero, hover/scroll-peek elsewhere) — `Hero`'s Intro frame, and Works/Services/Process cards, now pass `showSpacing`/`showPadding`.
- **Fixed a real bug this surfaced**: `WorkspaceFrame`'s `showSpacing` nested `SpacingGuide` *inside* the padded/flex surface element rather than replacing it, so `showPadding` always measured 0 and, on cards using `flex-1` children (Works' image), inserted a non-flex `div` that broke the flex context — the image stopped filling the card the moment `showSpacing` was enabled. Fixed by merging the surface/padding classes directly onto `SpacingGuide`.
- `SpacingGuide` gained an `active` prop so the frame's own hover state (not just pointer/scroll-peek) can gate overlay visibility — this is what keeps Works/Services/Process hover-only while Hero stays persistent.

### 2026-07 — Hero fixed-section bleed-through fix

- Bringing Hero's persistent frame back (above) surfaced a real bug: Hero is `position: fixed` at `lg`, so it never leaves the viewport, and its `inspectMode="always"` state isn't scroll-aware — its dimension pills, "INTRO"/"PORTRAIT" frame tabs, and internal column dividers (8/11) kept rendering into the nav-clearance gap above every section below it (visible as stray labels/lines floating above Works, Process, About, etc.).
- Added `useElementReachedTop(elementId, bufferPx)` (`hooks/useScrollOffset.ts`) — a real "is the next section now in focus" signal via `getBoundingClientRect()`, since a plain `IntersectionObserver` can't see a fixed element leave the viewport (it never does).
- Hero's two `WorkspaceFrame`s now disengage (`inspectMode: 'off'`) once `#works` reaches the top of the viewport, re-engaging smoothly on scroll-up.
- `SectionGridLines` gained a `visible` override (`SectionLayout`'s `guidesVisible`) that bypasses `persistentGuides` entirely, since the observer-based fallback has the same fixed-element blind spot — Hero's own column lines now fade out in sync with its frame UI instead of persisting page-wide.

### 2026-07 — Hero grid-line alignment fix

- **Root cause**: `GridGuideLayer`'s `LineLayer` positioned its guide lines as `absolute` children of `.site-shell` itself. Percentage `left` values resolve against the shell's *padding box* (including `padding-inline`), but the real `.site-grid` content lives inside the *content box* — so every guide line was offset by the shell padding (~32px at desktop), and Hero's copy/portrait divider was ~53px off (cutting through the portrait photo).
- **Fix**: moved the positioning context to a plain inner `relative` div that is a normal-flow child of `.site-shell`, so line percentages resolve against the same content-box width as `.site-grid`. Applied to all three `site-shell` wrappers in `GridGuideLayer` and `GridOverlayLayer`.
- **Hero boundary**: corrected `HOME_SECTION_BOUNDARIES.hero.desktop` from `[0, 8, 11, 24]` to `[0, 8, 10, 24]` so the copy/portrait divider lands on grid line 11 (portrait's left edge), matching `gridSpans.hero.portrait`'s `11 / span 14`.
- Verified at 1440px and 1920px: portrait left edge and copy right edge now align to their nearest guide lines within ~0.5px (sub-pixel).

### 2026-07 — Layout foundation rebuild

- **Single source of truth:** [`lib/grid-layout.ts`](lib/grid-layout.ts) defines `HOME_LAYOUTS` (typed cell placements + guide boundaries per section/breakpoint). [`lib/grid.ts`](lib/grid.ts) and [`lib/grid-spans.ts`](lib/grid-spans.ts) derive from it; `npm run validate:grid` asserts literals stay in sync (Tailwind JIT requires literal class strings in source).
- **Grid-native guide lines:** `GridGuideLayer` `LineLayer` now renders vertical guides as `.site-grid` column items with `border-l`/`border-r` instead of `position: absolute; left: X%` — same grid mechanism as content, inside the shell content box.
- **`GridCell` component:** Hero, Nav, Works, Expertise, About, and Footer migrated to `GridCell` / `layoutClass()` instead of scattered `gridSpans.*` imports.
- **Process track:** card width and gap now use global `--site-grid-col-width` (removed duplicate `--process-col-width` calc).
- **Cleanup:** removed unused `mobile-grid-*` CSS classes from `globals.css`.
