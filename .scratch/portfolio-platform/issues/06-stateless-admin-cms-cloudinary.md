# 06: Stateless Administrative CMS & Cloudinary Asset Optimization

**What to build:** A comprehensive administrative management dashboard authenticated via stateless JWT Bearer tokens. Enables real-time authoring and publishing of Case Studies and Articles via rich text editor, drag-and-drop media upload with automatic Cloudinary AVIF/WebP optimization, visitor message inbox management, and live editing of biography, Skill Matrix, and Work Chronology.

**Blocked by:** 01 (Multi-Channel Inbound Notification & Turnstile Anti-Spam Pipeline), 02 (Case Study & System Spec Rail Showcase), 03 (Article & Editorial Rich Content Publishing Pipeline)

**Status:** ready-for-agent

- [ ] Administrative login supports email/password and Google OAuth, issuing a stateless JWT stored in `localStorage`
- [ ] Authenticated requests attach `Authorization: Bearer <token>` header across independent Vercel origins
- [ ] Admin can create, edit, reorder, feature, and delete Case Studies and Articles with live preview
- [ ] Media assets uploaded through the admin panel are uploaded to Cloudinary and served with dynamic optimization transformations
- [ ] Admin can view, mark as read, and delete inbound visitor messages
- [ ] Admin can update profile biography, verified certifications, Skill Matrix groups, and Work Chronology entries
