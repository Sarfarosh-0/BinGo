# BinGo: Design Document — Layout and Application Architecture

**Project:** BinGo — Smart Waste Sorting for SDG 15 (Life on Land)  
**Document Role:** Authoritative Design System and Frontend UI Architecture  
**Visual Language:** "Eco Glass" (Dark-Green Glassmorphism)  
**Status:** Approved for Implementation  

---

## 1. Visual Design Principles & Aesthetics

BinGo adopts the **Eco Glass** design language—a deep, organic dark-green glassmorphism aesthetic tailored to convey precision, calm, and ecological technology.

### 1.1 Core Aesthetic Traits
* **Forest Canopy Depth:** Multi-stop dark-green gradient backdrop (`#0B2E25` to `#1B5240`) overlaid with subtle, static radial bokeh patches (`#8DB9A0` at low opacity).
* **Frosted Glass Panels:** Translucent surfaces (`rgba(255, 255, 255, 0.08–0.14)`) combined with backdrop blur (`backdrop-filter: blur(24px) saturate(140%)`), hairline light borders (`1px solid rgba(255, 255, 255, 0.22)`), and delicate top-edge inner highlights.
* **Luminous Emerald Accent:** Saturated emerald (`#2FBF71` and `#4ADE80`) reserved strictly for interactive scan actions, active states, progress indicators, and the glowing scanner line.
* **Lime Metric Highlighting:** Pale lime-tinted figures (`#CFEA8A`) for key counters ("Items sorted", "Day streak") to draw immediate focus to positive environmental impact.
* **Category Color Tones:** Each waste category is uniquely identified by an accent tone and dedicated Lucide icon; color never appears alone without category label text.
* **Generous Curvature:** Organic corner radii ranging from $16$ px (cards) to $24$ px (primary containers), full pill shapes ($999$ px) for chips and bars, and circular primary buttons ($56$ px).

---

## 2. Layout Structure and Screen Hierarchy

### 2.1 Viewport and Canvas Architecture
* **Single Mobile Column:** Full width on mobile screens, clamped to a maximum width of `480px` (`--layout-max-w`) centered horizontally on desktop/tablet displays.
* **Safe-Area Awareness:** Utilizes `viewport-fit=cover` and dynamic viewport units (`100dvh`). All bottom controls and scrolling containers include `env(safe-area-inset-bottom)` padding to prevent overlap with native mobile home indicators.
* **Fixed Atmospheric Backdrop:** A persistent, non-scrolling backdrop layer (`Backdrop.jsx`) featuring diagonal forest gradients and static bokeh gradients sits behind the application without re-rendering.

