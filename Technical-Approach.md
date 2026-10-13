# BinGo: Technical Approach

**Project:** BinGo — Smart Waste Sorting for SDG 15 (Life on Land)  
**Document Role:** Implementation Architecture, Systems Design, ML Pipeline, and Gated Build Plan  
**Version:** 1.2 (Complete with Reconstructed Sections 12–19)  
**Status:** Approved for Implementation  

---

## 1. System Architecture and High-Level Data Flow

BinGo is architected as a **100% client-side Single-Page Application (SPA)** with zero server dependencies, zero external runtime APIs, and zero databases.

```
 Mobile Browser (Chrome 111+ / Safari 16.4+) [HTTPS hosted on Vercel]
 ┌────────────────────────────────────────────────────────────────────────┐
 │ React UI Layer                                                         │
 │  Home ──► Analyzing (Min 500ms) ──► Result (Confident / Not Sure)     │
 │    │           │                         │               │             │
 │    ▼           ▼                         ▼               ▼             │
 │ Hidden File Inputs                     History        Impact / Streak  │
 │ (Camera / Gallery)                        │              │             │
 │    │                                      │              │             │
 │    ▼                                      ▼              ▼             │
 │ lib/image.js                           lib/storage.js                  │
 │ (EXIF decode, canvas resize ≤512px)       │ (localStorage wrapper)     │
 │    │                                      ▼                            │
 │    ▼                                 Device localStorage               │
 │ lib/classify.js                       - bingo:v1:history (max 50)      │
 │    │                                  - bingo:v1:progress              │
 │    ├─────────────────────────────┐                                     │
 │    ▼                             ▼                                     │
 │ lib/tm.js                    lib/rules.js                              │
 │ (TensorFlow.js / TM model)   (loads & validates public/rules.json)     │
 │    │                             │                                     │
 │    ▼                             ▼                                     │
 │ public/model/*               public/rules.json                         │
 │ (model.json, metadata.json)                                            │
 └────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Architectural Boundary Rules
To prevent coupling and maintain strict reliability:
1. **Machine Learning Boundary:** Only `src/lib/tm.js` may import or reference `@teachablemachine/image`, `@tensorflow/tfjs`, or `window.tmImage`. No component or hook may access TensorFlow directly.
2. **Storage Boundary:** Only `src/lib/storage.js` may interact with `window.localStorage`. All data persistence, quota handling, and memory fallbacks are encapsulated here.
3. **Data Immutability:** Disposal instructions and SDG 15 statements are exclusively loaded from `public/rules.json`. Hardcoded disposal copy in UI components is strictly prohibited.

---

## 2. Technology Stack & Justification

| Technology | Selection | Version Policy | Justification |
| :--- | :--- | :--- | :--- |
| **Framework / Build** | React + Vite | React 18.x / Vite 5.x | Ultra-fast HMR, tiny production bundles, standard modern SPA foundation. |
| **Styling** | Tailwind CSS v3.4 + Eco Glass CSS | Pinned v3.4.x | Tailwind provides layout and flexbox utilities; Eco Glass CSS variables supply 100% of the visual tokens. v3.4 ensures 100% compatibility across older Safari versions. |
| **ML Engine** | `@teachablemachine/image` + `@tensorflow/tfjs` | TF.js `1.3.1` / TM `0.8.5` (or pinned CDN script fallback) | Runs quantized MobileNet model locally in the browser with WebGL acceleration. Zero backend inference costs. |
| **Icons** | `lucide-react` | Pinned latest stable | Lightweight, clean, modern line icons matching the Eco Glass token specifications (stroke $1.75$ px). |
| **Typography** | `@fontsource-variable/inter` | Self-hosted variable | Self-hosted variable font eliminates external Google Fonts network requests and layout shifts. |
| **Hosting** | Vercel (Static SPA) | GitHub Integration | Instant global CDN delivery with automatic HTTPS (mandatory for mobile camera access). |

---

## 3. Directory and File Structure

```
bingo/
├── index.html                       # Viewport-fit=cover, theme-color, Inter preload
├── package.json                     # Pinned dependencies
├── vite.config.js                   # Vite config with base path and alias setup
├── tailwind.config.js               # Tailwind v3.4 configuration (layout utilities only)
├── postcss.config.js
├── .gitignore                       # Ignores node_modules, dist, dataset
├── README.md                        # Project instructions and licence credits
├── VERSIONS.md                      # Pinned library version log
├── public/
│   ├── model/                       # Model export files
│   │   ├── model.json
│   │   ├── metadata.json
│   │   └── weights.bin
│   ├── rules.json                   # Validated disposal content and SDG facts
│   └── favicon.ico
└── src/
    ├── main.jsx                     # Application root entry
    ├── App.jsx                      # View state machine, global inputs, popstate
    ├── styles/
    │   ├── tokens.css               # Eco Glass CSS custom properties
    │   ├── components.css           # Glass surfaces, button orbs, chips, scan frame
    │   └── index.css                # Tailwind imports and base layers
    ├── components/
    │   ├── Backdrop.jsx             # Fixed gradient & static bokeh layer
    │   ├── TopBar.jsx               # Header bar with back/close and title
    │   ├── BottomNav.jsx            # Floating glass nav (Home, Camera FAB, History)
    │   ├── Banner.jsx               # Error notifications with retry action
    │   ├── ImpactBar.jsx            # Items sorted counter & day streak
    │   ├── Scanner.jsx              # Home scan card, hints, gallery button
    │   ├── AnalyzingView.jsx        # Viewfinder, corner brackets, glowing scan line
    │   ├── ResultCard.jsx           # Confident and Not-Sure result views
    │   ├── History.jsx              # Scan history list & empty state
    │   └── CategoryIcon.jsx         # Lucide icon mapper for categories
    ├── hooks/
    │   ├── useModel.js              # Model loading, validation, warmup, retry
    │   ├── useHistory.js            # History CRUD, quota management, feedback
    │   └── useStreak.js             # Local calendar date streak & impact counter
    └── lib/
        ├── config.js                # App constants (threshold 0.60, caps, keys)
        ├── strings.js               # Central UI string dictionary
        ├── tm.js                    # Teachable Machine loader & predict wrapper
        ├── classify.js              # Top prediction sorting & decision engine
        ├── image.js                 # EXIF-aware canvas decode, resize, thumbnail
        ├── date.js                  # DST-safe local calendar date key calculations
        ├── storage.js               # LocalStorage wrapper with in-memory fallback
        └── rules.js                 # Fetch and validate rules.json schema
