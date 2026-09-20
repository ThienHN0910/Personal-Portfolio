# High-End UI Micro-Interactions, Circular Ripple & Command Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 4 high-end UI engineering micro-interactions: Command Palette theme commands, View Transitions API circular ripple, global keyboard navigation with Shortcuts HUD modal, and sub-100ms tactile feedback with skeleton shimmers.

**Architecture:** Vue 3 Composition API with Pinia store coordinate passing, Web Animations API on View Transitions pseudo-elements, custom keyboard event listener composable with input guard, and GPU-accelerated CSS transforms.

**Tech Stack:** Vue 3, TypeScript, Pinia, Tailwind CSS, SCSS, Web Animations API, View Transitions API.

**Spec:** `docs/superpowers/specs/2026-09-20-high-end-ui-micro-interactions-design.md`

## Global Constraints

- Never commit non-trivial features directly to `main`; work on `feat/ui-micro-interactions-command-palette`.
- Follow Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `test:`).
- Hardware Acceleration & 60fps Rule: Strictly animate `transform`, `opacity`, and `clip-path` (on pseudoElement).
- Zero-Leakage Security Hygiene: No secrets in code or commits.
- Pass all 3 verification checks before declaring completion (`backend build`, `fe seam tests`, `fe build`).

---

### Task 1: Native View Transitions API with Circular Ripple
**Files:**
- Modify: `fe/src/stores/theme.ts`
- Modify: `fe/src/components/ui/ThemeSwitcher.vue`
- Modify: `fe/src/assets/scss/main.scss`

- [ ] **Step 1: Update `ThemeStore` in `fe/src/stores/theme.ts`**
  Add origin parameter `{ x: number; y: number }` to `setThemeId` and `cycleTheme`. Implement Web Animations API clipPath ripple on `::view-transition-new(root)` using calculated hypot radius.
- [ ] **Step 2: Update `ThemeSwitcher.vue`**
  Pass click event coordinates `(e.clientX, e.clientY)` into `selectTheme` and `themeStore.setThemeId`.
- [ ] **Step 3: Update `main.scss`**
  Add view transition pseudo-element helper rules (`::view-transition-old(root)`, `::view-transition-new(root)`) with `animation: none; mix-blend-mode: normal;`.
- [ ] **Step 4: Verify typecheck & test theme switching**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 5: Commit changes**
  `git commit -am "feat(theme): add native view transitions circular ripple"`

---

### Task 2: Command Palette Theme & Action Integration
**Files:**
- Modify: `fe/src/components/ui/CommandPalette.vue`

- [ ] **Step 1: Add Theme Presets to `CommandPalette.vue`**
  Define theme command items for all 5 presets with color swatch dots, active indicators, and center-origin ripple triggering.
- [ ] **Step 2: Add Shortcut / Help Action**
  Add "Open Keyboard Shortcuts (?)" command item that triggers the shortcuts modal.
- [ ] **Step 3: Add Fuzzy Category Filtering**
  Add keywords (`theme`, `palette`, `dark`, `light`, `cyber`, `sepia`, `color`) to ensure instant discovery when typing.
- [ ] **Step 4: Verify typecheck**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 5: Commit changes**
  `git commit -am "feat(command-palette): integrate theme presets and keyboard shortcut actions"`

---

### Task 3: Global Keyboard Shortcuts Composable & HUD Modal
**Files:**
- Create: `fe/src/composables/useKeyboardShortcuts.ts`
- Create: `fe/src/components/ui/KeyboardShortcutsModal.vue`
- Modify: `fe/src/App.vue`

- [ ] **Step 1: Create `useKeyboardShortcuts.ts`**
  Manage `isShortcutsOpen`, register global key listeners for `?`, `T` (cycle theme), `J`/`K` (item scroll), `Esc` (close modal), with `isInputFocused` guard.
- [ ] **Step 2: Create `KeyboardShortcutsModal.vue`**
  Create an editorial-card modal displaying categorized shortcuts (`Navigation`, `Actions`, `System`) with tactile kbd styling and close button.
- [ ] **Step 3: Register in `App.vue`**
  Import and mount `KeyboardShortcutsModal` and hook into `useKeyboardShortcuts`.
- [ ] **Step 4: Verify typecheck**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 5: Commit changes**
  `git commit -am "feat(keyboard): add global shortcuts engine and shortcuts hud modal"`

---

### Task 4: Sub-100ms Micro-Interactions & Shimmer Utilities
**Files:**
- Modify: `fe/src/composables/useRichContentEnhancer.ts`
- Modify: `fe/src/assets/scss/main.scss`
- Modify: `fe/src/views/ProjectDetailView.vue`

- [ ] **Step 1: Enhance code copy button in `useRichContentEnhancer.ts`**
  Add SVG clipboard & checkmark icons, tactile spring scale bounce (`active:scale-[0.92]`), sub-100ms copied feedback.
- [ ] **Step 2: Add `.skeleton-shimmer` in `main.scss`**
  Add theme-aware shimmer CSS gradient with GPU-accelerated linear translation.
- [ ] **Step 3: Polish hover micro-interactions in `ProjectDetailView.vue`**
  Ensure System Spec Rail and Bento Metric Cards have 60fps GPU hover lift and stroke transitions.
- [ ] **Step 4: Verify typecheck**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 5: Commit changes**
  `git commit -am "feat(ui): enhance tactile code copy feedback, skeleton shimmer and spec rail"`

---

### Task 5: Full Verification & Quality Assurance
**Files:**
- Test all build & seam commands across the workspace.

- [ ] **Step 1: Backend Typecheck & Build**
  Run `cd backend && npm run build`
- [ ] **Step 2: Automated Seam Verification Suite (6 Seams)**
  Run `cd fe && node ./scripts/test-seams.mjs`
- [ ] **Step 3: Frontend Bundling & SEO Prerendering (25 pages)**
  Run `cd fe && npm run build`
