<template>
  <div class="min-h-screen pt-4 pb-16 relative overflow-hidden">
    <!-- Ambient Radial Background Gradients -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(99,102,241,0.08),transparent_30%)] z-0" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
      <!-- Hero Section -->
      <HeroSection :data="homeStore.homeData || {}" />

      <!-- Quick Exploration Bento Cards -->
      <div class="space-y-4">
        <div class="flex items-center justify-between gap-3 px-1">
          <div>
            <div class="font-mono text-xs text-cyan-400 uppercase tracking-wider font-semibold">NAVIGATION & FOCUS</div>
            <h2 class="text-xl sm:text-2xl font-bold font-display text-white mt-0.5 tracking-tight">Core Competencies & Work</h2>
          </div>
          <span class="hidden sm:inline-block font-mono text-xs text-slate-400 font-medium">QUICK EXPLORATION</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
          <!-- Card 1: Projects (Span 7) -->
          <RouterLink
            to="/projects"
            class="md:col-span-7 glass-panel p-6 sm:p-7 border border-cyber-border/30 hover:border-cyan-400/50 hover:shadow-cyan-glow transition-all duration-300 group flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-400/20 transition-all shadow-inner-glow">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span class="text-[10px] font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 uppercase font-medium">
                  ARCHITECTURES & APPS
                </span>
              </div>
              <h3 class="text-xl font-bold font-display text-white group-hover:text-cyan-400 transition-colors">Engineering Projects</h3>
              <p class="mt-2 text-sm text-slate-300 leading-relaxed max-w-lg">
                Explore real-world software solutions, high-scale web platforms, and interactive technical case studies with live production deployments.
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400">Vue 3 • TypeScript • Node.js • Cloud</span>
              <span class="text-cyan-400 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                <span>View Projects</span>
                <span>→</span>
              </span>
            </div>
          </RouterLink>

          <!-- Card 2: Biography & Skills (Span 5) -->
          <RouterLink
            to="/about"
            class="md:col-span-5 glass-panel p-6 sm:p-7 border border-cyber-border/30 hover:border-indigo-400/50 hover:shadow-glass-card-hover transition-all duration-300 group flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all shadow-inner-glow">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span class="text-[10px] font-mono text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 uppercase font-medium">
                  EXPERIENCE & BIO
                </span>
              </div>
              <h3 class="text-xl font-bold font-display text-white group-hover:text-indigo-400 transition-colors">Biography & Skills</h3>
              <p class="mt-2 text-sm text-slate-300 leading-relaxed">
                Career journey, hands-on experience, technical skill matrix, work history, and verified credentials.
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400">Career Timeline</span>
              <span class="text-indigo-400 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                <span>Read Story</span>
                <span>→</span>
              </span>
            </div>
          </RouterLink>

          <!-- Card 3: Articles & Insights (Span 6) -->
          <RouterLink
            to="/blog"
            class="md:col-span-6 glass-panel p-6 sm:p-7 border border-cyber-border/30 hover:border-purple-400/50 hover:shadow-glass-card-hover transition-all duration-300 group flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all shadow-inner-glow">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <span class="text-[10px] font-mono text-purple-400 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 uppercase font-medium">
                  PUBLICATIONS
                </span>
              </div>
              <h3 class="text-xl font-bold font-display text-white group-hover:text-purple-400 transition-colors">Technical Articles</h3>
              <p class="mt-2 text-sm text-slate-300 leading-relaxed">
                In-depth articles covering frontend optimization, system design, modern JavaScript patterns, and developer productivity.
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400">Engineering Notes</span>
              <span class="text-purple-400 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                <span>Read Articles</span>
                <span>→</span>
              </span>
            </div>
          </RouterLink>

          <!-- Card 4: Contact & Inquiries (Span 6) -->
          <RouterLink
            to="/contact"
            class="md:col-span-6 glass-panel p-6 sm:p-7 border border-cyber-border/30 hover:border-cyan-400/50 hover:shadow-cyan-glow transition-all duration-300 group flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-400/20 transition-all shadow-inner-glow">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span class="text-[10px] font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 uppercase font-medium">
                  OPEN FOR INQUIRIES
                </span>
              </div>
              <h3 class="text-xl font-bold font-display text-white group-hover:text-cyan-400 transition-colors">Get In Touch</h3>
              <p class="mt-2 text-sm text-slate-300 leading-relaxed">
                Reach out directly for project collaborations, software architecture consulting, or engineering opportunities.
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400">Fast Response</span>
              <span class="text-cyan-400 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                <span>Send Message</span>
                <span>→</span>
              </span>
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