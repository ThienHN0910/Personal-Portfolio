# System-Wide Specification: Personal Portfolio & Architecture Publishing Platform

## Problem Statement

Technical leaders, prospective clients, and engineering recruiters evaluating software engineers frequently encounter static, generic template websites that fail to showcase actual senior engineering caliber, system architecture depth, or real-world problem-solving abilities. Most developer portfolios suffer from cluttered visuals or sterile default frameworks, clunky animations that stutter during scroll, and shallow case summaries. Furthermore, portfolio creators face operational friction: missing urgent inbound inquiries due to inbox delay, dealing with spam bots on public contact forms, suffering from search engine indexing or social link preview failures on single-page applications, and enduring tedious manual processes to update credentials, publications, and case studies.

## Solution

A high-performance, full-stack architectural publishing and portfolio platform. The frontend delivers an avant-garde editorial magazine aesthetic with obsidian dark mode, double-bezel containment, Lenis inertia smooth scrolling, GSAP split-line reveals, magnetic physics, and an interactive command palette. Rich content authored via CKEditor is normalized and sanitized with strict client runtime security. The backend provides a secure, stateless API backed by MongoDB, Cloudinary media optimization, Cloudflare Turnstile anti-spam verification, and multi-channel inbound notification delivering instant Telegram Bot alerts to the engineer's device. An edge-ready static snapshot prerendering pipeline generates search engine and social crawler assets during build time with zero server runtime overhead.

## User Stories

1. As a prospective client or tech lead, I want to experience physics-driven smooth scrolling with natural inertia, so that exploring the portfolio feels refined, tactile, and responsive.
2. As a design director, I want to view an asymmetric broken-grid layout and high-contrast editorial typography, so that the engineer's creative taste and attention to detail are immediately apparent.
3. As a technical recruiter, I want to view a prominent, real-time availability indicator and timezone location badge in the hero area, so that I instantly know if the engineer is open for new contracts or employment.
4. As an engineering manager, I want to explore detailed Case Studies featuring architecture breakdowns, technology matrices, and deployment status, so that I can assess the engineer's production-grade system building capabilities.
5. As a visitor browsing a Case Study, I want a sticky technical specification rail alongside the narrative, so that I can easily reference deployment links, timelines, domain classifications, and repositories as I read.
6. As a technical reader, I want long-form Articles formatted with luxury pull-quotes, dark obsidian syntax-highlighted code blocks, responsive media embeds, and clean data tables, so that complex technical concepts are effortless to absorb.
7. As a mobile reader on an Article page, I want a persistent reading progress bar at the top edge of the screen, so that I have a clear indication of article length and my current position.
8. As a visitor exploring publications, I want to search and filter Articles by technical topics (Vue 3, TypeScript, Web Performance, System Design) in real time, so that I can quickly pinpoint relevant subject matter.
9. As a visitor exploring portfolio work, I want to search and filter Case Studies by category and tech stack, so that I can review work relevant to my project's architecture requirements.
10. As a keyboard power user, I want to open a Command Palette via shortcut (`Ctrl+K` or `Cmd+K`) to jump directly to any page, case study, or external repository, so that I can navigate without touching a mouse.
11. As a visitor wishing to collaborate, I want to submit a message through an accessible contact form protected by frictionless Cloudflare Turnstile CAPTCHA, so that my inquiry is delivered securely without annoying puzzle captchas.
12. As the portfolio owner, I want to receive an instant push notification on Telegram with Markdown-formatted sender details, email, subject, and message body whenever an inquiry is submitted, so that I can respond to opportunities within minutes.
13. As the portfolio owner, I want all visitor messages to be stored securely in MongoDB with read/unread flags and queue limits, so that no correspondence is lost during third-party notification outages.
14. As an administrative user, I want to authenticate securely using Google OAuth or email/password credentials, so that I can access the administrative dashboard without managing stateful server sessions.
15. As an administrative user, I want my authenticated session to use stateless JWT Bearer tokens, so that frontend and backend hosted on separate subdomains communicate reliably without third-party cookie restrictions.
16. As an administrative content manager, I want a full-featured rich text editor with image upload, table formatting, and video embedding, so that I can author and publish rich Case Studies and Articles directly from the browser.
17. As an administrative user, I want to upload screenshots, diagrams, and avatar media with automatic conversion to modern WebP and AVIF formats, so that high-resolution assets load quickly without manual compression.
18. As an administrative user, I want to configure site appearance, social links, biography details, education chronology, and skill matrix categories in real time, so that the portfolio always reflects my latest accomplishments.
19. As an administrative user, I want access to visitor analytics with country-level geolocations, referrer data, and page view metrics, so that I can evaluate traffic and audience engagement.
20. As a social media user sharing a link on Twitter/X, LinkedIn, Facebook, or Zalo, I want the link to expand into an OpenGraph preview card with title, excerpt, and optimized image, so that shared links look professional.
21. As a search engine crawler (Googlebot, Bingbot), I want pre-rendered static HTML snapshots of all dynamic routes along with an up-to-date `sitemap.xml` and `robots.txt`, so that every case study and article is indexed without executing client JavaScript.
22. As a user on a slow network or low-power device, I want GPU-accelerated animations strictly restricted to `transform` and `opacity` properties, so that the interface maintains a steady 60fps frame rate without layout stutter.
23. As a keyboard-only user, I want visible focus indicators on all interactive elements, logical tab order, and an accessible skip-to-content link, so that the platform meets accessibility standards.
24. As an administrative user, I want a confirm dialog modal before executing irreversible actions (such as deleting articles, case studies, or messages), so that accidental deletions are prevented.

