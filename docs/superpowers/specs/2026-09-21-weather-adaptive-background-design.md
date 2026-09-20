# Weather-Adaptive Ambient Background & 1-Hour Refresh Engine Design Spec

**Date:** 2026-09-21  
**Status:** Approved  
**Scope:** Full-Stack Architecture (`backend/` & `fe/`)  

---

## 1. Objectives & Executive Summary

Create a real-time, weather-adaptive ambient background system for the portfolio platform:
1. **IP-Based Weather Detection:** Resolve client IP to geolocation coordinates (`lat, lon`, `city`) and query the free, zero-leakage Open-Meteo API.
2. **1-Hour Cache & Hourly Refresh Loop:** Cache weather queries for 60 minutes in MongoDB/backend memory and re-query every 1 hour in frontend background lifecycle.
3. **Smooth Gradual Atmospheric Transition:** When weather condition changes (or on initial load), gently interpolate canvas particles, auras, and rain/mist opacity over 2.5–3.0 seconds without sudden visual jumps.
4. **Editorial & 60fps Harmony:** Adapt seamlessly to all 5 editorial theme palettes (`editorial-dark`, `editorial-light`, `monochrome-cyber`, `warm-sepia`, `system`) with strict adherence to the 60fps GPU rule.
5. **Interactive Telemetry & Command Palette Testing:** Render a subtle telemetry badge and provide commands in Command Palette (`Ctrl + K`) for instant weather previews.

---

## 2. Technical Architecture & Component Breakdown

### A. Backend Weather Subsystem (`backend/`)
- **Model:** `backend/src/models/WeatherCache.ts`
  - Stores cached weather data with 1-hour TTL (`createdAt` with 3600s expiration index).
  - Fields: `cacheKey` (`ip` or `city`), `city`, `country`, `latitude`, `longitude`, `temperature`, `weatherCode`, `condition`, `isDay`.
- **Service & Route:** `backend/src/routes/weather.ts`
  - Endpoint: `GET /api/weather`
  - Resolves client IP via `extractClientIp(req)` and `lookupIpInfo(clientIp)`.
  - Fallback coordinates for localhost/bogon: Ho Chi Minh City (`lat: 10.8231, lon: 106.6297`).
  - Calls `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`.
  - Maps WMO weather code into 5 normalized conditions:
    - `clear` (WMO 0)
    - `cloudy` (WMO 1, 2, 3, 45, 48)
    - `rain` (WMO 51-67, 80-82)
    - `snow` (WMO 71-77, 85-86)
    - `thunderstorm` (WMO 95-99)
  - Returns JSON response:
    ```json
    {
      "success": true,
      "data": {
        "city": "Ho Chi Minh City",
        "country": "Vietnam",
        "condition": "clear",
        "temperature": 29.5,
        "isDay": true,
        "weatherCode": 0,
        "cached": false
      }
    }
    ```
- **Registration in `backend/src/index.ts`:**
  - Mount route at `/api/weather`.

### B. Frontend Weather Store & Hourly Refresh Engine (`fe/src/stores/weather.ts`)
- Pinia store managing:
  - `weatherData`: current weather info.
  - `effectiveCondition`: computed condition combining real weather with user manual preview override.
  - `isWeatherEnabled`: boolean flag stored in `localStorage`.
  - `previewOverride`: `null | 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow'`.
- Lifecycle & 1-Hour Refresh Loop:
  - Stores `portfolio_weather_data` and timestamp in `localStorage`.
  - Sets a 60-minute `setInterval` timer.
  - Re-checks on `document.visibilitychange` when user returns to tab after > 60 minutes.
  - Dispatches change events to trigger smooth interpolation in background canvas.

### C. Smooth Atmospheric Interpolation in `fe/src/components/ui/ParticleBackground.vue`
- Canvas rendering updates:
  - Maintains `currentAtmosphere` and `targetAtmosphere`:
    - `rainAlpha`: 0 to 0.18 (delicate diagonal rain streaks).
    - `mistAlpha`: 0 to 0.08 (soft drifting horizontal clouds).
    - `particleSpeedMultiplier`: 0.8 (rain) to 1.2 (thunderstorm).
    - `glowTopLeft` / `glowBottomRight`: Ambient lighting colors smoothly lerped over 180 frames (~3.0 seconds at 60fps).
    - `thunderFlashAlpha`: micro 100ms soft ambient pulse every 10–14s if condition is `thunderstorm`.
  - Respects active theme palette and `prefers-reduced-motion`.

### D. Weather Telemetry Badge & Command Palette Integration
- **Component:** `fe/src/components/ui/WeatherBadge.vue`
  - Compact chip mounted in Navbar or Footer: `🌤️ 28°C · Ho Chi Minh City`.
  - Tooltip: *"Auto-synced with your local weather · Hourly refresh"*.
- **Command Palette (`Ctrl + K`):**
  - Category: `weather`
  - Commands:
    - `Weather: Auto-Sync with Real IP (Hourly)`
    - `Weather Preview: Sunny / Clear Sky`
    - `Weather Preview: Rain & Gentle Streaks`
    - `Weather Preview: Overcast & Mists`
    - `Weather Preview: Thunderstorm & Pulse`
    - `Weather Atmosphere: Toggle Effects (On / Off)`

---

## 3. Engineering Quality & Security Guarantees

- **Zero-Leakage Security Hygiene:** Open-Meteo requires no API key. No secrets stored in codebase.
- **60fps Rule:** Canvas uses `requestAnimationFrame` with linear interpolation math (sub-millisecond CPU cost). Suspends rendering when tab is hidden.
- **Fail-Safe Fallbacks:** Offline, adblocker, or network errors fall back to default serene starry/particle background without breaking page rendering.
