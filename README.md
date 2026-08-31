# Personal Portfolio Workspace

A full-stack portfolio monorepo with a Vue frontend and an Express backend.

## Highlights
 
- Public pages: Home, About, Case Studies (Projects), Publications (Blog), Contact, CV Viewer
- Admin CMS: Dashboard, Projects (Case Studies), Blog (Articles), Categories, Messages, About & Chronology, Appearance
- **Curated Multi-Theme System (Taste-Skill UI)**:
  - 5 switchable palettes: `editorial-dark`, `editorial-light`, `monochrome-cyber`, `warm-sepia`, `system`
  - Dynamic CSS custom properties (`--canvas`, `--bone`, `--surface`, `--ink`, `--stroke`, `--pastel-...`)
  - Floating Navbar Theme Switcher Pill with live swatch preview and popover selector
  - Zero-breakage CKEditor rich content compatibility
- **10 Masterclass Technical Publications**: Deep long-form articles with architecture diagrams, benchmarks, security guides, and production pitfalls
- **Decoupled Case Study Architecture**: Independent architectural dossiers with System Spec Rail, 60fps GPU acceleration, and smart cross-linking recommender
- **Unified AI Synthesis Engine**: Automated content enhancement adhering strictly to the Semantic Class Catalog
- **Automated Seam Verification Suite**: 6-point deterministic boundary testing
- **Snapshot Static SEO Prerender**: 25 pre-rendered pages with dynamic OpenGraph / Twitter metadata tags
- Shared CKEditor 5 with DOMPurify XSS sanitization
- CV PDF upload and embedded viewer with PDF.js
- Cloudinary global CDN asset pipeline with automatic format and compression negotiation (`f_auto,q_auto`)

## Tech Stack

- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, SCSS, Tailwind
- Backend: Express, TypeScript, MongoDB (Mongoose), JWT
- Auth: Google OAuth -> JWT
- Media: Cloudinary

## Monorepo Structure

```text
Personal-Portfolio/
|-- fe/                     # Vue application
|-- backend/                # Express API
|-- docs/                   # Project documentation
|   |-- ENVIRONMENT.md
|   |-- API_REFERENCE.md
|   `-- ADMIN_CONTENT_GUIDE.md
|-- package.json            # Root orchestration scripts
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB database
- Cloudinary account
- Google OAuth credentials

## Quick Start

1. Install dependencies

```bash
npm install
npm --prefix fe install
npm --prefix backend install
```

2. Create environment files

- Copy backend env template: backend/.env.example -> backend/.env
- Copy frontend env template: fe/.env.example -> fe/.env

3. Run development

```bash
npm run dev
```

Local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health: http://localhost:3000/api/health

## Build and Typecheck

```bash
npm run build
npm run typecheck
```

## Root Scripts

- npm run dev: run FE and BE together
- npm run build: build FE then BE
- npm run typecheck: typecheck FE then BE
- npm run preview:fe: preview FE production bundle
- npm run start:be: start built backend server

## Admin Access Flow

- Navbar has an Admin link to /admin.
- /admin acts as the admin gate screen.
- If not authenticated, the admin layout shows a login prompt.
- Login uses Google OAuth via backend auth endpoints.
- If authenticated with admin role, admin sidebar and all admin routes are accessible.
- Logout is available in the admin left sidebar.

## Key Data Behaviors

- Projects are sorted by: priority desc, featured desc, createdAt desc.
- Project and blog content use managed English category lists.
- About social links are dynamic list items (label + url), not fixed fields.
- Education supports GPA.
- Licenses and certifications are dynamic list items.
- Theme settings are dynamic and stored in backend.

## API Overview

Public endpoints include:

- GET /api/health
- GET /api/home
- GET /api/about
- GET /api/projects
- GET /api/projects/:id
- GET /api/blog
- GET /api/blog/:id
- GET /api/categories
- POST /api/contact
- GET /api/theme

Protected admin endpoints (Bearer JWT required) include:

- PUT /api/home
- PUT /api/about
- POST, PUT, DELETE /api/projects
- POST, PUT, DELETE /api/blog
- PUT /api/categories
- GET, DELETE /api/contact
- POST /api/upload
- PUT /api/theme

For full details, see docs/API_REFERENCE.md.

## Documentation Index

- Environment setup: docs/ENVIRONMENT.md
- API details: docs/API_REFERENCE.md
- Admin workflows: docs/ADMIN_CONTENT_GUIDE.md
- Agent replication playbook: docs/AGENT_REPLICATION_PLAYBOOK.md

## Notes

- Upload endpoint supports resourceType image | raw | video | auto.
- Theme runtime strategy reduces visual jumps:
  - Apply default theme immediately
  - Apply cached theme if available
  - Fetch and apply server theme
