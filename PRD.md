# BinGo: Product Requirements Document (PRD)

**Project:** BinGo — Smart Waste Sorting for SDG 15 (Life on Land)  
**Context:** Hackathon Build  
**Version:** 1.2 (Authoritative Source of Truth)  
**Target Submission:** 14 October 2026, 12:00 PM IST  
**Deliverables:** Deployed HTTPS web application (Vercel) + Presentation PPT  

---

## 1. Project Overview and Problem Statement

### 1.1 Problem Statement
Improper waste segregation at the household and individual level in India leads to massive volumes of recyclable and hazardous materials being dumped into open landfills. This causes heavy metal leaching, soil degradation, groundwater poisoning, and habitat destruction. While citizens often want to segregate waste correctly, ambiguity regarding which bin an item belongs to (especially multi-material packaging, e-waste, and household hazardous items) leads to widespread contamination and improper dumping.

### 1.2 Mission and Objectives
**BinGo** is an ultra-fast, mobile-first web application designed to eliminate waste segregation guesswork. A user captures or uploads a single photo of an everyday item using their mobile phone. BinGo instantly classifies the item into one of five standardized waste categories using an in-browser computer vision model and provides clear, actionable, India-friendly disposal instructions alongside an educational **SDG 15 (Life on Land)** impact fact.

**Key Objectives:**
1. **Instant Clarity:** Deliver an accurate classification and clear disposal steps in under 2 seconds on standard mobile devices.
2. **Zero Barrier to Entry:** Require no account creation, no login, no server round-trip, and no native app installation.
3. **Transparent ML:** Make the machine learning model's boundaries visible through explicit confidence percentages, a protective "Not sure" fallback threshold, and user feedback mechanisms.
4. **Environmental Literacy:** Directly link everyday waste disposal actions to soil and biodiversity preservation under UN Sustainable Development Goal 15.

---

## 2. Document Precedence and Authority

To resolve any potential conflicting guidance across the project artifacts, the following strict hierarchy of authority is established:

```
Rank 1: Project Owner's Latest Explicit Instruction (Wins over everything)
   │
   ▼
Rank 2: Agent Rules (`Agent-Rules.md`) (Governs agent boundaries and behavior)
   │
   ▼
Rank 3: Product Requirements Document (`PRD.md`) (Governs scope, features, copy, user flows)
   │
   ▼
Rank 4: Technical Approach (`Technical-Approach.md`) (Governs architecture, code structure, schemas)
   │
   ▼
Rank 5: Design Document (`Design-Document.md`) (Governs visual tokens, styles, and components)
```

**Conflict Resolution Rule:** If any ambiguity or contradiction arises that cannot be decisively settled by this rule, the AI development agent **must halt and request clarification from the project owner**. Under no circumstances may the agent make unapproved assumptions or silently alter specifications.

---

## 3. Locked Project Decisions

The following architectural and product decisions are finalized and locked:

| Area | Decision | Rationale |
| :--- | :--- | :--- |
| **Model Runtime** | In-browser TensorFlow.js (Teachable Machine model). Zero backend inference. | Eliminates server costs, latency, API rate limits, and network failure modes during live demos. |
| **Visible Classes** | Exactly 5: `Recyclable`, `Organic`, `E-Waste`, `Hazardous`, `General / Non-recyclable`. | Matches Indian municipal waste segregation archetypes and standard collection channels. |
| **Hidden Class** | A 6th class: `Background` (empty frame, walls, hands, clutter). Never displayed as a category. | Prevents false-positive classifications on empty camera shots. Triggers "Not sure". |
| **Confidence Gate** | Top prediction $< 60\%$ ($0.60$) or `Background` $\rightarrow$ Triggers **"Not sure, try another angle"**. | Builds user trust by admitting uncertainty rather than giving hazardous sorting advice. |
| **Image Input** | Native HTML file inputs (`capture="environment"` for camera, standard file picker for gallery). | No custom WebRTC camera viewfinder; maximizes mobile browser reliability and simplicity. |
| **Dataset** | Curated Kaggle waste images (~100/category) + team mobile photos (20–30/category) + background frames (40–60). 20% held-out test set. | Ensures model generalizes to real mobile camera shots under diverse Indian lighting. |
| **Tech Stack** | React + Vite + Tailwind CSS (v3.4 layout utilities) + TensorFlow.js + Lucide Icons. | High-performance, lightweight, modern web bundle deployed statically to Vercel. |
| **Storage** | Device-local (`localStorage`). No database, no cloud sync, no tracking. | Complete user privacy, instant state hydration, zero backend dependencies. |
| **Language & Locale**| English only; disposal copy tailored to India (referencing dry/wet bins, kabadiwalas, e-waste centers). | Tailored for immediate hackathon target audience without named commercial services. |
| **Visual Theme** | "Eco Glass" dark-green glassmorphism system. | High aesthetic wow-factor, premium feel, organic/clean tech vibe. |

