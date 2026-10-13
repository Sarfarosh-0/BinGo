# BinGo: Gated Build Execution Plan

**Project:** BinGo — Smart Waste Sorting for SDG 15 (Life on Land)  
**Document Role:** Token-Safe, Multi-Stage Development Execution Guide & Gate Tracking  
**Status:** Ready for Execution  

---

## 1. Strategy for Token-Safe Execution

To guarantee zero token truncation, avoid context degradation, and ensure robust production quality, development proceeds through **six sequential gates**. 

Each gate:
1. Implements a bounded, self-contained set of modules.
2. Validates functionality and runs `npm run build` with zero errors.
3. Serves as a solid checkpoint before the next gate begins.

---

## 2. Gate-by-Gate Roadmap & Verification Gates

```
  [Gate 0: Core ML & Environment Setup]
                     │
                     ▼
  [Gate 1: Design System & Visual Shell]
                     │
                     ▼
  [Gate 2: Storage & State Management]
                     │
                     ▼
  [Gate 3: Image Pipeline & Classification Flow]
                     │
                     ▼
  [Gate 4: Real Model / Rules & Edge Case Hardening]
                     │
                     ▼
  [Gate 5: Production Deployment & Cross-Device QA]
```

---

### Gate 0: Project Scaffolding & Environment Setup
- [x] Initialize project using React + Vite.
- [x] Configure `tailwind.config.js` (v3.4 layout utilities) and `postcss.config.js`.
- [x] Pin exact dependencies in `package.json` (`react`, `react-dom`, `@teachablemachine/image`, `@tensorflow/tfjs`, `lucide-react`, `@fontsource-variable/inter`).
- [x] Configure CDN script fallbacks in `index.html` for TensorFlow.js if needed.
- [x] Create initial directory structure under `src/` (`components/`, `hooks/`, `lib/`, `styles/`).
- [x] Verify bare environment compilation with `npm run build`.
* **Pass Criteria:** Clean Vite build output, zero warnings. (PASSED)

---

### Gate 1: Design System & Visual Shell
- [x] Create `src/styles/tokens.css` with all Eco Glass custom properties.
- [x] Create `src/styles/components.css` (`.surface-glass`, `.surface-glass-strong`, `.surface-flat`, buttons).
- [x] Import design tokens and typography into `src/styles/index.css`.
- [x] Implement `Backdrop.jsx` (persistent forest gradient and static bokeh).
- [x] Implement `TopBar.jsx` (title and 44px back/close hitboxes).
- [x] Implement `BottomNav.jsx` (floating glass pill with elevated center camera FAB).
- [x] Implement `ImpactBar.jsx` (items sorted & streak counter display).
- [x] Implement `Scanner.jsx` (scan card with decorative frame, hints, gallery trigger).
- [x] Assemble Home shell in `App.jsx` with mobile viewport clamp (`max-w-[480px]`).
* **Pass Criteria:** Pixel-perfect Home screen layout conforming to Eco Glass specs on 375px mobile view. (PASSED)

---

### Gate 2: Storage & State Management
- [x] Implement `src/lib/date.js` (DST-safe local calendar date formatting & difference calculation).
- [x] Implement `src/lib/storage.js` (localStorage wrapper with automatic quota management & in-memory fallback).
- [x] Implement `src/hooks/useStreak.js` (daily streak calculation and `totalSorted` lifetime counter).
- [x] Implement `src/hooks/useHistory.js` (history CRUD capped strictly at 50 items, thumbnail storage, thumbs feedback).
- [x] Implement `src/components/History.jsx` (chronological list using `.surface-flat` and empty state).
- [x] Connect tab switching between Home and History in `App.jsx`.
* **Pass Criteria:** Automated tests verify streak increment rules, 50-item FIFO cap, and quota drop logic. (PASSED)

---

### Gate 3: Image Pipeline & Scanning Flow
- [ ] Implement `src/lib/image.js` (EXIF-aware orientation, offscreen canvas downscaling to $\le 512$px, 100px thumbnail compression).
- [ ] Implement `src/lib/classify.js` (probability sorting, 0.60 confidence gate, and background class filter).
- [ ] Implement `src/components/AnalyzingView.jsx` (viewfinder, white corner brackets, glowing scan line animation, 500ms minimum display).
- [ ] Implement `src/components/ResultCard.jsx` (Confident result with disposal steps & SDG fact; Not-Sure result with scanning tips).
- [ ] Implement `src/components/CategoryIcon.jsx` (Lucide icon mapping for all categories).
- [ ] Wire native camera input (`capture="environment"`) and gallery picker in `App.jsx`.
- [ ] Hook up browser history navigation (`pushState` / `popstate`) for Result back button behavior.
* **Pass Criteria:** Full flow functional from image upload to analysis animation and result presentation.

---

### Gate 4: Rules Content, Model Integration & Edge Case Hardening
- [ ] Mount validated `public/rules.json` (exact copy from PRD Section 8.6).
- [ ] Implement `src/lib/rules.js` (fetcher and schema validator with in-memory fallback).
- [ ] Implement `src/lib/tm.js` and `src/hooks/useModel.js` (model loading, validation, and blank tensor warmup).
- [ ] Mount final/scaffold model files in `public/model/` (`model.json`, `metadata.json`, `weights.bin`).
- [ ] Implement `src/components/Banner.jsx` for dismissible/retryable inline error notifications.
- [ ] Verify all 26 edge cases from Technical Approach Section 7 (non-images, canceled scans, corrupt storage, memory leaks).
* **Pass Criteria:** Model warmup runs on load, zero console errors, scan time $< 2$ seconds.

---

### Gate 5: Production Deployment & QA
- [ ] Run `npm run build` and ensure bundle size $\le 350$ KB gzipped (excluding model weights).
- [ ] Verify accessibility: WCAG AA contrast, 44px touch targets, `aria-live="polite"` on results.
- [ ] Verify responsive layout across 320px–480px mobile viewports and desktop centered frame.
- [ ] Prepare static deployment configuration for Vercel.
* **Pass Criteria:** Clean production bundle ready for static HTTPS deployment.

---

## 3. Progress Tracking Log

| Gate | Focus | Status | Completed At |
| :--- | :--- | :--- | :--- |
| **Gate 0** | Core ML & Environment Setup | **Completed** | 2026-10-13 |
| **Gate 1** | Design System & Visual Shell | **Completed** | 2026-10-13 |
| **Gate 2** | Storage & State Management | **Completed** | 2026-10-13 |
| **Gate 3** | Image Pipeline & Full Flow | Pending | — |
| **Gate 4** | Rules & Edge Case Hardening | Pending | — |
| **Gate 5** | Production Build & QA | Pending | — |