```
┌──────────────────────────────────────────────┐
│  Desktop Backdrop (Centered Phone Frame)    │
│  ┌────────────────────────────────────────┐  │
│  │ Viewport: 100dvh / Max-Width: 480px    │  │
│  │                                        │  │
│  │  TopBar (Close/Back + Screen Title)    │  │
│  │  ───────────────────────────────────   │  │
│  │                                        │  │
│  │  Scrollable Content Container          │  │
│  │  - Cards, Buttons, Information         │  │
│  │  - Bottom Padding for Nav Clearance    │  │
│  │                                        │  │
│  │  ───────────────────────────────────   │  │
│  │  Floating Bottom Navigation Bar        │  │
│  │  [ Home ]      ( FAB )      [ History ]│  │
│  │                                        │  │
│  │  Safe Area Inset Space                 │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 3. Screen Layout Specifications and Wireframes

The app comprises four distinct screen views governed by a single `view` state in `App.jsx`:
1. `home` — Primary landing and scanning launchpad
2. `analyzing` — Transient, animated processing screen
3. `result` — Classification outcome (Confident or Not Sure)
4. `history` — Chronological log of past confident scans

---

### 3.1 Screen A: Home / Scan Launchpad

```
┌──────────────────────────────────────────────┐
│  BinGo                                       │
│  Sort your waste in one scan                 │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Every scan helps             (Leaf)   │  │
│  │                                        │  │
│  │     14              3 🔥               │  │
│  │  Items sorted    Day streak            │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │      ┌─             ─┐                 │  │
│  │            ( ♻ )                       │  │
│  │      ─── [Scan Line] ───               │  │
│  │      └─             ─┘                 │  │
│  │  Scan an item                          │  │
│  │  Point camera at one item to see how   │  │
│  │  to dispose of it.                     │  │
│  │                                        │  │
│  │  💡 Scan one item at a time            │  │
│  │  💡 Use good light and fill the frame  │  │
│  │                                        │  │
│  │  [ 🖼 Choose from gallery ]            │  │
│  │  (•) Loading model... (if loading)     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [ Home ● ]         ( 📷 )        [ History ]│
└──────────────────────────────────────────────┘
```

**Layout Sequence (Top to Bottom):**
1. **Header Block:** Clean typographic header without glass card container. `app.name` in Heading 1 (`24px`, bold white), `app.tagline` in Body (`14px`, muted white).
2. **Inline Banner Slot:** Displays dismissible/retryable alerts if content or model loading encounters an error.
3. **Impact Card (`surface-glass-strong`, radius `24px`, padding `20px`):**
   * Heading 3: "Every scan helps".
   * Metric 1: Total Confident Scans (`totalSorted`) in Lime (`20px`, bold) with "Items sorted" caption.
   * Metric 2: Day Streak (`streak`) with a Flame icon in Lime (or muted when 0) with "Day streak" caption.
   * Decorative `Leaf` icon ($72$ px, white at 15% opacity) overlapping the top-right card corner.
4. **Scan Card (`surface-glass`, radius `24px`, padding `20px`):**
   * **Decorative Scan Frame:** White corner brackets enclosing a centered `Recycle` icon, intersected by a static green glowing scan line.
   * Heading 2: "Scan an item".
   * Body text: "Point your camera at one item to see how to dispose of it."
   * Two hint rows with `Lightbulb` icons: "Scan one item at a time" and "Use good light and fill the frame".
   * **Gallery Button (`btn-glass`):** Glass button with `Image` icon and "Choose from gallery". Disabled until model is ready.
   * **Model Status Row:** Shows "Loading model..." with a pulsing dot while model loads; hidden once ready.
5. **Bottom Navigation Bar:** Floating pill bar displaying Home (active), elevated Camera FAB, and History.

---

### 3.2 Screen B: Analyzing View (Transient State)

*Replaces the entire viewport. Bottom navigation bar is hidden.*

```
┌──────────────────────────────────────────────┐
│  [ X ]               Analyzing               │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │   ┌─                                ─┐ │  │
│  │                                        │  │
│  │             [ Captured Photo ]         │  │
│  │                                        │  │
│  │   ══════ Glowing Scan Line ════════    │  │
│  │             (Sweeps down/up)           │  │
│  │                                        │  │
│  │   └─                                ─┘ │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Analyzing your item...                │  │
│  │  💡 Keep it simple: one item only      │  │
│  │  💡 This takes a moment                │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Layout Sequence:**
1. **TopBar:** Square close icon button (`X`) on left (returns to Home and cancels scan run); centered title "Analyzing"; right empty spacer.
2. **Viewfinder Canvas Container:** Occupies ~55% of viewport height. Displays the scaled user photo (`object-fit: contain`) with rounded corners ($24$ px).
3. **Scanning Animation Elements:**
   * Four white corner brackets (`border-width: 3px`, round caps) enclosing the central 75% of the frame.
   * **Animated Scan Line:** Neon green glowing horizontal line (`#4ADE80` with `--shadow-glow-scan`) executing a continuous vertical sweep loop (1.6s duration) with an opacity breath cycle (0.60 to 1.0).
4. **Status Panel (`surface-glass`, radius `24px`, padding `16px`):**
   * Heading 3: "Analyzing your item...".
   * Two guidance hints: "Keep it simple: one item only" and "This takes a moment".

---

### 3.3 Screen C: Result View

#### 3.3.1 Confident Result State ($\ge 60\%$ and Not Background)

