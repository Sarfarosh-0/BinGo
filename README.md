<div align="center">

# 🗑️ BinGo

**Smart Waste Sorting · SDG 15 — Life on Land**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)
![Bundle](https://img.shields.io/badge/Bundle-58_kB_gz-22C55E?style=flat-square)

Snap a photo of any piece of waste — BinGo tells you exactly how to dispose of it, entirely on-device with no data ever leaving your phone.

</div>

---

## ✨ Features

| Feature | Detail |
|---|---|
| 📸 **One-tap scanning** | Camera capture or gallery upload — EXIF orientation-aware |
| 🧠 **On-device AI** | MobileNetV2 classifier runs 100% in-browser via TensorFlow.js |
| ♻️ **5 waste classes** | Recyclable · Organic · E-Waste · Hazardous · General |
| 📋 **Disposal instructions** | Step-by-step how-to for every category |
| 🌿 **SDG 15 facts** | Each result surfaces a real environmental impact fact |
| 📈 **Streak & impact tracking** | Day streak + lifetime items sorted, persisted to localStorage |
| 🕘 **Scan history** | Last 50 scans stored locally with thumbnail + category |
| 👍 **Feedback loop** | Thumbs up/down on every result |
| 🔒 **100% private** | Zero backend, zero analytics, zero network calls for classification |
| 📱 **Mobile-first** | Runs offline after first visit; `viewport-fit=cover` safe-area aware |

---

## 🏗️ Architecture

> BinGo is a **100% client-side static SPA** — no backend, no server, no database.

```
┌─────────────────────────────────────────────────┐
│                  Browser (Client)               │
│                                                 │
│  ┌──────────┐    ┌──────────────────────────┐   │
│  │ React 18 │    │  TensorFlow.js (CDN)     │   │
│  │  + Vite  │───▶│  MobileNetV2 graph model │   │
│  └──────────┘    │  224×224 RGB input       │   │
│       │          │  5-class softmax output  │   │
│       │          └──────────────────────────┘   │
│       ▼                                         │
│  ┌──────────────────────────────────────────┐   │
│  │            View State Machine            │   │
│  │  home → analyzing → result → history    │   │
│  └──────────────────────────────────────────┘   │
│       │                                         │
│  ┌────▼─────────────────────────────────────┐   │
│  │     localStorage (with in-memory fallback)│  │
│  │  streak · total-sorted · history[50]     │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
         │ Served as static files
         ▼
    Vercel Edge Network
```

### Key design decisions

- **No bundled TF.js** — loaded via CDN `<script>` tag (saves ~3 MB from bundle)
- **60% confidence gate** — predictions below threshold return a "Not sure" state
- **Background class filter** — model trained with a `background` distractor class; if it tops the predictions, "Not sure" is shown
- **EXIF-aware decoding** — uses `createImageBitmap({ imageOrientation: 'from-image' })` with `<img>` element fallback
- **Run-ID guard** — every file-select increments a counter; stale async paths self-cancel to prevent race conditions
- **localStorage quota guard** — auto-drops oldest history entries on `QuotaExceededError`

---

## 🤖 AI Model

| Attribute | Value |
|---|---|
| Architecture | MobileNetV2 (transfer learning) |
| Input | 224 × 224 px RGB — `pixels / 255`, model applies internal `[-1, 1]` rescaling |
| Output | 5-class softmax probabilities |
| Test accuracy | **91.49%** |
| Classes | `recyclable` · `organic` · `ewaste` · `hazardous` · `general` |
| Confidence threshold | 60% (configurable in `src/lib/config.js`) |
| Format | TF.js Graph Model (`model.json` + 3 weight shards) |
| Total weight size | ~10 MB |

Model weights live in `public/model/` and are **never bundled** — Vercel serves them with `no-cache` headers so an updated model is picked up immediately on the next page load without a code rebuild.

---

## 📁 Project Structure

```
BinGo/
├── public/
│   ├── favicon.svg
│   ├── rules.json              # Disposal rules & SDG facts (editable, no rebuild needed)
│   └── model/
│       ├── model.json          # TF.js graph model topology
│       ├── metadata.json       # Labels, input shape, confidence threshold
│       └── group1-shard*.bin   # Weight shards (~10 MB total)
│
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # View state machine & scan pipeline orchestrator
│   │
│   ├── components/
│   │   ├── Backdrop.jsx        # Animated dark-green gradient background
│   │   ├── TopBar.jsx          # Screen header (optional back / close button)
│   │   ├── BottomNav.jsx       # Floating glass nav — Home · Scan · History
│   │   ├── ImpactBar.jsx       # Items sorted + day streak counters
│   │   ├── Scanner.jsx         # Viewfinder card + camera & gallery buttons
│   │   ├── AnalyzingView.jsx   # Full-screen scan overlay with sweep animation
│   │   ├── ResultCard.jsx      # Confident result or "Not sure" state
│   │   ├── CategoryIcon.jsx    # Lucide icon mapped from categoryId
│   │   ├── History.jsx         # FIFO scan history list (max 50)
│   │   └── Banner.jsx          # Dismissible error / info toast
│   │
│   ├── hooks/
│   │   ├── useModel.js         # TF.js model load + warmup inference + retry logic
│   │   ├── useStreak.js        # Day streak + totalSorted with localStorage persistence
│   │   └── useHistory.js       # Scan history CRUD (max 50, FIFO eviction)
│   │
│   └── lib/
│       ├── tm.js               # TF.js wrapper — accesses globalThis.tf (CDN global)
│       ├── classify.js         # Decision engine: confidence gate + background filter
│       ├── image.js            # EXIF decode · cover-crop to 224px · thumbnail pipeline
│       ├── rules.js            # rules.json fetch + schema validation
│       ├── storage.js          # localStorage wrapper with in-memory quota fallback
│       ├── date.js             # DST-safe date helpers for streak calculation
│       ├── config.js           # Tunable constants (threshold, image sizes)
│       └── strings.js          # Central UI string dictionary
│
├── index.html                  # TF.js CDN script + React module entry point
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json                 # SPA rewrites + cache-control headers
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **≥ 18**
- npm **≥ 9**

### Install & run locally

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/BinGo.git
cd BinGo

# 2. Install dependencies
npm install

# 3. Start the dev server with hot-reload
npm run dev
# → http://localhost:3000
```

> **Note:** The first load takes ~3–5 s while the browser downloads the ~10 MB model weights from `public/model/`. Subsequent loads are fast thanks to HTTP caching.

### Production build

```bash
npm run build          # Output: dist/  — deploy this folder
npm run preview        # Preview the production build locally
```

**Build output:**

| Asset | Raw | Gzip |
|---|---|---|
| `index-[hash].js` | 188 kB | **58 kB** |
| `index-[hash].css` | 23 kB | 5.8 kB |
| Model weights | ~10 MB | served separately, never bundled |

---

## 🌐 Deploy to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the project
3. Framework preset: **Vite**
4. No environment variables needed — zero config

The included `vercel.json` automatically handles:

- **SPA routing** — all paths rewrite to `index.html`
- **Immutable asset caching** — `Cache-Control: public, max-age=31536000, immutable` for hashed JS/CSS
- **No-cache for live content** — `rules.json` and model files are never stale-served

---

## ⚙️ Configuration

All tunable constants are in [`src/lib/config.js`](src/lib/config.js):

```js
// Minimum probability to classify as confident (0.0 – 1.0)
export const CONFIDENCE_THRESHOLD = 0.60

// Waste classes that count as visible output (background is excluded)
export const VISIBLE_CATEGORIES = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

export const IMAGE_CONFIG = {
  INPUT_MAX_SIDE: 512,    // Max dimension for display canvas (px)
  THUMB_MAX_SIDE: 100,    // Max dimension for history thumbnails (px)
  THUMB_QUALITY:  0.60,   // JPEG compression quality for thumbnails
}
```

Disposal steps, labels, and SDG facts are all in [`public/rules.json`](public/rules.json). You can update this file and redeploy **without touching any code**.

---

## 🗺️ Waste Categories

| Category | SDG Fact |
|---|---|
| ♻️ **Recyclable** | Recycling reduces demand for raw material extracted from forests and land |
| 🌱 **Organic** | Compost returns nutrients to soil instead of rotting in landfills |
| 📱 **E-Waste** | Toxic metals from dumped electronics leak into soil and harm land ecosystems |
| ⚠️ **Hazardous** | Chemicals and batteries contaminate soil and the life that depends on it |
| 🗑️ **General** | Waste left on open land damages soil and habitats |

---

## 🛡️ Privacy

BinGo was designed **privacy-first by architecture**:

- **No backend** — classification runs on-device using WebGL / CPU
- **No image uploads** — photos never leave the browser tab
- **No accounts** — streak and history exist only in your device's `localStorage`
- **No analytics** — no tracking scripts, pixels, or beacons of any kind
- **Open source** — you can audit every line of code in this repo

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repo and create a branch: `git checkout -b feat/your-feature`
2. All UI copy must go through `src/lib/strings.js` (no hardcoded strings in components)
3. Run `npm run build` — the JS bundle must stay **under 350 kB gzipped**
4. Open a Pull Request with a clear description of the change

### Updating the AI model

1. Re-train a MobileNetV2 classifier (e.g. via [Teachable Machine](https://teachablemachine.withgoogle.com/) or Keras)
2. Export as a **TF.js Graph Model**
3. Drop the new files into `public/model/`
4. If classes changed, update `public/model/metadata.json` → `labels` array

---

## 📄 License

MIT © 2026 Sarfarosh Alam

---

<div align="center">

Built for **SDG 15 — Life on Land** 🌍

*"Every scan that lands waste in the right bin is a vote for the planet."*

</div>
