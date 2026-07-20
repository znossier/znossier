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

**No hugging — snap to the line, round up, never clip.** A frame's width and height are never left to "hug" (auto-size to) its content when that would land between grid lines. Every frame edge must land exactly on a grid line:

- If a frame's natural content size falls between two grid lines, its box must be set to the **next line up**, never the nearest line down — extra whitespace inside the frame is always acceptable; clipping, cramming, or an off-grid edge is not.
- This applies to any box with a visible edge — cards, panels, images/photos, icon tiles, avatars, chips/badges, tabs — not just outer section frames.
- **Padding is exempt once the frame's outer size is already fixed.** `.flat-control` (Figma `352:414`, h-48 px-16 py-12) and `.flat-control-icon` (Figma `352:458`, 48×48 p-12) use literal Figma padding values (16/12), not grid multiples — because the *frame* they sit in is already an explicit on-grid size (`h-12`; callers set fixed on-grid widths like `w-[120px]` where the label is known), the padding never determines an edge and is cosmetic/typographic, exactly like font-size. Don't "fix" these back to `px-[var(--grid-unit)]` — 16/12 is the confirmed spec, verified against Figma `352:304`.
- **Accepted exception:** controls whose width is driven by *variable, arbitrary-length* text may still hug horizontally, because no fixed CSS width can be correct for unknown future copy. Their fixed dimension (height) must still stay on-grid (`h-12`). Any control whose label set is fixed/known (icon buttons, single-word chips) doesn't need this exception — give it an explicit on-grid size instead.

**Hover clearance:** Section / sticky panels reserve extra top inset (`padding-top` includes `--frame-tab-offset`) so Frame Name chips, resting labels, and outside dimensions never clip.

| Viewport | Page pad | Cell pad | Min control | Columns |
|----------|----------|----------|-------------|---------|
| Mobile (&lt;640) | **24** (1U) | 24 | **48×48** (2U) | 6 |
| Tablet (640–1023) | **24** | 24 | 48 | 8 |
| Desktop (`lg+`) | **72 start / 48 end** (asymmetric — see below) | 24 | 48 | 24 |

**Desktop rail is asymmetric, not 72/72.** Every section's Figma "Frame 78" sits at `x=72, width=1320` inside its 1440-wide header (confirmed across Nav/Works/Expertise/Process/TechStack/About) — i.e. `pl-72 / pr-48`, not a symmetric `72/72`. This is the site-wide `.site-shell` rule (`--site-padding-inline` start / `--site-padding-inline-end` end), not a nav-only patch. Outer shell max-width is therefore **1440** (`72 + 1320 + 48`), matching Figma's actual desktop frame width — not `1464`.

| Token | Purpose |
|-------|---------|
| `--grid-unit` | 24px square baseline |
| `--site-padding-inline` | Page pad start: 24 → 24 → 72 |
| `--site-padding-inline-end` | Page pad end: 24 → 24 → **48** (desktop only — asymmetric rail) |
| `--cell-padding-inline` / `--cell-padding-block` | Always 24 (decoupled from page pad) |
| `--site-content-width` | Desktop content box **1320** |
| `--site-max-width` / `--layout-shell-max` | Content + rails (`72 + 1320 + 48 = 1440`) |
| `--layout-shell-start` | Centered shell outer edge — **lattice origin** |
| `--layout-inline-start` | Content rail left edge |
| `--ruler-size` | Ruler track (= `--grid-unit` = 24) |
| `--nav-shell-height` | 72 mobile / 96 desktop; `--chrome-top` includes ruler at `lg+` |
| `--hero-portrait-width` / `--hero-portrait-height` | 720×480 (30U × 20U) |
| `--works-card-media-height` | 312 (13U) |
| `--process-card-width` / `--process-card-height` | 480×384 (20U × 16U) |
| `--tech-tile-size` | 144 (6U) — genuinely 144×144 in the real placed Figma instances, not a scaled-down deviation from a 192 master |
| `--tech-tile-gap` | 48 (2U) — tile pitch is 192 (144 + 48), not 24 |
| `--tech-row-gap` | 72 (3U) — row2 top(264) − row1 bottom(192) = 72 |
| `.tech-stack-logo-slot` | 72×72 icon container inside the 144 tile (Figma `467:1365`/`467:1459`) — not 48 |
| Tech Stack hover gap | Literal `12px` between icon and label (Figma `467:1360`) — not the 24px grid unit |
| `--expertise-visual-width` / `--expertise-visual-height` | 384×216 (16U × 9U) |