```

---

## 4. Application State and Navigation Architecture

### 4.1 State Machine
The app operates on a single active view state: `'home' | 'analyzing' | 'result' | 'history'`.

```
                  ┌──────────────┐
                  │     Home     │
                  └──────┬───────┘
                         │ User selects image (File input)
                         ▼
                  ┌──────────────┐
       ┌──────────│  Analyzing   │──────────┐
       │          └──────┬───────┘          │
       │ (User taps X)   │                  │ (Decode or classify error)
       ▼                 │                  ▼
  Return to Home         │ Inference Done   Return to Home + Error Banner
                         ▼
        ┌───────────────────────────────────┐
        │ Top = Background OR Conf < 0.60?  │
        └─────────┬───────────────┬─────────┘
                  │ Yes           │ No
                  ▼               ▼
         ┌─────────────────┐  ┌──────────────────────────────────┐
         │ Result: Not Sure│  │ Result: Confident                │
         │ (Nothing saved) │  │ - Save History (Thumbnail + Meta)│
         └────────┬────────┘  │ - Increment Total Scans          │
                  │           │ - Update Day Streak              │
                  │           └────────────────┬─────────────────┘
                  │                            │
                  └────────────┬───────────────┘
                               │ User taps Back / Back Swipe
                               ▼
                        Originating Tab (Home or History)
