# 0011. YouTube CDN & Smart Facade Architecture for Video Showcases

## Context
Video assets (system walkthroughs, runtime architecture demos, and CLI generators) require significant bandwidth and low-latency global delivery. Hosting Full HD 1080p video files directly on Cloudinary CDN risks exhausting the free tier bandwidth quota (~25GB/month) with only a few hundred views. Conversely, embedding raw YouTube iframes directly introduces heavy third-party JavaScript (~1.2MB), tracking scripts, and branding elements that degrade Lighthouse Core Web Vitals (FCP/LCP) and clash with the avant-garde editorial design system.

## Decision
1. **Zero-Cost Storage & Streaming**: All promo video files are hosted on YouTube in Public status with engineering-optimized SEO metadata, offloading 100% of video bandwidth and adaptive bitrate streaming to Google's edge infrastructure.
2. **Client-side Smart Facade Pattern**: Rich content video embeds (`oembed` or `iframe` from YouTube) are rendered at runtime via `fe/src/utils/richContent.ts` as lightweight Editorial Facades (styled with `var(--stroke)`, `var(--bone)`, and an avant-garde magnetic Play button).
3. **Lazy Hydration & Dual-mode Playback**:
   - Zero YouTube JavaScript is loaded during initial page rendering.
   - Upon clicking the Facade, the interactive YouTube player mounts in-place with `autoplay=1`.
   - A Cinema Lightbox trigger allows users to view the runtime walkthrough full-screen with backdrop blur and high-fidelity code readability.
4. **Resilient Poster Delivery**: Video thumbnails are resolved dynamically via `https://img.youtube.com/vi/<ID>/maxresdefault.jpg` with graceful fallback to `hqdefault.jpg`.

## Consequences
- **Infinite Bandwidth**: Portfolio operates sustainably at zero hosting cost without quota exhaustion risk.
- **Flawless Core Web Vitals**: Zero impact on initial page bundle or Lighthouse performance score.
- **Editorial Design Integrity**: Pages maintain curated aesthetic before user interaction, avoiding third-party UI pollution.
- **Dual SEO Discovery**: Projects gain organic search impressions on both Google Search (via portfolio static snapshot prerendering) and YouTube Video search.
