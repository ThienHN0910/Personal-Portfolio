# Environment Configuration

This document describes required and optional environment variables for local and production deployments.

## Env File Locations

- Backend: backend/.env
- Frontend: fe/.env

Backend loads env files in this order:

1. backend/.env
2. ../.env (repository root)
3. process environment

## Backend Variables

Core:

- PORT: backend port (default 3000)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: token signing secret
- ADMIN_EMAIL: email that receives admin role

Google OAuth:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- FRONTEND_URL: frontend base URL used for auth callback redirect
- API_BASE_URL: backend public URL used as OAuth redirect URI base

Cloudinary:

- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

CORS:

- CORS_ORIGIN: allowed frontend origin (recommended for production)

## Frontend Variables

- VITE_API_BASE_URL: API base path or full backend URL
  - local default: /api
  - for split-domain deployment: full backend URL
- VITE_SITE_URL: public frontend URL used for canonical URL, Open Graph URL, and generated sitemap/robots files
  - local example: http://localhost:5173
  - production example: https://your-portfolio-domain.com
- SEO_DATA_API_BASE_URL (optional): API base URL used only during build-time SEO prerender for dynamic routes
  - recommended in production builds: https://your-backend-domain.com/api
  - if omitted, build uses VITE_API_BASE_URL, then falls back to /api

## Local Example

backend/.env

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=replace_with_long_secret
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

fe/.env

```env
VITE_API_BASE_URL=/api
VITE_SITE_URL=http://localhost:5173
SEO_DATA_API_BASE_URL=http://localhost:3000/api
```

## Deployment Notes

- Always use HTTPS for FRONTEND_URL and API_BASE_URL.
- Keep JWT_SECRET long and private.
- Keep ADMIN_EMAIL strict to intended admin account.
- If using Vercel, ensure FRONTEND_URL and API_BASE_URL match actual deployed domains.
- Set VITE_SITE_URL to the final frontend domain so canonical/og:url and sitemap URLs are correct.

## SEO Files

Frontend build/dev now auto-generates these files based on VITE_SITE_URL:

- fe/public/robots.txt
- fe/public/sitemap.xml

If VITE_SITE_URL is missing or invalid, generation falls back to http://localhost:5173.

Sitemap generation now also includes dynamic public URLs from API when available:

- /projects/:id
- /blog/:id

## Dynamic Route Prerender

Frontend build also prerenders SEO HTML for public routes and dynamic details:

- /projects/:id
- /blog/:id

Public listing pages also use API-derived metadata where available:

- / (home)
- /about
- /projects
- /blog
- /contact
- /cv

The prerender step fetches metadata from SEO_DATA_API_BASE_URL (or VITE_API_BASE_URL).
If API is unavailable during build, static route prerender still succeeds and dynamic detail prerender is skipped.

## Theme System Notes

No extra env variables are needed for theme configuration.

Theme values are stored in database and loaded at runtime:

- default theme is applied immediately
- cached theme is applied next
- server theme is fetched and applied last
