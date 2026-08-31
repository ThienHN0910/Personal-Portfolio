# ADR-0010: Multi-Theme Palette System & Extended Editorial Class Catalog

## Status
Accepted (Implemented in Issue #49, PR #50)

## Context
The portfolio platform previously operated primarily on an Obsidian Dark theme, with limited dynamic customizability and lack of explicit support for visitors who prefer light reading modes, high-contrast monochrome, or newsprint sepia tones. Furthermore, as the platform expands into masterclass technical essays and case studies, the editorial design system requires an extended, theme-agnostic class catalog (`article-grid-12`, `article-col-7`, `article-badge`, `article-figure`) that renders deterministically across all themes without breaking CKEditor rich text or triggering layout reflows.

## Decision
1. **Dynamic CSS Custom Property Token Architecture:**
   - Map all core color tokens (`--canvas`, `--bone`, `--surface`, `--ink`, `--ink-secondary`, `--ink-tertiary`, `--stroke`, `--pastel-blue`, `--pastel-green`, `--pastel-amber`, `--pastel-red`) to CSS custom properties.
   - Configure Tailwind CSS in `tailwind.config.js` to resolve `colors.canvas`, `colors.surface`, etc. directly to `var(--canvas)`.

2. **Five Curated Taste-Skill Palettes:**
   - `editorial-dark` (Default Onyx / Charcoal / Bone / Pastel Accents).
   - `editorial-light` (Warm Fine Paper / Crisp Ink / Warm Slate / Clean Accent).
   - `monochrome-cyber` (Deep Jet Black / Pure White / Slate / Emerald Accent).
   - `warm-sepia` (Newsprint Sepia / Coffee / Warm Stone).
   - `system` (Dynamic OS Preference Auto-detection via `matchMedia`).

3. **Client & Server State Synchronization:**
   - Store user preference in browser `localStorage` (`portfolio_theme_id_v2`).
   - Store default site theme in MongoDB Atlas `themes` collection, configurable via `AdminAppearance.vue`.

4. **Extended Editorial Class Catalog for AI & CKEditor:**
   - Explicitly support `.article-grid-12`, `.article-col-7`, `.article-col-5`, `.article-col-6`, `.article-col-4`, `.article-col-8`, `.article-col-12`.
   - Explicitly support `.article-badge`, `.article-badge--green`, `.article-badge--amber`, `.article-badge--red`.
   - Prohibit hardcoded inline colors in AI prompt synthesis to ensure 100% theme fluidity.

5. **Automated Seam Verification (Seam 6):**
   - Added Seam 6 in `fe/scripts/test-seams.mjs` verifying theme presets and extended class whitelists.

## Consequences
- Visitors can toggle themes seamlessly from the Navbar Action Pill or Admin Appearance panel.
- Rich editorial publications adapt instantly across all themes with zero CSS conflicts or broken CKEditor output.
- All dynamic data remains 100% manageable via the minimal Admin dashboard.
