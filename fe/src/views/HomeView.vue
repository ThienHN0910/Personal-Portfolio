<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-24">

      <!-- Hero Section -->
      <HeroSection :data="homeStore.homeData || {}" />

      <!-- ── Quick Exploration Bento ──────────────────────────────────────── -->
      <section ref="bentoEl">
        <!-- Section header -->
        <div class="flex items-end justify-between mb-8">
          <div class="space-y-1">
            <span class="eyebrow-tag">Quick Navigation</span>
            <h2
              class="font-serif text-3xl sm:text-4xl font-light tracking-[-0.025em] leading-tight text-ink mt-2 reveal"
              :class="bentoVisible ? 'is-visible' : ''"
              style="transition-delay: 0ms"
            >
              Core work &amp; connections
            </h2>
          </div>
          <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">Select a path</span>
        </div>

        <!-- Asymmetric bento grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">

          <!-- Card 1: Projects (span 7) -->
          <div
            class="md:col-span-7 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 80ms"
          >
            <RouterLink to="/projects" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-7 flex flex-col justify-between min-h-[200px]">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-blue text-pastel-blue-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Architectures &amp; Apps
                    </span>
                    <!-- Arrow icon in circular shell — button-in-button -->
                    <span class="w-7 h-7 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>
                  <h3 class="font-serif text-2xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors duration-300 leading-snug">
                    Engineering Projects
                  </h3>
                  <p class="text-sm text-ink-secondary leading-relaxed font-light">
                    Production-grade web platforms, technical case studies, and live software deployments.
                  </p>
                </div>
                <div class="pt-4 border-t border-stroke flex items-center justify-between">
                  <span class="font-mono text-[10px] text-ink-tertiary">Vue 3 · TypeScript · Node.js · Cloud</span>
                  <span class="text-sm text-ink-secondary font-sans font-medium group-hover:text-ink transition-colors duration-200">View Projects →</span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Card 2: About (span 5) -->
          <div
            class="md:col-span-5 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 160ms"
          >
            <RouterLink to="/about" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-7 flex flex-col justify-between min-h-[200px]">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-amber text-pastel-amber-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Experience &amp; Bio
                    </span>
                    <span class="w-7 h-7 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>
                  <h3 class="font-serif text-2xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors duration-300 leading-snug">
                    Biography &amp; Skills
                  </h3>
                  <p class="text-sm text-ink-secondary leading-relaxed font-light">
                    Career timeline, technical skill matrix, work history, and verified credentials.
                  </p>
                </div>
                <div class="pt-4 border-t border-stroke flex items-center justify-between">
                  <span class="font-mono text-[10px] text-ink-tertiary">Career Timeline</span>
                  <span class="text-sm text-ink-secondary font-sans font-medium group-hover:text-ink transition-colors duration-200">Read Story →</span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Card 3: Articles (span 6) -->
          <div
            class="md:col-span-6 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 240ms"
          >
            <RouterLink to="/blog" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-7 flex flex-col justify-between min-h-[180px]">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-green text-pastel-green-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Publications
                    </span>
                    <span class="w-7 h-7 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>
                  <h3 class="font-serif text-2xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors duration-300 leading-snug">
                    Technical Articles
                  </h3>
                  <p class="text-sm text-ink-secondary leading-relaxed font-light">
                    Frontend optimization, system design patterns, modern JS, and developer productivity.
                  </p>
                </div>
                <div class="pt-4 border-t border-stroke flex items-center justify-between">
                  <span class="font-mono text-[10px] text-ink-tertiary">Engineering Notes</span>
                  <span class="text-sm text-ink-secondary font-sans font-medium group-hover:text-ink transition-colors duration-200">Read Articles →</span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Card 4: Contact (span 6) -->
          <div
            class="md:col-span-6 reveal"
            :class="bentoVisible ? 'is-visible' : ''"
            style="transition-delay: 320ms"
          >
            <RouterLink to="/contact" class="group block h-full editorial-card">
              <div class="editorial-card__inner p-7 flex flex-col justify-between min-h-[180px]">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-red text-pastel-red-text text-[10px] font-mono font-medium uppercase tracking-wider">
                      Open for Inquiries
                    </span>
                    <span class="w-7 h-7 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:bg-ink group-hover:border-ink group-hover:text-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </div>
                  <h3 class="font-serif text-2xl font-light tracking-tight text-ink group-hover:text-ink/80 transition-colors duration-300 leading-snug">
                    Get In Touch
                  </h3>
                  <p class="text-sm text-ink-secondary leading-relaxed font-light">
                    Project collaborations, architecture consulting, or engineering opportunities.
                  </p>
                </div>
                <div class="pt-4 border-t border-stroke flex items-center justify-between">
                  <span class="font-mono text-[10px] text-ink-tertiary">Fast Response</span>
                  <span class="text-sm text-ink-secondary font-sans font-medium group-hover:text-ink transition-colors duration-200">Send Message →</span>
                </div>
              </div>
            </RouterLink>
          </div>

        </div>
      </section>

      <!-- Featured Projects Showcase -->
      <FeaturedProjects />

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
  // Intersection observer for bento section reveal
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { bentoVisible.value = true; observer.disconnect() } },
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
