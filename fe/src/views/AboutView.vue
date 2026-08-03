<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_30%)]" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Page Header -->
      <div class="bento-card border-2 border-cyber-cyan/40 bg-slate-950/90 shadow-[6px_6px_0px_0px_rgba(0,242,255,0.25)]">
        <div class="brutal-badge mb-3">
          <span>BIOGRAPHY & SKILLS</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Hồ Ngọc Thiện <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-indigo-400 to-violet-400">(ThienHN)</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base max-w-2xl leading-relaxed border-l-4 border-cyber-cyan pl-4 font-normal">
          Career background, technical skill matrix, work history, academic credentials, and software architecture philosophy.
        </p>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <!-- Profile Card & Bio Overview Bento Grid -->
        <div class="bento-grid">
          <!-- Left Avatar Sidebar (Span 4) -->
          <div class="col-span-12 lg:col-span-4 bento-card bento-card--stark flex flex-col items-center text-center space-y-5">
            <div class="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-900 border-2 border-cyber-cyan shadow-[4px_4px_0px_0px_#00f2ff]">
              <img
                v-if="about?.avatarUrl"
                :src="about.avatarUrl"
                :alt="about.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-cyber-cyan font-mono text-3xl font-bold"
              >
                HN
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-white">{{ about?.name || 'Hồ Ngọc Thiện' }}</h2>
              <p class="text-xs font-mono text-cyber-cyan font-semibold mt-1 uppercase tracking-wider">{{ about?.title || 'Full Stack Software Engineer' }}</p>
            </div>

            <div v-if="publicSocialLinks.length" class="flex flex-wrap justify-center gap-2">
              <a
                v-for="link in publicSocialLinks"
                :key="link.label"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 bg-white/5 border-2 border-white/20 hover:border-cyber-cyan hover:text-cyber-cyan transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
              >
                {{ link.label }}
              </a>
            </div>

            <div v-if="about?.resumeUrl" class="w-full pt-2">
              <RouterLink to="/cv" class="w-full py-3 rounded-xl bg-cyber-cyan text-slate-950 font-mono font-bold text-xs uppercase tracking-wider block border-2 border-cyber-cyan shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff] transition-all">
                View & Download CV
              </RouterLink>
            </div>
          </div>

          <!-- Right Bio Narrative (Span 8) -->
          <div class="col-span-12 lg:col-span-8 bento-card border-2 border-cyber-cyan/30 bg-slate-950/80 shadow-[4px_4px_0px_0px_rgba(0,242,255,0.2)] flex flex-col justify-between space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 class="text-xl font-bold text-white">Biography Overview</h2>
              <span class="text-xs font-mono text-cyber-cyan font-bold">#BIO_OVERVIEW</span>
            </div>

            <p class="text-slate-300 text-base leading-relaxed">
              {{ about?.bio || 'Passionate Full Stack Software Engineer specializing in modern Web applications, performance engineering, scalable system design, and high-impact user experiences.' }}
            </p>

            <div class="p-4 rounded-xl bg-white/5 border-2 border-white/10 font-mono text-xs text-slate-300 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-slate-400">CORE FOCUS:</span>
                <span class="text-white font-bold">Full Stack & Performance Engineering</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400">ARCHITECTURE:</span>
                <span class="text-cyber-cyan font-bold">Microservices & SPA / SSR</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Matrix Bento -->
        <div v-if="about?.skills?.length" class="bento-card border-2 border-cyber-cyan/30 bg-slate-950/80 shadow-[4px_4px_0px_0px_rgba(0,242,255,0.2)] space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 class="text-xl font-bold text-white">Technical Skill Matrix</h2>
            <span class="text-xs font-mono text-cyber-cyan font-bold">#CORE_SKILLS</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="skill in about.skills"
              :key="skill"
              class="p-3.5 rounded-xl bg-white/5 border-2 border-white/10 hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all font-mono text-xs text-slate-200 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.08)]"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-cyber-cyan"></span>
              <span class="font-bold">{{ skill }}</span>
            </div>
          </div>
        </div>

        <!-- Experience Timeline -->
        <div v-if="about?.experience?.length" class="space-y-4">
          <div class="bento-card border-2 border-cyber-cyan/30 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Work Experience</h2>
            <span class="text-xs font-mono text-cyber-cyan font-bold">#EXPERIENCE</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(exp, i) in sortedExperiences"
              :key="i"
              class="bento-card bento-card--stark space-y-3"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <h3 class="text-lg font-bold text-white">{{ exp.position }}</h3>
                  <span class="text-xs font-mono text-cyber-cyan font-bold uppercase">{{ exp.company }}</span>
                </div>
                <span class="text-xs font-mono text-slate-300 bg-white/5 px-3 py-1 rounded-lg border-2 border-white/20">
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
          <div class="bento-card border-2 border-cyber-cyan/30 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Education & Training</h2>
            <span class="text-xs font-mono text-cyber-cyan font-bold">#EDUCATION</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(edu, i) in sortedEducation"
              :key="i"
              class="bento-card bento-card--stark space-y-2"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 class="text-lg font-bold text-white">{{ edu.degree }} {{ edu.field ? `in ${edu.field}` : '' }}</h3>
                  <span class="text-xs font-mono text-indigo-400 font-bold uppercase">{{ edu.institution }}</span>
                </div>
                <span class="text-xs font-mono text-slate-300 bg-white/5 px-3 py-1 rounded-lg border-2 border-white/20">
                  {{ edu.startDate }} – {{ edu.endDate || 'Present' }}
                </span>
              </div>
              <p v-if="edu.gpa" class="text-xs font-mono text-slate-300">GPA: {{ edu.gpa }}</p>
            </div>
          </div>
        </div>

        <!-- Licenses & Certifications -->
        <div v-if="licensesCertifications.length" class="space-y-4">
          <div class="bento-card border-2 border-cyber-cyan/30 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Licenses & Certifications</h2>
            <span class="text-xs font-mono text-cyber-cyan font-bold">#CERTIFICATIONS</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(item, i) in licensesCertifications"
              :key="`${item.name}-${item.issuer}-${i}`"
              class="bento-card bento-card--stark space-y-2"
            >
              <h3 class="text-base font-bold text-white">{{ item.name }}</h3>
              <p v-if="item.issuer" class="text-xs font-mono text-violet-400 font-bold uppercase">{{ item.issuer }}</p>
              <p v-if="item.issueDate || item.expirationDate" class="text-xs font-mono text-slate-400">
                {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'No Expiration' }}
              </p>
              <a
                v-if="item.credentialUrl"
                :href="item.credentialUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block text-xs font-mono text-cyber-cyan font-bold hover:underline pt-1"
              >
                Verify Credential ↗
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