**Per-section fixed inner bands (confirmed via Figma instance coordinates, not the abstract 24-col grid):**

| Section | Inner band | Items |
|---------|-----------|-------|
| Works | 1224px, inset 48/48 | Two 576px cards, 72px gap |
| Process | 1224px, inset 48/48 | 480px cards, 48px gap, overflowing carousel track |
| Tech Stack | 1224px, inset 48/48 (rows only — marquee itself is intentionally edge-to-edge) | 144px tiles, 48px gap, 72px row gap |
| Expertise | 1200px, inset 48 left / 72 right | Single 1200px-wide card per row |
| About | 1200px, inset 48 left / 72 right | Two 576px cards (About Me + Experience), 48px gap |
| Footer | **Not the standard rail** — `pl-24 / pr-0` fluid `repeat(3, 1fr)` grid (see Footer section below) |

These are implemented as literal fixed-pixel widths/margins in each component (`Works.tsx`, `Services.tsx`, `About.tsx`), not the proportional `HOME_LAYOUTS` 24-column spans — the old `works`/`about` cell defs in `lib/grid-layout.ts` approximated these with ~605px/110px-gap math that doesn't match Figma's literal 576/72 (or 576/48) numbers, so the sections now size themselves directly instead of going through `layoutClass()`.

**Grid columns:** 6 (mobile) → 8 (tablet) → 24 (desktop). Layout definitions live in [`lib/grid-layout.ts`](lib/grid-layout.ts) (`HOME_LAYOUTS`); Tailwind classes in [`lib/grid-spans.ts`](lib/grid-spans.ts). Run `npm run validate:grid` to keep them in sync.

**Components:** use `layoutClass('hero', 'copy')` from `grid-layout` (or `gridSpans`) — never hand-roll `lg:[grid-column:…]` in section files.

**Standard section composition (inspect ladder):**

```
Hero copy: editorial on grid (WorkspaceFrame optional / focus-gated)
Hero portrait: WorkspaceFrame inspect on fine pointer when in focus
Works / About: WorkspaceFrame inspectDepth="full" on hover
Expertise: outline by default → full W×H + measurements on hover; sticky card stack on lg
Process / Tech: inspectDepth="outline"
Footer: full-bleed 3×2 table (no WorkspaceFrame)
Mobile: no custom cursor; hero portrait inspectMode="off"
```

`WorkspaceFrame` hard-disables `showSpacing` / `showPadding` when `inspectDepth="outline"`.

**Global workspace chrome (home):** the 24px lattice (`--workspace-square-grid`, origin `--layout-shell-start`) is painted exactly **once** for the whole page by [`WorkspaceGrid`](components/WorkspaceGrid.tsx) — a single `position: absolute; inset: 0` overlay mounted once in [`AppShell`](components/AppShell.tsx), sized to `body`'s full content height (`body` carries `position: relative` for this). It sits at `z-index: 30`: above every `.section` / `.section-sticky-shell`'s own background and content (so the lattice reads as one continuous canvas grid over the whole page, not tucked behind cards per section), below the nav (`z-50`), `DesignRulers` (`z-40`), and the custom cursor. No column-guide overlays (`GridOverlay` / `GridGuideLayer` / `SectionGridLines` removed — those were a different, decorative system).

**Why one overlay instead of per-section painting (previous approach, removed):** sections used to each paint their own copy of the lattice as a local CSS background, because a background layer painted *inside* an opaque element automatically sits below that element's own children — no z-index math needed. The catch: `scroll`-attachment paints from each element's own local `(0,0)`, which only stays seamless with the section above it if that element's real document `offsetTop` happens to land on an exact 24px multiple — never guaranteed for `100svh`-sized sections on arbitrary device heights. That needed a runtime `GridPhaseSync` component measuring every section's `offsetTop` on mount/resize/load and writing a correction into `--section-grid-phase-y` — real complexity just to keep seams from visibly jumping at section boundaries. A single page-wide overlay can't ever drift out of phase with itself (there's only one copy of the pattern), so both the per-section repaint and `GridPhaseSync` are gone entirely.

