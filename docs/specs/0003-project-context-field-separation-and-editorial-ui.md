# Specification 0003: Project Context Field Separation & Continuous Magazine Presentation

## Overview
This specification separates the Project entity's rich architectural dossier (`context`) from the concise executive overview (`description`), migrates `<section>` blocks from `description` to `context` in MongoDB, updates the Admin form with dedicated editors, and presents a continuous magazine editorial layout on `ProjectDetailView.vue`.

---

## 1. Data Model & Migration
1. **Model Schema (`backend/src/models/Project.ts`):**
   - Add `context?: string` to `IProject` interface and `ProjectSchema`.
2. **Migration Script (`backend/src/scripts/migrate-extract-project-context.ts`):**
   - For every Project document in MongoDB, inspect `description`.
   - If `description` contains `<section class="project-deep-dive-section...` or any `<section...>...</section>` tag, extract the entire `<section>` inner content into `project.context`.
   - Strip the `<section>` block from `description`, trimming whitespace and leaving a clean executive summary.
   - Update MongoDB document with `{ description: cleanDescription, context: extractedContext }`.

---

## 2. Frontend Types & Admin Interface
1. **Frontend Types (`fe/src/types/index.ts`):**
   - Add `context?: string` to `Project` interface.
2. **AdminProjects (`fe/src/views/admin/AdminProjects.vue`):**
   - Provide two distinct form inputs:
     - **Executive Description**: Multiline `<textarea>` for the short overview / summary.
     - **Architecture Context Dossier**: `FullRichEditor.vue` for the rich case study breakdown, connected to the AI Assistant and image uploader.
   - Update `form` state, `fillFormFromProject`, and `handleSubmit`.

---

## 3. Public Presentation (`fe/src/views/ProjectDetailView.vue`)
1. Render the **Executive Overview** from `project.description` inside the primary case study container.
2. When `project.context` is present, render the **System Architecture Dossier** section:
   - Header with status dot: `System Architecture Dossier` & `Technical Context`.
   - `prose-editorial` container rendering `sanitizedProjectContext` with `useRichContentEnhancer` (Copy Code buttons, click-to-zoom Lightbox modal, and 60fps GPU-accelerated micro-interactions).
   - Clean obsidian divider and subtle background containment.

---

## 4. Verification & Testing
- Run MongoDB migration script.
- Backend TypeScript build (`npm run build` in `backend/`).
- Automated seam verification suite (`node ./scripts/test-seams.mjs` in `fe/`).
- Frontend TypeScript build & SEO prerendering 25 pages (`npm run build` in `fe/`).
- GitHub PR & merge into `main`.
