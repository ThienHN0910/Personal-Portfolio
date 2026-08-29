<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <!-- Page Header -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-12 flex flex-col justify-between gap-6">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Engineering Biography
            </span>
            <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">
              Profile &amp; Credentials
            </span>
          </div>

          <div class="space-y-3 max-w-2xl">
            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05] text-ink">
              {{ about?.name || 'Hồ Ngọc Thiện' }}
              <span class="block italic text-ink-secondary mt-1">Background &amp; Philosophy</span>
            </h1>
            <p class="text-base text-ink-secondary leading-relaxed font-sans font-light">
              Career background, technical skill matrix, engineering history, academic credentials, and software architecture philosophy.
            </p>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <!-- Profile Card & Bio Overview Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Left Avatar Sidebar (Span 4) -->
          <div class="lg:col-span-4 editorial-card">
            <div class="editorial-card__inner p-6 flex flex-col items-center text-center space-y-5">
              <div class="relative w-36 h-36 rounded-2xl overflow-hidden bg-bone border border-stroke shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <img
                  v-if="about?.avatarUrl"
                  :src="about.avatarUrl"
                  :alt="about.name"
                  class="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-ink-secondary font-mono text-2xl font-medium"
                >
                  HN
                </div>
              </div>

              <div>
                <h2 class="text-xl font-serif font-light text-ink">{{ about?.name || 'Hồ Ngọc Thiện' }}</h2>
                <p class="text-[11px] font-mono text-ink-tertiary mt-1 uppercase tracking-wider">{{ about?.title || 'Full Stack Software Engineer' }}</p>
              </div>

              <div v-if="publicSocialLinks.length" class="flex flex-wrap justify-center gap-1.5 pt-1">
                <a
                  v-for="link in publicSocialLinks"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2.5 py-1 rounded-md text-[11px] font-mono text-ink-secondary bg-bone border border-stroke hover:border-ink/20 hover:text-ink transition-all active:scale-95"
                >
                  {{ link.label }}
                </a>
              </div>

              <div v-if="about?.resumeUrl" class="w-full pt-2">
                <RouterLink
                  to="/cv"
                  class="group w-full py-2.5 px-4 rounded-md bg-ink text-surface font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-200"
                >
                  <span>View Full CV</span>
                  <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                    <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                    </svg>
                  </span>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Right Bio Narrative (Span 8) -->
          <div class="lg:col-span-8 editorial-card">
            <div class="editorial-card__inner p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-stroke">
                <h2 class="text-lg font-serif font-light text-ink">Biography Overview</h2>
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Engineering Focus</span>
              </div>

              <p class="text-ink-secondary text-sm sm:text-base leading-relaxed font-light">
                {{ about?.bio || 'Full Stack Software Engineer specializing in modern Web applications, performance engineering, scalable system design, and high-impact user experiences.' }}
              </p>

              <div class="p-4 rounded-lg bg-bone border border-stroke font-mono text-xs text-ink-secondary space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-ink-tertiary uppercase tracking-wider text-[10px]">Core Specialization</span>
                  <span class="text-ink font-medium">Full Stack &amp; Frontend Architecture</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-ink-tertiary uppercase tracking-wider text-[10px]">Ecosystem</span>
                  <span class="text-ink">Vue 3 · TypeScript · Node.js · Cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Matrix -->
        <div v-if="about?.skills?.length" class="editorial-card">
          <div class="editorial-card__inner p-6 sm:p-8 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-stroke">
              <h2 class="text-lg font-serif font-light text-ink">Technical Skill Matrix</h2>
              <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Expertise</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              <div
                v-for="skill in about.skills"
                :key="skill"
                class="p-2.5 rounded-md bg-bone border border-stroke hover:border-ink/20 hover:bg-bone/80 transition-all font-mono text-xs text-ink-secondary flex items-center gap-2 cursor-default"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text"></span>
                <span class="font-medium text-ink">{{ skill }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Experience Timeline -->
        <div v-if="about?.experience?.length" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-2xl font-serif font-light text-ink">Work Experience</h2>
            <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Chronology</span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(exp, i) in sortedExperiences"
              :key="i"
              class="editorial-card"
            >
              <div class="editorial-card__inner p-6 sm:p-7 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stroke">
                  <div>
                    <h3 class="text-base font-serif font-medium text-ink">{{ exp.position }}</h3>
                    <span class="text-xs font-mono text-ink-secondary uppercase tracking-wider">{{ exp.company }}</span>
                  </div>
                  <span class="text-[11px] font-mono text-ink-tertiary bg-bone px-2.5 py-1 rounded border border-stroke tabular-nums self-start sm:self-auto">
                    {{ exp.startDate }} – {{ exp.endDate || 'Present' }}
                  </span>
                </div>

                <!-- eslint-disable-next-line vue/no-v-html -->
                <div class="text-ink-secondary text-sm leading-relaxed font-light" v-html="sanitizeHtml(exp.description)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div v-if="about?.education?.length" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-2xl font-serif font-light text-ink">Education &amp; Training</h2>
            <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Academia</span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(edu, i) in sortedEducation"
              :key="i"
              class="editorial-card"
            >
              <div class="editorial-card__inner p-6 space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 class="text-base font-serif font-medium text-ink">{{ edu.degree }} {{ edu.field ? `in ${edu.field}` : '' }}</h3>
                    <span class="text-xs font-mono text-ink-secondary uppercase tracking-wider">{{ edu.institution }}</span>
                  </div>
                  <span class="text-[11px] font-mono text-ink-tertiary bg-bone px-2.5 py-1 rounded border border-stroke tabular-nums self-start sm:self-auto">
                    {{ edu.startDate }} – {{ edu.endDate || 'Present' }}
                  </span>
                </div>
                <p v-if="edu.gpa" class="text-xs font-mono text-ink-tertiary tabular-nums">GPA: {{ edu.gpa }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Licenses & Certifications -->
        <div v-if="licensesCertifications.length" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-2xl font-serif font-light text-ink">Licenses &amp; Certifications</h2>
            <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Credentials</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(item, i) in licensesCertifications"
              :key="`${item.name}-${item.issuer}-${i}`"
              class="editorial-card"
            >
              <div class="editorial-card__inner p-5 space-y-2">
                <h3 class="text-base font-serif font-medium text-ink">{{ item.name }}</h3>
                <p v-if="item.issuer" class="text-xs font-mono text-ink-secondary uppercase tracking-wider">{{ item.issuer }}</p>
                <p v-if="item.issueDate || item.expirationDate" class="text-xs font-mono text-ink-tertiary tabular-nums">
                  {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'No Expiration' }}
                </p>
                <a
                  v-if="item.credentialUrl"
                  :href="item.credentialUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-mono text-ink font-medium hover:underline pt-1"
                >
                  <span>Verify Credential</span>
                  <span>↗</span>
                </a>
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