---

## 4. Target Users and Use Cases

### 4.1 Target Audience
* **Primary Persona:** Urban residents, students, and office workers in India holding a disposable item (e.g., plastic bottle, battery, snack wrapper, tea bag) standing in front of municipal bins or scrap piles, unsure where it belongs.
* **Device Profiles:** Android Chrome (v111+) and iOS Safari (v16.4+) on mid-range smartphones running over 4G/5G mobile connections or Wi-Fi.

### 4.2 Key User Needs
* **Speed:** Instant answer within 2 seconds without navigation friction.
* **Simplicity:** Clear, numbered 1-2-3 steps rather than dense technical or chemical jargon.
* **Reliability:** Honest indication when an item cannot be identified rather than misleading guidance.

---

## 5. Scope: In-Scope vs. Non-Goals

### 5.1 In-Scope (MVP + Confirmed Extras)
* **MVP Core:**
  1. Camera capture button (triggers native device camera).
  2. Gallery upload button (triggers native photo library).
  3. In-browser client-side image resizing and inference.
  4. Confident result display with category, confidence rating (`{n}% sure`), and disposal steps.
  5. Fallback display for low-confidence or background scans ("Not sure, try another angle").
  6. Mobile-first responsive glassmorphic layout.
* **Confirmed Extras:**
  1. **Scan History:** Preserves the last 50 confident scans with compressed thumbnail, category, date/time, and feedback status.
  2. **Impact Counter:** Persistent count of total confident items sorted (continues incrementing past 50).
  3. **Daily Streak:** Consecutive days with at least one confident scan based on local calendar dates.
  4. **"Was this correct?" Feedback:** On-device thumbs up/down toggle stored per history row.
  5. **SDG 15 Facts:** Curated educational statement linking each category to land preservation.
  6. **"Scan another item" CTA:** Prominent primary button on both Confident and Not-Sure result screens.

### 5.2 Explicit Non-Goals (Out of Scope for v1)
* Multi-item simultaneous detection or bounding boxes.
* Continuous live camera video feed or WebRTC canvas streaming.
* User authentication, user profiles, login, or cloud accounts.
* Push notifications, settings menus, audio cues, or sound effects.
* Geo-location, GPS drop-off maps, recycler directory, or city-specific routing.
* Multilingual support (e.g., Hindi, Tamil) or localization selectors.
* Light mode theme.
* PWA service workers or offline caching manifests.
* History searching, filtering, exporting, or manual clearing.

---

## 6. Waste Categories and Classification Rules

### 6.1 Category Definitions

Every training image and app classification conforms strictly to these six definitions:

