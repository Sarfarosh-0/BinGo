# BinGo Design System v2.1 — Fresh Mint Bento (Production Spec)

Oct 14, 2026 · @Sarfarosh Alam

This is the build-ready spec for BinGo's **Fresh Mint Bento** UI: every token, component, screen and state needed to restyle the app, with the draft's open questions closed.

## 1. Document control and decisions

| Field | Value |
| --- | --- |
| Product | BinGo: smart waste sorting for SDG 15 (Life on Land) |
| Version | 2.1 (production). Supersedes v1.x "Eco Glass" and the v2.0 draft |
| Theme | Fresh Mint Bento, light-first |
| Stack (unchanged) | React 18, Vite 5, Tailwind CSS 3.4, TensorFlow.js, Lucide, `localStorage`, no backend |
| Precedence | PRD is the source of truth for scope and copy. This doc governs visual tokens, layout, components, motion and responsiveness |

### 1.1 Decisions made (v2.0 open questions, closed)

Each decision below is a default. Change one and the "Impact" column tells you what else moves.

| # | Question in v2.0 | Decision | Impact if reversed |
| --- | --- | --- | --- |
| D1 | Light theme overrides the PRD "no light mode" non-goal | **Approved.** Light is the only theme in this release | Re-tokenize section 3 for dark |
| D2 | Four-part nav (Home, History, Scan, Streaks) | **Approved** | Drop the Streaks slot; nav returns to 3 slots |
| D3 | Is the Streaks screen in scope? | **In scope.** Reads only stored `progress` and `history` data | Keep streak as a Home tile only; delete `Streaks.jsx` |
| D4 | Central Scan: ScanSheet or straight to camera? | **ScanSheet.** Scan opens a sheet with "Take a photo" and "Choose from gallery". Reuses the existing hidden inputs | Wire Scan directly to the `capture` input |
| D5 | Manrope or Inter? | **Manrope Variable**, Inter Variable as fallback in the font stack | Set `--font-sans` to Inter and remove the dependency |
| D6 | Streak 7-day strip: derive or extend storage? | **Derive** from `bingo:v1:history` timestamps. No schema change | Extending storage is a functional change and needs a PRD update |
| D7 | Feedback undo | **Tap the active thumb again to clear** (value returns to `null`) | None; the data model already allows `null` |
| D8 | Home "What goes where" legend | **Static reference only**, not tappable | Making chips tappable needs a detail view |

### 1.2 Still requires owner sign-off

D1, D2 and D3 override locked PRD decisions. Record the approval in the PRD changelog before merging.

## 2. Principles and non-negotiable invariants

The UI must read at arm's length in daylight on a mid-range Android phone, with scanning as the visual hero.

### 2.1 Design principles

| Principle | In practice |
| --- | --- |
| Content over decoration | No glows or brackets unless they communicate state |
| Solid over glassy | White and mint surfaces with soft shadows. No `backdrop-filter` anywhere |
| Rhythm through spacing | 4 px spacing scale and varied radii create hierarchy, not borders everywhere |
| One primary action per screen | Exactly one filled emerald button; everything else is secondary or tonal |
| Motion means something | Animate progress, success or state change only |
| Honest uncertainty | "Not sure" is amber, never red, and always offers recovery |

### 2.2 Functional invariants (do not change in a UI task)

- Categories: `recyclable`, `organic`, `ewaste`, `hazardous`, `general`, plus hidden `background`.
- Decision gate: top confidence below 60% **or** top class `background` returns `not_sure`.
- Input: native file inputs only (`capture="environment"` and gallery). No live WebRTC viewfinder.
- Minimum 500 ms on the Analyzing view.
- History capped at 50 items. Storage keys `bingo:v1:history` and `bingo:v1:progress`, with in-memory fallback on quota or private-mode failure.
- Model self-hosted in `/public/model/`. Bundle at most 350 KB gzip excluding weights.
- All copy reproduced verbatim from PRD section 8 (see section 7.4 of this doc).
- No login, account, avatar or settings UI.

## 3. Design tokens

All styling reads from one token file, `src/styles/tokens.css`. Components never hard-code a hex value, radius or shadow.

### 3.1 Brand and neutral palette

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Page background | `--color-bg` | `#F3F8F4` | App canvas |
| Surface | `--color-surface` | `#FFFFFF` | Cards, nav, rows |
| Soft mint | `--color-surface-alt` | `#E3F5E9` | Secondary tiles, SDG card |
| Brand green | `--color-primary` | `#0F9D58` | Large fills, bars, illustrations only (3.5:1 on white) |
| Primary strong | `--color-primary-strong` | `#0B7A44` | Buttons, links, small green text (5.5:1 on white) |
| Deep forest | `--color-secondary` | `#0B6E4F` | Secondary accent |
| Lime accent | `--color-accent` | `#D9F99D` | Highlights only: active nav pill, streak flame halo. Never text |
| Text | `--color-text` | `#0E2A1F` | Primary text |
| Secondary text | `--color-text-secondary` | `#52665A` | Supporting text |
| Muted text | `--color-text-muted` | `#6B7D72` | Captions (4.6:1 on page bg) |
| Border | `--color-border` | `#DCE8DF` | Hairlines |

