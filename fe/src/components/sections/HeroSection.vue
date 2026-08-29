<template>
  <section ref="sectionEl" class="relative w-full pt-6 pb-0">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

      <!-- ── Left: Main Hero Card ────────────────────────────────────────── -->
      <div class="lg:col-span-8">
        <!-- Double-bezel outer shell -->
        <div class="editorial-card h-full">
          <div class="editorial-card__inner p-8 sm:p-12 flex flex-col justify-between gap-8 min-h-[440px]">

            <!-- Eyebrow -->
            <div class="flex items-center justify-between gap-3">
              <span class="eyebrow-tag">
                <span class="status-dot"></span>
                Hồ Ngọc Thiện — Creative Developer
              </span>
              <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary tracking-widest uppercase">Portfolio · 2026</span>
            </div>

            <!-- Heading — editorial serif treatment with GSAP reveal -->
            <div class="space-y-4">
              <h1 ref="headingRef" class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink">
                <span class="hero-split-line block">
                  {{ data.heroTitle || 'Architecting software' }}
                </span>
                <span class="hero-split-line block italic text-ink-secondary mt-1">
                  {{ data.heroSubtitle || 'with craft & precision.' }}
                </span>
              </h1>
              <p ref="descRef" class="text-base text-ink-secondary leading-relaxed max-w-xl font-sans font-light">
                {{ data.heroDescription || 'Full Stack Software Engineer focused on Vue 3, TypeScript, Node.js, and high-impact web architectures. Building performant, tactile digital experiences.' }}
              </p>
            </div>

            <!-- Tech tags — pastel pill badges -->
            <div ref="pillsRef" class="flex flex-wrap items-center gap-2">
              <span
                v-for="tech in techPills"
                :key="tech"
                class="px-3 py-1 rounded-full bg-bone border border-stroke text-[11px] font-mono text-ink-secondary tracking-wide hover:border-ink/30 hover:text-ink transition-all duration-200 cursor-default"
              >
                {{ tech }}
              </span>
            </div>

            <!-- CTAs — button-in-button architecture with magnetic physics -->
            <div ref="ctaRowRef" class="flex flex-wrap items-center gap-3 pt-3 border-t border-stroke">
              <!-- Primary CTA: magnetic physics, button-in-button trailing icon -->
              <RouterLink
                :to="data.ctaLink || '/projects'"
                class="group inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-ink text-surface text-sm font-sans font-medium tracking-tight active:scale-[0.98] transition-all duration-200"
                @mousemove="handleMagneticMove"
                @mouseleave="handleMagneticLeave"
              >
                <span>{{ data.ctaText || 'View Case Studies' }}</span>
                <!-- Trailing icon shell with spring reaction -->
                <span class="w-6 h-6 rounded-full bg-surface/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                  </svg>
                </span>
              </RouterLink>

              <!-- Secondary: CV -->
              <RouterLink
                to="/cv"
                class="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-surface border border-stroke text-ink-secondary text-sm font-sans font-medium hover:border-ink/30 hover:text-ink active:scale-[0.98] transition-all duration-200"
              >
                Curriculum Vitae
              </RouterLink>

              <!-- Tertiary: Contact -->
              <RouterLink
                to="/contact"
                class="group inline-flex items-center gap-1.5 px-4 py-3 rounded-md text-ink-secondary text-sm font-sans font-medium hover:text-ink active:scale-[0.98] transition-colors duration-200"
              >
                <span>Contact</span>
                <span class="text-xs group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Right: Profile Card ─────────────────────────────────────────── -->
      <div class="lg:col-span-4">
        <!-- Double-bezel outer shell -->
        <div class="editorial-card h-full">
          <div class="editorial-card__inner flex flex-col justify-between gap-5 p-6 min-h-[360px]">

            <!-- Profile image — bezel-framed -->
            <div class="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-bone border border-stroke">
              <img
                v-if="data.profileImage"
                :src="data.profileImage"
                alt="Hồ Ngọc Thiện"
                class="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 bg-bone">
                <div class="w-16 h-16 rounded-full bg-surface border border-stroke flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <span class="font-mono text-ink-secondary font-medium text-lg tracking-tighter">HN</span>
                </div>
                <span class="font-serif italic text-ink-secondary text-sm">Hồ Ngọc Thiện</span>
              </div>
            </div>

            <!-- Status panel — monochrome -->
            <div class="space-y-3 pt-3 border-t border-stroke">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-ink-tertiary uppercase tracking-wider">Status</span>
                <span class="flex items-center gap-1.5 font-mono text-pastel-green-text font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
                  Available for contracts
                </span>
              </div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-ink-tertiary uppercase tracking-wider">Location</span>
                <span class="font-mono text-ink-secondary">Vietnam / Remote UTC+7</span>
              </div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-ink-tertiary uppercase tracking-wider">Discipline</span>
                <span class="font-mono text-ink-secondary">Full Stack Engineering</span>
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

defineProps<{ data: any }>()

const sectionEl = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const pillsRef = ref<HTMLElement | null>(null)
const ctaRowRef = ref<HTMLElement | null>(null)

const techPills = ['Vue.js 3', 'TypeScript', 'Node.js', 'React', 'Tailwind CSS', 'System Design', 'REST API']

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

  // 60fps GPU entrance animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  if (headingRef.value) {
    const lines = headingRef.value.querySelectorAll('.hero-split-line')
    tl.fromTo(
      lines,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.85 }
    )
  }
  if (descRef.value) {
    tl.fromTo(
      descRef.value,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.5'
    )
  }
  if (pillsRef.value) {
    tl.fromTo(
      pillsRef.value.children,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.4 },
      '-=0.3'
    )
  }
  if (ctaRowRef.value) {
    tl.fromTo(
      ctaRowRef.value,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    )
  }
})
</script>