| Category ID | Display Label | Includes |
| :--- | :--- | :--- |
| `recyclable` | **Recyclable** | PET/HDPE bottles, clean plastic containers, clean paper, newspapers, clean cardboard, metal beverage cans, food tins, clean glass bottles/jars, tetra packs. |
| `organic` | **Organic** | Fruit and vegetable peels, food leftovers, garden leaves, tea leaves, coffee grounds, eggshells, coconut shells. |
| `ewaste` | **E-Waste** | Old phones, tablets, chargers, USB cables, earphones, remotes, power banks, computer peripherals, small circuit boards. |
| `hazardous` | **Hazardous** | Loose household batteries (AA, AAA, button cells), CFLs, tube lights, LED bulbs, expired medicine strips/syrups, chemical/pesticide containers, aerosol spray cans. |
| `general` | **General / Non-recyclable** | Multilayer plastic snack wrappers, chip packets, soiled food paper (greasy pizza boxes), paper napkins, facial tissues, broken ceramics/porcelain, thermocol/styrofoam, cigarette butts. |
| `background` | *(Hidden — Not shown to user)* | Blank frames, walls, desk surfaces, hands, blurry non-item scenes, extreme close-up textures. |

### 6.2 Borderline Item Tie-Break Rules

To maintain strict consistency across training and classification, the following rules govern ambiguous items:

| Item Type | Standard Classification | Rationale |
| :--- | :--- | :--- |
| Plastic bags, chip wrappers, sachets | **General / Non-recyclable** | Multilayer metallized films cannot be processed in standard dry recycling in India. |
| Clean paper, notebooks, clean cardboard | **Recyclable** | High fiber recovery value. |
| Food-soiled or greasy paper (pizza boxes, napkins) | **General / Non-recyclable** | Grease contaminates the paper recycling pulp process. |
| Mobile phones, remotes, gadgets with built-in battery | **E-Waste** | Complex electronic assemblies require formal e-waste dismantlers. |
| Loose batteries (alkaline, lithium, button cells) | **Hazardous** | Corrosive chemical hazard; must not enter standard e-waste or municipal streams. |
| Earphones, charging cords, cables | **E-Waste** | Copper and plastic electronic scrap. |
| Medicine blister packs and syrup bottles | **Hazardous** | Pharmaceutical chemical contamination risk. |
| Intact glass bottles and jars | **Recyclable** | 100% recyclable via glass cullet. |
| Broken glass | *Excluded from v1* | Safety hazard; excluded from training dataset. |
| Broken ceramics, crockery | **General / Non-recyclable** | Non-meltable refractory material. |

*Note on Out-of-Scope Waste:* Sanitary/hygiene items, bio-medical waste, textiles/clothing, construction debris, and furniture are out of scope. If photographed, the model will likely yield "Not sure" or a nearest neighbor, which is an accepted version 1 limitation.

---

## 7. Core User Flows and Behavior

```
               ┌────────────────┐
               │   Open App     │
               └───────┬────────┘
                       ▼
        ┌──────────────────────────────┐
        │ Model & rules.json loading?  │
        └──────┬───────────────────────┘
               │ Ready
               ▼
 ┌───────────────────────────────────────────────┐
 │                  HOME SCREEN                  │
 │  - Items sorted count & day streak            │
 │  - Camera FAB (bottom center)                 │
 │  - "Choose from gallery" button               │
 └─────────────────────┬─────────────────────────┘
                       │ User picks/captures image
                       ▼
 ┌───────────────────────────────────────────────┐
 │               ANALYZING SCREEN                │
 │  - Photo preview + glowing scan sweep         │
 │  - "Analyzing your item..." heading           │
 │  - Min display: 500ms (avoids flicker)        │
 │  - Close "X" button returns to Home           │
 └─────────────────────┬─────────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Top = Background OR <60%]     [Top Class >= 60%]
       ▼                               ▼
┌───────────────────────────┐  ┌───────────────────────────────────┐
│     RESULT (NOT SURE)     │  │        RESULT (CONFIDENT)         │
│ - "Not sure, try another  │  │ - Category name + tone icon       │
│    angle"                 │  │ - Confidence rating ("{n}% sure") │
│ - 2 helpful scanning tips │  │ - Photo thumbnail + check badge   │
│ - "Scan another item" CTA │  │ - How to dispose numbered steps   │
│ - (NOT saved to history)  │  │ - SDG 15 impact fact card         │
│                           │  │ - "Was this correct?" thumbs      │
│                           │  │ - "Scan another item" CTA         │
│                           │  │ - (Saved to history & counters)   │
└───────────────────────────┘  └───────────────────────────────────┘
```

