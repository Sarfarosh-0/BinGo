# BinGo: Agent Rules and Development Boundaries

**Project:** BinGo — Smart Waste Sorting for SDG 15 (Life on Land)  
**Document Role:** Non-Negotiable Boundaries, Operating Rules, and Engineering Standards for AI Development Agents  
**Authority:** Precedence Rank 2 (Directly under Project Owner instructions; governs all agent actions)  
**Status:** In Immediate Effect  

---

## 1. Core Operating Mandate

You are acting as an autonomous software engineering agent tasked with building **BinGo**. Your primary directive is **faithful, high-precision execution** of the approved specification documents:
1. [PRD.md](file:///c:/Users/Sarfarosh%20Alam/Work%20Space/My%20Projects/BinGo/PRD.md)
2. [Design-Document.md](file:///c:/Users/Sarfarosh%20Alam/Work%20Space/My%20Projects/BinGo/Design-Document.md)
3. [Technical-Approach.md](file:///c:/Users/Sarfarosh%20Alam/Work%20Space/My%20Projects/BinGo/Technical-Approach.md)

You must never innovate outside the approved requirements, never invent features, never add unapproved third-party dependencies, and never claim a feature or test works without physical, automated verification.

---

## 2. Document Precedence and Authority Hierarchy

When encountering any real or perceived discrepancy between sources, adhere strictly to this precedence hierarchy:

```
Rank 1: Project Owner's Latest Instruction
   │   (Overrides all documents)
   ▼
Rank 2: Agent-Rules.md (This Document)
   │   (Governs agent behavior, boundaries, and validation requirements)
   ▼
Rank 3: PRD.md
   │   (Governs product behavior, features, flows, copy, and scope)
   ▼
Rank 4: Technical-Approach.md
   │   (Governs architecture, code structure, data schemas, and build order)
   ▼
Rank 5: Design-Document.md
       (Governs visual tokens, styles, components, and layout aesthetics)
```

**Conflict Protocol:** If a conflict arises that cannot be settled decisively by this ranking, **stop execution immediately and ask the project owner for clarification**. Never make a unilateral choice.

---

## 3. Absolute Prohibitions & Scope Boundaries

The following actions are **strictly forbidden** throughout development:

### 3.1 Architecture & Stack Boundaries
1. **NO BACKENDS OR SERVERS:** Do not create Node/Express servers, serverless API routes, edge functions, Python backends, or cloud databases (e.g., Firebase, Supabase). BinGo is a 100% client-side static web app.
2. **NO UNAPPROVED LIBRARIES:** Do not install any npm packages not explicitly listed in `Technical-Approach.md`. Specifically forbidden:
   - No React Router or routing libraries (BinGo uses a single state variable).
   - No Redux, Zustand, MobX, or state libraries (BinGo uses React useState/hooks).
   - No UI component libraries (no Material UI, Tailwind UI, Shadcn, Chakra, AntD).
   - No date libraries (no date-fns, dayjs, moment; use the native `date.js` utility).
   - No validation libraries (no Zod, Yup, Joi; use hand-written checkers).
3. **NO LIVE WEBRTC VIEWFINDFER:** Do not attempt to stream camera frames to canvas or create custom video elements. Image capture must use native HTML file inputs with `capture="environment"` and gallery pickers.
4. **NO INVENTED CONTENT OR ADVICE:** You may not invent, reword, or supplement waste disposal steps or SDG 15 statements. All copy must match `public/rules.json` and `PRD.md` Section 8.6 word-for-word.

### 3.2 Visual & Styling Prohibitions
1. **NO DEFAULT TAILWIND COLOR PALETTES:** Do not use Tailwind default colors (e.g., `bg-green-500`, `text-emerald-400`, `bg-gray-800`). All colors, shadows, borders, and glass surfaces must strictly use the Eco Glass CSS custom properties defined in `tokens.css`.
2. **NO UNBUDGETED BACKDROP BLUR:** Do not apply `backdrop-filter` to list items, history rows, or high-count elements. Blur is strictly budgeted to: the Impact Card, the Scan Card, the Result Primary Card, and the Bottom Nav. History rows must use `.surface-flat` (flat translucent fill, zero blur).
3. **NO DESKTOP OVER-COMPLICATION:** Do not design multi-column desktop layouts. On screens wider than 480px, the application must remain a centered 480px mobile frame over the atmospheric backdrop.

---

## 4. Module Boundaries & Architectural Isolation

To maintain maintainability and allow quick debugging, enforce these strict code boundaries:

1. **TensorFlow.js Isolation:**
   - Only `src/lib/tm.js` may import or reference `@teachablemachine/image`, `@tensorflow/tfjs`, or `window.tmImage`.
   - Any component or hook requiring classification must call `lib/classify.js` or `useModel.js`, never TensorFlow directly.
2. **LocalStorage Isolation:**
   - Only `src/lib/storage.js` may call `window.localStorage`.
   - Direct access to `localStorage.getItem` or `localStorage.setItem` inside components or hooks is prohibited.
3. **Strings Centralization:**
   - No user-facing UI strings may be hardcoded inside JSX components (except disposal content fetched from `rules.json`).
   - All labels, button texts, hints, and error messages must import from `src/lib/strings.js`.

---

## 5. Verification & Anti-Hallucination Rules

### 5.1 Verification Before Claiming Success
* **Never assume code works.** Never report that a task, component, or test is complete without executing the build, running the code, or viewing the browser.
* **Build Verification:** Every gate completion requires running `npm run build` and verifying that the bundle compiles with zero syntax errors and zero unresolved imports.
* **Console Cleanliness:** The application must run without unhandled runtime exceptions or React key warnings in the browser console.

### 5.2 Gated Implementation Discipline
* Follow the Gated Build Order defined in `Technical-Approach.md` Section 10 (`Gate 0` through `Gate 5`).
* Do not jump ahead to build result screens before the underlying state machine and classification pipeline are verified.
* If a gate fails, fix the underlying issue immediately before proceeding.

---

## 6. Edge Case and Failure Handling Protocol

Every implementation must be resilient against real-world mobile failure modes. You are required to support all 26 edge cases specified in `Technical-Approach.md` Section 7, with particular emphasis on:

1. **Storage Quota Exceeded:** When `localStorage` throws a quota error, drop the oldest scans from history one by one until the write succeeds, while maintaining the current session's memory state.
2. **Private Browsing / Blocked Storage:** If `localStorage` is inaccessible, fail over to an internal in-memory store without throwing unhandled exceptions.
3. **Invalid or Non-Image Files:** Reject non-image MIME types immediately before canvas decoding and display the user-friendly banner: *"That file isn't an image. Please choose a photo."*
4. **Memory Leaks:** Always revoke temporary blob object URLs via `URL.revokeObjectURL()` when navigating away from the Result view.
5. **Canceled Scans:** If a user closes the Analyzing screen mid-scan, increment `runId` and discard late-resolving promises so the UI never displays an unexpected result.

---

## 7. Change Management & Refactoring Guidelines

1. **Preserve Existing Functionality:** When making an update, ensure existing tested features (streak logic, history list, camera inputs) continue to work as intended.
2. **No Silent Changes:** If you find a technical reason why a requirement or interface cannot be fulfilled as written, you must document the blocker, explain the technical constraint, and ask the project owner for approval before changing any specification.
3. **Clean Diffs:** Keep changes focused and minimal. Do not rewrite working modules or restyle unaffected components unless required to fix a specific bug.

---

## 8. Development Completion Checklist

An AI development agent may only consider the project complete when:
- [ ] The Vite development server and production build run with zero errors.
- [ ] All 6 classes are recognized (`recyclable`, `organic`, `ewaste`, `hazardous`, `general`, `background`).
- [ ] Warmup tensor inference executes cleanly on app load.
- [ ] Confident scans display category, `{n}% sure`, disposal steps, SDG 15 facts, and allow thumbs feedback.
- [ ] Low-confidence ($<60\%$) or Background scans display "Not sure, try another angle" and are excluded from history.
- [ ] "Scan another item" CTA is present on both result states and launches the camera.
- [ ] History list preserves up to 50 items with thumbnails and displays empty state when zero.
- [ ] Impact counter tracks total confident scans; streak tracks consecutive local calendar dates.
- [ ] Browser back button returns to the originating tab from Result without leaving the app.
- [ ] Layout is verified responsive on mobile viewports ($375$ px) with proper safe-area insets.
- [ ] Production build is ready for static deployment to Vercel.
