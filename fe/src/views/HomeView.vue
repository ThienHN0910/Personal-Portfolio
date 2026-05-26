<template>
  <div class="section min-h-screen pt-24 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_36%),radial-gradient(circle_at_85%_20%,rgba(112,0,255,0.08),transparent_28%)]" />
    <div class="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(0,242,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.8)_1px,transparent_1px)] bg-[size:40px_40px]" />

    <div class="container relative z-10">
      <HeroSection :data="homeStore.homeData || {}" />

      <div class="mt-8 glass-panel cut-corners p-5 md:p-6">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">System Modules</div>
            <h2 class="font-os text-lg md:text-xl uppercase tracking-[0.16em] text-white mt-1">Dashboard Overview</h2>
          </div>
          <div class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[HOME_PANEL]</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-panel cut-corners p-4">
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">Identity</div>
            <div class="mt-2 text-white font-os uppercase">Profile / Narrative</div>
            <p class="mt-2 text-sm text-gray-300 font-mono">System identity and technical direction.</p>
          </div>
          <div class="glass-panel cut-corners p-4">
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">Workload</div>
            <div class="mt-2 text-white font-os uppercase">Projects / Blog</div>
            <p class="mt-2 text-sm text-gray-300 font-mono">Active modules and latest transmissions.</p>
          </div>
          <div class="glass-panel cut-corners p-4">
            <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">Status</div>
            <div class="mt-2 text-white font-os uppercase">Available</div>
            <p class="mt-2 text-sm text-gray-300 font-mono">Currently open for collaboration.</p>
          </div>
        </div>
      </div>

      <div class="mt-8">
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