```

### 4.2 Browser History & Back Button Behavior
* When transitioning to `result`, the app executes `window.history.pushState({ view: 'result' }, '')`.
* A global `popstate` listener intercepts native Android back buttons or iOS swipe-back gestures, cleanly returning the user to their originating tab (`home` or `history`) without exiting the web application.
* When navigating away from `result`, object URLs created for image display are revoked via `URL.revokeObjectURL()` to prevent memory leaks.

---

## 5. Data Specifications and Schemas

### 5.1 `public/rules.json` Schema

Disposal steps and SDG 15 lines are fixed and validate against this strict schema:

```json
{
  "version": 1,
  "fallback": {
    "title": "Not sure",
    "message": "Not sure, try another angle",
    "tips": [
      "Try another angle.",
      "Scan one item at a time."
    ]
  },
  "categories": {
    "recyclable": {
      "id": "recyclable",
      "label": "Recyclable",
      "iconName": "Recycle",
      "tone": "accent",
      "steps": [
        "Empty and rinse it.",
        "Keep it dry.",
        "Put it in the dry-waste bin or give it to a kabadiwala or recycler."
      ],
      "sdgFact": "Recycling reduces demand for new raw material taken from forests and land."
    },
    "organic": {
      "id": "organic",
      "label": "Organic",
      "iconName": "Sprout",
      "tone": "highlight",
      "steps": [
        "Put it in the wet-waste bin or a compost pit.",
        "Don't mix it with plastic."
      ],
      "sdgFact": "Compost returns nutrients to soil instead of rotting in landfills."
    },
    "ewaste": {
      "id": "ewaste",
      "label": "E-Waste",
      "iconName": "Smartphone",
      "tone": "info",
      "steps": [
        "Don't put it in household waste.",
        "Hand it to an authorised e-waste collector or a take-back counter."
      ],
      "sdgFact": "Toxic metals from dumped electronics can leak into soil and harm land ecosystems."
    },
    "hazardous": {
      "id": "hazardous",
      "label": "Hazardous",
      "iconName": "TriangleAlert",
      "tone": "error",
      "steps": [
        "Keep it separate and sealed.",
        "Don't burn, flush or mix it.",
        "Give it to a hazardous-waste collection point."
      ],
      "sdgFact": "Chemicals and batteries that reach the ground contaminate soil and the life that depends on it."
    },
    "general": {
      "id": "general",
      "label": "General / Non-recyclable",
      "iconName": "Trash2",
      "tone": "muted",
      "steps": [
        "Wrap it and put it in the general dry non-recyclable bin.",
        "Don't litter."
      ],
      "sdgFact": "Waste left on open land damages soil and habitats, so proper disposal protects them."
    }
  }
}
```

### 5.2 Device Local Storage Schemas

Storage keys are prefixed with `bingo:v1:`:

#### Key 1: `bingo:v1:history`
Array of objects, sorted newest first, strictly capped at $50$ items:
```typescript
interface HistoryEntry {
  id: string;              // crypto.randomUUID() with fallback
  ts: number;              // Date.now()
  categoryId: string;      // 'recyclable' | 'organic' | 'ewaste' | 'hazardous' | 'general'
  confidence: number;      // 0.0 to 1.0
  thumb: string;           // Base64 JPEG data URL (max side 100px, quality 0.60)
  feedback: 'up' | 'down' | null;
}
```

#### Key 2: `bingo:v1:progress`
Object tracking lifetime counts and day streak:
```typescript
interface ProgressRecord {
  totalSorted: number;     // Lifetime confident scans count (continues past 50)
  byCategory: {
    recyclable: number;
    organic: number;
    ewaste: number;
    hazardous: number;
    general: number;
  };
  streak: {
    count: number;
    lastDate: string | null; // Local calendar format: 'YYYY-MM-DD'
  };
}
```

### 5.3 Daily Streak & Impact Calculation Algorithm
* **Local Date Key:** Computed via `localDateKey(new Date())` using the device's local calendar (year, month, day). UTC is never used for streak logic to avoid premature rollover in Indian timezones.
* **Streak Update Rules on Confident Scan:**
  1. If `lastDate == null`: `count = 1, lastDate = today`.
  2. If `dayDiff(lastDate, today) === 0` (same day): no change to streak count.
  3. If `dayDiff(lastDate, today) === 1` (consecutive day): `count += 1, lastDate = today`.
  4. If `dayDiff(lastDate, today) > 1` (missed a day): `count = 1, lastDate = today`.
  5. If `dayDiff < 0` (clock shifted backwards): ignore change.
* **Effective Streak for Display:**
  On the Home screen, the displayed streak shows `count` if `lastDate` is today or yesterday; if `lastDate` is older than yesterday, it displays `0` (an inactive streak), but preserves the stored value until the next scan.

---

## 6. Image Processing and Classification Pipeline

### 6.1 Image Acquisition and Canvas Pipeline (`src/lib/image.js`)
1. **EXIF Normalization:** Images are decoded using `createImageBitmap(file, { imageOrientation: 'from-image' })` with an `HTMLImageElement` fallback to ensure upright orientation regardless of mobile camera orientation.
2. **Dimension Scaling:** Images are scaled down to a maximum side length of $512$ px (`INPUT_MAX_SIDE`) on an offscreen canvas. This avoids mobile memory bottlenecks while preserving optimal feature resolution.
3. **Thumbnail Generation:** A lightweight $100$ px JPEG thumbnail (`THUMB_QUALITY = 0.60`) is generated for storage in history (~$3$ to $5$ KB).

### 6.2 Decision Engine (`src/lib/classify.js`)
* The scaled canvas is fed to `model.predict(canvas)`.
* Results are sorted descending by probability.
* **Evaluation Matrix:**
  - If `top.className === 'background'` $\rightarrow$ `{ kind: 'not_sure', reason: 'background' }`
  - If `top.probability < 0.60` $\rightarrow$ `{ kind: 'not_sure', reason: 'low_confidence' }`
  - If `top.probability >= 0.60` and top class is valid $\rightarrow$ `{ kind: 'result', categoryId: top.className, confidence: top.probability }`

### 6.3 Model Warmup
Immediately upon model load in `useModel.js`, a dummy prediction is run against a blank $224 \times 224$ canvas. This forces TensorFlow.js WebGL shader compilation at initialization rather than during the user's first live scan.

---

## 7. Edge-Case Matrix

The implementation explicitly handles all 26 identified edge scenarios:

| # | Edge Case | Mitigation / Handling Strategy | Module |
| :- | :--- | :--- | :--- |
| 1 | Model still loading | Scan FAB and gallery buttons disabled; "Loading model..." shown | `useModel`, `Scanner` |
| 2 | Model fails to load | Inline error banner displayed with actionable "Retry" button | `useModel`, `Banner` |
| 3 | `rules.json` fetch fails | Error banner "Couldn't load app content"; controls stay disabled | `rules.js`, `App` |
| 4 | Model class name mismatch | Validates labels on load; sets error state if classes $\neq 6$ | `useModel` |
| 5 | Non-image file chosen | Rejects file, displays banner: "That file isn't an image." | `image.js`, `App` |
| 6 | Massive photo (20MB+) | Decoded and clamped to $\le 512$px offscreen canvas before inference | `image.js` |
| 7 | Image decode failure | Caught in try/catch; shows "Couldn't read that photo." banner | `image.js` |
| 8 | Prediction runtime exception| Caught in try/catch; shows "Something went wrong while scanning." | `classify.js`, `App` |
| 9 | Cluttered multi-item photo | Prevented by on-screen hints; low confidence triggers "Not sure" | Copy & Decision |
| 10 | Unseen object category | Yields low probability ($< 60\%$), cleanly triggering "Not sure" | `classify.js` |
| 11 | Empty frame / hand / wall | `background` class achieves top rank, cleanly triggering "Not sure"| `classify.js` |
| 12 | Confidence exactly 60% | Counts as Confident ($\ge 0.60$ threshold) | `classify.js` |
| 13 | User cancels Analyzing | `runId` ref incremented on close; late prediction promise discarded | `App.jsx` |
| 14 | Rapid multi-tap on scan | Ignored while `view === 'analyzing'` | `App.jsx` |
| 15 | Same image picked twice | File input `value` reset to `''` after each selection | `App.jsx` |
| 16 | `localStorage` quota full | Drops oldest scans iteratively until write succeeds; preserves state | `storage.js` |
| 17 | Private browsing mode | In-memory store activated; app works seamlessly for active session | `storage.js` |
| 18 | Corrupt stored JSON | Caught and defaulted to empty history / default progress | `storage.js` |
| 19 | Device clock rolls back | Negative day difference branch preserves existing streak | `date.js`, `useStreak` |
| 20 | DST / Timezone shift | Safe day difference calculated using UTC day boundaries | `date.js` |
| 21 | Camera denied / non-HTTPS | Fallback gracefully handled; gallery picker remains operational | Deployment / OS |
| 22 | Back button on Result | Pushed browser history pops back to originating tab | `App.jsx` |
| 23 | Rotated phone photo | `imageOrientation: 'from-image'` maintains upright rendering | `image.js` |
| 24 | Slow network connection | Model loading indicator persists smoothly; no timeout crashes | `useModel` |
| 25 | Memory leak from URLs | Object URLs explicitly revoked upon leaving Result screen | `App.jsx` |
| 26 | WebGL unavailable | TensorFlow.js automatically falls back to CPU backend | `tm.js` |

---

## 8. Dataset Preparation and Training Plan (Section 12)

### 8.1 Dataset Composition and Sourcing
The model is trained on a curated dataset combining public Kaggle waste images with real mobile photographs:
* **Target Classes (6 Total):**
  1. `recyclable` (~100 Kaggle + 25 team mobile shots)
  2. `organic` (~100 Kaggle + 25 team mobile shots)
  3. `ewaste` (~100 Kaggle + 25 team mobile shots)
  4. `hazardous` (~100 Kaggle + 25 team mobile shots)
  5. `general` (~100 Kaggle + 25 team mobile shots)
  6. `background` (40–60 shots of empty tables, walls, floors, holding hands, blurred rooms)

### 8.2 Labeling and Curation Protocol
* Every image must be audited against the tie-break rules in PRD Section 6.1.
* Multi-material or ambiguous items that cannot be firmly categorized are discarded.
* Images must reflect realistic lighting, angled perspectives, and slight shadows typical of mobile phone snapshots.

### 8.3 Train / Test Holdout Split (20% Gate)
* **Split Ratio:** Strict 80% Training / 20% Testing split applied **per class**.
* **Leakage Prevention:** Multiple shots of the same physical item must be grouped entirely into either the training set or the test set—never split across both.
* The test set is held out permanently and evaluated independently to verify the $\ge 80\%$ accuracy requirement.

### 8.4 Model Export Procedure
* Model trained using Google Teachable Machine (Image Project, standard MobileNet backbone).
* Exported format: **TensorFlow.js (Upload/Download) $\rightarrow$ Download model**.
* Downloaded files placed in `public/model/`:
  - `model.json`
  - `metadata.json`
  - `weights.bin`

---

## 9. Version Pinning & Bare-Component Test (Section 13)

### 9.1 Dependency Pinning
Teachable Machine models depend on legacy TensorFlow.js graph operations. The dependencies are pinned with exact versions:
```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@teachablemachine/image": "0.8.5",
    "@tensorflow/tfjs": "1.3.1",
    "lucide-react": "^0.395.0",
    "@fontsource-variable/inter": "^5.0.18"
  }
}
```

### 9.2 Script-Tag CDN Fallback
If npm package bundler conflicts occur with Vite during build, the verified CDN fallback is loaded in `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js"></script>
```
In `src/lib/tm.js`:
```javascript
const tmImage = window.tmImage || (await import('@teachablemachine/image'));
```

### 9.3 Bare-Component Isolation Test
Before building any UI components, Gate 0 requires running an isolated bare test script:
1. Load `model.json` and `metadata.json` from `/public/model/`.
2. Execute a single prediction against a blank $224 \times 224$ canvas.
3. Validate that 6 probabilities are returned corresponding to the six target class IDs.

---

## 10. Gated Build Order (Section 14)

Development proceeds in strict, sequential gates. An agent may not proceed to the next gate until all verification checks of the current gate have passed:

```
[Gate 0: Core ML & Environment]
  ├── Initialize Vite + React project
  ├── Configure Tailwind v3.4 + tokens.css
  ├── Verify bare model loading & prediction in isolation
  └── PASS CRITERIA: Bare prediction logs 6 probabilities to console

