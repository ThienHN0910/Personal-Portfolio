# API Reference

Base path: /api

## Health

- GET /health
- GET /api/health

Response:

```json
{ "success": true, "status": "ok" }
```

## Auth

### GET /api/auth/google

Redirects to Google OAuth consent.

### GET /api/auth/callback

- Exchanges auth code with Google
- Fetches user profile
- Issues JWT
- Redirects to frontend callback route with query:
  - token=<jwt> on success
  - error=<reason> on failure

Admin role rule:

- role=admin when Google email equals ADMIN_EMAIL

## Home

### GET /api/home

Returns current home content record.

### PUT /api/home (admin)

Updates home content.

Fields:

- heroTitle
- heroSubtitle
- heroDescription
- ctaText
- ctaLink
- profileImage

## About

### GET /api/about

Returns about content. If empty, backend creates a default record.

### PUT /api/about (admin)

Updates about content.

Payload shape:

- name
- title
- bio
- contactInfo
  - email
  - phone
  - location
  - website
- skills: string[]
- experience: array
  - company
  - position
  - startDate
  - endDate
  - description (rich HTML)
- education: array
  - institution
  - degree
  - field
  - gpa
  - startDate
  - endDate
- licensesCertifications: array
  - name
  - issuer
  - issueDate
  - expirationDate
  - credentialId
  - credentialUrl
- avatarUrl
- resumeUrl
- socialLinks: array
  - label
  - url

Normalization behavior:

- Social links are normalized and legacy social data is migrated.
- Education and licenses arrays are normalized and empty rows are removed.

## Projects

### GET /api/projects

Returns all projects sorted by:

- priority desc
- featured desc
- createdAt desc

### POST /api/projects (admin)

Creates a new project.

### GET /api/projects/:id

Returns one project.

### PUT /api/projects/:id (admin)

Updates a project.

### DELETE /api/projects/:id (admin)

Deletes a project.

Project fields:

- title
- description
- duration
- priority
- technologies
- imageUrl
- githubUrl
- liveUrl
- relatedBlogId
- featured

## Blog

### GET /api/blog

- Public mode: returns published posts only
- Admin mode: pass query all=true to return all posts

### POST /api/blog (admin)

Creates a post.

### GET /api/blog/:id

Returns one post.

### PUT /api/blog/:id (admin)

Updates a post.

### DELETE /api/blog/:id (admin)

Deletes a post.

## Contact

### POST /api/contact

Public contact form submit endpoint.

Required fields:

- name
- email
- subject
- message

### GET /api/contact (admin)

Returns messages sorted by newest first.

### DELETE /api/contact/:id (admin)

Deletes a message.

## Theme

### GET /api/theme

Returns current theme settings. Creates default theme if missing.

### PUT /api/theme (admin)

Updates theme settings.

Theme fields:

- name
- primaryColor
- secondaryColor
- accentColor
- backgroundFrom
- backgroundTo
- surfaceFrom
- surfaceTo
- headingGradientFrom
- headingGradientTo
- textPrimary
- textMuted
- useAnimatedGlow

Validation behavior:

- Colors are normalized to valid hex values
- Invalid values fallback to defaults

## Upload

### POST /api/upload (admin)

Request body:

- data: data URL string (required)
- folder: target cloud folder (optional)
- resourceType: image | raw | video | auto (optional)
- fileName: custom public id source (optional)

Notes:

- image uploads receive quality/fetch format optimization
- raw uploads are used for non-image files (for example CV PDF)

## Authorization Header

Protected endpoints require:

```http
Authorization: Bearer <jwt_token>
```

Errors:

- 401: missing or invalid token
- 403: valid token but non-admin role on admin endpoints