**Scroll:** sticky section shells use **page scroll** (`min-height`, no nested `overflow` / `data-lenis-prevent`). Process keeps horizontal scrub.

**Full-bleed exceptions:** Process track (`site-track-pad`) at `lg+`, footer 3×2, hero textures. Tech Stack runs two opposite-direction marquee rows of 144px tiles (static 9-up grid fallback under `prefers-reduced-motion`).

### Atmosphere (secondary layer)

Figma is flatter; the live site keeps soft ambient washes + selective dotted fills — dialed down so the 24px square baseline stays primary.

| Keep | Skip |
|------|------|
| Soft cyan radials on `.section--canvas` via `::after` | Loud multi-layer washes over content |
| `.workspace-grid-dots-fill` on card wells / tech tiles / artifacts | `background-attachment: fixed` on anything but `body` |
| Hero edge fade for copy-on-media | Ambient on nav / footer |

Tune intensity via `--ambient-cyan-*` and `--workspace-grid-dots-fill-opacity` only.

## Grid enforcement

**Rule:** Every home section child must use `layoutClass()` backed by [`lib/grid-layout.ts`](lib/grid-layout.ts). Tailwind literals in [`lib/grid-spans.ts`](lib/grid-spans.ts) must match `HOME_LAYOUTS` (validated by `npm run validate:grid`). No ad-hoc `max-width`, negative margins, or absolute positioning that breaks shell alignment.

| Do | Don't |
|----|-------|
| Hero intro: plain text on grid canvas | Always-on spacing chrome on hero copy |
| Works cards: `inspectDepth="full"` hover measurements | Plain `Panel` without hover frame nodes |
| Expertise: sticky cards as direct flex siblings (no Reveal wrapper on lg) | Nested panel scroll / `data-lenis-prevent` |
| Expertise/Process/Tech: `inspectDepth="outline"` without spacing fills | Nested SpacingGuide inside WorkspaceFrame |
| About: `WorkspaceFrame inspectDepth="full"` on both panels | Hard-coded 576px columns off the 24-col grid |
| `SectionLayout` + `layoutClass()` for column placement | Hand-rolled `lg:[grid-column:…]` per file |
| Lattice via `scroll` attachment on `.section` / sticky shells | `background-attachment: fixed` on sections (desyncs under Framer Motion transforms) |
| Scroll hints / CTAs as grid cells (`gridSpans.hero.scrollHint`) | `absolute bottom-0 right-0` for layout |
| Internal cell padding via `--cell-padding-*` | Extra horizontal padding on `.site-shell` children |
| Full-bleed via `-mx-[var(--site-padding-inline)]` on `col-span-full` only | Arbitrary `-mx` on content blocks |

**Section headings:** single-line format — `01 - Selected works` via `SectionHeading title="…"`; hairline track extends right.

## Surface rhythm

Every `.section` (and, at `lg+`, every `.section-sticky-shell`) paints the always-on **24px square** lattice, origin `--layout-shell-start`, `scroll` attachment. Flat panels/cards on top of that canvas (`.section-figma-panel`, `.figma-surface`, `.process-card-surface`, `.tech-stack-card`) are solid — no lattice — matching Figma's flat card surfaces sitting on a gridded canvas.

| Section | Variant | Background |
|---------|---------|------------|
| Hero | canvas (fixed at `lg+`) | `#0a0a0a` + lattice |
| Works → About | `canvas` | `#0a0a0a` + lattice + soft wash |
| Footer | footer | `#0a0a0a` full-bleed, **flat** (no lattice — matches Figma `407:1586`) |

Panel surfaces: `#0f0f0f` cards inside `#3d3d3d` section panels — flat, no lattice.
| Footer | `footer` | `#0a0a0a` | Flat chrome (no dots) |