[Gate 1: Design System & Shell]
  ├── Implement Backdrop.jsx (gradients + bokeh)
  ├── Implement TopBar.jsx and BottomNav.jsx with 44px hitboxes
  ├── Implement Scanner.jsx with decorative scan frame
  ├── Verify safe-area insets & responsive layout on mobile viewport (375px)
  └── PASS CRITERIA: Pixel-perfect Home layout matching Eco Glass tokens

[Gate 2: Storage & State Management]
  ├── Implement lib/storage.js with quota & in-memory fallback
  ├── Implement useHistory.js and useStreak.js (local date logic)
  ├── Implement History.jsx list (flat cards, no blur) and empty state
  └── PASS CRITERIA: Unit test passes for streak increment and 50-item cap

[Gate 3: Image Pipeline & Full Flow]
  ├── Implement lib/image.js (EXIF decode, 512px canvas, 100px thumbnail)
  ├── Implement AnalyzingView.jsx (sweeping scan line animation)
  ├── Implement lib/classify.js decision engine (0.60 threshold & Background)
  ├── Implement ResultCard.jsx (Confident & Not-Sure states)
  ├── Hook up native camera & gallery hidden file inputs
  └── PASS CRITERIA: Full scan flow works from photo pick to result view

[Gate 4: Real Model & Edge Case Hardening]
  ├── Mount final trained model in /public/model/
  ├── Mount validated public/rules.json
  ├── Validate all 26 edge cases in Section 7
  └── PASS CRITERIA: Zero console warnings, <2s scan latency on mobile