### 3.2 Category tones

Every category shows **icon + text label + tone**. Color is never the only signal. `background` has no UI color and can never render.

| Category | Label | Ink | Soft bg | Icon | Contrast on white |
| --- | --- | --- | --- | --- | --- |
| `recyclable` | Recyclable | `#1565C0` | `#E7F0FB` | `Recycle` | 5.8:1 |
| `organic` | Organic | `#2E7D32` | `#E8F6EA` | `Sprout` | 5.2:1 |
| `ewaste` | E-Waste | `#6A3DB8` | `#F0EAFB` | `Smartphone` | 7.1:1 |
| `hazardous` | Hazardous | `#C62828` | `#FBE9E9` | `TriangleAlert` | 5.6:1 |
| `general` | General / Non-recyclable | `#5F6B63` | `#EEF2EF` | `Trash2` | 5.6:1 |
| `not_sure` | Not sure | `#9A6700` | `#FFF6E0` | `CircleHelp` | 4.9:1 |

`rules.json` keeps its `tone` field. Only the CSS mapping layer changes:

| `rules.json` tone | Category | CSS variables |
| --- | --- | --- |
| `accent` | recyclable | `--cat-recyclable`, `--cat-recyclable-soft` |
| `highlight` | organic | `--cat-organic`, `--cat-organic-soft` |
| `info` | ewaste | `--cat-ewaste`, `--cat-ewaste-soft` |
| `error` | hazardous | `--cat-hazardous`, `--cat-hazardous-soft` |
| `muted` | general | `--cat-general`, `--cat-general-soft` |

### 3.3 Typography

Family: **Manrope Variable**, self-hosted via `@fontsource-variable/manrope`, falling back to Inter Variable then system fonts. Use `font-variant-numeric: tabular-nums` on every counter and percentage.

| Token | Size / line | Weight | Tracking | Use |
| --- | --- | --- | --- | --- |
| Display | 28 / 1.15 | 800 | -0.02em | Result category label |
| H1 | 24 / 1.2 | 800 | -0.02em | "BinGo" wordmark |
| H2 | 20 / 1.25 | 700 | -0.01em | Tile headings |
| H3 | 18 / 1.3 | 700 | 0 | Section headings |
| Subheading | 15 / 1.45 | 600 | 0 | "84% sure", row labels |
| Body | 15 / 1.55 | 400 | 0 | Disposal steps, facts |
| Body-sm | 14 / 1.5 | 400 | 0 | Tile supporting text |
| Caption | 12 / 1.4 | 500 | 0.01em | Timestamps, meta |
| Label | 11 / 1.2 | 700 | 0.08em uppercase | Overlines |
| Button | 15 / 1.1 | 700 | 0.01em | All buttons |
| Metric | 28 / 1 | 800 | -0.02em | Counters. Streaks hero uses 40 |

Rules: body never below 14 px, captions never below 12 px, prose measure at most 62ch.

### 3.4 Spacing, radii, elevation, motion

- **Spacing** (4 px base): 4, 8, 12, 16, 20, 24, 32, 40, 48. Use only these.
- **Radii:** pills and buttons 999; hero tiles 28; bento tiles and stat cards 24; history rows and step cards 20; inputs and icon buttons 14; thumbnails 12 (history) and 16 (result).
- **Elevation:** four shadow steps, no blur-based glass.
- **Motion:** only `transform` and `opacity` animate (plus scan-line `translateY` and bar `scaleX`).

### 3.5 Token file

