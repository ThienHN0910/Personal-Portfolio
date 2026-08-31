# Agent Operating Guidelines & Engineering Standard

> **Target Audience:** Autonomous AI coding agents (Antigravity, Claude Code, Cursor, Copilot Workspace) and human engineers operating in `ThienHN0910/Personal-Portfolio`.

---

## 1. Domain Vocabulary & Architecture Rules

- **Always consult [`CONTEXT.md`](./CONTEXT.md)** before introducing new symbols, database models, route names, or user-facing labels. Use canonical vocabulary:
  - `Case Study` (not "Project" or "Work item")
  - `Article` (not "Blog post" or "Diary")
  - `Publication` (not "Feed")
  - `Skill Matrix` & `Work Chronology` (not "Resume list")
  - `System Spec Rail` (the sticky metadata sidebar on case studies)
  - `Snapshot Prerender` (the build-time static HTML crawler generator)
  - `Bearer Session` (stateless JWT authentication)
  - `Optimized Asset Delivery` (Cloudinary CDN pipeline)
- **Respect Architectural Decision Records:** Every architectural choice is documented under [`docs/adr/`](./docs/adr/). Review relevant ADRs (ADR-0001 through ADR-0010) before making structural changes.

---

## 2. Git & Branching Strategy

- **Never commit directly to `main` for non-trivial feature work.**
- **Always branch from latest `origin/main`:**
  - Feature branch: `git checkout -b feat/<issue-id>-<short-slug>` (e.g., `feat/3-telegram-notifications`)
  - Bugfix branch: `git checkout -b fix/<issue-id>-<short-slug>` (e.g., `fix/12-turnstile-timeout`)
  - Refactor branch: `git checkout -b refactor/<short-slug>`
  - Documentation branch: `git checkout -b docs/<short-slug>`

---

## 3. Conventional Commit Standard

Every commit message must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short imperative description>

[optional body describing technical decisions and tradeoffs]

[optional footer: Closes #<issue-id>]
```

**Permitted Types:**
- `feat`: New feature or user-facing capability
- `fix`: Bug fix
- `refactor`: Code restructuring without behavioral change
- `perf`: Performance optimization (60fps animation, asset compression)
- `style`: CSS, typography, layout, or formatting adjustments
- `docs`: Documentation, ADRs, CONTEXT.md updates
- `test`: Adding or refactoring test suites
- `chore`: Tooling, dependencies, build script updates

---

## 4. GitHub CLI (`gh`) & PR Workflow

When completing work on a feature branch:

1. **Verify all builds and tests pass locally** (see Section 5).
2. **Push the branch to GitHub:**
   ```bash
   git push -u origin <branch-name>
   ```
3. **Create a Pull Request using `gh` CLI:**
   ```bash
   gh pr create --title "<type>(<scope>): <summary>" --body "Closes #<issue-id>

   ## Summary of Changes
   - ...

   ## Testing & Verification
   - [x] Backend TypeScript build passed (\`npm run build\` in \`backend/\`)
   - [x] Frontend build & SEO prerender passed (\`npm run build\` in \`fe/\`)
   - [x] Automated seam tests passed (\`node ./scripts/test-seams.mjs\` in \`fe/\`)"
   ```
4. **Auto-merge or squash merge** once review is verified.

---

## 5. Verification Commands (Zero-Error Policy)

Before opening a PR or declaring a ticket complete, agents MUST run and verify:

```bash
# 1. Backend Typecheck & Build
cd backend && npm run build

# 2. Automated Seam Verification Suite (6 Seams)
cd fe && node ./scripts/test-seams.mjs

# 3. Frontend Typecheck, Vite Bundling & SEO Prerendering (25 pages)
cd fe && npm run build
```

---

## 6. Frontend Aesthetic & Motion Dials

All UI code must preserve the project's creative direction:
- **`DESIGN_VARIANCE: 8`** — Asymmetric bento spans (7/5, 8/4, 6/6), broken grid rhythm, variable media heights.
- **`MOTION_INTENSITY: 8`** — Lenis inertia smooth scrolling, GSAP split-line reveals, magnetic CTA cursor tracking with elastic recovery.
- **`VISUAL_DENSITY: 3`** — Airy, expansive negative space (`space-y-28` to `space-y-32`), max 60ch readable line lengths.
- **60fps GPU Acceleration Rule:** Strictly animate only `transform` (`translate3d`, `scale`) and `opacity`. NEVER animate layout-triggering properties (`width`, `height`, `top`, `margin`, `padding`).

---

## 7. Multi-Theme Architecture & Editorial Class Catalog

- **Dynamic Theme Properties:** Always use CSS custom properties (`--canvas`, `--bone`, `--surface`, `--ink`, `--stroke`, `--pastel-...`) instead of hardcoded hex values to support all 5 curated palettes (`editorial-dark`, `editorial-light`, `monochrome-cyber`, `warm-sepia`, `system`).
- **Strict Editorial Class Whitelist:** Rich content and AI-generated text must use the predefined catalog:
  - Lead: `.article-lead` / `.project-lead`
  - Headings: `.article-h2` / `.project-h2`, `.article-h3` / `.project-h3`, `.article-h4`
  - Body: `.article-p` / `.project-p`, `.article-list`
  - Badges: `.article-badge`, `.article-badge--green`, `.article-badge--amber`, `.article-badge--red`, `.project-hero-badge`
  - Layouts: `.article-grid-12`, `.article-col-7`, `.article-col-5`, `.article-col-6`, `.article-col-4`, `.article-col-8`, `.article-col-12`
  - Callouts & ADRs: `.article-callout`, `.project-architecture-callout`
  - Code & Tables: `.article-codeblock`, `.project-codeblock`, `.article-table`, `.project-spec-table`
  - Quotes & Figures: `.article-pullquote`, `.article-figure`, `.project-figure`
- **Zero Inline Hardcoded Colors:** Never output inline color or background-color hex codes in rich content.

---

## 8. Security & Secrets Hygiene

- **NEVER write real secrets, API keys, or bot tokens into `.md` documentation files.**
- Place all environment variables exclusively in local `.env` files (which are strictly `.gitignore`d).
- Update `.env.example` with sanitized placeholders whenever new environment variables are introduced.
- Client-rendered HTML MUST pass through `sanitizeRichContent()` (`fe/src/utils/richContent.ts`) via `DOMPurify` to eliminate XSS vectors.