### 7.1 Flow Steps
1. **App Initialization:** Loads `rules.json` and compiles the browser TensorFlow.js model. Scan triggers remain disabled and display "Loading model..." until initialization completes. A blank tensor warm-up inference runs in the background.
2. **User Capture:** User taps either the center camera FAB (opens device camera) or "Choose from gallery" (opens photo library).
3. **Analyzing Transient State:** The app transitions to the `analyzing` screen, scaling the image to a working canvas (max 512px). A glowing scan-line sweeps across the image. The analysis view remains visible for at least 500ms to provide smooth visual feedback.
4. **Classification & Decision:**
   * If the model's top predicted class is `background`, or if the top class confidence is $< 0.60$ ($60\%$), transition to `result (not_sure)`.
   * Otherwise, transition to `result (confident)`.
5. **Persistence on Confident Scans:**
   * Generate a 100px compressed JPEG thumbnail.
   * Prepend new scan record to `bingo:v1:history` in `localStorage` (capped at 50).
   * Increment `totalSorted` impact counter.
   * Evaluate and update the daily streak using the local calendar date.
6. **Result Interaction:**
   * On confident results, user can toggle Thumbs Up / Thumbs Down feedback.
   * User can tap "Scan another item" (or the bottom FAB) to immediately launch the camera for another item.
7. **Back Navigation:**
   * When navigating to `result`, the app pushes state to browser history.
   * Triggering the system back button (Android back or iOS swipe-back) returns the user to their originating view (`home` or `history`), never leaving the web app.

---

## 8. Screen Hierarchy and Approved Copy

All copy in the application must strictly adhere to the following approved texts:

### 8.1 Home Screen
* **Header:** "BinGo" (Heading 1) · "Sort your waste in one scan" (Body Muted).
* **Impact Card:** "Every scan helps" · "Items sorted" (`totalSorted`) · "Day streak" (`streak`).
* **Scan Card:** "Scan an item" · "Point your camera at one item to see how to dispose of it."
* **Hints:** "Scan one item at a time" · "Use good light and fill the frame".
* **Buttons:** "Choose from gallery" (Secondary Glass) · Camera FAB (Primary Emerald Orb).

### 8.2 Analyzing Screen
* **Top Bar:** Close "X" button · Title: "Analyzing".
* **Status Panel:** "Analyzing your item..." · Hints: "Keep it simple: one item only" · "This takes a moment".

### 8.3 Confident Result Screen
* **Top Bar:** Back arrow button · Title: "Scan result".
* **Primary Card:** Category Label (Display) · Confidence: `"{n}% sure"` · Confidence progress bar · User photo with glowing check badge.
* **Disposal Steps Section:** Heading: "How to dispose" · Numbered step list.
* **SDG 15 Card:** Overline: "SDG 15 · LIFE ON LAND" · Educational statement.
* **Feedback Row:** "Was this correct?" · Thumbs Up / Thumbs Down buttons · Post-tap message: "Thanks for the feedback".
* **Action CTA:** "Scan another item" (Primary button).

### 8.4 "Not Sure" Result Screen
* **Top Bar:** Back arrow button · Title: "Scan result".
* **Primary Card:** Warning icon (`CircleHelp`) · Title: "Not sure" · Subtitle: "Not sure, try another angle".
* **Tips Card:** "Try another angle." · "Scan one item at a time."
* **Action CTA:** "Scan another item" (Primary button).
* *Exclusions:* No disposal steps, no SDG fact, no feedback row, no history entry.

### 8.5 History Screen
* **Top Bar:** Title: "History".
* **List:** Up to 50 rows. Each row displays 56px thumbnail, category name, tone dot, `{n}% sure`, formatted date/time (e.g., "Today, 2:30 PM"), and thumb icon (if set).
* **Empty State:** Centered icon · "No scans yet" · "Your last 50 scans will show up here."