## Implementation Decisions

- **Domain Glossary Enforcement**: The system strictly uses the canonical language established in the project context:
  - `Case Study` for detailed engineering project breakdowns (avoiding "Project" or "Work item").
  - `Article` for technical long-form publications (avoiding "Blog post" or "Diary").
  - `Publication` for the collective archive of articles.
  - `Skill Matrix` for technical proficiencies.
  - `Work Chronology` for verified career history.
  - `System Spec Rail` for the sticky case study metadata rail.
  - `Snapshot Prerender` for the build-time static HTML crawler generation.
  - `Optimized Asset Delivery` for Cloudinary CDN media delivery.
  - `Bearer Session` for stateless JWT administrative sessions.
  - `Multi-Channel Inbound Notification` for simultaneous database persistence and Telegram Bot webhook alerts.

- **Frontend Presentation & Interaction Architecture**:
  - Built as a Vue 3 Single Page Application using Composition API and TypeScript.
  - Visual system based on an obsidian palette: `#090A0C` (Canvas base), `#12141A` (Bone bezel shell), `#181A22` (Surface core), `#F5F5F7` (Ink primary), `#8E919A` (Ink secondary), and hairline borders (`rgba(255,255,255,0.08)`).
  - Design dials locked to `DESIGN_VARIANCE: 8` (asymmetric bento spans 7/5, 8/4, 6/6), `MOTION_INTENSITY: 8` (Lenis inertia smooth scrolling, GSAP split-line title reveals, magnetic cursor pull with elastic spring recovery), and `VISUAL_DENSITY: 3` (generous negative space and 60ch max line lengths).
  - Micro-interactions use GPU-accelerated transforms (`translate3d`, `scale`, `opacity`) to guarantee zero layout reflows and 60fps responsiveness.

- **Content Rendering & Security Pipeline (ADR-0001)**:
  - Raw semantic HTML generated by CKEditor is stored in the database.
  - During client render, an isolated sanitization module normalizes embedded media (converting YouTube/Vimeo `oembed` URLs to responsive iframes) and enforces strict DOMPurify filtering before injecting content into the DOM via `v-html`.

- **SEO & Static Snapshot Generation (ADR-0002)**:
  - The build process executes automated prerendering scripts (`generate-seo-files.mjs` and `prerender-social-pages.mjs`).
  - The scripts query the backend API during `npm run build`, generate dynamic `sitemap.xml` and `robots.txt`, and generate pre-rendered static HTML snapshots in `dist/` with full OpenGraph/Twitter `<meta>` tags for all dynamic routes.

- **Stateless Authentication & Multi-Origin Deployment (ADR-0003)**:
  - Administrative authentication uses stateless JSON Web Tokens stored in client `localStorage` and passed via `Authorization: Bearer <token>` HTTP headers.
  - This architecture decouples frontend and backend deployed across different subdomains on Vercel without cross-origin cookie restrictions or third-party tracking blocks.

- **Media & Asset Delivery Pipeline (ADR-0004)**:
  - All administrative image uploads are routed through backend multipart handlers to Cloudinary CDN.
  - Media URLs leverage automatic format and compression negotiation (`f_auto,q_auto`) to deliver next-generation AVIF/WebP assets worldwide with minimal payload size.

- **Multi-Channel Inbound Notification Pipeline (ADR-0005)**:
  - The contact submission endpoint validates required fields, enforces message length constraints, verifies Cloudflare Turnstile tokens, and checks unread queue limits.
  - Upon saving to MongoDB, the backend asynchronously triggers an unblocking HTTP request to the Telegram Bot API (`https://api.telegram.org/bot<TOKEN>/sendMessage`), transmitting Markdown-formatted notification cards directly to the portfolio owner's private chat ID.

## Testing Decisions

- **Testing Philosophy**: Tests must evaluate observable external behavior, contract integrity, and system boundaries rather than transient internal implementation details.
- **Seam 1: HTTP API & Inbound Notification Seam (Highest Seam)**:
  - Test that `POST /api/contact` rejects payloads with missing fields or invalid Turnstile tokens.
  - Test that valid contact submissions persist correctly to MongoDB and dispatch the expected Telegram Bot API request body.
  - Test that `GET /api/projects` and `GET /api/blog` return correctly paginated, filtered, and sorted response payloads.
- **Seam 2: Client Content Sanitization & Media Normalization Seam**:
  - Test that client sanitization strips XSS attack vectors (`<script>`, `onerror`, `javascript:`) while preserving permitted semantic HTML.
  - Test that YouTube and Vimeo `oembed` tags are converted to sandboxed, responsive iframes with valid aspect ratio wrappers.
- **Seam 3: Prerender & SEO Pipeline Seam**:
  - Test that the build-time prerender script outputs valid static HTML files for every published Case Study and Article slug, verifying the presence of `<meta property="og:title">`, `<meta property="og:image">`, and canonical URL links.
  - Test that `sitemap.xml` and `robots.txt` contain all dynamic routes and valid XML structure.

## Out of Scope

- Public user registration, user commenting systems, or forum discussions.
- Direct e-commerce shopping carts, payment gateways, or subscription paywalls.
- Native mobile app wrappers (iOS/Android native builds).
- Node.js runtime SSR server deployment (Nuxt 3 migration).

## Further Notes

- The Telegram notification dispatch is fully asynchronous and failure-tolerant: any transient network error from Telegram will log a warning without failing the user's contact submission or stalling the HTTP response.
- All dynamic routes gracefully handle legacy ID parameters by automatically performing router replacements to canonical SEO slugs where available.
