# Specification 0005: Full Platform Avant-Garde Redesign & Editorial Elevation

## Overview
This specification details the end-to-end redesign of the entire portfolio and admin suite with `DESIGN_VARIANCE: 10`, `MOTION_INTENSITY: 8`, `VISUAL_DENSITY: 4`, upgrading global SCSS, public views, admin panels, and providing automated database content re-synthesis.

---

## 1. Global SCSS Design System Elevation (`fe/src/assets/scss/main.scss`)
- **Obsidian & Bone Palette:** High-contrast serif headlines, subtle glass backdrops, dual-layer borders with subtle highlights.
- **Editorial Cards & Containers:** `.editorial-card` with GPU-accelerated hover lift, soft inner shadows, and rounded 16px corners.
- **Semantic Components:**
  - `.project-metric-grid` / `.project-metric-card`: Asymmetric multi-card layout with large tabular numbers and micro-labels.
  - `.project-architecture-callout` / `.article-callout`: Inset obsidian panels with glowing accent borders.
  - `.article-pullquote`: Oversized italic quotes with custom quote glyphs.
  - `.project-spec-table` / `.article-table`: Clean monospace headers with hover highlight rows.
  - `.project-codeblock` / `.article-codeblock`: Deep space obsidian container with inset lighting.
  - `.project-hero-badge`: Glowing emerald dot status badge.
  - `.article-list`: Monospace bullet dots with glowing accents.

---

## 2. Public Views Redesign
- **`HomeView.vue`, `HeroSection.vue`, `FeaturedProjects.vue`:**
  - Split-screen asymmetric hero with kinetic typography and quick stats strip.
  - Asymmetric bento grid for featured case studies (7/5 rhythm).
- **`AboutView.vue`:**
  - Avant-garde 2-column split with sticky architect profile and glowing timeline rails for Work & Education chronologies.
- **`ProjectsView.vue` & `ProjectCard.vue`:**
  - Broken bento grid with dynamic category filter badges and hover micro-interactions.
- **`ProjectDetailView.vue`:**
  - Magazine header, executive overview card, and full System Architecture Dossier with lightbox zoom and copy code buttons.
- **`BlogView.vue`, `BlogPostView.vue`, `BlogCard.vue`:**
  - Magazine layout with reading time, category pills, and rich prose formatting.
- **`ContactView.vue` & `CvViewerView.vue`:**
  - Asymmetric communication dossier with tactile feedback and verified security badges.

---

## 3. Admin Control Panel Redesign
- **`AdminLayout.vue`:** Sleek sidebar with obsidian glass styling, active pill indicator, and status header.
- **`AdminDashboard.vue`, `AdminProjects.vue`, `AdminBlog.vue`, `AdminAbout.vue`, `AdminCategories.vue`, `AdminAppearance.vue`, `AdminAnalytics.vue`, `AdminMessages.vue`:**
  - Unified modern dark UI with glassy modals, crisp inputs, and responsive action toolbars.

---

## 4. Database Content Re-synthesis
- `backend/src/scripts/resynthesize-editorial-content.ts`: Migration script utilizing the unified AI Master Synthesis prompt to upgrade existing live project dossiers and articles in MongoDB.

---

## 5. Verification
- Backend TypeScript build (`npm run build` in `backend/`).
- Automated seam verification suite (`node ./scripts/test-seams.mjs` in `fe/` - 5/5 PASS).
- Frontend TypeScript build & SEO prerendering 25 pages (`npm run build` in `fe/`).