**Ambient lighting:** reduced via `--ambient-cyan-*` tokens. Hero uses `.hero-edge-fade` for readable copy over media.

**Shell bars (nav, detail nav):** flat — no grid texture overlays.

## Workspace grid textures

| Pattern | Use |
|---------|-----|
| Square lattice | Always on every `.section` / sticky shell (`--workspace-square-grid`, origin `--layout-shell-start`, `scroll` attachment) |
| `.workspace-grid-dots-fill` | Local dots on cards / tech tiles / artifact wells only |

## Inspection UI

| Component | Role |
|-----------|------|
| `DesignRulers` | Scroll-synced cyan ticks; section band markers; edge markers on frame hover |
| `SelectionOutline` | Cyan 1px frame + square corner handles |
| `SpacingGuide` | Magenta padding/gap fills; cyan gutter fills with pixel labels |
| `MeasurementOverlay` | Cyan dimension lines with arrow caps; `labelPlacement="outside-*"` for hero/cards |
| `WorkspaceFrame` | Card/panel frame with `variant="figma"` or hover inspect |
| `Cursor` | Figma collaborator cursor: cyan arrow + badge |

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
| Full-bleed tracks | Off | Off | Never |

Inline gap/gutter labels use plain `.measurement-text` (no pill/box). Padding/gap fills use stacked rgba bands so corners compound where bands overlap. Tooltips use `.measurement-tooltip` with matching border treatment.

## Section layouts (desktop `lg+`)

| Section | Boundaries | Layout |
|---------|------------|--------|
| Hero | `[0, 8, 11, 24]` | Copy cols 1–8, portrait 11–24, gutter cols 9–10 labeled |
| Works | `[0, 11, 13, 24]` | Alternating 11-col cards; guides at cols 11 and 13 |
| Services | `[0, 6, 24]` | Heading cols 1–5, cards cols 7–24 |
| Process | `[0, 24]` | Full-width scroll track (special case) |
| Tech Stack | Full width | Two marquee rows, 144px tiles, gap 48 / row-gap 72 (static 9-up grid under reduced motion) |
| About | Fixed 576/48/576, inset 48 left | Bio + experience, `lg:flex-row`, not a proportional grid span |
| Footer | `[0, 8, 16, 24]` | Row 1: back-to-top cols 17–24; Row 2: three 8-col zones — **own `pl-24/pr-0` shell**, not the standard 72/48 rail |

Footer uses one `site-section-grid` with `SpacingGuide`; wrapped in `Section variant="footer"`. Its `SectionLayout` gets a `footer-shell` class that overrides `.site-shell`'s padding to Figma's real `pl-24 / pr-0` at desktop (confirmed via `407:1586` dev-mode: `grid-cols-[repeat(3,minmax(0,1fr))] pl-[24px]`, no right padding) — the 8/8/8-of-24 column math is unchanged since equal thirds are proportional regardless of container width.

## Hero

- Copy + portrait: `WorkspaceFrame variant="figma"` with `measurementPlacement="outside"`
- Frame tab labels: **Intro**, **Portrait** (`.frame-tab`, outside top-left — not inside panel chrome)
- Single 1px frame border + `SelectionOutline` corner nodes; no nested Panel border
- No portfolio kicker or role dash pseudo-element
- Lattice from body only (no column-guide overlays)

## Theme contract (enforcement)

Three layers — apply in order.

### Layer 1 — Workspace (always on)

