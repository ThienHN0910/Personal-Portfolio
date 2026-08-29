# 05: Build-Time Static Snapshot Prerendering & OpenGraph SEO Pipeline

**What to build:** An edge-ready SEO and crawler pipeline that executes during build time to generate static HTML snapshots, dynamic `sitemap.xml`, and `robots.txt` for all Case Studies and Articles, enabling rich link previews across social platforms and complete search engine indexability with zero server runtime overhead.

**Blocked by:** 02 (Case Study & System Spec Rail Showcase), 03 (Article & Editorial Rich Content Publishing Pipeline)

**Status:** ready-for-agent

- [ ] `npm run build` generates dynamic `sitemap.xml` listing all published Case Study and Article routes with priority and change frequencies
- [ ] Static snapshot prerenderer outputs pre-rendered HTML files in `dist/` for every published slug
- [ ] Each static snapshot contains server-rendered `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, and `<meta name="twitter:card">` headers
- [ ] Single-page application router hydrates seamlessly on top of pre-rendered HTML snapshots without flickering
- [ ] Build script logs route counts and terminates with zero errors on production CI pipelines
