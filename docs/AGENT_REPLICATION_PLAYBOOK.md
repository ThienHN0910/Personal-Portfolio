# Agent Replication Playbook

This document is a practical guide for an engineering agent to:

1. Read this repository end-to-end in a deterministic order.
2. Extract architecture decisions and implementation conventions.
3. Rebuild a similar full-stack portfolio project with the same architecture style.

Use this playbook together with:

- docs/ENVIRONMENT.md
- docs/API_REFERENCE.md
- docs/ADMIN_CONTENT_GUIDE.md

---

## 1) Outcome And Scope

Target architecture to replicate:

- Monorepo with two apps:
  - Frontend: Vue 3 + Vite + TypeScript + Pinia + Vue Router
  - Backend: Express + TypeScript + MongoDB (Mongoose) + JWT
- OAuth login with Google and role-based admin access.
- CMS-style admin panel for Home/About/Projects/Blog/Contact/Theme.
- Shared rich text editor with image upload to Cloudinary.
- Public pages consume backend-managed content.
- Runtime theme system (default -> cached -> server theme).

Non-goals:

- Exact pixel-level UI cloning.
- Exact copy of all styles and animations.
- Exact same data records.

---

## 2) Fast Architecture Snapshot

### Repository boundaries

- Root: orchestration scripts for FE + BE.
- backend/: API server and data layer.
- fe/: public site + admin UI.
- docs/: runtime, API, and content workflows.

### Backend architecture style