| Element | Rule |
|---------|------|
| Body / viewport | Fallback `fixed` lattice (invisible in practice — sections are opaque + full-bleed) |
| Sections / sticky shells | Opaque fill **+ lattice**, `scroll` attachment only (never `fixed` — avoids drifting/doubled grids under Framer Motion transforms) |
| Home | `DesignRulers` only |
| Canvas sections | Opaque fill + ambient `::after` |
| Cards / panels | `.panel` / figma card + optional `.workspace-grid-dots-fill` |

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
Section layout?     → SectionLayout + layoutClass() / site-section-grid
Section heading?    → SectionHeading chip + hairline track
Interactive card?   → WorkspaceFrame inspectMode="hover" + SelectionOutline + measurements
Hero panels?        → WorkspaceFrame variant="figma" / bare; measurementPlacement="outside"
Flat tile (tech)?   → CSS hover border + label
Footer?             → Section variant="footer" full-bleed 3×2
Measurements?       → Cards/components only (MeasurementOverlay); never whole sections
Cursor?             → Cursor (cyan arrow + badge); contextual label by hover target
```

### Do / Don't

| Do | Don't |
|----|-------|
| Single `site-section-grid` per section content | Sibling competing grids for the same content |
| `layoutClass()` for column placement | Per-component absolute line math / deleted overlays |
| Page scroll for Works / Expertise / About | Nested `overflow` + `data-lenis-prevent` |
| Gutter labels on inspect | Always-on labels everywhere |
| `npm run dev:webpack` if Turbopack cache corrupts | Parallel `dev` + `build` |
| For per-instance position/padding overrides on a `<section>`, check whether a plain `.section`/`.section--*` rule in `globals.css` already sets that property | Assume a single-class Tailwind utility (`lg:fixed`, `pb-10`, `py-0`) on the element will win — unlayered custom CSS is emitted after Tailwind's utilities, so at equal specificity it wins by source order regardless of the class list. If you need to override, either target a more-specific selector (`.hero-section.section`) or restate the real value directly in the custom rule (see `.section--footer`, `.section.py-0`) |

## Text hierarchy

Figma Desktop `351:658` type roles (exact size/weight/tracking — not forced to 24px lattice):

| Class / token | Role | Spec |
|---------------|------|------|
| `.type-display` / `--type-display-*` | Hero name | Geist Bold 72 / lh 72 / tracking −3px |
| `.hero-role` / `--type-role-*` | Hero role line | Mono Medium 16 / lh 24 / tracking 4px |
| `.type-nav` / `--type-nav-*` | Nav links | Mono SemiBold 14 / tracking 1px |
| `.type-brand` / `--type-brand-*` | Brand wordmark | Mono ExtraBold 16 / tracking 2px |
| `.type-section` / `--type-section-*` | Section chips | Mono SemiBold 16 / tracking 2px |
| `.type-card-title` / `.type-title` | Project / Process titles | Mono Bold 20 / tracking 2px / lh 24 |
| `.type-expertise-title` | Expertise titles | Mono Bold 24 / tracking 2px |
| `.type-about-title` | About name | Mono Bold 24 / tracking 2px |
| `.type-about-bio` | About body | Geist Regular 14 / lh 20 / `#a8a8a8` / **no uppercase** |
| `.type-exp-role` | Experience role | **Geist Sans** Bold 18 / capitalize (not Geist Mono — Figma `479:2727` is `font-['Geist:Bold']`) |
| `.type-exp-group-company` | Experience current company | Geist SemiBold 18 |
| `.type-exp-company` | Experience company | Geist Regular **18** (not 16 — Figma `479:2734` is literally 18px, matching the role size) |
| `.type-exp-period` | Experience period | Mono Regular 14 / tracking 1px |
| `.type-meta` | Indexes / tags | Mono Medium 12 / tracking 2px / `#a8a8a8` |
| `.type-button` | Buttons | Mono Medium 12 / tracking 4px |
| `.footer-link` | Footer links | Mono SemiBold 14 / tracking 1px |
| `.footer-figma-heading` | Footer column heads | Mono Medium 12 / tracking 2px |
| `.footer-link--back` | Back to top | Mono SemiBold 16 / tracking 2px |

Semantic colors: `.text-secondary`, `.text-muted`, `.text-faint`, `.text-on-media`

