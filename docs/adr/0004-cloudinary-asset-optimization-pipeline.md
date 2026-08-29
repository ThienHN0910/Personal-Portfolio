# 0004. Cloudinary Dynamic Asset Optimization Pipeline

## Context
Case Study media, high-resolution screenshots, profile avatars, and Article cover imagery require low bandwidth usage, responsive sizing, and modern next-gen image formats (AVIF/WebP) to maintain 60fps scrolling and fast First Contentful Paint (FCP).

## Decision
We delegate all media storage, resizing, and format negotiation to Cloudinary CDN using dynamic URL transformations (`f_auto,q_auto,w_auto`).

## Consequences
- Serverless backend functions do not handle static file serving or disk I/O.
- Images are automatically served in the optimal format (AVIF or WebP) depending on the client browser capabilities.
- Global edge caching reduces latency for visitors worldwide.