[Gate 5: Production Deployment & Cross-Device QA]
  ├── Execute npm run build (verifying zero build warnings)
  ├── Deploy to Vercel with automatic HTTPS
  └── PASS CRITERIA: Verified on real Android Chrome and iOS Safari
```

---

## 11. Testing and Verification Plan (Section 15)

### 11.1 Automated Logic Tests
* **Date & Streak Calculation:** Test `dayDiff` across month transitions, leap years, and DST changes.
* **Storage Wrapper:** Test quota overflow by inserting 60 items and verifying oldest 10 items are dropped without data loss.
* **Decision Engine:** Verify that a $59.9\%$ confidence score yields `not_sure`, while $60.0\%$ yields `result`. Verify that `background` at $95\%$ yields `not_sure`.

### 11.2 Real-Device Manual Verification
* **Android Chrome:** Verify camera opens environment camera; verify back button returns to Home from Result.
* **iOS Safari:** Verify portrait photo orientation is upright (EXIF handled); verify bottom nav clears home bar indicator.
* **Performance Benchmark:** Verify scan analysis completes in under $2$ seconds.

---

## 12. Deployment Configuration (Section 16)

* **Platform:** Vercel (Static Web Application).
* **Build Command:** `npm run build`.
* **Output Directory:** `dist`.
* **Root Directory:** `./`.
* **HTTPS:** Required and enforced by Vercel; camera access will fail under plain HTTP.
* **Headers:** Standard caching for immutable static assets (`/assets/*`), `no-cache` for `model.json` and `rules.json`.

---

## 13. Risk Register & Mitigations (Section 17)

| Risk | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Model Incompatible with Bundler** | High | Medium | CDN fallback via script tags in `index.html` ready to activate. |
| **Large Camera Photos Crash iOS** | High | Medium | Offscreen canvas scales image immediately to $\le 512$px before feeding ML. |
| **Model Accuracy $<80\%$ on Real Items** | Medium | Medium | Single allowed retrain; transparent reporting in PPT if deadline arrives. |
| **Local Storage Quota Exceeded** | Low | Low | Thumbnails heavily compressed (JPEG 0.60, 100px); auto-drop oldest entries. |
| **Backdrop Blur Causes Scroll Lag** | Medium | Low | History list items use flat translucent fills without `backdrop-filter`. |

---

## 14. Verification Checklist & Success Criteria (Section 18)

- [ ] All 6 classes recognized: `recyclable`, `organic`, `ewaste`, `hazardous`, `general`, `background`.
- [ ] Model warmup inference runs on app initialization.
- [ ] Confident results display category, `{n}% sure`, disposal steps, SDG 15 fact, and feedback row.
- [ ] Low confidence ($<60\%$) or Background scans display "Not sure, try another angle" and are never saved to history.
- [ ] "Scan another item" button exists and functions on both Result screens.
- [ ] History displays last 50 scans with thumbnails and feedback icons.
- [ ] Impact counter increments accurately; streak tracks local calendar days.
- [ ] Native back navigation behaves correctly without exiting the application.
- [ ] Deployed to Vercel over HTTPS and verified on mobile devices.