```
┌──────────────────────────────────────────────┐
│  [ ← ]              Scan result              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  (♻) Recyclable       ┌──────────────┐ │  │
│  │  84% sure             │ Photo Thumb  │ │  │
│  │  [═══════════   ]     │        ( ✔ ) │ │  │
│  │                       └──────────────┘ │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  How to dispose                              │
│  ┌────────────────────────────────────────┐  │
│  │  (1) Empty and rinse it.               │  │
│  │  ────────────────────────────────────  │  │
│  │  (2) Keep it dry.                      │  │
│  │  ────────────────────────────────────  │  │
│  │  (3) Put it in the dry-waste bin or    │  │
│  │      give it to a kabadiwala...        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  (🌿) SDG 15 · LIFE ON LAND            │  │
│  │  Recycling reduces demand for new raw  │  │
│  │  material taken from forests and land. │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Was this correct?            [ 👍 ]  [ 👎 ] │
│                                              │
│  [ 📷 Scan another item ] (Primary Pill)     │
│                                              │
│  [ Home ]           ( 📷 )        [ History ]│
└──────────────────────────────────────────────┘
```

**Layout Sequence:**
1. **TopBar:** Square back button (`ArrowLeft`); centered title "Scan result"; right spacer.
2. **Primary Result Card (`surface-glass-strong`, radius `24px`, padding `20px`):**
   * Left Column: Category tone icon ($24$ px) beside Category Name in Display style (`28px`, bold); Confidence rating `"{n}% sure"` in Subheading; 6px high confidence progress bar filled with the category tone.
   * Right Column: User photo ($112 \times 112$ px, `object-fit: cover`, radius `16px`) with an overlapping circular check badge ($28$ px emerald orb with white checkmark).
3. **Section Title:** "How to dispose" (Heading 2, `18px`, bold white).
4. **Steps Card (`surface-glass`, radius `16px`, padding `16px`):** Numbered sequence of clear disposal actions. Step indices rendered as circular badges with subtle dividers between rows.
5. **SDG 15 Impact Card (`surface-glass`, radius `16px`, padding `16px`):** Accent `Leaf` icon, overline text "SDG 15 · LIFE ON LAND", followed by educational fact sentence.
6. **Feedback Interaction Row:** Left: "Was this correct?" (or "Thanks for the feedback"). Right: Two round glass buttons ($44$ px hit area) for Thumbs Up / Thumbs Down.
7. **Action Button:** Full-width primary emerald pill button (`btn-primary`): "Scan another item".
8. **Bottom Navigation Bar:** Visible with camera FAB ready.

#### 3.3.2 "Not Sure" Result State ($< 60\%$ or Background Top)

```
┌──────────────────────────────────────────────┐
│  [ ← ]              Scan result              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  ( ? ) Not sure       ┌──────────────┐ │  │
│  │  Not sure, try        │ Photo Thumb  │ │  │
│  │  another angle        │  (No Badge)  │ │  │
│  │                       └──────────────┘ │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  💡 Try another angle.                 │  │
│  │  💡 Scan one item at a time.           │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [ 📷 Scan another item ] (Primary Pill)     │
│                                              │
│  [ Home ]           ( 📷 )        [ History ]│
└──────────────────────────────────────────────┘
```

*Key Differences from Confident Result:*
* Amber `CircleHelp` icon with title "Not sure" and subtitle "Not sure, try another angle".
* Photo thumbnail rendered **without** check badge.
* Tips card with two actionable recommendations.
* Excludes disposal steps, SDG card, feedback row, and local history persistence.
* Features the primary "Scan another item" button to quickly retry.

---

### 3.4 Screen D: History View

```
┌──────────────────────────────────────────────┐
│                     History                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ┌────┐  Recyclable ●           [ 👍 ]  │  │
│  │ │ 🖼 │  88% sure · Today, 2:30 PM      │  │
│  │ └────┘                                 │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ┌────┐  Organic ●                      │  │
│  │ │ 🖼 │  94% sure · Yesterday, 6:15 PM  │  │
│  │ └────┘                                 │  │
│  └────────────────────────────────────────┘  │
│  ... (up to 50 items)                        │
│                                              │
│  [ Home ]           ( 📷 )      [ History ● ]│
└──────────────────────────────────────────────┘
```

