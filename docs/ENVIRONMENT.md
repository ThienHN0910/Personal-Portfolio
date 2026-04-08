# Environment Configuration

This document explains environment variables for local development and deployment.

## File Locations

- Backend env file: backend/.env
- Frontend env file: fe/.env
- Optional combined template: .env.example (repo root)

The backend loads env in this order:

1. backend/.env
2. ../.env (root)
3. process default env

## Backend Variables

Required in most environments:

- PORT: API server port. Default 3000.
- MONGODB_URI: MongoDB connection string.
- JWT_SECRET: Secret used to sign auth tokens.
- ADMIN_EMAIL: Email that receives admin role after Google login.

Google OAuth:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- FRONTEND_URL: Base URL for redirect to FE callback page.
- API_BASE_URL: Public backend base URL used to build OAuth callback URL.

Cloudinary:

- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

CORS:

- CORS_ORIGIN: Allowed frontend origin (recommended in production).

## Frontend Variables

- VITE_API_BASE_URL: API base path or full URL.
  - Local default: /api
  - If FE and BE are split domains, use full BE URL.

## Local Example

Backend (backend/.env):

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

Frontend (fe/.env):

```env
VITE_API_BASE_URL=/api
```

## Production Notes

- Always rotate JWT_SECRET and Cloudinary keys if exposed.
- Use HTTPS URLs for FRONTEND_URL and API_BASE_URL.
- Keep ADMIN_EMAIL explicit and restricted to the real maintainer account.
- If hosted on Vercel, API_BASE_URL/FRONTEND_URL should be the deployed domains.