```css
:root {
  /* Brand */
  --color-primary: #0F9D58;
  --color-primary-strong: #0B7A44;
  --color-primary-hover: #0C8A4B;
  --color-primary-active: #0A6B3C;
  --color-primary-soft: #E3F5E9;
  --color-primary-ring: rgba(15,157,88,.35);
  --color-secondary: #0B6E4F;
  --color-accent: #D9F99D;
  --color-accent-ink: #3F6212;
  --color-accent-soft: #F2FBDD;

  /* Surfaces */
  --color-bg: #F3F8F4;
  --color-bg-band: #EAF4EE;
  --color-surface: #FFFFFF;
  --color-surface-alt: #E3F5E9;
  --color-surface-sunken: #EEF4F0;

  /* Text */
  --color-text: #0E2A1F;
  --color-text-secondary: #52665A;
  --color-text-muted: #6B7D72;
  --color-text-disabled: #9AA8A0;
  --color-text-on-primary: #FFFFFF;

  /* Lines */
  --color-border: #DCE8DF;
  --color-border-strong: #C6D9CC;
  --color-divider: #E6F0E9;
  --color-focus-ring: #0F9D58;

  /* Status */
  --color-success: #16834A;  --color-success-soft: #E4F5EB;
  --color-warning: #9A6700;  --color-warning-soft: #FFF6E0;
  --color-error:   #C62828;  --color-error-soft:   #FCEAEA;
  --color-info:    #1769AA;  --color-info-soft:    #E7F1FA;

  /* Categories */
  --cat-recyclable: #1565C0; --cat-recyclable-soft: #E7F0FB;
  --cat-organic:    #2E7D32; --cat-organic-soft:    #E8F6EA;
  --cat-ewaste:     #6A3DB8; --cat-ewaste-soft:     #F0EAFB;
  --cat-hazardous:  #C62828; --cat-hazardous-soft:  #FBE9E9;
  --cat-general:    #5F6B63; --cat-general-soft:    #EEF2EF;
  --cat-not-sure:   #9A6700; --cat-not-sure-soft:   #FFF6E0;

  /* Scan */
  --scan-line: #0F9D58;
  --scan-line-soft: rgba(15,157,88,.30);
  --scan-frame-border: rgba(255,255,255,.9);

  /* Elevation */
  --shadow-xs: 0 1px 2px rgba(14,42,31,.06);
  --shadow-sm: 0 2px 6px rgba(14,42,31,.06), 0 1px 2px rgba(14,42,31,.04);
  --shadow-md: 0 6px 16px rgba(14,42,31,.08), 0 2px 4px rgba(14,42,31,.05);
  --shadow-lg: 0 12px 28px rgba(14,42,31,.10), 0 4px 8px rgba(14,42,31,.05);
  --shadow-scan-btn: 0 6px 16px rgba(15,157,88,.32);

  /* Radii */
  --radius-xs: 8px;  --radius-sm: 10px; --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 24px; --radius-2xl: 28px; --radius-pill: 999px;

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px;

  /* Layout */
  --layout-max-w: 480px;
  --layout-content-w: 720px;
  --layout-wide-w: 1080px;
  --nav-h: 68px;
  --topbar-h: 56px;
  --gutter: 16px;
  --sidebar-w: 240px;
  --sidebar-w-collapsed: 72px;

  /* Motion */
  --ease-standard: cubic-bezier(.4, 0, .2, 1);
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 320ms;

  /* Z-index */
  --z-nav: 40;
  --z-sidebar: 40;
  --z-sheet-backdrop: 60;
  --z-sheet: 70;
  --z-toast: 80;

  /* Type */
  --font-sans: 'Manrope Variable', 'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
```

Legacy Eco Glass tokens (`--forest-*`, `--emerald-*`, `--lime-mist`, `--coral-500`, `--aqua-400`, `--amber-400`, `--shadow-glow-scan`, `--shadow-fab`, `--shadow-glass`) are removed. Delete them and fix any reference.

## 4. Layout, grid and responsive behavior

Mobile is a single bento column; tablet keeps the bottom nav; desktop swaps it for a sidebar rail and a two-column bento.

### 4.1 Breakpoints

| Name | Range | Navigation | Content width | Grid | Page padding |
| --- | --- | --- | --- | --- | --- |
| Mobile | up to 767 px | Floating bottom nav | `--layout-max-w` 480 | 6 col, 12 px gap | 16 px |
| Tablet | 768 to 1023 px | Floating bottom nav | `--layout-content-w` 720, centered | 12 col, 16 px gap | 24 px |
| Desktop | 1024 px and up | Left sidebar, 240 px (72 px below 1280) | up to `--layout-wide-w` 1080 | 12 col, 16 px gap | 32 px |

Tailwind: use `md` (768) and `lg` (1024) as the two switch points; do not add others.

### 4.2 Screen adaptation

| Screen | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Home | One-column bento stack | Two-column bento | Hero left; stats, legend, recent stacked right |
| Analyzing | Full-screen, centered frame (max 420 px tall) | Wider centered frame | Centered frame with generous margins |
| Result | One column | Hero full width, steps and SDG stacked | Two columns: hero left, steps and SDG right |
| History | Full-width rows | Centered rows | Centered rows beside sidebar |
| Streaks | One-column tiles | Two-column tiles | Hero left, stats right |

### 4.3 Viewport and safe areas

- Root height `100dvh`; `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Bottom nav offset: `bottom: max(12px, env(safe-area-inset-bottom))`.
- Scrolling content bottom padding: `calc(var(--nav-h) + 24px + env(safe-area-inset-bottom))`. Without it the nav covers the last card.
- Headers and sidebar add `env(safe-area-inset-top)`.
- Layouts must survive 200% text zoom with no clipped or fixed-height text blocks.

### 4.4 Backdrop

Replace `Backdrop.jsx` with a flat `--color-bg` canvas plus an optional top band using `--color-bg-band`. No bokeh, no blur. This removes the heaviest paint cost in v1.

## 5. Component library

Every component below ships with rest, hover, pressed, focus-visible and disabled states unless noted. Transitions use `--dur-fast` and `--ease-standard`.

### 5.1 Buttons

| Variant | Class | Rest | Hover | Pressed | Disabled |
| --- | --- | --- | --- | --- | --- |
| Primary | `.btn-primary` | bg `--color-primary-strong`, white text | bg `--color-primary-hover`, up 1 px | bg `--color-primary-active`, scale .97 | opacity .45, no shadow |
| Secondary | `.btn-secondary` | white bg, strong-green text, `--color-border-strong` border | bg `--color-primary-soft` | bg `--color-surface-sunken`, scale .97 | opacity .5 |
| Tonal | `.btn-tonal` | bg `--color-primary-soft`, strong-green text | bg `#D5EDDF` | scale .97 | opacity .5 |
| Ghost | `.btn-ghost` | transparent, secondary text | bg `--color-surface-alt` | scale .97 | opacity .45 |
| Icon | `.btn-icon` | 44 x 44, transparent | bg `--color-surface-alt` | scale .94 | opacity .4 |

