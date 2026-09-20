<template>
  <div class="particle-background-container pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <canvas ref="canvasRef" class="w-full h-full opacity-90 transition-opacity duration-700" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useWeatherStore } from '@/stores/weather'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const weatherStore = useWeatherStore()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseAlpha: number
  pulsePhase: number
  pulseSpeed: number
  colorType: number // 0 for primary, 1 for accent
}

interface RainDrop {
  x: number
  y: number
  length: number
  speed: number
  alpha: number
}

interface SnowFlake {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  phase: number
}

interface ThemePalette {
  primaryRgb: string
  accentRgb: string
  lineRgb: string
  lineAlpha: number
  particleAlphaScale: number
  glowTopRgb: [number, number, number]
  glowTopAlpha: number
  glowBottomRgb: [number, number, number]
  glowBottomAlpha: number
}

interface AtmosphereState {
  rainAlpha: number
  mistAlpha: number
  snowAlpha: number
  thunderFlashAlpha: number
  particleSpeedScale: number
  glowTopRgb: [number, number, number]
  glowTopAlpha: number
  glowBottomRgb: [number, number, number]
  glowBottomAlpha: number
}

let animationFrameId: number | null = null
let particles: Particle[] = []
let rainDrops: RainDrop[] = []
let snowFlakes: SnowFlake[] = []
let mouseX = -1000
let mouseY = -1000
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D | null = null
let themeObserver: MutationObserver | null = null
let activePalette: ThemePalette

let mistOffset = 0
let thunderTimer = 0
let thunderFlashRemaining = 0

// Atmospheric state interpolation (lerp)
const currentAtmosphere: AtmosphereState = {
  rainAlpha: 0,
  mistAlpha: 0,
  snowAlpha: 0,
  thunderFlashAlpha: 0,
  particleSpeedScale: 1.0,
  glowTopRgb: [96, 165, 250],
  glowTopAlpha: 0.045,
  glowBottomRgb: [74, 222, 128],
  glowBottomAlpha: 0.035,
}

let targetAtmosphere: AtmosphereState = { ...currentAtmosphere }

function getEffectiveTheme(): string {
  if (typeof document === 'undefined') return 'editorial-dark'
  const html = document.documentElement
  const dataTheme = html.getAttribute('data-theme')
  if (dataTheme && dataTheme !== 'system') return dataTheme

  if (html.classList.contains('editorial-light')) return 'editorial-light'
  if (html.classList.contains('monochrome-cyber')) return 'monochrome-cyber'
  if (html.classList.contains('warm-sepia')) return 'warm-sepia'
  if (html.classList.contains('editorial-dark')) return 'editorial-dark'

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'editorial-dark' : 'editorial-light'
  }
  return 'editorial-dark'
}

function resolvePalette(): ThemePalette {
  const theme = getEffectiveTheme()

  switch (theme) {
    case 'editorial-light':
      return {
        primaryRgb: '30, 41, 59',
        accentRgb: '29, 78, 216',
        lineRgb: '51, 65, 85',
        lineAlpha: 0.16,
        particleAlphaScale: 0.55,
        glowTopRgb: [37, 99, 235],
        glowTopAlpha: 0.025,
        glowBottomRgb: [180, 83, 9],
        glowBottomAlpha: 0.02,
      }
    case 'monochrome-cyber':
      return {
        primaryRgb: '255, 255, 255',
        accentRgb: '16, 185, 129',
        lineRgb: '255, 255, 255',
        lineAlpha: 0.15,
        particleAlphaScale: 0.65,
        glowTopRgb: [16, 185, 129],
        glowTopAlpha: 0.04,
        glowBottomRgb: [56, 189, 248],
        glowBottomAlpha: 0.03,
      }
    case 'warm-sepia':
      return {
        primaryRgb: '68, 51, 38',
        accentRgb: '180, 83, 9',
        lineRgb: '115, 82, 53',
        lineAlpha: 0.18,
        particleAlphaScale: 0.55,
        glowTopRgb: [180, 83, 9],
        glowTopAlpha: 0.03,
        glowBottomRgb: [146, 64, 14],
        glowBottomAlpha: 0.025,
      }
    case 'editorial-dark':
    default:
      return {
        primaryRgb: '240, 243, 250',
        accentRgb: '96, 165, 250',
        lineRgb: '147, 197, 253',
        lineAlpha: 0.15,
        particleAlphaScale: 0.55,
        glowTopRgb: [96, 165, 250],
        glowTopAlpha: 0.045,
        glowBottomRgb: [74, 222, 128],
        glowBottomAlpha: 0.035,
      }
  }
}

