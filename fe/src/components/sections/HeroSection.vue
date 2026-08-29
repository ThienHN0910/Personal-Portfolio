<template>
  <section ref="sectionEl" class="relative w-full pt-8 pb-0">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">

      <!-- ── Left: Main Hero Card ────────────────────────────────────────── -->
      <div
        class="lg:col-span-8 reveal"
        :class="isVisible ? 'is-visible' : ''"
        style="transition-delay: 0ms"
      >
        <!-- Double-bezel outer shell -->
        <div class="editorial-card h-full">
          <div class="editorial-card__inner p-8 sm:p-10 flex flex-col justify-between gap-8 min-h-[420px]">

            <!-- Eyebrow -->
            <div class="flex items-center justify-between gap-3">
              <span class="eyebrow-tag">
                <span class="status-dot"></span>
                Hồ Ngọc Thiện — Full Stack Engineer
              </span>
              <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary tracking-widest uppercase">Portfolio · 2026</span>
            </div>

            <!-- Heading — editorial serif treatment -->
            <div class="space-y-4">
              <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-[-0.03em] leading-[1.05] text-ink">
                {{ data.heroTitle || 'Building things' }}
                <span class="block italic text-ink-secondary mt-1">
                  {{ data.heroSubtitle || 'worth using.' }}
                </span>
              </h1>
              <p class="text-base text-ink-secondary leading-relaxed max-w-xl font-sans font-light">
                {{ data.heroDescription || 'Full Stack Software Engineer focused on Vue 3, TypeScript, Node.js, and React. Specializing in high-performance web applications with attention to architecture and craft.' }}
              </p>
            </div>

            <!-- Tech tags — pastel pill badges -->
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="tech in techPills"
                :key="tech"
                class="px-3 py-1 rounded-full bg-bone border border-stroke text-[11px] font-mono text-ink-secondary tracking-wide hover:border-ink/20 hover:text-ink transition-all duration-200 cursor-default"
              >
                {{ tech }}
              </span>
            </div>

            <!-- CTAs — button-in-button architecture -->
            <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-stroke">
              <!-- Primary CTA: ink-filled, button-in-button trailing icon -->
              <RouterLink
                :to="data.ctaLink || '/projects'"
                class="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-ink text-surface text-sm font-sans font-medium tracking-tight active:scale-[0.98] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <span>{{ data.ctaText || 'View Projects' }}</span>
                <!-- Trailing icon shell -->
                <span class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                  </svg>
                </span>
              </RouterLink>

              <!-- Secondary: CV -->
              <RouterLink
                to="/cv"
                class="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-surface border border-stroke text-ink-secondary text-sm font-sans font-medium hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all duration-200"
              >
                View CV
              </RouterLink>

              <!-- Tertiary: Contact -->
              <RouterLink
                to="/contact"
                class="group inline-flex items-center gap-2 px-5 py-3 rounded-md text-ink-secondary text-sm font-sans font-medium hover:text-ink active:scale-[0.98] transition-colors duration-200"
              >
                Contact
                <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.5 6h7M6 2.5l3.5 3.5L6 9.5"/>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Right: Profile Card ─────────────────────────────────────────── -->
      <div
        class="lg:col-span-4 reveal"
        :class="isVisible ? 'is-visible' : ''"
        style="transition-delay: 120ms"
      >
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
                <!-- Monogram -->
                <div class="w-16 h-16 rounded-full bg-surface border border-stroke flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                  <span class="font-mono text-ink-secondary font-medium text-lg tracking-tighter">HN</span>
                </div>
                <span class="font-serif italic text-ink-secondary text-sm">Hồ Ngọc Thiện</span>
              </div>
            </div>

            <!-- Status panel — monochrome -->
            <div class="space-y-3 pt-2 border-t border-stroke">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-ink-tertiary uppercase tracking-wider">Status</span>
                <span class="flex items-center gap-1.5 font-mono text-pastel-green-text font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
                  Open to work
                </span>
              </div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-ink-tertiary uppercase tracking-wider">Location</span>
                <span class="font-mono text-ink-secondary">Vietnam / Remote</span>
              </div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-ink-tertiary uppercase tracking-wider">Role</span>
                <span class="font-mono text-ink-secondary">Full Stack · Frontend</span>
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

defineProps<{ data: any }>()

const sectionEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const techPills = ['Vue.js 3', 'TypeScript', 'Node.js', 'React', 'Tailwind CSS', 'System Design', 'REST API']

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { isVisible.value = true; observer.disconnect() } },
    { threshold: 0.1 }
  )
  if (sectionEl.value) observer.observe(sectionEl.value)
})
</script>