All buttons: height 52 (icon 44), pill radius (icon 14), Button type style, 3 px focus ring `--color-primary-ring` with 2 px offset. One `.btn-primary` per screen.

### 5.2 Starter `components.css`

```css
@layer components {
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px;
    min-height:44px; padding:0 24px; border:1px solid transparent; border-radius:var(--radius-pill);
    font:700 15px/1.1 var(--font-sans); letter-spacing:.01em; cursor:pointer;
    transition:background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard),
      box-shadow var(--dur-fast) var(--ease-standard); }
  .btn:active:not(:disabled) { transform:scale(.97); }
  .btn:focus-visible { outline:3px solid var(--color-primary-ring); outline-offset:2px; }
  .btn:disabled { opacity:.45; cursor:not-allowed; box-shadow:none; }

  .btn-primary { height:52px; background:var(--color-primary-strong); color:var(--color-text-on-primary); }
  .btn-primary:hover:not(:disabled) { background:var(--color-primary-hover); transform:translateY(-1px); }
  .btn-primary:active:not(:disabled) { background:var(--color-primary-active); }
  .btn-secondary { height:52px; background:var(--color-surface); color:var(--color-primary-strong);
    border-color:var(--color-border-strong); }
  .btn-secondary:hover:not(:disabled) { background:var(--color-primary-soft); }
  .btn-tonal { height:52px; background:var(--color-primary-soft); color:var(--color-primary-strong); }
  .btn-tonal:hover:not(:disabled) { background:#D5EDDF; }
  .btn-ghost { background:transparent; color:var(--color-text-secondary); }
  .btn-ghost:hover:not(:disabled) { background:var(--color-surface-alt); }
  .btn-icon { width:44px; height:44px; padding:0; border-radius:var(--radius-md);
    background:transparent; color:var(--color-text); }
  .btn-icon:hover:not(:disabled) { background:var(--color-surface-alt); }
  .btn-icon:active:not(:disabled) { transform:scale(.94); }

  .card { background:var(--color-surface); border:1px solid var(--color-border);
    border-radius:var(--radius-xl); padding:var(--space-5); box-shadow:var(--shadow-sm); }
  .card-hero { border-radius:var(--radius-2xl); box-shadow:var(--shadow-md); }
  .card-mint { background:var(--color-surface-alt); border-color:transparent; box-shadow:none; }
  .card-interactive { transition:box-shadow 160ms var(--ease-standard), transform 160ms var(--ease-standard); }
  .card-interactive:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }

  .history-row { display:flex; align-items:center; gap:14px; min-height:72px; padding:12px;
    background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg); }
  .history-row:hover { box-shadow:var(--shadow-sm); }
  .history-row:active { transform:scale(.99); }
  .history-row:focus-visible { outline:2px solid var(--color-focus-ring); outline-offset:2px; }

  .chip { display:inline-flex; align-items:center; gap:6px; padding:4px 10px;
    border-radius:var(--radius-pill); font:600 12px/1.4 var(--font-sans);
    background:var(--chip-soft); color:var(--chip-ink);
    border:1px solid color-mix(in srgb, var(--chip-ink) 25%, transparent); }

  .scan-frame { position:relative; overflow:hidden; border-radius:var(--radius-xl);
    background:var(--color-surface-sunken); }
  .scan-corner { position:absolute; width:32px; height:32px; border:0 solid var(--scan-frame-border); }
  .scan-corner.tl { top:12%; left:12%; border-top-width:3px; border-left-width:3px; border-top-left-radius:12px; }
  .scan-corner.tr { top:12%; right:12%; border-top-width:3px; border-right-width:3px; border-top-right-radius:12px; }
  .scan-corner.bl { bottom:12%; left:12%; border-bottom-width:3px; border-left-width:3px; border-bottom-left-radius:12px; }
  .scan-corner.br { bottom:12%; right:12%; border-bottom-width:3px; border-right-width:3px; border-bottom-right-radius:12px; }
  .scan-line { position:absolute; left:0; right:0; top:6%; height:3px;
    background:linear-gradient(90deg, transparent, var(--scan-line), transparent);
    box-shadow:0 0 12px var(--scan-line-soft);
    animation:scan-sweep 1800ms linear infinite alternate, scan-breathe 1200ms ease-in-out infinite; }
}

@keyframes scan-sweep { from { transform:translateY(0); } to { transform:translateY(var(--scan-travel, 280px)); } }
@keyframes scan-breathe { 0%,100% { opacity:.55; } 50% { opacity:1; } }
@keyframes shimmer { from { background-position:200% 0; } to { background-position:-200% 0; } }

@media (prefers-reduced-motion: reduce) {
  .scan-line { animation:scan-breathe 1200ms ease-in-out infinite; transform:none; }
  *, *::before, *::after { transition-duration:1ms !important; }
}
```

