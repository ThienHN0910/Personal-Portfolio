# Specification 0004: Unified AI Prompt Pipeline & Streamlined Editor Modal

## Overview
This specification consolidates the fragmented multi-template AI selector into a single unified master synthesis pipeline in `backend/src/routes/ai.ts` and simplifies `FullRichEditor.vue`'s AI Assistant modal into a seamless, one-click workflow with an optional prompt input.

---

## 1. Unified Master AI Pipeline (`backend/src/routes/ai.ts`)
- Replace the disparate template map (`default`, `project_blog`, `dev_log`, `project_overview`, `context_to_casestudy`, `context_to_article`) with a single comprehensive **Master AI Synthesis Engine**:
  - Automatically identifies whether the input is a **Project Case Study**, **Technical Article**, or **Architectural Note**.
  - Enforces the full **`DESIGN_SYSTEM_RULES`**:
    - Predefined classes: `.project-hero-title`, `.project-lead`, `.project-h2`, `.project-h3`, `.project-p`, `.project-architecture-callout`, `.project-metric-grid`, `.project-metric-card` (with `.metric-value` & `.metric-label`), `.project-spec-table`, `.project-codeblock`, `.project-figure`, `.article-pullquote`.
    - Inline styles *exclusively* for structural 12-column CSS Grid spans (`grid-column: span 7;`, `grid-column: span 5;`, `gap: 1.5rem;`) and flex alignments.
    - Zero inline colors, backgrounds, or custom fonts.
  - Supports optional custom user directives passed via `customPrompt`.

---

## 2. Streamlined AI Assistant Modal (`FullRichEditor.vue`)
- Remove the template selection dropdown from the modal.
- Provide a clean, focused 2-field layout:
  1. **Source Content / Raw Context (Optional if editor already has text)**: Textarea for pasting `CONTEXT.md`, README, or drafts.
  2. **Additional Instructions (Optional)**: Single-line / 2-line input for specific tweaks (e.g., "Emphasize Redis caching").
- One-click primary action: **"✨ Generate with Design System"**.

---

## 3. Verification & Testing
- Backend TypeScript build (`npm run build` in `backend/`).
- Automated seam verification suite (`node ./scripts/test-seams.mjs` in `fe/`).
- Frontend TypeScript build & SEO prerendering 25 pages (`npm run build` in `fe/`).
- GitHub PR & merge into `main`.
