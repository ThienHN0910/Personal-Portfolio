# 0001. Client Runtime Rich Content Sanitization and Media Transformation

## Context
Rich content authored through CKEditor contains mixed HTML markup, custom blockquotes, code blocks, and oEmbed URLs for video media (YouTube / Vimeo). Storing pre-sanitized or pre-rendered iframes directly in MongoDB would create tight coupling with specific rendering markup and make future editor upgrades difficult.

## Decision
We store raw, semantic HTML in MongoDB and perform runtime normalization (converting `oembed` tags to secure responsive iframes) followed by strict `DOMPurify` sanitization in the client utility `src/utils/richContent.ts` before DOM rendering via `v-html`.

## Consequences
- The database remains editor-agnostic and stores clean semantic source markup.
- Client runtime guarantees complete XSS protection with strict tag and attribute allowlists (`iframe`, `allowfullscreen`, etc.).
- Embedded video URLs are strictly validated against allowlisted YouTube and Vimeo regex domains.
