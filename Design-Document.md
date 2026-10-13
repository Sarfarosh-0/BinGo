# BinGo Design System v2.1 — Fresh Mint Bento (Production Spec)

Oct 14, 2026 · @Sarfarosh Alam

This is the build-ready spec for BinGo's **Fresh Mint Bento** UI: every token, component, screen, and state needed to restyle the app, incorporating your custom GPay-inspired navigation layout and Impact Counter screen[cite: 1].

---

## 1. Document control and decisions

| Field | Value |
| --- | --- |
| Product | BinGo: smart waste sorting for SDG 15 (Life on Land)[cite: 1] |
| Version | 2.1 (production). Supersedes v1.x "Eco Glass" and the v2.0 draft[cite: 1] |
| Theme | Fresh Mint Bento, light-first[cite: 1] |
| Stack (unchanged) | React 18, Vite 5, Tailwind CSS 3.4, TensorFlow.js, Lucide, `localStorage`, no backend[cite: 1] |
| Precedence | PRD is the source of truth for scope and copy. This doc governs visual tokens, layout, components, motion, and responsiveness[cite: 1] |

### 1.1 Decisions made (v2.0 open questions, closed)

Each decision below is a default. Change one and the "Impact" column tells you what else moves.

| # | Question / Topic | Decision | Impact if reversed |
| --- | --- | --- | --- |
| D1 | Light theme overrides PRD "no light mode" non-goal | **Approved.** Light is the only theme in this release[cite: 1] | Re-tokenize section 3 for dark[cite: 1] |
| D2 | Custom Navigation Layout | **Approved (GPay style).** 3-slot bottom bar (`Impact Counter`, `Home`, `History`) with a floating action hero pill centered directly above for **`Scan`**[cite: 1] | Reverts to a standard 4-tab equal distribution nav[cite: 1] |
| D3 | Is the Impact Counter screen in scope? | **In scope.** Replaces Streaks; reads only stored `progress` and `history` data[cite: 1] | Keep impact metrics as a Home tile only; delete `ImpactCounter.jsx`[cite: 1] |
| D4 | Central Scan: ScanSheet or straight to camera? | **ScanSheet.** Scan opens a sheet with "Take a photo" and "Choose from gallery". Reuses the existing hidden inputs[cite: 1] | Wire Scan directly to the `capture` input[cite: 1] |
| D5 | Manrope or Inter? | **Manrope Variable**, Inter Variable as fallback in the font stack[cite: 1] | Set `--font-sans` to Inter and remove the dependency[cite: 1] |
| D6 | Impact / 7-day strip: derive or extend storage? | **Derive** from `bingo:v1:history` timestamps. No schema change[cite: 1] | Extending storage is a functional change and needs a PRD update[cite: 1] |
| D7 | Feedback undo | **Tap the active thumb again to clear** (value returns to `null`)[cite: 1] | None; the data model already allows `null`[cite: 1] |
| D8 | Home "What goes where" legend | **Static reference only**, not tappable[cite: 1] | Making chips tappable needs a detail view[cite: 1] |

### 1.2 Still requires owner sign-off

D1, D2, and D3 override locked PRD decisions. Record the approval in the PRD changelog before merging[cite: 1].

---

## 2. Principles and non-negotiable invariants

The UI must read at arm's length in daylight on a mid-range Android phone, with scanning as the visual hero[cite: 1].

### 2.1 Design principles

| Principle | In practice |
| --- | --- |
| Content over decoration | No glows or brackets unless they communicate state[cite: 1] |
| Solid over glassy | White and mint surfaces with soft shadows. No `backdrop-filter` anywhere[cite: 1] |
| Rhythm through spacing | 4 px spacing scale and varied radii create hierarchy, not borders everywhere[cite: 1] |
| One primary action per screen | Exactly one filled emerald button; everything else is secondary or tonal[cite: 1] |
| Motion means something | Animate progress, success, or state change only[cite: 1] |
| Honest uncertainty | "Not sure" is amber, never red, and always offers recovery[cite: 1] |

### 2.2 Functional invariants (do not change in a UI task)

