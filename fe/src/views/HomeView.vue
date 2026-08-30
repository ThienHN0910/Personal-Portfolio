<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="w-full max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 space-y-24 sm:space-y-32">

      <!-- ── Hero Section ────────────────────────────────────────────── -->
      <HeroSection :data="homeStore.homeData || {}" />

      <!-- ── Curated Exploration Pathways (Asymmetric Bento) ─────────── -->
      <section ref="bentoEl" class="space-y-8">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Core Disciplines &amp; Pathways
            </span>
            <h2
              class="font-serif text-3xl sm:text-5xl font-light tracking-[-0.03em] leading-tight text-ink reveal"
              :class="bentoVisible ? 'is-visible' : ''"
            >
              Curated archives
              <span class="italic text-ink-secondary">&amp; perspectives</span>
            </h2>
          </div>
          <span class="font-mono text-[10px] text-ink-tertiary uppercase tracking-widest hidden sm:inline-block">
            03 Selected Destinations
          </span>
        </div>

        <!-- Asymmetric Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

          <!-- Card 1: Case Studies (Span 7) -->
          <div
            class="md:col-span-7 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 80ms"
          >
            <RouterLink to="/projects" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 flex flex-col justify-between gap-8 min-h-[260px]">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="px-3 py-1 rounded-full bg-pastel-blue text-pastel-blue-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Architectures &amp; Systems
                    </span>
                    <span class="w-8 h-8 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>

                  <h3 class="font-serif text-2xl sm:text-3xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors leading-snug">
                    Engineering Case Studies
                  </h3>

                  <p class="text-sm sm:text-base text-ink-secondary leading-relaxed font-light max-w-md">
                    In-depth case studies of production-grade platforms, full-stack tools, and distributed applications.
                  </p>
                </div>

                <div class="pt-4 border-t border-stroke flex items-center justify-between font-mono text-xs text-ink-tertiary">
                  <span>Vue 3 · TypeScript · Node.js</span>
                  <span class="text-ink-secondary group-hover:text-ink transition-colors">Browse 10+ Projects →</span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Card 2: Biography & Skills (Span 5) -->
          <div
            class="md:col-span-5 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 160ms"
          >
            <RouterLink to="/about" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 flex flex-col justify-between gap-8 min-h-[260px]">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="px-3 py-1 rounded-full bg-pastel-amber text-pastel-amber-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Biography &amp; Skill Matrix
                    </span>
                    <span class="w-8 h-8 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>

                  <h3 class="font-serif text-2xl sm:text-3xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors leading-snug">
                    Engineering Background
                  </h3>

                  <p class="text-sm sm:text-base text-ink-secondary leading-relaxed font-light">
                    Career chronology, technical capabilities, verified credentials, and software philosophy.
                  </p>
                </div>

                <div class="pt-4 border-t border-stroke flex items-center justify-between font-mono text-xs text-ink-tertiary">
                  <span>Credentials</span>
                  <span class="text-ink-secondary group-hover:text-ink transition-colors">Read Profile →</span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Card 3: Publications (Span 8) -->
          <div
            class="md:col-span-8 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 240ms"
          >
            <RouterLink to="/blog" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 flex flex-col justify-between gap-8 min-h-[220px]">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="px-3 py-1 rounded-full bg-pastel-green text-pastel-green-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Technical Publications
                    </span>
                    <span class="w-8 h-8 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>

                  <h3 class="font-serif text-2xl sm:text-3xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors leading-snug">
                    Architecture &amp; Performance Insights
                  </h3>

                  <p class="text-sm sm:text-base text-ink-secondary leading-relaxed font-light max-w-lg">
                    Deep dives covering Vue 3 reactivity internals, TypeScript system design patterns, and 60fps web rendering techniques.
                  </p>
                </div>

                <div class="pt-4 border-t border-stroke flex items-center justify-between font-mono text-xs text-ink-tertiary">
                  <span>Technical Articles</span>
                  <span class="text-ink-secondary group-hover:text-ink transition-colors">Browse Articles →</span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Card 4: Inquiries (Span 4) -->
          <div
            class="md:col-span-4 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 300ms"
          >
            <RouterLink to="/contact" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 flex flex-col justify-between gap-8 min-h-[220px]">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="px-3 py-1 rounded-full bg-pastel-red text-pastel-red-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Collaboration
                    </span>
                    <span class="w-8 h-8 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>

                  <h3 class="font-serif text-2xl sm:text-3xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors leading-snug">
                    Initiate Contact
                  </h3>

                  <p class="text-sm text-ink-secondary leading-relaxed font-light">
                    Direct channel for architecture consulting, freelance projects, and full-time inquiries.
                  </p>
                </div>

                <div class="pt-4 border-t border-stroke flex items-center justify-between font-mono text-xs text-ink-tertiary">
                  <span>Response &lt; 24h</span>
                  <span class="text-ink-secondary group-hover:text-ink transition-colors">Send Message →</span>
                </div>
              </div>
            </RouterLink>
          </div>

        </div>
      </section>

      <!-- ── Featured Projects Section ───────────────────────────────── -->
      <FeaturedProjects />

      <!-- ── Direct Inquiry Footer Banner ────────────────────────────── -->
      <section class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div class="space-y-2 max-w-xl">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Engineering Inquiries
            </span>
            <h2 class="font-serif text-3xl sm:text-4xl font-light tracking-tight text-ink">
              Have a complex system to build?
            </h2>
            <p class="text-sm sm:text-base text-ink-secondary leading-relaxed font-light">
              Available for architectural design, performance audits, and high-impact web development.
            </p>
          </div>

          <RouterLink
            to="/contact"
            class="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-ink text-surface text-sm font-sans font-medium tracking-tight active:scale-[0.98] transition-all duration-200 shrink-0"
          >
            <span>Start a Conversation</span>
            <span class="w-5 h-5 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
              <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
              </svg>
            </span>
          </RouterLink>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturedProjects from '@/components/sections/FeaturedProjects.vue'
import { applySeo } from '@/utils/seo'
import { getHomeSeoMeta } from '@/utils/seoPriority'

const homeStore = useHomeStore()
const aboutStore = useAboutStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

const bentoEl = ref<HTMLElement | null>(null)
const bentoVisible = ref(false)

onMounted(async () => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        bentoVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.05 }
  )
  if (bentoEl.value) observer.observe(bentoEl.value)

  await Promise.all([
    homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  applySeo({
    ...getHomeSeoMeta({
      home: homeStore.homeData,
      about: aboutStore.aboutData,
      projects: projectsStore.projects,
      posts: blogStore.posts,
    }),
    url: '/',
  })
})
</script>

