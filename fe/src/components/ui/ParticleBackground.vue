<template>
  <div class="particle-background-container pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <canvas ref="canvasRef" class="w-full h-full opacity-90 transition-opacity duration-700" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

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

interface ThemePalette {
  primaryRgb: string
  accentRgb: string
  lineRgb: string
  lineAlpha: number
  particleAlphaScale: number
  glowTopLeft: string
  glowBottomRight: string
}

let animationFrameId: number | null = null
let particles: Particle[] = []
let mouseX = -1000
let mouseY = -1000
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D | null = null
let themeObserver: MutationObserver | null = null
let activePalette: ThemePalette

function getEffectiveTheme(): string {
  if (typeof document === 'undefined') return 'editorial-dark'
  const html = document.documentElement
  const dataTheme = html.getAttribute('data-theme')
  if (dataTheme && dataTheme !== 'system') return dataTheme

  // Fallback check classes
  if (html.classList.contains('editorial-light')) return 'editorial-light'
  if (html.classList.contains('monochrome-cyber')) return 'monochrome-cyber'
  if (html.classList.contains('warm-sepia')) return 'warm-sepia'
  if (html.classList.contains('editorial-dark')) return 'editorial-dark'

  // System mode check
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
        primaryRgb: '30, 41, 59',       // Deep slate charcoal
        accentRgb: '29, 78, 216',        // Deep editorial cobalt
        lineRgb: '51, 65, 85',          // Crisp slate line
        lineAlpha: 0.16,
        particleAlphaScale: 0.55,
        glowTopLeft: 'rgba(37, 99, 235, 0.025)',
        glowBottomRight: 'rgba(180, 83, 9, 0.020)',
      }
    case 'monochrome-cyber':
      return {
        primaryRgb: '255, 255, 255',    // Pure stark white
        accentRgb: '16, 185, 129',      // Cyber emerald
        lineRgb: '255, 255, 255',       // Pure white hairline
        lineAlpha: 0.15,
        particleAlphaScale: 0.65,
        glowTopLeft: 'rgba(16, 185, 129, 0.040)',
        glowBottomRight: 'rgba(56, 189, 248, 0.030)',
      }
    case 'warm-sepia':
      return {
        primaryRgb: '68, 51, 38',       // Deep espresso umber
        accentRgb: '180, 83, 9',        // Golden bronze sepia
        lineRgb: '115, 82, 53',         // Warm umber hairline
        lineAlpha: 0.18,
        particleAlphaScale: 0.55,
        glowTopLeft: 'rgba(180, 83, 9, 0.030)',
        glowBottomRight: 'rgba(146, 64, 14, 0.025)',
      }
    case 'editorial-dark':
    default:
      return {
        primaryRgb: '240, 243, 250',    // Soft starlight bone
        accentRgb: '96, 165, 250',      // Electric sapphire pastel blue
        lineRgb: '147, 197, 253',       // Icy blue hairline
        lineAlpha: 0.15,
        particleAlphaScale: 0.55,
        glowTopLeft: 'rgba(96, 165, 250, 0.045)',
        glowBottomRight: 'rgba(74, 222, 128, 0.035)',
      }
  }
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

function createParticles() {
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth < 1200
  const count = isMobile ? 32 : (isTablet ? 50 : 70)
  particles = []

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      // Calm, gentle float velocity (sub-pixel drift)
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      size: Math.random() * 1.6 + 1.1,
      baseAlpha: Math.random() * 0.45 + 0.35,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.012 + 0.008,
      colorType: Math.random() > 0.78 ? 1 : 0, // ~22% accent particles
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

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  // 1. Draw Subtle Ambient Aura Light Wells in Background
  if (activePalette.glowTopLeft) {
    const radiusTop = Math.max(width, height) * 0.45
    const gradTop = ctx.createRadialGradient(width * 0.15, height * 0.15, 0, width * 0.15, height * 0.15, radiusTop)
    gradTop.addColorStop(0, activePalette.glowTopLeft)
    gradTop.addColorStop(1, 'transparent')
    ctx.fillStyle = gradTop
    ctx.fillRect(0, 0, width, height)
  }

  if (activePalette.glowBottomRight) {
    const radiusBottom = Math.max(width, height) * 0.42
    const gradBottom = ctx.createRadialGradient(width * 0.85, height * 0.85, 0, width * 0.85, height * 0.85, radiusBottom)
    gradBottom.addColorStop(0, activePalette.glowBottomRight)
    gradBottom.addColorStop(1, 'transparent')
    ctx.fillStyle = gradBottom
    ctx.fillRect(0, 0, width, height)
  }

  // 2. Particle Constellation Network
  const lineMaxDist = 135
  const mouseRadius = 145

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    // Position updates with gentle sub-pixel drift
    p.x += p.vx
    p.y += p.vy

    // Gentle organic breathing pulse
    p.pulsePhase += p.pulseSpeed
    const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.12

    // Smooth edge wrap with generous buffer
    if (p.x < -30) p.x = width + 30
    if (p.x > width + 30) p.x = -30
    if (p.y < -30) p.y = height + 30
    if (p.y > height + 30) p.y = -30

    // Gentle spring-damped mouse interaction
    const dxMouse = mouseX - p.x
    const dyMouse = mouseY - p.y
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
    let renderAlpha = currentAlpha * activePalette.particleAlphaScale

    if (distMouse < mouseRadius && distMouse > 0) {
      const force = (1 - distMouse / mouseRadius) * 0.35
      p.vx -= (dxMouse / distMouse) * force * 0.45
      p.vy -= (dyMouse / distMouse) * force * 0.45
      renderAlpha = Math.min(1, renderAlpha + (1 - distMouse / mouseRadius) * 0.4)

      // Delicate tether line to mouse cursor
      const mouseLineAlpha = (1 - distMouse / mouseRadius) * (activePalette.lineAlpha * 1.25)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(mouseX, mouseY)
      ctx.strokeStyle = `rgba(${activePalette.lineRgb}, ${mouseLineAlpha})`
      ctx.lineWidth = 0.75
      ctx.stroke()
    }

    // Apply gentle velocity damping to keep floating calm
    p.vx *= 0.99
    p.vy *= 0.99

    // Maintain subtle baseline drift
    if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.02
    if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.02

    // Draw particle with glow
    const rgb = p.colorType === 1 ? activePalette.accentRgb : activePalette.primaryRgb
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${rgb}, ${renderAlpha})`
    ctx.fill()

    // Connect constellation lines
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
        ctx.lineWidth = 0.75
        ctx.stroke()
      }
    }
  }

  animationFrameId = requestAnimationFrame(draw)
}

function startAnimation() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Single static render for accessibility
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
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  activePalette = resolvePalette()
  handleResize()
  createParticles()

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Watch for theme changes on html element
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