**Layout shell (desktop):** content width **1320** (`--site-content-width`) + asymmetric rail pad **72 start / 48 end** → outer max **1440** (matches Figma's real desktop frame width). Lattice origin tracks `--layout-shell-start` so rails stay on the 24px grid when the shell is centered. Sticky sections use **page scroll** (min-height, no nested `overflow` / `data-lenis-prevent`).

## Flat controls

Figma Button `352:414` / Icon Button `352:458`:

| State | Border | Background | Text / icon |
|-------|--------|------------|-------------|
| Default | `#6b6b6b` (1.5px text / 1px icon) | transparent | `#dedede` |
| Hover | `#58bfe8` | `rgba(88,191,232,0.2)` | `#ffffff` |
| Pressed | `#58bfe8` | `rgba(88,191,232,0.5)` | `#ffffff` |

- `.flat-control` — text button (48h fixed / 2U, px 24 / 1U, Geist Mono 12 Medium, tracking 4px). Width hugs its label — labels are short/known strings, so this is an accepted exception to the "no hug" rule below (see Grid multiple contract)
- `.flat-control-icon` — 48×48 icon button (1px border), no internal padding — flex centering handles it
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

**Corner handles (`SelectionOutline`):** 12×12px, black fill, 1px cyan border, centered on each corner (Figma `352:654–657`) — previously implemented at 6×6px, fixed.

**Frame-tab chip text (`.frame-tab`):** letter-spacing is a literal `1px` (Figma `405:7604`), not `0.0625em` — fixed.

**Frame-tab chip vertical clearance:** only cards that also render an outside width ruler (Works/Expertise/About, `measurementPlacement="outside"` + `showMeasurementLines`) need the active chip lifted the full `-72px` to clear that ruler. Cards without one (Process, `showMeasurementLines={false}`) sit flush at `-48px` per Figma `463:1264` — `WorkspaceFrame` renders `.frame-tab--flush` in that case instead of the universal `-72px`.

**Project Card — resolved deviation:** Figma's Project Card (`388:7006`/`402:7472`) has no description text and no hover-reveal overlay in *any* state — just image (576×312) + title row (title + `ProjectType` badge) + tags row, with only the universal cyan-chrome hover. The previous implementation added a custom hover-triggered blur/scale + description-overlay reveal that Figma never specified; removed to match Figma exactly (the project's `description` field still renders as plain body text in the no-image fallback case, and is available on the case-study detail page).

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
| **Grid discipline** | One `.site-shell` rail; one `site-section-grid` per section; `layoutClass()` from `HOME_LAYOUTS` |

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

### 2026-07 — Footer grid fix + single-layer workspace grid