Set `--scan-travel` from the frame's pixel height (frame height minus 12% margins) so the line stays inside the photo. This replaces the invalid `-t-3` and `border-t-3` Tailwind classes from v1.

### 5.3 Other components

| Component | Spec |
| --- | --- |
| **Category chip** | Pill, `--cat-*-soft` bg, `--cat-*` text, 14 px icon + 12/600 label. Set `--chip-soft` and `--chip-ink` inline from the category. Always icon + text |
| **Confidence bar** | Track `--color-surface-sunken`, 6 px pill; fill in category tone, animates `scaleX` 0 to n over 600 ms ease-out. `role="progressbar"` with `aria-valuenow/min/max`. Reduced motion: instant |
| **Feedback thumbs** | Two 44 x 44 icon buttons. Idle: sunken bg. Up selected: success-soft bg, success ink and border. Down selected: warning-soft bg, warning ink (amber, not red). Tapping the selected thumb clears it (D7). Use `aria-pressed` |
| **History row** | See `.history-row`. 56 x 56 thumb (radius 12, `loading="lazy"`), category label with 8 px tone dot, `{n}% sure` + date, optional feedback glyph. `role="button"` with Enter and Space handlers |
| **Central Scan button** | 60 px circle, `--color-primary` fill, white `ScanLine` 26 px, `--shadow-scan-btn`, 4 px white ring, raised 16 px. Pressed: scale .94. Disabled (model loading): `--color-text-disabled` fill, no shadow |
| **Stat tile** | `.card`, Metric numeral in `--color-text` on lime halo (`--color-accent`), caption below. Flame lights only when streak is above 0 |
| **Streak day-dot** | 10 px circle. Filled `--color-primary`; empty `--color-surface-sunken` with border. Day letter underneath |
| **Distribution bar** | 8 px pill track; fill in category tone; label and count always shown |
| **ScanSheet** | Backdrop `rgba(14,42,31,.45)`; panel white, top radius 28, 36 x 4 handle, padding 20. Options: "Take a photo" (primary, `Camera`), "Choose from gallery" (secondary, `Image`). Enter 260 ms `--ease-out`. Focus trap; Esc and backdrop dismiss. Becomes a centered modal at 768 px and up |
| **Toast** | White pill, `--shadow-lg`, tone icon, one line. Slide and fade 200 ms, auto-dismiss 3200 ms, `role="status"` |
| **Inline banner** | `--color-error-soft` bg, error border at 25%, `TriangleAlert`, message in `--color-error`, ghost "Retry" and "Dismiss" |
| **Skeleton** | `--color-surface-sunken` with a 1200 ms linear `shimmer`. Fixed block heights matching final content, so no layout shift |
| **Empty state** | 80 px `--color-surface-alt` circle holding a 48 px `--color-text-disabled` glyph, H3 title, muted subtitle, optional single action |
| **Model status chip** | 8 px pulsing dot + "Loading model..." while loading; removed when ready |

## 6. Screen specifications

The app stays a single `view` state machine: `home`, `analyzing`, `result`, `history`, `streaks`, plus the `ScanSheet` overlay. `analyzing` and `result` are full-screen and hide the bottom nav.

### 6.1 Home (scan launchpad)

**Primary action:** central Scan. Build order, top to bottom on mobile:

1. **Brand header** (no card): "BinGo" in H1, an SDG-15 pill, tagline "Sort your waste in one scan" in Body-sm muted.
2. **Hero scan tile** (`.card-hero`, full width): a rounded lens containing a `Recycle` glyph and a static scan line; "Scan an item" (H2); "Point your camera at one item to see how to dispose of it."; primary button "Take a photo"; tonal button "Choose from gallery". The two hints "Scan one item at a time" and "Use good light and fill the frame" sit below with `Lightbulb` icons. Model status chip shows here while loading.
3. **Stat strip** (two tiles side by side): "Items sorted" (`totalSorted`) and "Day streak" (`streak`).
4. **"What goes where" tile:** five category chips as a static legend (D8).
5. **Recent scans tile:** the 2 to 3 newest history rows plus a "See all" ghost button. Hidden entirely when history is empty; no placeholder.

**States:** loading (scan buttons disabled, status chip), ready, error (inline banner with Retry). **Motion:** tiles fade and rise 8 px, 60 ms stagger, once per session (guard with a ref). Numerals count up when the value changes. **Desktop:** hero spans the left column; stats, legend and recent stack on the right.

### 6.2 Analyzing (transient)

**Primary action:** none; Cancel (X) returns to origin and aborts the run. Minimum display 500 ms.

