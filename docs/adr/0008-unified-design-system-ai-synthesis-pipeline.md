# ADR-0008: Unified Design-System-Constrained AI Synthesis Pipeline

## Context & Problem Statement
Previously, the AI Assistant in `FullRichEditor.vue` presented a multi-choice template selector (`context_to_casestudy`, `context_to_article`, `project_blog`, `dev_log`, `default`). This introduced cognitive overhead and friction for authors who simply wanted to paste raw notes/markdown and get a compliant, avant-garde editorial layout.

## Decision Drivers
- **Frictionless Authoring:** One unified master AI pipeline that automatically infers context and applies the complete `DESIGN_SYSTEM_RULES` without requiring manual template selection.
- **Strict Design System Fidelity:** Guaranteed enforcement of the Semantic Class Catalog (`.article-*`, `.project-*`, `.editorial-*`) and 12-column CSS Grid layout orchestration.
- **Extensibility via Optional Prompt:** Retain an optional custom instructions field for author-specific directives (e.g. translation, emphasis, specific metrics).

## Considered Options
1. **Multi-template dropdown selector** (Rejected: created unnecessary UI complexity and friction).
2. **Unified master AI synthesis pipeline with optional custom prompt** (Accepted).

## Consequences
- **Positive:**
  - One-click workflow: paste raw context -> click generate -> receive publication-ready editorial HTML.
  - Streamlined Admin UI modal.
  - Consistent adherence to `DESIGN_VARIANCE: 8` and `VISUAL_DENSITY: 3`.
- **Negative:**
  - Backend prompt handles multi-format detection in a single comprehensive instruction.

## Implementation Seams
1. Backend AI Engine: `backend/src/routes/ai.ts`
2. Frontend Modal: `fe/src/components/admin/FullRichEditor.vue`
