# High-End UI Micro-Interactions, Circular Ripple Theme Transitions & Command Palette Expansion

**Date:** 2026-09-20  
**Status:** Approved  
**Scope:** Frontend Architecture (`fe/`)  

---

## 1. Problem Statement & Objectives

While the portfolio currently features industry-grade animation foundations (GSAP 3.15, Lenis smooth scrolling, and custom composables), several high-leverage UI micro-interactions remain untapped:
1. **Command Palette (`Ctrl + K`):** While search for pages, case studies, and blog posts is functional, it lacks direct theme management commands (e.g., "Switch to Editorial Light", "Cycle Theme") and direct action shortcuts.
2. **Theme Switching Transition:** Currently falls back to a standard browser cross-fade instead of a seamless, modern circular ripple expanding from the user's cursor click position.
3. **Power-User Keyboard Shortcuts:** There is no centralized keyboard navigation engine for jumping between Case Studies (`J`/`K`), viewing an interactive Shortcuts HUD modal (`?`), or cycling themes (`T`), complete with smart input guards.
4. **Sub-100ms Tactile Micro-Interactions:** Code block copy buttons use static text swaps without tactile elastic scale bumps or SVG transitions. System Spec Rails and skeleton loading states lack cohesive theme-aware shimmer effects.

---

## 2. Architecture & Subsystem Design

### Subsystem 1: Command Palette Theme & Action Integration
- **File:** `fe/src/components/ui/CommandPalette.vue`
- **Behavior:**
  - Add a dedicated category or command set: `theme` actions (`action-theme-editorial-dark`, `action-theme-editorial-light`, `action-theme-monochrome-cyber`, `action-theme-warm-sepia`, `action-theme-system`).
  - Each theme item displays its color swatch dot and active checkmark.
  - Selecting a theme immediately invokes the theme transition with center-origin coordinates and closes the palette with a confirmation toast.
  - Register shortcut triggers for opening the Keyboard Shortcuts Modal (`?`).

### Subsystem 2: Native View Transitions API with Circular Ripple
- **Files:** `fe/src/stores/theme.ts`, `fe/src/components/ui/ThemeSwitcher.vue`
- **Behavior:**
  - Enhance `setThemeId(id: ThemeId, persist = true, origin?: { x: number; y: number })`.
  - Capture mouse click coordinates `(e.clientX, e.clientY)` from the trigger element in `ThemeSwitcher.vue`.
  - If triggered via keyboard or Command Palette, default coordinates to screen center: `(window.innerWidth / 2, window.innerHeight / 2)`.
  - Check browser support (`document.startViewTransition`) and `prefers-reduced-motion`.
  - Compute maximum expansion radius:
    `radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))`
  - Execute Web Animations API on `::view-transition-new(root)`:
    ```js
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 450,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    )
    ```

### Subsystem 3: Global Keyboard Shortcuts & HUD Cheat-Sheet
- **New Composable:** `fe/src/composables/useKeyboardShortcuts.ts`
- **New UI Component:** `fe/src/components/ui/KeyboardShortcutsModal.vue`
- **Registered Shortcuts:**
  - `?` (Shift + `/`): Open/close Keyboard Shortcuts HUD.
  - `T`: Cycle to the next theme preset using circular ripple from center.
  - `J` / `K`: Navigate between case studies on `/projects` or scroll between sections in `/projects/:slug`.
  - `Esc`: Dismiss any active modal or popover.
- **Smart Focus Guard:**
  - Check `e.target` against `<input>`, `<textarea>`, `contenteditable`, and prevent shortcut triggers while typing.
  - Exclude `/admin` management routes to prevent interference with CMS authoring.

### Subsystem 4: Sub-100ms Tactile Micro-Interactions & Shimmer
- **File:** `fe/src/composables/useRichContentEnhancer.ts`
  - Upgrade copy button in code blocks with tactile bounce:
    `active:scale-[0.92] hover:scale-[1.03] transition-transform duration-100`
  - Inline dynamic SVG transition: Clipboard icon transforms into green checkmark (`#4ade80`) with "Copied!" badge and reverts gracefully.
- **File:** `fe/src/assets/scss/main.scss`
  - Add theme-tokenized `.skeleton-shimmer` utility class using CSS linear gradient and keyframe animation for smooth loading states.
- **File:** `fe/src/views/ProjectDetailView.vue`
  - Enhance System Spec Rail and Bento Metric Cards with sub-100ms hover transitions using GPU-accelerated `translate3d` and glowing stroke accents.

---

## 3. Engineering Quality & Non-Functional Requirements

- **Zero-Leakage Security Hygiene:** No API secrets or tokens exposed.
- **60fps GPU Rule:** Strictly animate only `transform`, `opacity`, and `clip-path` (on pseudoElement). No layout reflow properties (`width`, `height`, `margin`).
- **A11y & Motion Preference:** Respect `prefers-reduced-motion: reduce` by disabling ripple clip-paths and falling back to clean instant state changes.
- **Type Safety:** Full TypeScript coverage with zero build or linter errors.

---

## 4. Verification Plan

1. **Backend Build Check:** `cd backend && npm run build`
2. **Automated Seam Verification:** `cd fe && node ./scripts/test-seams.mjs`
3. **Frontend Build & Prerender:** `cd fe && npm run build`
4. **Manual Verification:**
   - Press `Ctrl + K`: Test theme switching commands and new action badges.
   - Click theme switcher: Confirm circular ripple expands smoothly from click origin.
   - Press `?`: Confirm Shortcuts HUD appears; test `Esc` to close.
   - Press `T`: Confirm theme cycles.
   - Code block copy: Confirm SVG transition and tactile bounce.
