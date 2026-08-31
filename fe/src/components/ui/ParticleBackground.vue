<template>
  <div class="particle-background-container pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <canvas ref="canvasRef" class="w-full h-full opacity-60 transition-opacity duration-700" />
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
}

let animationFrameId: number | null = null
let particles: Particle[] = []
let mouseX = -1000
let mouseY = -1000
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D | null = null

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  handleResize()
  createParticles()

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('mouseleave', handleMouseLeave)

  startAnimation()
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
  const count = isMobile ? 35 : 75
  particles = []

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 1.8 + 1.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
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

  const isDark = document.documentElement.classList.contains('editorial-dark') ||
                 document.documentElement.classList.contains('monochrome-cyber') ||
                 (!document.documentElement.classList.contains('editorial-light') && !document.documentElement.classList.contains('warm-sepia'))

  const particleColor = isDark ? '255, 255, 255' : '15, 23, 42'
  const lineMaxDist = 130
  const mouseRadius = 140

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    // Position updates
    p.x += p.vx
    p.y += p.vy

    // Screen wrapping with buffer
    if (p.x < -20) p.x = width + 20
    if (p.x > width + 20) p.x = -20
    if (p.y < -20) p.y = height + 20
    if (p.y > height + 20) p.y = -20

    // Mouse repulsion / proximity glow
    const dxMouse = mouseX - p.x
    const dyMouse = mouseY - p.y
    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
    let alpha = p.baseAlpha

    if (distMouse < mouseRadius) {
      const force = (1 - distMouse / mouseRadius) * 0.8
      p.x -= (dxMouse / distMouse) * force * 1.2
      p.y -= (dyMouse / distMouse) * force * 1.2
      alpha = Math.min(1, p.baseAlpha + (1 - distMouse / mouseRadius) * 0.5)
    }

    // Draw particle
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${particleColor}, ${alpha * 0.35})`
    ctx.fill()

    // Connect constellation lines
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p.x - p2.x
      const dy = p.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < lineMaxDist) {
        const lineAlpha = (1 - dist / lineMaxDist) * 0.18
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(${particleColor}, ${lineAlpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }
  }

  animationFrameId = requestAnimationFrame(draw)
}

function startAnimation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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

onMounted(() => {
  initCanvas()
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<style scoped>
.particle-background-container {
  mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.2) 90%);
  -webkit-mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.2) 90%);
}
</style>