* Categories: `recyclable`, `organic`, `ewaste`, `hazardous`, `general`, plus hidden `background`[cite: 1].
* Decision gate: top confidence below 60% **or** top class `background` returns `not_sure`[cite: 1].
* Input: native file inputs only (`capture="environment"` and gallery). No live WebRTC viewfinder[cite: 1].
* Minimum 500 ms on the Analyzing view[cite: 1].
* History capped at 50 items. Storage keys `bingo:v1:history` and `bingo:v1:progress`, with in-memory fallback on quota or private-mode failure[cite: 1].
* Model self-hosted in `/public/model/`. Bundle at most 350 KB gzip excluding weights[cite: 1].
* All copy reproduced verbatim from PRD section 8 (see section 7.4 of this doc)[cite: 1].
* No login, account, avatar, or settings UI[cite: 1].

---

## 3. Design tokens

All styling reads from one token file, `src/styles/tokens.css`. Components never hard-code a hex value, radius, or shadow[cite: 1].

### 3.1 Brand and neutral palette

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Page background | `--color-bg` | `#F3F8F4` | App canvas[cite: 1] |
| Surface | `--color-surface` | `#FFFFFF` | Cards, nav, rows[cite: 1] |
| Soft mint | `--color-surface-alt` | `#E3F5E9` | Secondary tiles, SDG card[cite: 1] |
| Brand green | `--color-primary` | `#0F9D58` | Large fills, bars, illustrations only (3.5:1 on white)[cite: 1] |
| Primary strong | `--color-primary-strong` | `#0B7A44` | Buttons, links, small green text (5.5:1 on white)[cite: 1] |
| Deep forest | `--color-secondary` | `#0B6E4F` | Secondary accent[cite: 1] |
| Lime accent | `--color-accent` | `#D9F99D` | Highlights only: active nav pill, counter halo. Never text[cite: 1] |
| Text | `--color-text` | `#0E2A1F` | Primary text[cite: 1] |
| Secondary text | `--color-text-secondary` | `#52665A` | Supporting text[cite: 1] |
| Muted text | `--color-text-muted` | `#6B7D72` | Captions (4.6:1 on page bg)[cite: 1] |
| Border | `--color-border` | `#DCE8DF` | Hairlines[cite: 1] |

### 3.2 Category tones

Every category shows **icon + text label + tone**. Color is never the only signal. `background` has no UI color and can never render[cite: 1].

| Category | Label | Ink | Soft bg | Icon | Contrast on white |
| --- | --- | --- | --- | --- | --- |
| `recyclable` | Recyclable[cite: 1] | `#1565C0`[cite: 1] | `#E7F0FB`[cite: 1] | `Recycle`[cite: 1] | 5.8:1[cite: 1] |
| `organic` | Organic[cite: 1] | `#2E7D32`[cite: 1] | `#E8F6EA`[cite: 1] | `Sprout`[cite: 1] | 5.2:1[cite: 1] |
| `ewaste` | E-Waste[cite: 1] | `#6A3DB8`[cite: 1] | `#F0EAFB`[cite: 1] | `Smartphone`[cite: 1] | 7.1:1[cite: 1] |
| `hazardous` | Hazardous[cite: 1] | `#C62828`[cite: 1] | `#FBE9E9`[cite: 1] | `TriangleAlert`[cite: 1] | 5.6:1[cite: 1] |
| `general` | General / Non-recyclable[cite: 1] | `#5F6B63`[cite: 1] | `#EEF2EF`[cite: 1] | `Trash2`[cite: 1] | 5.6:1[cite: 1] |
| `not_sure` | Not sure[cite: 1] | `#9A6700`[cite: 1] | `#FFF6E0`[cite: 1] | `CircleHelp`[cite: 1] | 4.9:1[cite: 1] |

### 3.3 Typography

Family: **Manrope Variable**, self-hosted via `@fontsource-variable/manrope`, falling back to Inter Variable then system fonts. Use `font-variant-numeric: tabular-nums` on every counter and percentage[cite: 1].

