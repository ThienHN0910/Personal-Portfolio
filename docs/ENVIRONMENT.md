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
```

## Deployment Notes

- Always use HTTPS for FRONTEND_URL and API_BASE_URL.
- Keep JWT_SECRET long and private.
- Keep ADMIN_EMAIL strict to intended admin account.
- If using Vercel, ensure FRONTEND_URL and API_BASE_URL match actual deployed domains.

## Theme System Notes

No extra env variables are needed for theme configuration.

Theme values are stored in database and loaded at runtime:

- default theme is applied immediately
- cached theme is applied next
- server theme is fetched and applied last