1. Top bar: close button left, centered title "Analyzing".
2. Scan frame (`.scan-frame`, radius 24, `object-fit: contain` on the captured photo, max 420 px tall) with four corner brackets and the sweeping line.
3. Status card: pulsing dot, "Analyzing your item...", hints "Keep it simple: one item only" and "This takes a moment". Use `role="status"`.

Because the PRD forbids a live viewfinder, the scan animation runs over the captured photo. Do not add a live-camera overlay.

### 6.3 Result: confident (60% or above, not `background`)

**Primary action:** "Scan another item". Secondary: feedback thumbs.

1. Top bar: back arrow, title "Scan result".
2. **Result hero card** (`.card-hero`): 4 px category-tone accent bar on the top-left edge; left column holds the category icon (24), label in Display, `{n}% sure` in Subheading (`--color-primary-strong`), and the confidence bar in the category tone; right column holds a 112 x 112 photo (radius 16) with a mint check badge. Wrap the label and percentage in `aria-live="polite"`.
3. "How to dispose" overline, then the steps card (`--radius-lg`): numbered circular badges, divider between rows.
4. SDG card (`.card-mint`): `Leaf` glyph, "SDG 15 · LIFE ON LAND", fact sentence.
5. Feedback row: "Was this correct?" with the two thumbs. After a tap the text becomes "Thanks for the feedback".
6. Full-width `.btn-primary` "Scan another item".

**Motion:** hero scale .98 to 1 with fade (220 ms), badge pop (320 ms), bar fills over 600 ms, steps stagger in. **Desktop:** hero left, steps and SDG right. **Opened from History:** identical layout; back returns to History.

### 6.4 Result: not sure (below 60% or `background`)

Hero card with amber `CircleHelp`, "Not sure", subtitle "Not sure, try another angle", photo **without** the check badge. Then a tips card ("Try another angle.", "Scan one item at a time.") and the primary "Scan another item" button.

**Excluded by PRD:** disposal steps, SDG card, feedback row, history entry, progress update. Tone stays amber; uncertainty is not an error.

### 6.5 History

Slim page header "History" (56 px, no back button). Up to 50 `.history-row` items, newest first, tap opens the confident result. No search, filter or export (PRD non-goal).

**Loading:** three skeleton rows. **Empty:** "No scans yet" with subtitle "Your last 50 scans will show up here." and a muted `Recycle` glyph. Rows are solid white with no blur. Dates render relative ("Today, 2:30 PM", "Yesterday, 6:15 PM") then absolute.

### 6.6 Streaks

Uses only stored data: `streak.count`, `streak.lastDate`, `totalSorted`, `byCategory`, and a 7-day strip derived from history timestamps (D6). Do not invent values.

1. Title "Streaks".
2. **Streak hero tile:** large `streak` numeral (40/800) with `Flame`, caption "Day streak", line "A streak grows each day you sort at least one item." At 0: "Start a streak today" with a Scan button.
3. **Last 7 days tile:** seven day-dots, filled when a confident scan exists that day. Label it "Last 7 days". Hide it if history is empty.
4. **Lifetime tile:** "Items sorted" plus five distribution bars from `byCategory` (bar width equals category share, label and count beside each).
5. Optional ghost link "See your scans" to History.

**States:** active streak, zero streak, first run (no progress data). **Motion:** count-up on change; flame halo pulses 1 to 1.15 to 1 (300 ms) only when the streak increments; bars grow from 0 over 500 ms.

### 6.7 State catalog

| Context | Loading | Empty | Error | Recovery |
| --- | --- | --- | --- | --- |
| Model | Status chip "Loading model..."; scan disabled | n/a | Banner "Couldn't load scanner model." | Retry re-initializes model |
| `rules.json` | Controls disabled | n/a | Banner "Couldn't load app content." | Retry or reload |
| Analyze | Analyzing screen, 500 ms minimum | n/a | Return to origin with banner "Something went wrong while scanning." | Retry |
| Result | Brief skeleton hero | n/a | n/a | "Scan another item" |
| History | Three skeleton rows | "No scans yet" | Corrupt store falls back to empty | Storage layer handles it |
| Streaks | Skeleton numeral | "Start a streak today" | n/a | Scan to begin |

Storage failures never show a red wall: quota full drops oldest entries, private mode uses the in-memory store, corrupt JSON resets to defaults. Use only existing `strings.js` error copy; add no new user-facing errors.

## 7. Navigation, motion, accessibility and copy

### 7.1 Navigation

Three tabs plus one raised action. Scan is not a peer tab.

| Slot | Label | Lucide icon | Action |
| --- | --- | --- | --- |
| 1 | Home | `Home` | `setView('home')` |
| 2 | History | `History` | `setView('history')` |
| 3 (center, raised) | Scan | `ScanLine` | Open ScanSheet |
| 4 | Streaks | `Flame` | `setView('streaks')` |

**Mobile and tablet bottom nav**

