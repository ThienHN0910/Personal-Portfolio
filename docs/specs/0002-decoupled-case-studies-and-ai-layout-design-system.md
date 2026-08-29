# Specification 0002: Decoupled Case Studies & Design-System-Constrained AI Layout Engine

## Overview
This specification completely decouples Case Studies (`/projects`) from Articles (`/blog`), migrates existing relational blog data into self-contained case study descriptions, and implements a strict design-system-constrained AI layout engine that enforces standard HTML tags with predefined semantic CSS classes and broken-grid inline layout styling.

---

## 1. Decoupled Data Model & Migration
1. **Migration Seam (`backend/src/scripts/migrate-decouple-project-blogs.ts`):**
   - Connect to MongoDB.
   - For every `Project` document containing a non-null `relatedBlogId`, look up the referenced `BlogPost`.
   - If the blog post exists and its content is not already present in `project.description`, append the blog content to `project.description` formatted as a self-contained case study section.
   - Unset `relatedBlogId` on the Project document.
2. **Schema Cleanup:**
   - Remove `relatedBlogId` from `ProjectSchema` in `backend/src/models/Project.ts`.
   - Remove `relatedBlogId` from `backend/src/routes/projects.ts`.
   - Remove `relatedBlogId` from `fe/src/types/index.ts`.
   - Remove related blog selector from `fe/src/views/admin/AdminProjects.vue`.
   - Remove companion article card and related blog fetching from `fe/src/views/ProjectDetailView.vue`.

---

## 2. Global Semantic CSS Class Catalog
Define an extensive, avant-garde design system in `fe/src/assets/scss/main.scss` for both Articles and Case Studies:

### For Articles (`/blog`):
- `.article-hero-title` — High-contrast serif display headline with negative tracking.
- `.article-lead` — Airy, elegant italic summary paragraph.
- `.article-h2` — Distinct section heading with border-top separator and monospace pill marker.
- `.article-h3` — Sub-heading for deep-dive technical subsections.
- `.article-p` — Readable body paragraph with max 60ch line length and generous line height.
- `.article-pullquote` — Luxury pull-quote with glowing border accent and serif quote mark.
- `.article-callout` — Bento-boxed highlight note for critical insights or caveats.
- `.article-codeblock` — Obsidian terminal container with monospace font and high-contrast syntax colors.
- `.article-figure` — Responsive media container with centered monospace caption.
- `.article-list` — Custom bullet list with colored status dot markers.

### For Case Studies (`/projects`):
- `.project-hero-badge` — Status badge indicating active deployment or production status.
- `.project-h2` — Architectural section header.
- `.project-h3` — Component or sub-system header.
- `.project-lead` — Executive summary statement.
- `.project-p` — Technical narrative paragraph.
- `.project-metric-grid` — Multi-column asymmetric container for performance and scale metrics.
- `.project-metric-card` — Individual metric card with big monospace stat and label.
- `.project-architecture-callout` — Double-bezel container for architecture tradeoff notes (ADRs).
- `.project-spec-table` — Monospace technical specification table with hover row highlights.
- `.project-figure` — Screenshot or diagram frame with zoom cursor.

---

## 3. Design-System-Constrained AI Synthesis Prompt
In `backend/src/routes/ai.ts`:
- Update the system prompt to explicitly enumerate the exact HTML tags (`h2`, `h3`, `p`, `blockquote`, `pre`, `code`, `ul`, `ol`, `li`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `div`, `span`, `figure`, `figcaption`, `img`) and the exact CSS class catalog above.
- **Rule:** AI MUST assign these predefined classes to their corresponding elements.
- **Rule:** AI is ONLY permitted to use `style="..."` for layout properties:
  - `display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem;`
  - `grid-column: span 8;`, `grid-column: span 4;`, `grid-column: span 12;`
  - `display: flex; justify-content: space-between; align-items: center; gap: 1rem;`
  - `margin-top: 3rem; margin-bottom: 2rem;`
- **Rule:** AI MUST NOT output custom inline font-family, background-color, color, or box-shadow (which are strictly enforced by the CSS classes).
- **Creative Dials:** `DESIGN_VARIANCE: 8` (asymmetric spans 8/4, 7/5), `VISUAL_DENSITY: 3` (wide breathing space).

---

## 4. Verification & Testing
- Run MongoDB migration script (dry run & execute).
- Run backend typecheck: `npm run build` in `backend/`.
- Run automated seams suite: `node ./scripts/test-seams.mjs` in `fe/`.
- Run frontend build & SEO prerendering (25 pages): `npm run build` in `fe/`.
- Create GitHub PR and merge into `main`.