- Thin route handlers in backend/src/routes/*.ts.
- Mongoose models in backend/src/models/*.ts.
- Shared infra helpers in backend/src/lib/*.ts.
- Per-request DB connection helper with cached mongoose handle.
- Auth guard helpers return user object or send response immediately.

### Frontend architecture style

- Route-based view composition in fe/src/router/index.ts.
- Pinia store per domain in fe/src/stores/*.ts.
- API access centralized in fe/src/utils/api.ts.
- Views consume stores, not direct axios calls.
- Admin views and public views share the same backend resources.

### Cross-cutting patterns

- All API responses use shape: success + data/message/error.
- Rich HTML is generated in admin and sanitized on public render.
- Uploads go through backend /api/upload, not direct client Cloudinary calls.
- Theme values are persisted in DB and applied to CSS variables.

---

## 3) Deterministic Reading Plan (Whole Project)

Read in this exact order to avoid context switching.

## Phase A - Orientation (15-20 min)

Goal: understand scope and run model.

Read:

1. README.md
2. docs/ENVIRONMENT.md
3. docs/API_REFERENCE.md
4. docs/ADMIN_CONTENT_GUIDE.md
5. package.json
6. backend/package.json
7. fe/package.json

Extract:

- Runtime dependencies and toolchain.
- Feature list and public/admin capabilities.
- Required env variables.

Deliverable:

- One-page "system map" (apps, databases, external services, auth flow).

## Phase B - Backend Skeleton (35-45 min)

Goal: map backend request lifecycle.

Read:

1. backend/src/server.ts
2. backend/src/lib/mongodb.ts
3. backend/src/lib/auth.ts
4. backend/src/lib/cloudinary.ts

Extract:

- Middleware order (cors, json body limit, urlencoded, routes, 404, error handler).
- Health endpoints.
- DB connection strategy.
- JWT generation and role guard behavior.

Deliverable:

- Request lifecycle diagram: incoming request -> route -> model -> response.

## Phase C - Backend Domain APIs (50-70 min)

Goal: capture contracts, authorization, and normalization logic.

Read routes in this order:

1. backend/src/routes/auth.ts
2. backend/src/routes/home.ts
3. backend/src/routes/about.ts
4. backend/src/routes/projects.ts
5. backend/src/routes/blog.ts
6. backend/src/routes/contact.ts
7. backend/src/routes/theme.ts
8. backend/src/routes/upload.ts

Then read models in this order:

1. backend/src/models/Home.ts
2. backend/src/models/About.ts
3. backend/src/models/Project.ts
4. backend/src/models/BlogPost.ts
5. backend/src/models/Contact.ts
6. backend/src/models/Theme.ts

Extract:

- Public vs admin endpoints.
- Input normalization (social links, colors, list cleanup).
- Default document creation behavior for singleton resources.
- Sort policies (projects, messages, posts).

Deliverable:

- API matrix table: endpoint, auth level, payload, validation, side effects.

## Phase D - Frontend Foundation (35-50 min)

Goal: map app bootstrapping and routing.

Read:

1. fe/src/main.ts
2. fe/src/App.vue
3. fe/src/router/index.ts
4. fe/src/utils/api.ts
5. fe/src/utils/auth.ts
6. fe/src/types/index.ts
7. fe/vite.config.ts
8. fe/vercel.json

Extract:

- App initialization order.
- Route layout split (public vs admin).
- Auth guard behavior.
- Axios interceptors and token handling.

Deliverable:

- Frontend runtime flow: app boot -> theme init -> route -> data fetch.

## Phase E - Frontend Domain Stores (35-50 min)

Goal: map state ownership and API integration.

Read in order:

1. fe/src/stores/auth.ts
2. fe/src/stores/theme.ts
3. fe/src/stores/home.ts
4. fe/src/stores/about.ts
5. fe/src/stores/projects.ts
6. fe/src/stores/blog.ts
7. fe/src/stores/contact.ts

Extract:

- Store boundaries and responsibilities.
- Data-fetch and update conventions.
- Client-side sort and merge logic.

Deliverable:

- Store contract sheet: state, actions, endpoint mapping.

## Phase F - UI Composition And Admin CMS (60-90 min)

Goal: understand authoring workflow and public rendering.

Read these representative files:

1. fe/src/components/admin/AdminLayout.vue
2. fe/src/components/admin/FullRichEditor.vue
3. fe/src/utils/ckeditorUploadAdapter.ts
4. fe/src/views/admin/AdminAbout.vue
5. fe/src/views/admin/AdminProjects.vue
6. fe/src/views/admin/AdminBlog.vue
7. fe/src/views/admin/AdminAppearance.vue
8. fe/src/views/HomeView.vue
9. fe/src/views/AboutView.vue
10. fe/src/views/BlogPostView.vue
11. fe/src/views/CvViewerView.vue

Extract:

- Admin gate behavior and navigation.
- Rich text editor plugin usage and upload pipeline.
- How admin forms normalize and save data.
- How public pages sanitize/render managed content.

Deliverable:

- End-to-end authoring flow: admin edit -> backend save -> public render.

## Phase G - Validation And Runbook (20-30 min)

Goal: verify understanding against real runtime.

Run:

1. npm install
2. npm --prefix fe install
3. npm --prefix backend install
4. npm run typecheck
5. npm run build
6. npm run dev

Smoke checks:

- GET /api/health returns 200.
- Public pages load and fetch data.
- Admin login route redirects to Google.
- Admin CRUD works for at least one Project and one Blog post.
- Theme changes are applied after save and preserved on refresh.

Deliverable:

- Verified setup checklist with pass/fail notes.

---

## 4) Rebuild Blueprint For Another Agent

Follow this sequence to implement a similar project from scratch.

1. Create monorepo folders: fe, backend, docs.
2. Add root orchestration scripts for dev/build/typecheck.
3. Build backend skeleton:
   - Express app
   - env loading
   - cors/json middleware
   - health routes
   - route registration
4. Add backend libs:
   - mongodb connection cache
   - jwt auth helpers (requireAuth, requireAdmin)
   - cloudinary provider helper
5. Add backend models and CRUD routes by domain:
   - Home, About, Project, BlogPost, Contact, Theme
6. Add auth route with Google OAuth callback and JWT issuing.
7. Add upload endpoint with role guard and Cloudinary upload options.
8. Build frontend skeleton:
   - Vue app bootstrap
   - router with admin child routes
   - Pinia setup
9. Add shared frontend utilities:
   - typed axios client
   - token persistence helpers
10. Implement domain stores mapped 1:1 with backend resources.
11. Build admin UI first (content authoring surfaces).
12. Build public pages that consume stored content.
13. Add theme store with staged initialization:
   - apply default
   - apply cache
   - fetch server theme
14. Add rich text editor and upload adapter integration.
15. Add documentation and operational runbooks.

---

## 5) Mandatory Conventions To Keep

If you want the same architecture behavior, keep these conventions:

- One Pinia store per backend domain resource.
- Single API client with auth interceptor.
- Route-layer auth checks, not scattered in model code.
- Singleton resources (Home/About/Theme) auto-create defaults on first read.
- Admin-only write endpoints guarded with JWT role check.
- Public rendering of rich HTML always sanitized.
- Uploads pass through backend for credential isolation.

---

## 6) Known Pitfalls And Guardrails

Use these guardrails while replicating:

- Do not rely on nested ref auto-unwrapping in Vue templates for dialog-like state objects.
- CKEditor plugin injection should return a named function (constructor-safe runtime behavior).
- Keep backend and frontend package dependencies self-contained; avoid cross-package file dependency loops.
- Validate upload payload size before converting to data URL to protect backend body parser limits.
- Theme color input should be normalized to valid hex before persistence.

---

## 7) Documentation Pack To Produce

When another agent rebuilds the project, require these docs as outputs:

1. ENVIRONMENT.md
2. API_REFERENCE.md
3. ADMIN_CONTENT_GUIDE.md
4. ARCHITECTURE_DECISIONS.md
5. RUNBOOK.md (build, typecheck, smoke checks)

Minimum acceptance for docs quality:

- Every endpoint lists auth mode and payload.
- Every env var lists purpose and example.
- Every admin section lists which API/store it uses.
- Include at least one complete login and content-publish flow.

---

## 8) Definition Of Done (Replication)

A replication is complete only when all checks pass:

1. Monorepo scripts run FE and BE together.
2. OAuth login returns JWT and role.
3. Admin pages can create/update/delete Project and Blog records.
4. About page renders rich experience content safely.
5. CV PDF can be uploaded and viewed.
6. Theme update persists and applies after reload.
7. Typecheck and production build pass for both apps.
8. Documentation pack is complete and accurate.

If any item fails, replication is not done.