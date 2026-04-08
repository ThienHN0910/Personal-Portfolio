# Personal Portfolio Workspace

Full-stack portfolio monorepo with a Vue frontend and an Express backend.

## Tech Stack

- Frontend: Vue 3, Vite, TypeScript, Pinia, SCSS, Tailwind
- Backend: Express, TypeScript, MongoDB (Mongoose), JWT
- Content: CKEditor 5 (shared editor for admin About and Blog)
- Media: Cloudinary (images and PDF upload)
- Auth: Google OAuth callback -> JWT -> admin guards

## Key Features

- Home/About/Projects/Blog/Contact public pages
- Admin dashboard for About, Projects, Blog, and Contact messages
- Shared rich text editor for admin content workflows
- CV upload (PDF) and CV viewer using pdf.js
- Project ordering by `priority` (desc), then `featured`, then newest
- Project metadata fields: `duration` and `priority`

## Repository Structure

```text
Personal-Portfolio/
|-- fe/                 # Vue app
|   |-- src/
|   |-- package.json
|   `-- .env.example
|-- backend/            # Express API
|   |-- src/
|   |   |-- routes/
|   |   |-- models/
|   |   `-- lib/
|   |-- package.json
|   `-- .env.example
|-- docs/
|   |-- ENVIRONMENT.md
|   |-- API_REFERENCE.md
|   `-- ADMIN_CONTENT_GUIDE.md
|-- package.json        # Monorepo orchestration scripts
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance
- Cloudinary account
- Google OAuth credentials

## Quick Start

1. Install dependencies:

```bash
npm install
npm --prefix fe install
npm --prefix backend install
```

2. Configure env files:

- Copy `backend/.env.example` -> `backend/.env`
- Copy `fe/.env.example` -> `fe/.env`

3. Run development servers:

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

## Scripts

Root (`package.json`):

- `npm run dev` - run FE + BE concurrently
- `npm run build` - build FE + BE
- `npm run typecheck` - typecheck FE + BE
- `npm run preview:fe` - preview FE build
- `npm run start:be` - run built backend

Frontend (`fe/package.json`):

- `npm --prefix fe run dev`
- `npm --prefix fe run build`
- `npm --prefix fe run typecheck`

Backend (`backend/package.json`):

- `npm --prefix backend run dev`
- `npm --prefix backend run build`
- `npm --prefix backend run typecheck`

## API Summary

Public endpoints:

- `GET /api/health`
- `GET /api/home`
- `GET /api/about`
- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/blog`
- `GET /api/blog/:id`
- `POST /api/contact`

Protected admin endpoints (Bearer JWT required):

- `PUT /api/home`
- `PUT /api/about`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/blog`
- `PUT /api/blog/:id`
- `DELETE /api/blog/:id`
- `GET /api/contact`
- `DELETE /api/contact/:id`
- `POST /api/upload`

OAuth endpoints:

- `GET /api/auth/google`
- `GET /api/auth/callback`

See full API notes in `docs/API_REFERENCE.md`.

## Admin Access Model

- User signs in via Google OAuth.
- Backend creates JWT in callback.
- Role is `admin` only when Google email matches `ADMIN_EMAIL`.
- Admin-only routes are guarded by `requireAdmin` middleware.

## Documentation

- Environment setup: `docs/ENVIRONMENT.md`
- API details: `docs/API_REFERENCE.md`
- Admin content workflow: `docs/ADMIN_CONTENT_GUIDE.md`

## Notes

- `POST /api/upload` supports `image` and `raw` resource types (used for both image and PDF flows).
- Rich text editor is shared for Admin About and Admin Blog to keep a consistent authoring experience.
