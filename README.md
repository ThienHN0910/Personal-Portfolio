# Personal Portfolio Workspace

A full-stack portfolio monorepo with a Vue frontend and an Express backend.

## Highlights

- Public pages: Home, About, Projects, Blog, Contact, CV Viewer
- Admin CMS: Dashboard, Projects, Blog, Messages, Content, Appearance
- Dynamic theme system:
  - Runtime gradient and color variables
  - Admin-editable appearance settings
  - Default style first, then cached/fetched theme for smoother loading
- Shared CKEditor 5 for admin blog and about experience content
- CV PDF upload and viewer with pdf.js
- Cloudinary upload flow for images and raw files (for example PDF)

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
- POST /api/contact
- GET /api/theme

Protected admin endpoints (Bearer JWT required) include:

- PUT /api/home
- PUT /api/about
- POST, PUT, DELETE /api/projects
- POST, PUT, DELETE /api/blog
- GET, DELETE /api/contact
- POST /api/upload
- PUT /api/theme

For full details, see docs/API_REFERENCE.md.

## Documentation Index

- Environment setup: docs/ENVIRONMENT.md
- API details: docs/API_REFERENCE.md
- Admin workflows: docs/ADMIN_CONTENT_GUIDE.md

## Notes

- Upload endpoint supports resourceType image | raw | video | auto.
- Theme runtime strategy reduces visual jumps:
  - Apply default theme immediately
  - Apply cached theme if available
  - Fetch and apply server theme
