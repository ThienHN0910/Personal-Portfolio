# ADR-0007: Project Technical Context Field Separation & Continuous Magazine Presentation

## Context & Problem Statement
Following the decoupling of Case Studies from Articles (ADR-0006), deep-dive technical content was temporarily stored in `project.description`. However, mixing high-level executive summaries with long-form architectural breakdowns in a single field made it difficult for client views to present concise card excerpts alongside deep-dive editorial layouts.

## Decision Drivers
- **Separation of Concerns:** Clear demarcation between an Executive Summary (`description`) and the in-depth Architectural Dossier (`context`).
- **Rich Content Integrity:** The `context` field is authored via CKEditor, constrained by our Semantic CSS Class Catalog, and sanitized via `DOMPurify` before client injection.
- **Continuous Editorial Presentation:** Public Case Study view presents the Executive Summary followed seamlessly by the System Architecture Dossier.
- **Zero-Friction Administration:** Admin interface provides a concise textarea for `description` and a dedicated `FullRichEditor` with AI Assistant for `context`.

## Considered Options
1. **Single overloaded `description` field** (Rejected: conflates summary excerpts with deep-dive technical dossiers).
2. **Separate `context` field with automated migration and continuous magazine UI** (Accepted).

## Consequences
- **Positive:**
  - Clear schema distinction between concise project summaries and exhaustive architectural dossiers.
  - Project Cards and SEO descriptions remain clean, while Case Study pages offer deep technical depth.
  - Backward compatible via automated migration extracting `<section>` blocks into `context`.
- **Negative:**
  - Minor schema addition and form layout update.

## Implementation Seams
1. Migration Script: `backend/src/scripts/migrate-extract-project-context.ts`
2. Backend Schema: `backend/src/models/Project.ts`
3. Frontend Types: `fe/src/types/index.ts`
4. Admin Interface: `fe/src/views/admin/AdminProjects.vue`
5. Public Presentation: `fe/src/views/ProjectDetailView.vue`