**Layout Sequence:**
1. **TopBar:** Centered title "History" (no back button).
2. **List of Scans:** Up to 50 cards ordered chronologically (newest first).
   * Rendered as flat translucent cards (`surface-flat`, **no backdrop blur** for scrolling performance).
   * Left: $56 \times 56$ px thumbnail (`object-fit: cover`, radius `12px`).
   * Center: Category label with an $8$ px category tone dot; subtitle with `{n}% sure` and localized date string.
   * Right: Small thumb feedback icon if set by the user.
   * Tap Interaction: Entire row is interactive ($72$ px min height), opening the Confident Result screen for that scan.
3. **Empty State (when items = 0):** Centered `Recycle` icon ($48$ px, muted), Heading 3 "No scans yet", Body "Your last 50 scans will show up here."

---

## 4. Frontend Component Architecture

### 4.1 Component Inventory & Tree

```
App.jsx (View State, Scan Orchestration, Global Inputs)
 ├── Backdrop.jsx (Persistent Gradients + Bokeh)
 ├── TopBar.jsx (Dynamic navigation title, back/close actions)
 ├── Banner.jsx (Error & retry notifications)
 ├── [View: 'home']
 │    ├── ImpactBar.jsx (Items sorted count + Day streak)
 │    └── Scanner.jsx (Scan card, hints, gallery trigger, loading indicator)
 ├── [View: 'analyzing']
 │    └── AnalyzingView.jsx (Photo, corner brackets, sweeping scan line, hints)
 ├── [View: 'result']
 │    └── ResultCard.jsx (Category, confidence bar, steps, SDG fact, feedback, retry CTA)
 ├── [View: 'history']
 │    └── History.jsx (Chronological scan list & empty state)
 └── BottomNav.jsx (Floating glass pill: Home, Camera FAB, History)
```

### 4.2 Component Responsibility & Props Contracts

| Component | Responsibility | Props Interface |
| :--- | :--- | :--- |
| `Backdrop` | Renders fixed background gradients and bokeh light layers. | *None (pure presentational)* |
| `TopBar` | Renders top navigation bar with square icon buttons and title. | `title: string`, `onBack?: () => void`, `onClose?: () => void` |
| `BottomNav` | Floating navigation bar with elevated FAB. | `active: 'home' \| 'history' \| null`, `onHome: () => void`, `onHistory: () => void`, `onScan: () => void`, `scanDisabled: boolean` |
| `ImpactBar` | Formats and displays impact metrics (items sorted, streak). | `totalSorted: number`, `streak: number` |
| `Scanner` | Renders Home scan card, hints, and gallery opener. | `ready: boolean`, `loadingText: string`, `onGalleryClick: () => void` |
| `AnalyzingView` | Viewfinder with corner brackets, sweeping scan line, and hints. | `photoCanvas: HTMLCanvasElement \| null`, `onClose: () => void` |
| `ResultCard` | Renders both Confident and Not-Sure result states. | `current: ScanResult`, `rules: RulesData`, `onFeedback: (val: 'up'\|'down'\|null) => void`, `onScanAnother: () => void` |
| `History` | Renders up to 50 scan rows or empty state. | `items: HistoryEntry[]`, `rules: RulesData`, `onOpenItem: (entry: HistoryEntry) => void` |
| `CategoryIcon` | Renders Lucide icon mapped to category tone. | `iconName: string`, `tone: string`, `size?: number` |
| `Banner` | Inline error and notification banner with retry action. | `tone: 'error' \| 'info'`, `message: string`, `onRetry?: () => void` |

---

## 5. Visual Token System (Eco Glass)

All component styles are driven by standardized CSS variables.

### 5.1 Color Tokens & Category Tones

