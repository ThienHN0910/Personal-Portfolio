<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_30%)]" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Page Header -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow">
        <div class="brutal-badge mb-3">
          <span>BIOGRAPHY & SKILLS</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Hồ Ngọc Thiện <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">(ThienHN)</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base max-w-2xl leading-relaxed border-l-2 border-cyan-400/60 pl-4 font-normal">
          Career background, technical skill matrix, work history, academic credentials, and software architecture philosophy.
        </p>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <!-- Profile Card & Bio Overview Bento Grid -->
        <div class="bento-grid">
          <!-- Left Avatar Sidebar (Span 4) -->
          <div class="col-span-12 lg:col-span-4 glass-panel p-6 border border-cyber-border/30 shadow-glass-card flex flex-col items-center text-center space-y-5">
            <div class="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-900 border border-cyan-400/40 shadow-inner-glow group">
              <img
                v-if="about?.avatarUrl"
                :src="about.avatarUrl"
                :alt="about.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-cyan-400 font-mono text-3xl font-bold"
              >
                HN
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold font-display text-white">{{ about?.name || 'Hồ Ngọc Thiện' }}</h2>
              <p class="text-xs font-mono text-cyan-400 font-semibold mt-1 uppercase tracking-wider">{{ about?.title || 'Full Stack Software Engineer' }}</p>
            </div>

            <div v-if="publicSocialLinks.length" class="flex flex-wrap justify-center gap-2">
              <a
                v-for="link in publicSocialLinks"
                :key="link.label"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 bg-white/5 border border-white/15 hover:border-cyan-400/50 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all shadow-inner-glow active:scale-95"
              >
                {{ link.label }}
              </a>
            </div>

            <div v-if="about?.resumeUrl" class="w-full pt-2">
              <RouterLink to="/cv" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider block shadow-[0_4px_20px_-2px_rgba(0,229,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-2px_rgba(0,229,255,0.55)] active:scale-[0.98] transition-all text-center">
                View & Download CV
              </RouterLink>
            </div>
          </div>

          <!-- Right Bio Narrative (Span 8) -->
          <div class="col-span-12 lg:col-span-8 glass-panel p-6 sm:p-8 border border-cyber-border/30 shadow-glass-card flex flex-col justify-between space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 class="text-xl font-bold font-display text-white">Biography Overview</h2>
              <span class="text-xs font-mono text-cyan-400 font-semibold">#BIO_OVERVIEW</span>
            </div>

            <p class="text-slate-300 text-base leading-relaxed">
              {{ about?.bio || 'Passionate Full Stack Software Engineer specializing in modern Web applications, performance engineering, scalable system design, and high-impact user experiences.' }}
            </p>

            <div class="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300 space-y-2.5 shadow-inner-glow">
              <div class="flex items-center justify-between">
                <span class="text-slate-400">CORE FOCUS:</span>
                <span class="text-white font-medium">Full Stack & Performance Engineering</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400">ARCHITECTURE:</span>
                <span class="text-cyan-400 font-semibold">Microservices & SPA / SSR</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Matrix Bento -->
        <div v-if="about?.skills?.length" class="glass-panel p-6 sm:p-8 border border-cyber-border/30 shadow-glass-card space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 class="text-xl font-bold font-display text-white">Technical Skill Matrix</h2>
            <span class="text-xs font-mono text-cyan-400 font-semibold">#CORE_SKILLS</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="skill in about.skills"
              :key="skill"
              class="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-cyan-300 transition-all font-mono text-xs text-slate-200 flex items-center gap-2.5 shadow-inner-glow"
            >
              <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]"></span>
              <span class="font-medium">{{ skill }}</span>
            </div>
          </div>
        </div>

        <!-- Experience Timeline -->
        <div v-if="about?.experience?.length" class="space-y-4">
          <div class="glass-panel p-5 border border-cyber-border/30 flex items-center justify-between">
            <h2 class="text-xl font-bold font-display text-white">Work Experience</h2>
            <span class="text-xs font-mono text-cyan-400 font-semibold">#EXPERIENCE</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(exp, i) in sortedExperiences"
              :key="i"
              class="glass-panel p-6 sm:p-7 border border-cyber-border/30 shadow-glass-card space-y-3"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <h3 class="text-lg font-bold font-display text-white">{{ exp.position }}</h3>
                  <span class="text-xs font-mono text-cyan-400 font-semibold uppercase">{{ exp.company }}</span>
                </div>
                <span class="text-xs font-mono text-slate-300 bg-white/5 px-3 py-1 rounded-lg border border-white/15 tabular-nums">
                  {{ exp.startDate }} – {{ exp.endDate || 'Present' }}
                </span>
              </div>

              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="text-slate-300 text-sm leading-relaxed" v-html="sanitizeHtml(exp.description)" />
            </div>
          </div>
        </div>

        <!-- Education -->
        <div v-if="about?.education?.length" class="space-y-4">
          <div class="glass-panel p-5 border border-cyber-border/30 flex items-center justify-between">
            <h2 class="text-xl font-bold font-display text-white">Education & Training</h2>
            <span class="text-xs font-mono text-cyan-400 font-semibold">#EDUCATION</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(edu, i) in sortedEducation"
              :key="i"
              class="glass-panel p-6 border border-cyber-border/30 shadow-glass-card space-y-2"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 class="text-lg font-bold font-display text-white">{{ edu.degree }} {{ edu.field ? `in ${edu.field}` : '' }}</h3>
                  <span class="text-xs font-mono text-indigo-400 font-semibold uppercase">{{ edu.institution }}</span>
                </div>
                <span class="text-xs font-mono text-slate-300 bg-white/5 px-3 py-1 rounded-lg border border-white/15 tabular-nums">
                  {{ edu.startDate }} – {{ edu.endDate || 'Present' }}
                </span>
              </div>
              <p v-if="edu.gpa" class="text-xs font-mono text-slate-300 tabular-nums">GPA: {{ edu.gpa }}</p>
            </div>
          </div>
        </div>

        <!-- Licenses & Certifications -->
        <div v-if="licensesCertifications.length" class="space-y-4">
          <div class="glass-panel p-5 border border-cyber-border/30 flex items-center justify-between">
            <h2 class="text-xl font-bold font-display text-white">Licenses & Certifications</h2>
            <span class="text-xs font-mono text-cyan-400 font-semibold">#CERTIFICATIONS</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(item, i) in licensesCertifications"
              :key="`${item.name}-${item.issuer}-${i}`"
              class="glass-panel p-5 border border-cyber-border/30 shadow-glass-card space-y-2"
            >
              <h3 class="text-base font-bold font-display text-white">{{ item.name }}</h3>
              <p v-if="item.issuer" class="text-xs font-mono text-purple-400 font-semibold uppercase">{{ item.issuer }}</p>
              <p v-if="item.issueDate || item.expirationDate" class="text-xs font-mono text-slate-400 tabular-nums">
                {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'No Expiration' }}
              </p>
              <a
                v-if="item.credentialUrl"
                :href="item.credentialUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 font-semibold hover:underline pt-1"
              >
                <span>Verify Credential</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import { getPublicSocialLinks } from '@/utils/aboutPresentation'
import { sortExperiencesDescending } from '@/utils/experienceSort'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getAboutSeoMeta } from '@/utils/seoPriority'

const aboutStore = useAboutStore()
const homeStore = useHomeStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const loading = computed(() => aboutStore.loading)
const about = computed(() => aboutStore.aboutData)
const publicSocialLinks = computed(() => getPublicSocialLinks(about.value))
const sortedExperiences = computed(() => sortExperiencesDescending(about.value?.experience || []))
const sortedEducation = computed(() => sortExperiencesDescending(about.value?.education || []))
const licensesCertifications = computed(() => about.value?.licensesCertifications || [])

function sanitizeHtml(html: string): string {
  return sanitizeRichContent(html)
}

onMounted(async () => {
  await Promise.all([
    aboutStore.fetchAboutData(),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  applySeo({
    ...getAboutSeoMeta({
      about: aboutStore.aboutData,
      home: homeStore.homeData,
      projects: projectsStore.projects,
      posts: blogStore.posts,
    }),
    url: '/about',
  })
})
</script>