### 8.6 Disposal Advice and SDG 15 Text Table

No alternative disposal advice may appear anywhere in the app:

| Category | Disposal Steps | SDG 15 Fact Line |
| :--- | :--- | :--- |
| **Recyclable** | 1. Empty and rinse it.<br>2. Keep it dry.<br>3. Put it in the dry-waste bin or give it to a kabadiwala or recycler. | Recycling reduces demand for new raw material taken from forests and land. |
| **Organic** | 1. Put it in the wet-waste bin or a compost pit.<br>2. Don't mix it with plastic. | Compost returns nutrients to soil instead of rotting in landfills. |
| **E-Waste** | 1. Don't put it in household waste.<br>2. Hand it to an authorised e-waste collector or a take-back counter. | Toxic metals from dumped electronics can leak into soil and harm land ecosystems. |
| **Hazardous** | 1. Keep it separate and sealed.<br>2. Don't burn, flush or mix it.<br>3. Give it to a hazardous-waste collection point. | Chemicals and batteries that reach the ground contaminate soil and the life that depends on it. |
| **General / Non-recyclable** | 1. Wrap it and put it in the general dry non-recyclable bin.<br>2. Don't litter. | Waste left on open land damages soil and habitats, so proper disposal protects them. |

---

## 9. Non-Functional Requirements

1. **Performance & Latency:**
   * Total latency from file selection to result display must be $\le 2.0$ seconds on modern mid-range smartphones over 4G/Wi-Fi.
   * Initial page bundle load must be lightweight ($\le 350$ KB gzipped excluding model weights).
   * Minimum analyzing view time of $500$ ms to prevent visual layout flashing.
2. **Device & Browser Compatibility:**
   * Full functionality on **Android Chrome 111+** and **iOS Safari 16.4+**.
   * Responsive layout optimized for viewports between $320$ px and $480$ px width (desktop centers as a 480px mobile column).
3. **Storage Quotas & Resilience:**
   * Thumbnails must be compressed JPEGs (max side 100px, quality 0.60) consuming $\le 6$ KB per entry ($\le 300$ KB total for 50 entries).
   * If `localStorage` is disabled or fails quota, the app must drop oldest entries gracefully and maintain an in-memory fallback store without crashing.
4. **Accessibility (a11y):**
   * Minimum tap target size of $44 \times 44$ px for all interactive elements.
   * WCAG AA contrast compliance ($\ge 4.5:1$) on text over glass panels.
   * Category meaning must never rely solely on color; text label and icon are always present.
   * ARIA live region (`aria-live="polite"`) on the result screen for screen reader announcements.
5. **Security & Privacy:**
   * Zero photos or personal data transmitted to any external server.
   * Full HTTPS enforcement required for camera input access.

---

## 10. Success Criteria and Acceptance Gates

* **Model Accuracy:** $\ge 80\%$ overall accuracy on the held-out test set (20% split per category). No category should fall below $60\%$.
* **Graceful Deadline Rule:** If accuracy targets are missed close to the hackathon deadline, at most one retrain cycle is permitted. If still missed, the app ships with honest disclosure of accuracy metrics in the presentation PPT.
* **Zero Console Errors:** Clean execution without unhandled exceptions during image decoding, model inference, or storage operations.
* **Offline-Tolerant Model Inference:** Model weights self-hosted in `/public/model/` so once loaded, inference does not depend on external CDNs or network stability.

---

## 11. Feature Cut-First Order

If time constraints arise before the hackathon deadline, optional features must be removed in this strict order without degrading the MVP:
1. Daily Streak Counter (`streak`)
2. Thumb icon display on History rows
3. "Was this correct?" Feedback buttons
4. Impact Counter (`totalSorted`)

*The core flow (camera/gallery $\rightarrow$ analysis $\rightarrow$ classification $\rightarrow$ disposal steps) must NEVER be cut.*
