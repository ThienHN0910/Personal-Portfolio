# 0002. Static Snapshot Prerendering for Search and Social Crawlers

## Context
The portfolio is built as a single-page application (Vue 3 + Vite + Pinia) to deliver 60fps smooth scrolling (Lenis) and physics-based interactions (GSAP). However, social platforms (Facebook, Twitter, LinkedIn, Zalo) and search engine crawlers require complete server-rendered `<meta>` tags and OpenGraph image headers in the initial HTML payload.

## Decision
Instead of introducing the operational complexity and runtime cost of a Node.js SSR server (Nuxt 3), we implement a build-time Static Snapshot Prerender pipeline (`scripts/generate-seo-files.mjs` and `scripts/prerender-social-pages.mjs`). During `npm run build`, the scripts query the backend API, generate `sitemap.xml`, `robots.txt`, and output pre-rendered static HTML files for all dynamic Case Studies and Articles in `dist/`.

## Consequences
- 100% crawler compatibility and rich link previews across all social platforms.
- Zero server maintenance, zero cold-start delay, and instant edge delivery on Vercel CDN.
- Pure client-side SPA interactivity without hydration mismatches or complex SSR state synchronization.
