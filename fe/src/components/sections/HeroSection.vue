<template>
  <section ref="sectionEl" class="relative w-full pt-4 pb-2">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

      <!-- ── Left: Editorial Lead Column (Col 8) ────────────────────────── -->
      <div class="lg:col-span-8 flex flex-col">
        <div class="editorial-card h-full">
          <div class="editorial-card__inner p-8 sm:p-12 lg:p-14 flex flex-col justify-between gap-10 min-h-[480px]">

            <!-- Eyebrow Bar -->
            <div class="flex items-center justify-between gap-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bone border border-stroke text-[11px] font-mono text-ink-secondary">
                <span class="w-2 h-2 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
                <span>Hồ Ngọc Thiện · Full Stack Engineer</span>
              </div>
              <span class="hidden sm:inline-block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest tabular-nums">
                Archive · 2026
              </span>
            </div>

            <!-- Main Headline with GSAP Split-Text -->
            <div class="space-y-4 max-w-2xl">
              <h1 ref="headingRef" class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
                <span class="hero-split-line block">
                  {{ data.heroTitle || 'Designing scalable systems' }}
                </span>
                <span class="hero-split-line block italic text-ink-secondary mt-1">
                  {{ data.heroSubtitle || 'with architectural precision.' }}
                </span>
              </h1>

              <p ref="descRef" class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light max-w-xl">
                {{ data.heroDescription || 'Full Stack Software Engineer building high-performance web platforms, distributed systems, and tactile frontend experiences with Vue 3 and TypeScript.' }}
              </p>
            </div>

            <!-- Tech Matrix Pills -->
            <div ref="pillsRef" class="flex flex-wrap items-center gap-2">
              <span
                v-for="tech in techPills"
                :key="tech"
                class="px-3 py-1 rounded-full bg-bone border border-stroke text-[11px] font-mono text-ink-secondary tracking-wide hover:border-ink/30 hover:text-ink transition-all duration-200 cursor-default"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Magnetic CTA Row -->
            <div ref="ctaRowRef" class="flex flex-wrap items-center gap-3 pt-6 border-t border-stroke">
              <!-- Primary Magnetic CTA -->
              <RouterLink
                :to="data.ctaLink || '/projects'"
                class="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-ink text-surface text-sm font-sans font-medium tracking-tight active:scale-[0.98] transition-all duration-200"
                @mousemove="handleMagneticMove"
                @mouseleave="handleMagneticLeave"
              >
                <span>{{ data.ctaText || 'Explore Case Studies' }}</span>
                <span class="w-6 h-6 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                  </svg>
                </span>
              </RouterLink>

              <!-- Secondary CV CTA -->
              <RouterLink
                to="/cv"
                class="group inline-flex items-center gap-2 px-5 py-3.5 rounded-md bg-bone border border-stroke text-ink-secondary text-sm font-sans font-medium hover:border-ink/30 hover:text-ink active:scale-[0.98] transition-all duration-200"
              >
                <span>Curriculum Vitae</span>
              </RouterLink>

              <!-- Quick Inquire Link -->
              <RouterLink
                to="/contact"
                class="group inline-flex items-center gap-1.5 px-4 py-3.5 rounded-md text-ink-secondary text-sm font-sans font-medium hover:text-ink active:scale-[0.98] transition-colors duration-200 ml-auto sm:ml-0"
              >
                <span>Inquire</span>
                <span class="text-xs group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </RouterLink>
            </div>

          </div>
        </div>
      </div>

      <!-- ── Right: Precision Avatar & Live Status (Col 4) ───────────────── -->
      <div class="lg:col-span-4 flex flex-col">
        <div
          class="editorial-card spotlight-card h-full"
          @mousemove="onRightCardMouseMove"
          @mouseleave="onRightCardMouseLeave"
        >
          <div class="editorial-card__inner p-7 flex flex-col justify-between gap-6 min-h-[440px]">

            <!-- Framed Portrait Container with Floating Spec Pill -->
            <div class="relative">
              <div
                class="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-bone border border-stroke group cursor-pointer"
                data-cursor="view"
                data-cursor-label="Hi"
              >
                <img
                  v-if="data.profileImage"
                  :src="data.profileImage"
                  alt="Hồ Ngọc Thiện"
                  class="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 transition-all duration-700"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 bg-bone">
                  <div class="w-16 h-16 rounded-2xl bg-surface border border-stroke flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <span class="font-mono text-ink-secondary font-semibold text-lg tracking-tighter">HN</span>
                  </div>
                  <span class="font-serif italic text-ink-secondary text-sm">Hồ Ngọc Thiện</span>
                </div>
              </div>

              <!-- Floating Ambient Pill -->
              <div class="absolute -bottom-2.5 -right-2 px-3 py-1 rounded-full bg-surface/95 border border-stroke/90 shadow-island backdrop-blur-md text-[10px] font-mono text-ink flex items-center gap-1.5 animate-float z-10 pointer-events-none">
                <span class="w-1.5 h-1.5 rounded-full bg-pastel-blue-text"></span>
                <span>Full-Stack &amp; Arch</span>
              </div>
            </div>

            <!-- Specification Ticker -->
            <div class="space-y-3.5 pt-4 border-t border-stroke text-xs font-mono">
              <div class="flex items-center justify-between">
                <span class="text-ink-tertiary uppercase tracking-wider text-[10px]">Availability</span>
                <span class="flex items-center gap-1.5 text-pastel-green-text font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
                  Open for new contracts
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-ink-tertiary uppercase tracking-wider text-[10px]">Location</span>
                <span class="text-ink-secondary">Vietnam · UTC+7 (Remote)</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-ink-tertiary uppercase tracking-wider text-[10px]">Primary Focus</span>
                <span class="text-ink font-medium">Vue 3 · TypeScript · Node.js</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useSpotlight } from '@/composables/useSpotlight'
import { use3DTilt } from '@/composables/use3DTilt'

defineProps<{ data: any }>()

const sectionEl = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const pillsRef = ref<HTMLElement | null>(null)
const ctaRowRef = ref<HTMLElement | null>(null)

const { handleSpotlightMove } = useSpotlight()
const { handleTiltMove, handleTiltLeave } = use3DTilt({ maxTilt: 4.5, scale: 1.01 })

function onRightCardMouseMove(e: MouseEvent) {
  handleSpotlightMove(e)
  handleTiltMove(e)
}

function onRightCardMouseLeave(e: MouseEvent) {
  handleTiltLeave(e)
}

const techPills = ['Vue 3', 'TypeScript', 'Node.js', 'Vite', 'Tailwind CSS', 'System Architecture', 'REST APIs']

function handleMagneticMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - (rect.left + rect.width / 2)
  const y = e.clientY - (rect.top + rect.height / 2)
  gsap.to(target, {
    x: x * 0.22,
    y: y * 0.22,
    duration: 0.25,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}

function handleMagneticLeave(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  gsap.to(target, {
    x: 0,
    y: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.45)',
    overwrite: 'auto',
  })
}

onMounted(() => {
  if (!sectionEl.value) return

  // 60fps GPU-accelerated entrance animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  if (headingRef.value) {
    const lines = headingRef.value.querySelectorAll('.hero-split-line')
    tl.fromTo(
      lines,
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.85 }
    )
  }
  if (descRef.value) {
    tl.fromTo(
      descRef.value,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.5'
    )
  }
  if (pillsRef.value) {
    tl.fromTo(
      pillsRef.value.children,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.45 },
      '-=0.3'
    )
  }
  if (ctaRowRef.value) {
    tl.fromTo(
      ctaRowRef.value,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 },
      '-=0.2'
    )
  }
})
</script>