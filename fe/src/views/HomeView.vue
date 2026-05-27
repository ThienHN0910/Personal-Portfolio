<template>
  <div class="section min-h-screen pt-24 relative overflow-hidden bg-[#0c1324]">
    <!-- Background Layers -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_36%),radial-gradient(circle_at_85%_20%,rgba(112,0,255,0.08),transparent_28%)] z-0" />
    <div class="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(0,242,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.8)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

    <div class="container relative z-10 px-6 mx-auto">
      <!-- Hero Section -->
      <HeroSection :data="homeStore.homeData || {}" />

      <!-- Dashboard Overview Module -->
      <div class="mt-8 glass-panel cut-corners p-5 md:p-8 bg-surface-glass border border-border-cyan/30 backdrop-blur-md">
        <div class="flex items-center justify-between gap-3 mb-6">
          <div>
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase opacity-70">System Modules</div>
            <h2 class="font-display-os text-xl md:text-2xl uppercase tracking-[0.16em] text-white mt-1">Dashboard Overview</h2>
          </div>
          <div class="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase">[HOME_PANEL]</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Identity Card -->
          <div class="glass-panel cut-corners p-6 bg-surface-container-low/50 border border-border-cyan/20 hover:bg-surface-variant/30 transition-all duration-300 group">
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">Identity</div>
            <div class="mt-2 text-white font-display-os uppercase text-lg group-hover:text-cyan-300 transition-colors">Profile / Narrative</div>
            <p class="mt-3 text-sm text-gray-400 font-mono leading-relaxed">System identity and technical direction. Deep dive into the core values and architectural philosophy.</p>
          </div>

          <!-- Workload Card -->
          <div class="glass-panel cut-corners p-6 bg-surface-container-low/50 border border-border-cyan/20 hover:bg-surface-variant/30 transition-all duration-300 group">
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">Workload</div>
            <div class="mt-2 text-white font-display-os uppercase text-lg group-hover:text-cyan-300 transition-colors">Projects / Blog</div>
            <p class="mt-3 text-sm text-gray-400 font-mono leading-relaxed">Active modules and latest transmissions. Exploration of code repositories and technical write-ups.</p>
          </div>

          <!-- Status Card -->
          <div class="glass-panel cut-corners p-6 bg-primary-container/10 border border-primary-container/30 hover:bg-primary-container/20 transition-all duration-300 group">
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">Status</div>
            <div class="mt-2 text-white font-display-os uppercase text-lg group-hover:text-cyan-300 transition-colors">Available</div>
            <p class="mt-3 text-sm text-gray-400 font-mono leading-relaxed">Currently open for collaboration. Accepting specialized tasks and system-level integrations.</p>
          </div>
        </div>
      </div>

      <!-- Featured Projects Section -->
      <div class="mt-12">
        <FeaturedProjects />
      </div>
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
  // Parallel data fetching for performance
  await Promise.all([
    homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  // Apply dynamic SEO metadata
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

<style scoped>
/* Tactical UI Utilities */
.glass-panel {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.cut-corners {
  clip-path: polygon(
    0 10px, 10px 0, 
    calc(100% - 10px) 0, 100% 10px, 
    100% calc(100% - 10px), calc(100% - 10px) 100%, 
    10px 100%, 0 calc(100% - 10px)
  );
}

.font-display-os {
  font-family: 'Space Grotesk', sans-serif; /* Fallback for Display OS */
  font-weight: 700;
  letter-spacing: 0.1em;
}
</style>