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
- /admin/categories
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
- Categories are selected from the shared category list.
- Tags are comma-separated.
- Publish toggle controls post visibility.

Derived behavior:

- Excerpt is generated from HTML content.
- Cover image is extracted from first image in content.
- Public blog page now loads posts progressively with infinite scroll.
- Public blog filters support category and keyword search.

## Projects Content

In /admin/projects:

- Manage all project metadata.
- Categories are selected from the shared category list.
- Fields include duration and priority.
- Related blog can be linked from existing posts.

Display order on public pages:

- priority desc -> featured desc -> createdAt desc
- Public project and blog pages now load content progressively with infinite scroll.
- Public project filters support category and keyword search.

## Categories

In /admin/categories:

- Manage the shared project category list.
- Manage the shared blog category list.
- Keep category labels short and in English.

## Messages

In /admin/messages:

- Read contact submissions.
- Delete messages with confirmation dialog.

## Appearance and Theme

In /admin/appearance:

- Configure global theme colors and gradients.
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