- **Footer "Navigation" column padding:** Figma's footer was rebuilt to land cleanly on the 24px grid (row heights now clean multiples: 96/312/408). Re-pulling its dev-mode spec surfaced one real diff: the "Navigation" column carries `pl-[48px] pr-[24px]` — double the left inset of Contact/Connect (`p-[24px]` uniform) — so its links line up with the site's true content-start line (the footer shell itself only reserves `24px`, not the usual `72px` other sections use). New `.footer-figma-cell--nav` override adds the extra `24px`.
- **Workspace grid is now one layer for the whole page, not per-`.section`:** replaced the per-section lattice repaint (`.section` / `.section--footer` / `.section-sticky-shell` each painting their own copy of `--workspace-square-grid`, kept in phase by a runtime `GridPhaseSync` component measuring every section's `offsetTop`) with a single [`WorkspaceGrid`](components/WorkspaceGrid.tsx) overlay: one `position: absolute; inset: 0` div sized to `body`'s full content height, mounted once in `AppShell`, `z-index: 30` (above all section content, below nav/rulers/cursor). `GridPhaseSync.tsx` deleted; `--section-grid-phase-y` removed. See "Global workspace chrome" above for the full rationale.

### 2026-07 — Figma-exact parity sweep (remaining sections)

Second-pass line-by-line diff of Works/Expertise/Process/Tech Stack/About/Footer against fresh Figma dev-mode pulls, plus a sitewide sweep for the "hard-coded dead asset path" bug class the Hero fix originally surfaced.

- **Frame-tab chip clearance is conditional, not universal:** Figma's active chip sits at `-72px` only on cards that also render an outside width ruler (Works/Expertise/About); cards without one (Process — confirmed via `463:1264`) sit flush at `-48px`. `WorkspaceFrame` now emits `.frame-tab--flush` when `showMeasurementLines`/`measurementPlacement="outside"` isn't active, instead of always reserving the wider clearance. `.process-scroll-viewport`'s reserved top padding corrected to match (`--frame-tab-offset`, not `--frame-tab-clearance`).
- **Tech Stack tile is literally 144×144 in Figma** (confirmed via instance metadata under `407:1514`'s `Frame 120`/`Frame 122` — not a "scaled down from 192" deviation as the old comment claimed). Within that real 144 tile, the icon container is a literal `72px` (not 48), and the hover reveal gap between icon and label is a literal `12px` (not the 24px grid unit) — both corrected. The "App name" label also had a fabricated `0.08em` tracking; Figma specifies none, so it's now `normal`.
- **About Me / Experience:** "Current Company" label is Geist Mono **Regular/400** (Figma `479:2723`), not the shared `.type-meta` Medium/500 used elsewhere (new `.type-exp-group-label` class); role-row divider borders corrected from 85%-opacity `--border` to the literal solid `#2a2a2a`; the expand ("add") icon corrected 16px → 20px (Figma `479:2730`); rail dots corrected from a stray 24px/mixed-color box to the literal 12×12px black-fill/`#616161`-border dot (Figma `479:2718`); Experience frame-tab label corrected `"Experience"` → `"EXPERIENCE-01"`; removed an unused fixed `min-w-[120px]` on the About Me card's Contact button (Figma's button hugs its label, no explicit width).
- **Footer background** corrected from the generic `#0a0a0a` canvas color to Figma's literal `bg-black` (`#000000`) for `.section--footer`.
- **Dead local asset paths (same bug class as the original Hero fix) removed sitewide:** `/zeina-photo.jpg` never existed in `/public` and was still referenced as a fallback in three places (`Hero.tsx`'s `FALLBACK_PORTRAIT`, `site-content.ts`'s About-image normalization, and the works detail page's OG-image fallback) — all three now degrade gracefully instead of pointing at a 404 (Hero/About hide the `<img>` and let the slot's own solid fill show through; the OG fallback now points at the real `/og-image.jpg`). `/logos/{noon,bespoke,auc,microsoft}.png` were referenced in mock experience data but never shipped either — removed so `CompanyLogo` falls back to its existing empty-placeholder branch; `CompanyLogo` also gained an `onError` guard for defensive robustness against any future broken CMS-provided logo URL.

### 2026-07 — Full Figma-exact rebuild sweep

Ground-up re-verification of every token, primitive, and section directly against fresh Figma dev-mode pulls (not the prior file's assumed values), triggered by persistent "still looks crooked" feedback despite code-level parity.

- **Site-wide asymmetric rail (biggest fix):** every section's content box is `pl-72/pr-48` (1320 wide inside a 1440 frame), not symmetric `72/72` — previously patched only for the nav shell. Now the `.site-shell` default, sitewide. `--site-max-width` corrected from `1464` to `1440`.
- **Per-section fixed inner bands:** Works (1224/48/48, 576+72gap+576), Expertise (1200, inset 48/72, single 1200-wide card), About (1200, inset 48/72, 576+48gap+576), Process/Tech Stack rows (1224/48/48) — all confirmed via literal Figma instance coordinates and implemented as fixed pixel widths instead of the approximate 24-col grid spans.
- **Tech Stack gaps:** tile gap corrected 24→48, row gap corrected 48→72 (confirmed tile size of 144 was already correct — it's the real Figma instance size, not a documented "scaled down from 192" deviation).
- **Footer shell:** its own `pl-24/pr-0` padding (not the standard rail), plus two border-rule fixes (`back to top` cell has no bottom rule; `connect` cell has a top rule instead).
- **Corner handles:** 6×6px → 12×12px (Figma `352:654–657`).
- **Frame-tab chip tracking:** `0.0625em` → literal `1px`.
- **Experience type fixes:** role font-family Mono→Sans (Figma `Geist:Bold`); company font-size 16→18.
- **Project Card:** removed the hover-triggered blur/scale/description-overlay — Figma has no description or hover-reveal in any state for this card, only the universal cyan-chrome hover.
- **CSS cleanup:** split a merged/glitched rule near the project-card hover styles (a stale "title stays white" comment had been attached to unrelated always-on `.workspace-frame .panel` border-color selectors) into two clear, correctly-scoped rules.

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
