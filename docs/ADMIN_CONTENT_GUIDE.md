# Admin Content Guide

This guide explains the current admin workflow for content and appearance management.

## Access and Login Flow

1. Open /admin from the site navigation.
2. If not authenticated, the admin gate screen appears.
3. Click Login with Google.
4. After OAuth callback, return to admin routes.
5. Admin role is granted only when Google email matches ADMIN_EMAIL.

Notes:

- Navbar no longer has dedicated login/logout buttons.
- Logout is available from the admin left sidebar.

## Admin Layout

Admin uses a left sidebar layout with these routes:

- /admin (Dashboard)
- /admin/projects
- /admin/blog
- /admin/messages
- /admin/about
- /admin/appearance

Mobile behavior:

- Sidebar becomes a drawer opened by the Menu button.

## Dashboard

Shows summary cards:

- Total projects
- Blog posts
- Contact messages
- Featured projects count

Also provides quick links to all admin sections.

## About and Home Content

In /admin/about you can edit:

- Home section
  - heroTitle
  - heroSubtitle
  - heroDescription
  - ctaText
  - ctaLink
  - profileImage
- About section
  - name, title, bio
  - contact info
  - skills
  - experience (rich text)
  - education (including GPA)
  - licenses and certifications
  - avatar image
  - resume PDF
  - social links (dynamic label + url rows)

Behavior notes:

- Experience and education are sorted descending by timeline.
- Empty dynamic rows are ignored on save.
- Social links and URLs are normalized.

## Blog Content

In /admin/blog:

- Create and edit posts with shared rich editor.
- Tags are comma-separated.
- Publish toggle controls post visibility.

Derived behavior:

- Excerpt is generated from HTML content.
- Cover image is extracted from first image in content.

## Projects Content

In /admin/projects:


Display order on public pages:

 Public project and blog pages now load content progressively with infinite scroll.

## Messages

In /admin/messages:

## Appearance and Theme

In /admin/appearance:
 Public blog page now loads posts progressively with infinite scroll.
- Toggle animated glow.
- Preview style changes before saving.

Runtime behavior:

- App applies default theme immediately.
- Then applies cached theme if available.
- Then fetches and applies server theme.

This reduces visual jumps on first render.

## Shared Editor

Both admin about experience and admin blog use the same editor component:

- fe/src/components/admin/FullRichEditor.vue

Upload adapter:

- fe/src/utils/ckeditorUploadAdapter.ts

Benefits:

- Consistent toolbar and formatting behavior.
- Unified media upload flow.

## Troubleshooting

### Cannot access admin after login

- Verify ADMIN_EMAIL in backend env matches Google account exactly.
- Verify JWT_SECRET is set.

### Upload fails

- Check Cloudinary credentials.
- Ensure request includes valid admin Bearer token.
- Keep payload under backend JSON body limit.

### Theme updates not visible

- Save in /admin/appearance.
- Hard refresh browser to clear stale local cache if needed.