* **Display:** 28 / 1.15, Weight 800, Tracking -0.02em (Result category label)[cite: 1]
* **H1:** 24 / 1.2, Weight 800, Tracking -0.02em ("BinGo" wordmark)[cite: 1]
* **H2:** 20 / 1.25, Weight 700, Tracking -0.01em (Tile headings)[cite: 1]
* **H3:** 18 / 1.3, Weight 700, Tracking 0 (Section headings)[cite: 1]
* **Subheading:** 15 / 1.45, Weight 600, Tracking 0 ("84% sure", row labels)[cite: 1]
* **Body:** 15 / 1.55, Weight 400, Tracking 0 (Disposal steps, facts)[cite: 1]
* **Metric:** 28 / 1, Weight 800, Tracking -0.02em (Counters. Impact hero uses 40)[cite: 1]

---

## 4. Layout, grid, and navigation architecture

### 4.1 Custom Bottom Navigation & Floating Scan Hero (GPay Style)
The navigation layout matches your custom user preference (modeled after the provided reference style):
1. **Floating Action Button (FAB):** Positioned centered directly *above* the bottom navigation bar as a prominent pill container (`Scan` icon + text), floating with soft elevation `--shadow-scan-btn`[cite: 1]. Tapping it opens the `ScanSheet`[cite: 1].
2. **Bottom Navigation Bar (3 Slots):**
   * **Left Slot:** Impact Counter (`Impact` view)[cite: 1]
   * **Center Slot:** Home (`Home` view, highlighted with an active mint/lime pill background indicator)[cite: 1]
   * **Right Slot:** History (`History` view)[cite: 1]

### 4.2 Breakpoints & Responsiveness
* **Mobile (up to 767 px):** Single bento column, fixed GPay-style floating bottom navigation[cite: 1].
* **Tablet (768 to 1023 px):** Centered content width (`--layout-content-w` 720 px), bottom nav maintained[cite: 1].
* **Desktop (1024 px and up):** Left sidebar rail (240 px), two-column bento workspace, bottom nav hidden[cite: 1].

---

## 5. Screen specifications & View States

The app runs on a single `view` state machine: `home`, `analyzing`, `result`, `history`, `impact`, plus the `ScanSheet` overlay[cite: 1].

### 5.1 Home (Scan Launchpad)
* **Brand Header:** "BinGo" wordmark, SDG-15 badge, tagline "Sort your waste in one scan"[cite: 1].
* **Hero Scan Tile (`.card-hero`):** Prominent lens containing a `Recycle` glyph, static scan line, primary "Take a photo" button, and tonal "Choose from gallery" button[cite: 1].
* **Stat Strip:** Quick stats preview for items sorted and current environmental score[cite: 1].
* **"What goes where" Tile:** Static reference category legend chips[cite: 1].
* **Recent Scans Tile:** The 2 to 3 newest history entries with a "See all" ghost button[cite: 1].

### 5.2 Impact Counter (Replaces Streaks)
* **Impact Hero Tile:** Large counter numeral (`totalSorted`) with descriptive metrics showing personal ecological impact against SDG 15 goals.
* **Activity Breakdown:** Distribution bars detailing items sorted across categories (`byCategory`), showing volume share visually[cite: 1].
* **Timeline Strip:** 7-day visual summary derived from local history timestamps[cite: 1].

### 5.3 Result & Analyzing Views
* **Analyzing View:** Transient 500 ms minimum load state with camera frame and sweeping laser animation over the captured photo[cite: 1].
* **Confident Result:** Displays category breakdown, confidence percentage bar, step-by-step disposal guide, SDG 15 fact card, and feedback thumbs[cite: 1].
* **Not Sure Result:** Clean amber fallback card (`CircleHelp`) with alternative angle tips and zero clutter[cite: 1].

---

## 6. Verification & Implementation Hand-off
* **Storage Keys:** `bingo:v1:history` and `bingo:v1:progress` via `localStorage` with in-memory fallback[cite: 1].
* **Accessibility:** Fully semantic markup, `aria-live` polite live regions for scan classifications, `aria-current="page"` on active navigation tabs, and minimum 44 x 44 px touch targets[cite: 1].
* **Zero Bloat:** No backend requirements, no user authentication workflows, and completely self-hosted TF.js model execution under 350 KB gzip excluding weights[cite: 1].