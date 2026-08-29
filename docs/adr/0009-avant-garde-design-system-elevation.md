# ADR-0009: Full Platform Avant-Garde Redesign & Kinetic Editorial Elevation

## Context & Problem Statement
The portfolio and CMS platform requires a cohesive, high-impact aesthetic upgrade matching the creative direction dials:
- `DESIGN_VARIANCE: 10` (Artsy Chaos / Broken 12-Column Grids / Asymmetric Bento Spans)
- `MOTION_INTENSITY: 8` (Kinetic Physics / 60fps GPU Acceleration / Elastic Hover Recovery)
- `VISUAL_DENSITY: 4` (Editorial Negative Space / 65ch Line Lengths / High Contrast)

## Decision Drivers
- **Anti-Slop Design Discipline:** Avoid generic centered heroes, AI purple gradients, and repetitive symmetrical cards.
- **Strict Semantic Class Preservation:** Retain exact CSS class names (`.article-*`, `.project-*`, `.editorial-*`) to preserve 100% compatibility with the AI generation engine.
- **60fps GPU Performance:** Strictly animate `transform` and `opacity` only.
- **Unified Public & Admin Experience:** Extend the avant-garde obsidian aesthetic to both the public portfolio and the admin control panels.

## Considered Options
1. **Partial Public-Only Redesign** (Rejected: left admin outdated and inconsistent).
2. **Complete Public & Admin Redesign + SCSS Semantic Elevation + Database Content Re-synthesis** (Accepted).

## Consequences
- **Positive:**
  - Distinctive, memorable editorial identity across all 25+ pages and modals.
  - Full consistency between human authoring and AI synthesis.
  - Zero performance regressions.
- **Negative:**
  - Requires updating multiple view components and running verification builds.

## Implementation Seams
1. Global SCSS & Semantic Catalog: `fe/src/assets/scss/main.scss`
2. Public Views: `HomeView`, `AboutView`, `ProjectsView`, `ProjectDetailView`, `BlogView`, `BlogPostView`, `ContactView`, `CvViewerView`
3. Admin Control Panels: `AdminLayout`, `AdminProjects`, `AdminBlog`, `AdminAbout`, `AdminCategories`, `AdminAppearance`, `AdminAnalytics`, `AdminMessages`
4. Database Content Re-synthesis: `backend/src/scripts/resynthesize-editorial-content.ts`
