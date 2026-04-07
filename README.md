# Personal Portfolio Workspace

Full-stack portfolio project with separated frontend and backend:
- Frontend: Vue 3 + Vite + TypeScript (folder `fe`)
- Backend: Express + TypeScript + MongoDB (folder `backend`)

## Workspace Structure

```
Personal-Portfolio/
├── fe/                     # Frontend app (Vue + Vite)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── backend/                # Backend API (Express + TS)
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── lib/
│   ├── package.json
│   └── .env.example
├── package.json            # Root orchestrator scripts
└── README.md
```

## Requirements

- Node.js >= 18
- npm >= 9
- MongoDB (Atlas or self-hosted)
- Cloudinary account
- Google OAuth credentials

## Setup

1) Install dependencies at root (for orchestration scripts)

```bash
npm install
```

2) Install frontend dependencies

```bash
npm --prefix fe install
```

3) Install backend dependencies

```bash
npm --prefix backend install
```

4) Configure environment variables

- Backend env: copy `backend/.env.example` to `backend/.env`
- Frontend env: copy `fe/.env.example` to `fe/.env`

Backend variables (minimum):

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_key_min_32_chars
ADMIN_EMAIL=your-admin@email.com
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

Frontend variables:

```env
VITE_API_BASE_URL=/api
```

Notes:
- In local dev, frontend running on 5173 auto-resolves API to `http://localhost:3000/api`.
- In production, set `VITE_API_BASE_URL` to your backend base URL if FE and BE are on different domains.

## Run

Run both frontend and backend in parallel:

```bash
npm run dev
```

Expected local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/api/health

## Build and Typecheck

Build both apps:

```bash
npm run build
```

Typecheck both apps:

```bash
npm run typecheck
```

## Root Scripts

- `npm run dev`: run FE + BE concurrently
- `npm run build`: build FE + BE
- `npm run typecheck`: typecheck FE + BE
- `npm run preview:fe`: preview FE production build
- `npm run start:be`: run built backend

## API Overview

Main backend routes:
- `GET /api/health`
- `GET/PUT /api/home`
- `GET/PUT /api/about`
- `GET/POST /api/projects`
- `GET/PUT/DELETE /api/projects/:id`
- `GET/POST /api/blog`
- `GET/PUT/DELETE /api/blog/:id`
- `GET/POST /api/contact`
- `DELETE /api/contact/:id`
- `POST /api/upload`
- `GET /api/auth/google`
- `GET /api/auth/callback`

## Admin Access

Admin role is granted when Google account email matches `ADMIN_EMAIL`.
4. From there you can manage projects, blog posts, messages, and page content

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Type-check and build for production
npm run preview   # Preview production build locally
```