function computeTargetAtmosphere(): AtmosphereState {
  const cond = weatherStore.effectiveCondition
  const isDay = weatherStore.isDay
  const enabled = weatherStore.isWeatherEnabled
  const palette = activePalette || resolvePalette()

  let rainAlpha = 0
  let mistAlpha = 0
  let snowAlpha = 0
  let speedScale = 1.0
  let topRgb: [number, number, number] = [...palette.glowTopRgb]
  let topAlpha = palette.glowTopAlpha
  let bottomRgb: [number, number, number] = [...palette.glowBottomRgb]
  let bottomAlpha = palette.glowBottomAlpha

  if (enabled) {
    switch (cond) {
      case 'rain':
        rainAlpha = 0.18
        mistAlpha = 0.03
        speedScale = 0.85
        topRgb = [59, 130, 246] // Rainy cool cobalt
        topAlpha = 0.05
        bottomRgb = [100, 116, 139] // Slate mist
        bottomAlpha = 0.035
        break

      case 'thunderstorm':
        rainAlpha = 0.22
        mistAlpha = 0.05
        speedScale = 1.25
        topRgb = [99, 102, 241] // Electric indigo
        topAlpha = 0.065
        bottomRgb = [59, 130, 246]
        bottomAlpha = 0.045
        break

      case 'cloudy':
        mistAlpha = 0.075
        speedScale = 0.75
        topRgb = [148, 163, 184] // Overcast pearl
        topAlpha = 0.038
        bottomRgb = [100, 116, 139]
        bottomAlpha = 0.03
        break

      case 'snow':
        snowAlpha = 0.22
        mistAlpha = 0.04
        speedScale = 0.65
        topRgb = [224, 242, 254] // Icy snow crystalline
        topAlpha = 0.045
        bottomRgb = [186, 230, 253]
        bottomAlpha = 0.035
        break

      case 'clear':
      default:
        if (isDay) {
          topRgb = [245, 158, 11] // Warm honey daylight
          topAlpha = 0.035
          bottomRgb = palette.glowBottomRgb
          bottomAlpha = palette.glowBottomAlpha
        } else {
          topRgb = [129, 140, 248] // Cosmic starlight twilight
          topAlpha = 0.045
          bottomRgb = [99, 102, 241]
          bottomAlpha = 0.03
        }
        break
    }
  }

  return {
    rainAlpha,
    mistAlpha,
    snowAlpha,
    thunderFlashAlpha: 0,
    particleSpeedScale: speedScale,
    glowTopRgb: topRgb,
    glowTopAlpha: topAlpha,
    glowBottomRgb: bottomRgb,
    glowBottomAlpha: bottomAlpha,
  }
}

function updateAtmosphereTarget() {
  targetAtmosphere = computeTargetAtmosphere()
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
}

function createElements() {
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth < 1200
  const count = isMobile ? 32 : isTablet ? 50 : 70
  particles = []

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      size: Math.random() * 1.6 + 1.1,
      baseAlpha: Math.random() * 0.45 + 0.35,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.012 + 0.008,
      colorType: Math.random() > 0.78 ? 1 : 0,
    })
  }

  // Pre-allocate 55 delicate rain drops
  rainDrops = []
  const rainCount = isMobile ? 30 : 55
  for (let i = 0; i < rainCount; i++) {
    rainDrops.push({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      length: Math.random() * 18 + 14,
      speed: Math.random() * 8 + 14,
      alpha: Math.random() * 0.35 + 0.25,
    })
  }

  // Pre-allocate 40 snowflakes
  snowFlakes = []
  const snowCount = isMobile ? 22 : 40
  for (let i = 0; i < snowCount; i++) {
    snowFlakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1.2,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
    })
  }
}

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function handleMouseLeave() {
  mouseX = -1000
  mouseY = -1000
}

