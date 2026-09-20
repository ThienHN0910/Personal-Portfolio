# Weather-Adaptive Background & 1-Hour Refresh Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time IP-based weather detection, 1-hour hourly refresh loop, gentle 2.5s-3.0s atmospheric canvas background interpolation, and Command Palette weather controls.

**Architecture:** Full-stack Express route with Open-Meteo & MongoDB TTL cache; Pinia weather store with 60-minute interval lifecycle; HTML5 Canvas atmospheric layer with linear interpolation (lerp) for rain streaks, mist, and lighting auras; Command Palette quick preview actions.

**Tech Stack:** Express, Node.js, Mongoose, Open-Meteo API, Vue 3, Pinia, HTML5 Canvas 2D, TypeScript, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-09-21-weather-adaptive-background-design.md`

## Global Constraints

- Work on branch `feat/weather-adaptive-background`.
- Follow Conventional Commits (`feat:`, `fix:`, `style:`, `test:`, `chore:`).
- Hardware Acceleration & 60fps Rule: Strictly interpolate alpha, positions, and radial gradients without layout thrashing.
- Zero-Leakage Security Hygiene: No raw API keys; use free Open-Meteo API.
- All three verification commands must pass with zero errors before completion.

---

### Task 1: Backend Weather Cache Model & API Route
**Files:**
- Create: `backend/src/models/WeatherCache.ts`
- Create: `backend/src/routes/weather.ts`
- Modify: `backend/src/index.ts`

- [ ] **Step 1: Create `WeatherCache.ts` model**
  Define `IWeatherCache` document with 1-hour TTL expiration index on `createdAt`.
- [ ] **Step 2: Create `backend/src/routes/weather.ts`**
  Extract client IP, lookup geolocation coords via `lookupIpInfo`, fetch Open-Meteo current_weather, map WMO code to condition, save to cache, and handle fallbacks for localhost.
- [ ] **Step 3: Register route in `backend/src/index.ts`**
  Mount router at `/api/weather`.
- [ ] **Step 4: Verify backend build**
  Run `cd backend && npm run build`.
- [ ] **Step 5: Commit changes**
  `git commit -am "feat(backend): add weather api route with ip detection and 1-hour cache"`

---

### Task 2: Frontend Weather Store & Hourly Refresh Engine
**Files:**
- Modify: `fe/src/types/index.ts`
- Create: `fe/src/stores/weather.ts`

- [ ] **Step 1: Add Weather types in `fe/src/types/index.ts`**
  Define `WeatherCondition`, `WeatherData`, `WeatherResponse`.
- [ ] **Step 2: Create `fe/src/stores/weather.ts`**
  Manage `weatherData`, `effectiveCondition`, `previewOverride`, `isWeatherEnabled`. Implement `fetchWeather()`, `setPreviewCondition()`, `toggleWeather()`, and 60-minute hourly refresh with `visibilitychange` listener.
- [ ] **Step 3: Verify frontend typecheck**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 4: Commit changes**
  `git commit -am "feat(store): add weather store with 1-hour refresh loop"`

---

### Task 3: Smooth Canvas Atmospheric Interpolation in `ParticleBackground.vue`
**Files:**
- Modify: `fe/src/components/ui/ParticleBackground.vue`

- [ ] **Step 1: Connect `useWeatherStore` in `ParticleBackground.vue`**
  Watch `effectiveCondition` and `isWeatherEnabled`.
- [ ] **Step 2: Implement Atmospheric Transition State Machine**
  Add `currentAtmosphere` and `targetAtmosphere` with lerp logic:
  - `rainAlpha` (0 to 0.18 for delicate diagonal falling rain streaks).
  - `mistAlpha` (0 to 0.08 for soft drifting clouds).
  - `glowTopLeft` / `glowBottomRight` color interpolation based on theme and weather.
  - `thunderPulseAlpha` for subtle ambient flashes.
- [ ] **Step 3: Verify frontend typecheck**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 4: Commit changes**
  `git commit -am "feat(canvas): add smooth atmospheric weather transitions to particle background"`

---

### Task 4: Weather Telemetry Badge & Command Palette Integration
**Files:**
- Create: `fe/src/components/ui/WeatherBadge.vue`
- Modify: `fe/src/components/layout/Navbar.vue`
- Modify: `fe/src/components/ui/CommandPalette.vue`

- [ ] **Step 1: Create `WeatherBadge.vue`**
  Compact pill badge on Navbar displaying condition icon, temperature, city name, with tooltip indicating hourly auto-sync.
- [ ] **Step 2: Mount `WeatherBadge` in `Navbar.vue`**
  Place next to `ThemeSwitcher.vue`.
- [ ] **Step 3: Add Weather Commands to `CommandPalette.vue`**
  Add `weather` category with commands to preview rain, sun, clouds, storm, reset to live IP, and toggle background on/off.
- [ ] **Step 4: Verify frontend typecheck**
  Run `npm run typecheck` in `fe/`.
- [ ] **Step 5: Commit changes**
  `git commit -am "feat(ui): add weather telemetry badge and command palette weather actions"`

---

### Task 5: Full Verification & Quality Gate
**Files:**
- All build & test suites.

- [ ] **Step 1: Backend Typecheck & Build**
  `cd backend && npm run build`
- [ ] **Step 2: Automated Seam Verification Suite (6 Seams)**
  `cd fe && node ./scripts/test-seams.mjs`
- [ ] **Step 3: Frontend Vite Bundling & SEO Prerendering**
  `cd fe && npm run build`
