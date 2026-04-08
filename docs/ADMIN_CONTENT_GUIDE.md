# Admin Content Guide

This guide describes how to manage content from admin pages.

## Access

1. Use Google login from frontend.
2. Ensure your Google email matches ADMIN_EMAIL.
3. Open admin routes:
   - /admin
   - /admin/projects
   - /admin/blog
   - /admin/messages
   - /admin/about

## Shared Rich Text Editor

Admin About and Admin Blog use the same shared CKEditor component:

- Component: fe/src/components/admin/FullRichEditor.vue
- Upload adapter: fe/src/utils/ckeditorUploadAdapter.ts

Benefits:

- Consistent toolbar/formatting behavior.
- Unified image upload path to Cloudinary.
- Easier maintenance and plugin updates.

## About Content

In Admin About you can manage:

- Name, title, bio
- Contact info: email, phone, location, website
- Skills
- Experience (rich text descriptions)
- Avatar image
- Resume PDF
- Social links (github/linkedin/email)

Notes:

- Experience list is sorted descending by timeline.
- Resume uploads are handled through /api/upload with resourceType=raw.

## Projects Content

Project fields include:

- Title, description
- Duration (for display)
- Priority (sorting control, higher shows first)
- Technologies
- Related blog post
- GitHub URL, Live URL
- Image
- Featured flag

Display order:

- Priority desc -> Featured desc -> CreatedAt desc

## Blog Content

Blog post form includes:

- Title
- Rich content
- Tags
- Publish status

Derived fields:

- Excerpt is generated from content text.
- Cover image is extracted from the first image in content.

## Troubleshooting

White text on white dropdown in admin:

- The project related-blog select uses admin-select styling in SCSS.
- Check fe/src/assets/scss/main.scss and rebuild FE if style cache is stale.

Upload fails:

- Verify Cloudinary env variables.
- Verify auth token is present (upload endpoint is admin-only).
- Ensure payload size fits backend limit (10mb JSON body).
