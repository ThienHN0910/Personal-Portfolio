# API Reference

Base path: /api

## Health

- GET /health
- GET /api/health

Both return:

```json
{ "success": true, "status": "ok" }
```

## Auth

- GET /api/auth/google
  - Redirects to Google OAuth consent screen.
- GET /api/auth/callback
  - Exchanges code for Google profile, issues JWT, redirects to FE callback route.

Admin role rule:

- role=admin if Google email equals ADMIN_EMAIL.

## Home

- GET /api/home
- PUT /api/home (admin)

## About

- GET /api/about
- PUT /api/about (admin)

About payload includes:

- name, title, bio
- contactInfo: email, phone, location, website
- skills
- experience (rich text description supported)
- education
- avatarUrl, resumeUrl
- socialLinks: github, linkedin, email

## Projects

- GET /api/projects
  - Sorted by priority desc, featured desc, createdAt desc.
- POST /api/projects (admin)
- GET /api/projects/:id
- PUT /api/projects/:id (admin)
- DELETE /api/projects/:id (admin)

Project fields:

- title
- description
- duration (optional)
- priority (number)
- technologies
- imageUrl
- githubUrl
- liveUrl
- relatedBlogId
- featured

## Blog

- GET /api/blog
  - Public list returns only published posts.
  - Admin UI can request all posts using query `all=true`.
- POST /api/blog (admin)
- GET /api/blog/:id
- PUT /api/blog/:id (admin)
- DELETE /api/blog/:id (admin)

## Contact

- GET /api/contact (admin)
- POST /api/contact (public)
- DELETE /api/contact/:id (admin)

## Upload

- POST /api/upload (admin)

Request body:

- data: data URL string (required)
- folder: cloud folder (optional)
- resourceType: image | raw | video | auto (optional)
- fileName: custom public id source (optional)

Behavior:

- image uploads get auto quality/fetch_format transformation.
- raw uploads are used for non-image files (for example PDF CV).

## Auth Header for Protected Endpoints

Use Bearer token in Authorization header:

```http
Authorization: Bearer <jwt_token>
```

If token is missing or invalid, API returns 401.
If role is not admin on admin routes, API returns 403.