- Floating pill, centered, max width 360, height `--nav-h` 68, white, hairline border, `--shadow-md`, offset by the safe-area rule in section 4.3.
- Tabs are `flex: 1`: 22 px icon above an 11/600 label. Inactive uses `--color-text-muted`. Active uses `--color-primary-strong` with a 4 px lime pill behind the icon (width transition 200 ms).
- Scan wrapper is `position: relative; transform: translateY(-16px)`.
- Markup: `<nav aria-label="Main Navigation">`; active tab gets `aria-current="page"`.
- Hidden on `analyzing` and `result`.

**Desktop sidebar (1024 px and up)**

- 240 px rail (72 px below 1280). Same four slots; Scan becomes a full-width primary button "Scan an item" at the top.
- Active item: `--color-primary-soft` background plus a 3 px lime bar on the left.
- Bottom nav is not rendered at this width.

**Header:** Home has the brand header only. History and Streaks use a slim 56 px title bar. Result has back; Analyzing has close. No login, avatar or settings anywhere.

**Back contract:** `result` pushes `{view:'result'}`. `popstate` returns to the originating tab and never exits the SPA. Revoke object URLs when leaving `result`.

### 7.2 Motion

| Moment | Behavior | Duration | Easing |
| --- | --- | --- | --- |
| Scan initiation | Button press scale .97; Home fades out, Analyzing fades and scales in | 200 ms | ease-out |
| Active scan | Line sweeps top to bottom and back; brackets static | 1800 ms loop | linear |
| Processing | Status dot and line opacity breathe .55 to 1 | 1200 ms | ease-in-out |
| Success | Analyzing fades; hero scales .98 to 1; badge pops; bar fills | 220 / 320 / 600 ms | ease-out |
| Error | Return to origin; banner slides down | 200 ms | ease-out |
| Tab switch | Outgoing fades 120 ms; incoming fades and rises 8 px | 180 ms | ease-out |
| ScanSheet | Slides up 100% to 0; backdrop fades | 260 / 200 ms | `--ease-out` |
| Card hover | Shadow sm to md, up 2 px | 160 ms | standard |
| Counters | Count up from previous to new value | 400 ms | ease-out |

**Reduced motion** (`prefers-reduced-motion: reduce`): scan line stops translating and keeps only the opacity breath; cards fade only; counters jump to the final value; sheet and toast appear instantly; badge pop becomes opacity only; confidence bar fills instantly.

### 7.3 Accessibility and daylight readability

| Requirement | Specification |
| --- | --- |
| Contrast | Text 4.5:1 or better on its surface; large display text 3:1 or better. Category inks pass 4.5:1 on white (see 3.2) |
| Touch targets | 44 x 44 px minimum on every interactive element |
| Focus | Visible 2 px `--color-focus-ring` outline with 2 px offset via `:focus-visible` |
| Semantics | One `<h1>` per view; images carry descriptive `alt`; History rows are keyboard operable |
| Announcements | Result classification in `aria-live="polite"` reads "Recyclable, 84% sure"; Analyzing uses `role="status"` |
| Color independence | Category and feedback states always show icon plus text |
| Daylight | Light surfaces with dark ink. Mint is a surface color only, never text |
| Zoom | Works at 200% text zoom without clipping |

### 7.4 Copy deck (verbatim from PRD; do not edit)

| Screen | Strings |
| --- | --- |
| Home | "BinGo", "Sort your waste in one scan", "Every scan helps", "Items sorted", "Day streak", "Scan an item", "Point your camera at one item to see how to dispose of it.", "Scan one item at a time", "Use good light and fill the frame", "Choose from gallery", "Loading model..." |
| Analyzing | "Analyzing", "Analyzing your item...", "Keep it simple: one item only", "This takes a moment" |
| Result | "Scan result", "{n}% sure", "How to dispose", "SDG 15 · LIFE ON LAND", "Was this correct?", "Thanks for the feedback", "Not sure", "Not sure, try another angle", "Try another angle.", "Scan one item at a time.", "Scan another item" |
| History | "History", "No scans yet", "Your last 50 scans will show up here." |
| Streaks (new) | "Streaks", "Day streak", "Items sorted", "Last 7 days", "Start a streak today", "A streak grows each day you sort at least one item." |
| ScanSheet (new) | "Take a photo", "Choose from gallery" |

Category labels, disposal steps and SDG facts come unchanged from `rules.json` (PRD section 8.6). Streaks and ScanSheet strings are new and need adding to `strings.js`.

## 8. Implementation guide

The restyle touches styles and presentational components; `lib/*`, hooks and the `App.jsx` state machine keep their behavior.

### 8.1 File changes

