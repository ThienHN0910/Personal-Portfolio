<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="w-full max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-14 space-y-12 sm:space-y-16">

      <!-- ── Page Header: Avant-Garde Profile Masthead ────────────────── -->
      <header class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-14 flex flex-col justify-between gap-8">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Engineering Biography &amp; Technical Philosophy
            </span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary tabular-nums">
                System Architect #0910
              </span>
              <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-green text-pastel-green-text uppercase font-medium">
                Production Verified
              </span>
            </div>
          </div>

          <div class="space-y-4 max-w-4xl">
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
              {{ about?.name || 'Hồ Ngọc Thiện' }}
              <span class="block italic text-ink-secondary mt-1">Background &amp; System Craft</span>
            </h1>
            <p class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light max-w-3xl">
              Lead full-stack software engineer specializing in high-performance web platforms, type-safe architecture, resilient distributed backends, and sub-100ms user interaction design.
            </p>
          </div>
        </div>
      </header>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <!-- ── Main 2-Column Layout: Sticky Left Identity + Right Content ─ -->
        <div class="xl:grid xl:grid-cols-[300px_1fr] xl:items-start xl:gap-8 space-y-8 xl:space-y-0">

          <!-- ── STICKY LEFT RAIL: Profile Identity & Telemetry ────────── -->
          <aside class="xl:sticky xl:top-24 xl:self-start space-y-5">
            <!-- Profile Identity Card -->
            <div class="editorial-card">
              <div class="editorial-card__inner p-6 flex flex-col items-center text-center space-y-5">
                <!-- Avatar Frame -->
                <div class="relative w-36 h-36 rounded-2xl overflow-hidden bg-bone border border-stroke shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group">
                  <img
                    v-if="about?.avatarUrl"
                    :src="about.avatarUrl"
                    :alt="about.name"
                    class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-ink-secondary font-mono text-3xl font-medium"
                  >
                    HN
                  </div>
                </div>

                <div>
                  <h2 class="text-xl font-serif font-light text-ink">{{ about?.name || 'Hồ Ngọc Thiện' }}</h2>
                  <p class="text-[11px] font-mono text-ink-tertiary mt-1 uppercase tracking-wider">{{ about?.title || 'Full Stack Software Engineer' }}</p>
                </div>

                <!-- Live Availability Badge -->
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-green text-pastel-green-text text-[11px] font-mono font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
                  <span>Available for Architecture</span>
                </div>

                <!-- Social & Contact Shortcuts -->
                <div v-if="publicSocialLinks.length" class="flex flex-wrap justify-center gap-1.5 pt-1 w-full">
                  <a
                    v-for="link in publicSocialLinks"
                    :key="link.label"
                    :href="link.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-2.5 py-1 rounded-md text-[11px] font-mono text-ink-secondary bg-bone border border-stroke hover:border-ink/20 hover:text-ink transition-all active:scale-95 flex items-center gap-1"
                  >
                    <span>{{ link.label }}</span>
                    <span class="text-[10px] text-ink-tertiary">↗</span>
                  </a>
                </div>

                <!-- Curriculum Vitae Action -->
                <div v-if="about?.resumeUrl" class="w-full pt-2">
                  <RouterLink
                    to="/cv"
                    class="group w-full py-2.5 px-4 rounded-md bg-ink text-surface font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-200"
                  >
                    <span>View Curriculum Vitae</span>
                    <span class="w-4 h-4 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                      <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Telemetry & Location Card -->
            <div class="editorial-card">
              <div class="editorial-card__inner p-5 space-y-4 font-mono text-xs text-ink-secondary">
                <div class="flex items-center justify-between pb-2 border-b border-stroke">
                  <span class="text-[10px] text-ink-tertiary uppercase tracking-widest">Profile Telemetry</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-blue-text"></span>
                </div>

                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-ink-tertiary uppercase">Location</span>
                    <span class="text-ink text-right">Ho Chi Minh City, VN</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-ink-tertiary uppercase">Timezone</span>
                    <span class="text-ink tabular-nums">GMT+7 (Indochina)</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-ink-tertiary uppercase">Focus</span>
                    <span class="text-ink text-right">Web Apps &amp; Architecture</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-ink-tertiary uppercase">Status</span>
                    <span class="text-pastel-green-text font-medium">Production Active</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- ── RIGHT MAIN CANVAS: Narrative, Principles, Skills, History ── -->
          <div class="space-y-10 min-w-0">

            <!-- ── Executive Biography & Architectural Focus ──────────── -->
            <div class="editorial-card">
              <div class="editorial-card__inner p-8 sm:p-12 space-y-8">
                <div class="flex items-center justify-between pb-4 border-b border-stroke">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                    <h2 class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Architectural Statement</h2>
                  </div>
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Design &amp; Systems</span>
                </div>

                <p class="text-ink text-lg sm:text-xl leading-relaxed font-serif font-light">
                  {{ about?.bio || 'Full Stack Software Engineer specializing in modern Web applications, performance engineering, scalable system design, and high-impact user experiences.' }}
                </p>

                <!-- 3 Core Engineering Pillars -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div class="p-4 rounded-lg bg-bone border border-stroke space-y-2">
                    <div class="flex items-center justify-between text-ink-tertiary font-mono text-[10px]">
                      <span>PILLAR 01</span>
                      <span class="text-blue-400">⚡ TYPE SAFETY</span>
                    </div>
                    <h4 class="font-serif text-sm font-medium text-ink">Contract-First Systems</h4>
                    <p class="text-xs text-ink-secondary leading-relaxed font-sans font-light">
                      End-to-end typing from database schemas to client state, preventing runtime mismatches and contract drift.
                    </p>
                  </div>

                  <div class="p-4 rounded-lg bg-bone border border-stroke space-y-2">
                    <div class="flex items-center justify-between text-ink-tertiary font-mono text-[10px]">
                      <span>PILLAR 02</span>
                      <span class="text-green-400">⚡ 60FPS UI</span>
                    </div>
                    <h4 class="font-serif text-sm font-medium text-ink">Sub-100ms Interactions</h4>
                    <p class="text-xs text-ink-secondary leading-relaxed font-sans font-light">
                      GPU-composited transforms, lightweight reactive trees, and optimized asset delivery for tactile micro-interactions.
                    </p>
                  </div>

                  <div class="p-4 rounded-lg bg-bone border border-stroke space-y-2">
                    <div class="flex items-center justify-between text-ink-tertiary font-mono text-[10px]">
                      <span>PILLAR 03</span>
                      <span class="text-amber-400">⚡ RESILIENCE</span>
                    </div>
                    <h4 class="font-serif text-sm font-medium text-ink">Fault-Tolerant Seams</h4>
                    <p class="text-xs text-ink-secondary leading-relaxed font-sans font-light">
                      Graceful API degradation, robust fallbacks, and automated seam tests protecting critical system boundaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Technical Skill Matrix ────────────────────────────── -->
            <div v-if="about?.skills?.length" class="editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-stroke">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-pastel-green-text"></span>
                    <h2 class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Technical Skill Matrix</h2>
                  </div>
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider tabular-nums">
                    {{ about.skills.length }} Core Disciplines
                  </span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  <div
                    v-for="skill in about.skills"
                    :key="skill"
                    class="p-3 rounded-lg bg-bone border border-stroke hover:border-ink/30 hover:bg-bone/80 transition-all font-mono text-xs text-ink flex items-center justify-between gap-2 cursor-default group active:scale-[0.98]"
                  >
                    <span class="truncate font-medium">{{ skill }}</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text group-hover:scale-125 transition-transform"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Work Chronology (Experience) ───────────────────────── -->
            <div v-if="about?.experience?.length" class="space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
                <div class="space-y-1">
                  <span class="eyebrow-tag">
                    <span class="status-dot"></span>
                    Professional Trajectory
                  </span>
                  <h2 class="text-2xl sm:text-4xl font-serif font-light text-ink">Work Chronology</h2>
                </div>
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Verified Track Record</span>
              </div>

              <div class="space-y-5">
                <div
                  v-for="(exp, i) in sortedExperiences"
                  :key="i"
                  class="editorial-card group"
                >
                  <div class="editorial-card__inner p-7 sm:p-10 space-y-5">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stroke">
                      <div class="space-y-1">
                        <h3 class="text-xl font-serif font-medium text-ink group-hover:text-ink/90 transition-colors">{{ exp.position }}</h3>
                        <span class="text-xs font-mono text-ink-secondary uppercase tracking-wider font-semibold">{{ exp.company }}</span>
                      </div>
                      <span class="text-[11px] font-mono text-ink bg-bone px-3.5 py-1.5 rounded-md border border-stroke tabular-nums self-start sm:self-auto shadow-sm">
                        {{ exp.startDate }} – {{ exp.endDate || 'Present' }}
                      </span>
                    </div>

                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="prose-editorial text-sm leading-relaxed" v-html="sanitizeHtml(exp.description)" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Academic Foundation (Education) ───────────────────── -->
            <div v-if="about?.education?.length" class="space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
                <div class="space-y-1">
                  <span class="eyebrow-tag">
                    <span class="status-dot"></span>
                    Academic Background
                  </span>
                  <h2 class="text-2xl sm:text-4xl font-serif font-light text-ink">Education &amp; Academic Training</h2>
                </div>
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Academia</span>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(edu, i) in sortedEducation"
                  :key="i"
                  class="editorial-card"
                >
                  <div class="editorial-card__inner p-7 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div class="space-y-1">
                        <h3 class="text-lg font-serif font-medium text-ink">{{ edu.degree }} {{ edu.field ? `in ${edu.field}` : '' }}</h3>
                        <span class="text-xs font-mono text-ink-secondary uppercase tracking-wider font-medium">{{ edu.institution }}</span>
                      </div>
                      <span class="text-[11px] font-mono text-ink-tertiary bg-bone px-3 py-1 rounded border border-stroke tabular-nums self-start sm:self-auto">
                        {{ edu.startDate }} – {{ edu.endDate || 'Present' }}
                      </span>
                    </div>
                    <p v-if="edu.gpa" class="text-xs font-mono text-ink-tertiary tabular-nums">GPA: {{ edu.gpa }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Licenses & Certifications ─────────────────────────── -->
            <div v-if="licensesCertifications.length" class="space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
                <div class="space-y-1">
                  <span class="eyebrow-tag">
                    <span class="status-dot"></span>
                    Accreditations
                  </span>
                  <h2 class="text-2xl sm:text-4xl font-serif font-light text-ink">Licenses &amp; Certifications</h2>
                </div>
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Verified Credentials</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(item, i) in licensesCertifications"
                  :key="`${item.name}-${item.issuer}-${i}`"
                  class="editorial-card"
                >
                  <div class="editorial-card__inner p-6 space-y-3 flex flex-col justify-between min-h-[140px]">
                    <div class="space-y-1">
                      <h3 class="text-base font-serif font-medium text-ink">{{ item.name }}</h3>
                      <p v-if="item.issuer" class="text-xs font-mono text-ink-secondary uppercase tracking-wider font-medium">{{ item.issuer }}</p>
                      <p v-if="item.issueDate || item.expirationDate" class="text-xs font-mono text-ink-tertiary tabular-nums">
                        {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'No Expiration' }}
                      </p>
                    </div>
                    <a
                      v-if="item.credentialUrl"
                      :href="item.credentialUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1.5 text-xs font-mono text-ink font-medium hover:underline pt-2 group self-start"
                    >
                      <span>Verify Credential</span>
                      <span class="group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import { getPublicSocialLinks } from '@/utils/aboutPresentation'
import { sortChronologyDescending } from '@/utils/experienceSort'
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
const sortedExperiences = computed(() => sortChronologyDescending(about.value?.experience || []))
const sortedEducation = computed(() => sortChronologyDescending(about.value?.education || []))
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
