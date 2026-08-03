<template>
  <div class="min-h-screen pt-4 pb-16 relative overflow-hidden">
    <!-- Ambient Radial Background Gradients -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(99,102,241,0.08),transparent_30%)] z-0" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
      <!-- Hero Section -->
      <HeroSection :data="homeStore.homeData || {}" />

      <!-- Quick Exploration Cards -->
      <div class="glass-panel p-6 sm:p-8 border border-cyber-border/30 shadow-glass-card">
        <div class="flex items-center justify-between gap-3 mb-6">
          <div>
            <div class="font-mono text-xs text-cyber-cyan uppercase tracking-wider font-semibold">SYSTEM OVERVIEW</div>
            <h2 class="text-xl sm:text-2xl font-bold text-white mt-1">Core Competencies & Navigation</h2>
          </div>
          <div class="hidden sm:block font-mono text-xs text-slate-500 uppercase">#THIENHN_PORTFOLIO</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1: About -->
          <RouterLink
            to="/about"
            class="glass-panel p-6 border border-white/10 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors">Biography & Skills</h3>
              <p class="mt-2 text-sm text-slate-400 leading-relaxed">Discover Hồ Ngọc Thiện's career journey, hands-on experience, and technical skill matrix.</p>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-mono text-cyber-cyan group-hover:translate-x-1 transition-transform">
              <span>Read Details</span>
              <span>→</span>
            </div>
          </RouterLink>

          <!-- Card 2: Projects -->
          <RouterLink
            to="/projects"
            class="glass-panel p-6 border border-white/10 hover:border-cyber-indigo/50 hover:bg-cyber-indigo/5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Engineering Projects</h3>
              <p class="mt-2 text-sm text-slate-400 leading-relaxed">Explore software applications, architecture case studies, and live production deployments.</p>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Projects</span>
              <span>→</span>
            </div>
          </RouterLink>

          <!-- Card 3: Contact & Status -->
          <RouterLink
            to="/contact"
            class="glass-panel p-6 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">Get In Touch</h3>
              <p class="mt-2 text-slate-400 text-sm leading-relaxed">Reach out directly for project collaborations, software architecture consulting, or technical inquiries.</p>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-mono text-violet-400 group-hover:translate-x-1 transition-transform">
              <span>Send Message</span>
              <span>→</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Featured Projects Showcase -->
      <FeaturedProjects />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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

onMounted(async () => {
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