| File | Change |
| --- | --- |
| `src/styles/tokens.css` | Replace with the block in section 3.5 |
| `src/styles/components.css` | Replace with section 5.2. Delete every glass class (`surface-glass*`, `btn-glass`, `surface-flat`) |
| `tailwind.config.js` | Map tokens into the theme (see 8.2) |
| `index.html` | Confirm `viewport-fit=cover`; set `theme-color` to `#F3F8F4` |
| `src/components/Backdrop.jsx` | Flat canvas plus optional top band |
| `src/components/BottomNav.jsx` | Four slots, raised Scan, lime active pill, `aria-current` |
| `src/components/Sidebar.jsx` | **New.** Desktop rail at 1024 px and up |
| `src/components/ScanSheet.jsx` | **New.** Reuses the existing hidden file inputs in `App.jsx` |
| `src/components/Streaks.jsx` | **New.** Reads existing `progress` and `history` |
| `src/components/HomeScreen.jsx` | Optional extraction of the Home bento from `App.jsx`; behavior-identical |
| `ImpactBar.jsx`, `Scanner.jsx` | Restyle as stat tiles and hero scan tile; remove Home corner brackets |
| `AnalyzingView.jsx` | New scan frame; replace invalid arbitrary Tailwind classes |
| `ResultCard.jsx`, `History.jsx`, `CategoryIcon.jsx`, `TopBar.jsx` | Token-driven tones and surfaces |
| `src/lib/strings.js` | Add Streaks and ScanSheet strings from 7.4 |
| `package.json` | Add `@fontsource-variable/manrope`; import it in `main.jsx` |

### 8.2 Tailwind mapping

```js
// tailwind.config.js (theme.extend)
colors: {
  bg: 'var(--color-bg)',
  surface: { DEFAULT: 'var(--color-surface)', alt: 'var(--color-surface-alt)', sunken: 'var(--color-surface-sunken)' },
  primary: { DEFAULT: 'var(--color-primary)', strong: 'var(--color-primary-strong)', soft: 'var(--color-primary-soft)' },
  accent: 'var(--color-accent)',
  ink: { DEFAULT: 'var(--color-text)', secondary: 'var(--color-text-secondary)', muted: 'var(--color-text-muted)' },
  line: 'var(--color-border)',
},
borderRadius: { lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', '2xl': 'var(--radius-2xl)' },
boxShadow: { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' },
fontFamily: { sans: 'var(--font-sans)' },
```

Category colors are applied through a lookup, not dynamic class names (Tailwind cannot see built strings):

```js
// lib/categoryTheme.js
export const CATEGORY_THEME = {
  recyclable: { ink: 'var(--cat-recyclable)', soft: 'var(--cat-recyclable-soft)', icon: 'Recycle' },
  organic:    { ink: 'var(--cat-organic)',    soft: 'var(--cat-organic-soft)',    icon: 'Sprout' },
  ewaste:     { ink: 'var(--cat-ewaste)',     soft: 'var(--cat-ewaste-soft)',     icon: 'Smartphone' },
  hazardous:  { ink: 'var(--cat-hazardous)',  soft: 'var(--cat-hazardous-soft)',  icon: 'TriangleAlert' },
  general:    { ink: 'var(--cat-general)',    soft: 'var(--cat-general-soft)',    icon: 'Trash2' },
  not_sure:   { ink: 'var(--cat-not-sure)',   soft: 'var(--cat-not-sure-soft)',   icon: 'CircleHelp' },
};
```

Apply it inline: `style={{ '--chip-ink': t.ink, '--chip-soft': t.soft }}` on a `.chip`.

### 8.3 Suggested order of work

1. Swap `tokens.css` and `components.css`; remove blur and legacy tokens; app should render, unstyled-but-light.
2. Restyle shared pieces: `TopBar`, `Banner`, `CategoryIcon`, buttons.
3. Restyle screens in flow order: Home, Analyzing, Result (both states), History.
4. Build `BottomNav`, `ScanSheet`, then `Sidebar` for desktop.
5. Add `Streaks` and the new strings.
6. Add motion and reduced-motion fallbacks.
7. Run the QA checklist below on real devices.

### 8.4 QA checklist

- [ ] All five categories plus `not_sure` render with icon, label and tone; none relies on color alone.
- [ ] Contrast verified with a tool: body, secondary and muted text; every category ink on white and soft bg; white on `--color-primary-strong`.
- [ ] Every CSS variable used in a component exists in `tokens.css`.
- [ ] No `backdrop-filter`, no legacy glass classes, no invalid Tailwind classes (`-t-3`, `border-t-3`).
- [ ] Four-slot mobile nav; Scan at least 60 px with 44 px or larger hit area; last card never hidden behind the nav.
- [ ] Sidebar shows at 1024 px and up; bottom nav hidden there.
- [ ] Scan flow works end to end: sheet, capture, 500 ms minimum Analyzing, result or error, retry.
- [ ] Not-sure result shows no steps, SDG card, feedback or history write.
- [ ] History empty and populated; Streaks active, zero and first-run.
- [ ] Feedback thumb toggles off on second tap and uses `aria-pressed`.
- [ ] `aria-live` result announcement, `aria-current` on active tab, visible focus rings.
- [ ] Reduced-motion behaves per section 7.2.
- [ ] Counters use tabular numerals with no layout shift.
- [ ] Real-device pass: Android Chrome 111+ and iOS Safari 16.4+ (camera input, back gesture, scroll performance).
- [ ] Bundle at most 350 KB gzip excluding weights. Do not claim a 2 s scan latency without device testing.
- [ ] No login, account, avatar or menu UI.