function lerp(current: number, target: number, rate = 0.022): number {
  return current + (target - current) * rate
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  // 1. Smoothly interpolate atmospheric properties towards target (Gentle 2.5s - 3s easing)
  currentAtmosphere.rainAlpha = lerp(currentAtmosphere.rainAlpha, targetAtmosphere.rainAlpha)
  currentAtmosphere.mistAlpha = lerp(currentAtmosphere.mistAlpha, targetAtmosphere.mistAlpha)
  currentAtmosphere.snowAlpha = lerp(currentAtmosphere.snowAlpha, targetAtmosphere.snowAlpha)
  currentAtmosphere.particleSpeedScale = lerp(currentAtmosphere.particleSpeedScale, targetAtmosphere.particleSpeedScale)
  currentAtmosphere.glowTopAlpha = lerp(currentAtmosphere.glowTopAlpha, targetAtmosphere.glowTopAlpha)
  currentAtmosphere.glowBottomAlpha = lerp(currentAtmosphere.glowBottomAlpha, targetAtmosphere.glowBottomAlpha)

  for (let c = 0; c < 3; c++) {
    currentAtmosphere.glowTopRgb[c] = lerp(currentAtmosphere.glowTopRgb[c], targetAtmosphere.glowTopRgb[c])
    currentAtmosphere.glowBottomRgb[c] = lerp(currentAtmosphere.glowBottomRgb[c], targetAtmosphere.glowBottomRgb[c])
  }

  // 2. Ambient Lighting Auroras with Interpolated Colors
  const topCol = `rgba(${Math.round(currentAtmosphere.glowTopRgb[0])}, ${Math.round(currentAtmosphere.glowTopRgb[1])}, ${Math.round(currentAtmosphere.glowTopRgb[2])}, ${currentAtmosphere.glowTopAlpha.toFixed(4)})`
  const bottomCol = `rgba(${Math.round(currentAtmosphere.glowBottomRgb[0])}, ${Math.round(currentAtmosphere.glowBottomRgb[1])}, ${Math.round(currentAtmosphere.glowBottomRgb[2])}, ${currentAtmosphere.glowBottomAlpha.toFixed(4)})`

  const radiusTop = Math.max(width, height) * 0.45
  const gradTop = ctx.createRadialGradient(width * 0.15, height * 0.15, 0, width * 0.15, height * 0.15, radiusTop)
  gradTop.addColorStop(0, topCol)
  gradTop.addColorStop(1, 'transparent')
  ctx.fillStyle = gradTop
  ctx.fillRect(0, 0, width, height)

  const radiusBottom = Math.max(width, height) * 0.42
  const gradBottom = ctx.createRadialGradient(width * 0.85, height * 0.85, 0, width * 0.85, height * 0.85, radiusBottom)
  gradBottom.addColorStop(0, bottomCol)
  gradBottom.addColorStop(1, 'transparent')
  ctx.fillStyle = gradBottom
  ctx.fillRect(0, 0, width, height)

  // 3. Optional Thunderstorm Ambient Pulse
  if (weatherStore.effectiveCondition === 'thunderstorm' && weatherStore.isWeatherEnabled) {
    thunderTimer++
    if (thunderTimer > 600 && Math.random() < 0.008) {
      thunderTimer = 0
      thunderFlashRemaining = 8
    }
    if (thunderFlashRemaining > 0) {
      thunderFlashRemaining--
      ctx.fillStyle = `rgba(255, 255, 255, ${0.035 * (thunderFlashRemaining / 8)})`
      ctx.fillRect(0, 0, width, height)
    }
  }

  // 4. Subtle Drifting Overcast Mist Clouds
  if (currentAtmosphere.mistAlpha > 0.005) {
    mistOffset += 0.25
    ctx.save()
    const mistGrad = ctx.createLinearGradient(0, 0, width, height)
    mistGrad.addColorStop(0, `rgba(200, 215, 235, ${currentAtmosphere.mistAlpha * 0.6})`)
    mistGrad.addColorStop(0.5, `rgba(160, 185, 215, ${currentAtmosphere.mistAlpha * 0.9})`)
    mistGrad.addColorStop(1, `rgba(200, 215, 235, ${currentAtmosphere.mistAlpha * 0.4})`)
    ctx.fillStyle = mistGrad
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  // 5. Delicate Falling Rain Streaks
  if (currentAtmosphere.rainAlpha > 0.005) {
    ctx.save()
    ctx.lineWidth = 0.85
    const angleX = 1.6
    for (let i = 0; i < rainDrops.length; i++) {
      const drop = rainDrops[i]
      drop.y += drop.speed
      drop.x += angleX

      if (drop.y > height + 20) {
        drop.y = -20
        drop.x = Math.random() * (width + 150) - 75
      }

      ctx.strokeStyle = `rgba(186, 215, 250, ${drop.alpha * currentAtmosphere.rainAlpha})`
      ctx.beginPath()
      ctx.moveTo(drop.x, drop.y)
      ctx.lineTo(drop.x + angleX * (drop.length / drop.speed), drop.y + drop.length)
      ctx.stroke()
    }
    ctx.restore()
  }

  // 6. Gentle Drifting Snowflakes
  if (currentAtmosphere.snowAlpha > 0.005) {
    ctx.save()
    for (let i = 0; i < snowFlakes.length; i++) {
      const flake = snowFlakes[i]
      flake.phase += 0.02
      flake.y += flake.speedY
      flake.x += flake.speedX + Math.sin(flake.phase) * 0.4

      if (flake.y > height + 10) {
        flake.y = -10
        flake.x = Math.random() * width
      }

      ctx.beginPath()
      ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAtmosphere.snowAlpha})`
      ctx.fill()
    }
    ctx.restore()
  }

  // 7. Particle Constellation Network
  const lineMaxDist = 135
  const mouseRadius = 145
  const speedScale = currentAtmosphere.particleSpeedScale

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    p.x += p.vx * speedScale
    p.y += p.vy * speedScale

    p.pulsePhase += p.pulseSpeed
    const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.12

    if (p.x < -30) p.x = width + 30
    if (p.x > width + 30) p.x = -30
    if (p.y < -30) p.y = height + 30
    if (p.y > height + 30) p.y = -30

    const dxMouse = mouseX - p.x
    const dyMouse = mouseY - p.y
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
    let renderAlpha = currentAlpha * activePalette.particleAlphaScale

    if (distMouse < mouseRadius && distMouse > 0) {
      const force = (1 - distMouse / mouseRadius) * 0.35
      p.vx -= (dxMouse / distMouse) * force * 0.45
      p.vy -= (dyMouse / distMouse) * force * 0.45
      renderAlpha = Math.min(1, renderAlpha + (1 - distMouse / mouseRadius) * 0.4)

      const mouseLineAlpha = (1 - distMouse / mouseRadius) * (activePalette.lineAlpha * 1.25)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(mouseX, mouseY)
      ctx.strokeStyle = `rgba(${activePalette.lineRgb}, ${mouseLineAlpha})`
      ctx.lineWidth = 0.75
      ctx.stroke()
    }

    p.vx *= 0.99
    p.vy *= 0.99

    if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.02
    if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.02

    const rgb = p.colorType === 1 ? activePalette.accentRgb : activePalette.primaryRgb
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${rgb}, ${renderAlpha})`
    ctx.fill()

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p.x - p2.x
      const dy = p.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < lineMaxDist) {
        const lineAlpha = (1 - dist / lineMaxDist) * activePalette.lineAlpha
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(${activePalette.lineRgb}, ${lineAlpha})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }
  }

  animationFrameId = requestAnimationFrame(draw)
}

function startAnimation() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw()
    return
  }
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(draw)
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopAnimation()
  } else {
    startAnimation()
  }
}

function updateTheme() {
  activePalette = resolvePalette()
  updateAtmosphereTarget()
}

// Watch for weather and preview condition updates
watch(
  [() => weatherStore.effectiveCondition, () => weatherStore.isDay, () => weatherStore.isWeatherEnabled],
  () => {
    updateAtmosphereTarget()
  },
  { immediate: true },
)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  activePalette = resolvePalette()
  handleResize()
  createElements()
  updateAtmosphereTarget()

  // Initialize initial atmosphere matching target directly on startup
  Object.assign(currentAtmosphere, targetAtmosphere)

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  themeObserver = new MutationObserver(() => {
    updateTheme()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  })

  startAnimation()
})

onUnmounted(() => {
  stopAnimation()
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.particle-background-container {
  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.4) 92%);
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.4) 92%);
}
</style>