```css
:root {
  /* Raw Palette */
  --forest-900: #0B2E25;
  --forest-800: #12402F;
  --forest-700: #1B5240;
  --forest-500: #4F8A6B;
  --forest-300: #8DB9A0;

  --emerald-300: #7BE8A4;
  --emerald-400: #4ADE80;
  --emerald-500: #2FBF71;
  --emerald-700: #1A8F52;

  --lime-mist:   #CFEA8A;
  --coral-500:   #FF6B5E;
  --amber-400:   #F5B942;
  --aqua-400:    #6FC3D9;
  --white:       #FFFFFF;
  --shadow-tint: 4, 26, 20;

  /* Semantic Mappings */
  --color-bg:              var(--forest-800);
  --color-primary:         var(--emerald-500);
  --color-primary-hover:   var(--emerald-400);
  --color-primary-pressed: var(--emerald-700);
  --color-accent:          var(--emerald-400);
  --color-highlight:       var(--lime-mist);
  --color-border:          rgba(255, 255, 255, 0.22);
  --color-border-subtle:   rgba(255, 255, 255, 0.14);
  --color-divider:         rgba(255, 255, 255, 0.10);

  /* Typography Colors */
  --color-text-primary:    #FFFFFF;
  --color-text-secondary:  rgba(255, 255, 255, 0.78);
  --color-text-muted:      rgba(255, 255, 255, 0.62);
  --color-text-disabled:   rgba(255, 255, 255, 0.32);
}
```

### 5.2 Category Visual Association Table

| Category ID | Tone Token | Hex Value | Lucide Icon | Meaning Requirement |
| :--- | :--- | :--- | :--- | :--- |
| `recyclable` | `--color-accent` | `#4ADE80` | `Recycle` | Accompanied by text "Recyclable" |
| `organic` | `--color-highlight` | `#CFEA8A` | `Sprout` | Accompanied by text "Organic" |
| `ewaste` | `--color-info` | `#6FC3D9` | `Smartphone` | Accompanied by text "E-Waste" |
| `hazardous` | `--color-error` | `#FF6B5E` | `TriangleAlert` | Accompanied by text "Hazardous" |
| `general` | `--color-text-muted` | `rgba(255,255,255,0.62)` | `Trash2` | Accompanied by text "General / Non-recyclable" |
| `not_sure` | `--color-warning` | `#F5B942` | `CircleHelp` | Accompanied by text "Not sure" |

### 5.3 Surfaces, Blurs, and Elevation

To guarantee 60 FPS performance on mid-range Android and iOS devices, **backdrop blur is strictly budgeted**:

| Class / Token | CSS Definition | Usage Policy |
| :--- | :--- | :--- |
| `.surface-glass` | `background: rgba(255,255,255,0.10); backdrop-filter: blur(24px) saturate(140%); border: 1px solid rgba(255,255,255,0.22);` | Scan Card, Steps Card, SDG Card |
| `.surface-glass-strong`| `background: rgba(255,255,255,0.14); backdrop-filter: blur(32px) saturate(150%); border: 1px solid rgba(255,255,255,0.24);` | Impact Card, Result Primary Card, BottomNav |
| `.surface-flat` | `background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);` (**NO BLUR**) | **History List Rows** (prevents scroll lag) |
| `@supports fallback` | `background: rgba(24, 70, 54, 0.88);` | Fallback for browsers lacking `backdrop-filter` |

---

## 6. Interaction, Motion, and Accessibility

### 6.1 Animations and Micro-Interactions
* **Scan Line Motion:** The glowing emerald scan line translates vertically from top to bottom over $1.6$ s (`cubic-bezier(0.4, 0, 0.2, 1)`), looping continuously.
* **Scan Line Opacity Pulse:** Line opacity cycles between $0.60$ and $1.0$ over $1.2$ s ease-in-out.
* **Button Press State:** Scale transformation to `0.97` with an active inner shadow over $120$ ms.
* **Prefers-Reduced-Motion:** When reduced motion is requested by the OS, vertical line translation is disabled; only the gentle static opacity pulse remains active.

### 6.2 Accessibility Standards (a11y)
* **Touch Targets:** Every interactive element (nav icons, thumbs buttons, close buttons, gallery triggers) adheres to a minimum hitbox of $44 \times 44$ px.
* **Text Contrast:** Primary text ($11:1$) and secondary text ($4.6:1$) exceed WCAG AA contrast standards over glass surfaces.
* **Non-Color Dependence:** Category states always present explicit text labels alongside icons and tone colors.
* **Screen Reader Announcer:** The result view wraps the primary classification in `aria-live="polite"` so screen readers immediately announce: *"Category: Recyclable, 84% sure"*.
