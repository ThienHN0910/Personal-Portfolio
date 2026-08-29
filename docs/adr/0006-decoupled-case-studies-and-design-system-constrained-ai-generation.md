# ADR-0006: Decoupled Case Studies & Design-System-Constrained AI Content Generation

## Context & Problem Statement
Previously, the portfolio platform loosely coupled `Project` (Case Study) records with companion `BlogPost` (Article) records via a `relatedBlogId` foreign key. This caused architectural ambiguity:
1. Case studies lacked self-contained, end-to-end technical breakdowns and relied on external companion articles.
2. AI-assisted content generation produced arbitrary HTML tags and ad-hoc styling, risking visual inconsistencies with the creative direction dials (`DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 8`, `VISUAL_DENSITY: 3`).

## Decision Drivers
- **Self-Contained Domain Models:** Case Studies and Articles must be completely autonomous, distinct publication formats.
- **Data Integrity:** Any existing `relatedBlogId` content in MongoDB must be migrated directly into the corresponding project's `description` field prior to schema decoupling.
- **Strict Visual Cohesion:** AI content generation must be strictly constrained to a curated catalog of semantic HTML tags and predefined CSS classes (`.article-*`, `.project-*`, `.editorial-*`).
- **Layout Freedom:** AI is permitted to generate inline styles *strictly* for layout orchestration (asymmetric CSS Grid column spans, broken rhythm, negative space gaps), while all colors, typography, glowing borders, animations, and token variables remain 100% governed by the global design system.

## Considered Options
1. **Keep `relatedBlogId` linkage** (Rejected: fractured reader experience and fragmented SEO indexing).
2. **Completely decouple models & enforce strict CSS class catalog for AI generation** (Accepted).

## Consequences
- **Positive:**
  - Case studies are comprehensive, standalone architectural deep dives.
  - Articles remain focused technical essays.
  - AI generation outputs 100% consistent, magazine-grade layout structures without style drift or CSS contamination.
  - Full backward compatibility guaranteed via automated database migration script.
- **Negative:**
  - Requires updating Admin forms and API schemas to remove `relatedBlogId`.

## Implementation Seams
1. Migration Script: `backend/src/scripts/migrate-decouple-project-blogs.ts`
2. Backend AI Prompt Architecture: `backend/src/routes/ai.ts`
3. Global Style Catalog: `fe/src/assets/scss/main.scss` (`.article-*`, `.project-*`, `.editorial-*`)
4. Public Views: `fe/src/views/ProjectDetailView.vue`, `fe/src/views/BlogPostView.vue`
5. Admin Views: `fe/src/views/admin/AdminProjects.vue`
