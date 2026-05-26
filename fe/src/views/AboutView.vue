<template>
  <div class="section min-h-screen pt-24 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(112,0,255,0.08),transparent_28%)]" />
    <div class="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(0,242,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.8)_1px,transparent_1px)] bg-[size:40px_40px]" />

    <div class="container relative z-10">
      <div class="glass-panel cut-corners p-6 md:p-8 mb-8">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="status-dot"></span>
            <span class="font-mono text-xs tracking-[0.2em] text-cyan-300 uppercase">About</span>
          </div>
          <div>
            <h1 class="section-title mb-3 font-os text-cyan-100 uppercase tracking-[0.16em]">
              About <span class="highlight">Me</span>
            </h1>
            <p class="section-subtitle max-w-2xl text-gray-300">
              Biography, skills, experience, and credentials.
            </p>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div class="lg:col-span-4 glass-panel cut-corners p-6">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="relative w-40 h-40 glass-panel cut-corners p-2">
                <img
                  v-if="about?.avatarUrl"
                  :src="about.avatarUrl"
                  :alt="about.name"
                  class="w-full h-full object-cover rounded-md border border-white/10"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center border border-white/10 rounded-md"
                >
                  <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" class="text-cyan-300 opacity-60">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </div>

              <div>
                <h2 class="font-os text-2xl uppercase tracking-[0.16em] text-cyan-100">{{ about?.name || 'About Me' }}</h2>
                <p class="mt-2 font-mono text-cyan-300 text-sm uppercase tracking-[0.18em]">{{ about?.title || 'Full Stack Developer' }}</p>
              </div>

              <div v-if="publicSocialLinks.length" class="flex flex-wrap justify-center gap-3">
                <a
                  v-for="link in publicSocialLinks"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-2 text-xs font-mono tracking-[0.2em] uppercase text-cyan-100 border border-white/10 rounded bg-white/3 hover:border-cyan-300/40 hover:bg-cyan-300/10 transition-colors"
                >
                  {{ link.label }}
                </a>
              </div>

              <div v-if="about?.resumeUrl" class="w-full">
                <RouterLink to="/cv" class="btn btn--primary w-full font-os uppercase tracking-[0.18em]">
                  View My CV
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="lg:col-span-8 glass-panel cut-corners p-6 md:p-7">
            <div class="flex items-center justify-between gap-3 mb-5">
              <h2 class="font-os text-xl uppercase tracking-[0.16em] text-cyan-100">Overview</h2>
              <span class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[PROFILE_MODULE]</span>
            </div>
            <p class="font-mono text-sm md:text-base text-gray-300 leading-relaxed">
              {{ about?.bio || 'A passionate developer who loves building great web experiences.' }}
            </p>

          </div>
        </div>

        <div v-if="about?.contactInfo && hasContactInfo" class="mb-8 glass-panel cut-corners p-6 md:p-7">
          <div class="flex items-center justify-between gap-3 mb-5">
            <h2 class="font-os text-xl uppercase tracking-[0.16em] text-cyan-100">Contact</h2>
            <span class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[CHANNELS]</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-if="about.contactInfo.email" class="glass-panel cut-corners px-4 py-3 text-sm">
              <p class="text-gray-400 mb-1 font-mono text-xs uppercase tracking-[0.2em]">Email</p>
              <a :href="`mailto:${about.contactInfo.email}`" class="text-cyan-300 hover:text-cyan-200 transition-colors font-mono">{{ about.contactInfo.email }}</a>
            </div>
            <div v-if="about.contactInfo.phone" class="glass-panel cut-corners px-4 py-3 text-sm">
              <p class="text-gray-400 mb-1 font-mono text-xs uppercase tracking-[0.2em]">Phone</p>
              <a :href="`tel:${about.contactInfo.phone}`" class="text-cyan-300 hover:text-cyan-200 transition-colors font-mono">{{ about.contactInfo.phone }}</a>
            </div>
            <div v-if="about.contactInfo.location" class="glass-panel cut-corners px-4 py-3 text-sm">
              <p class="text-gray-400 mb-1 font-mono text-xs uppercase tracking-[0.2em]">Location</p>
              <p class="text-gray-300 font-mono">{{ about.contactInfo.location }}</p>
            </div>
            <div v-if="about.contactInfo.website" class="glass-panel cut-corners px-4 py-3 text-sm">
              <p class="text-gray-400 mb-1 font-mono text-xs uppercase tracking-[0.2em]">Website</p>
              <a :href="about.contactInfo.website" target="_blank" rel="noopener noreferrer" class="text-cyan-300 hover:text-cyan-200 transition-colors font-mono">{{ about.contactInfo.website }}</a>
            </div>
          </div>
        </div>

        <div v-if="about?.skills?.length" class="mb-8 glass-panel cut-corners p-6 md:p-7">
          <div class="flex items-center justify-between gap-3 mb-5">
            <h2 class="font-os text-xl uppercase tracking-[0.16em] text-cyan-100">Skills</h2>
            <span class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[LOADING_SEQUENCES]</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div v-for="skill in about.skills" :key="skill" class="p-4 bg-white/3 border border-white/6 rounded-md font-mono text-sm text-cyan-100">
              <div class="text-xs uppercase tracking-[0.18em] text-gray-300">{{ skill }}</div>
            </div>
          </div>
        </div>

        <div v-if="about?.experience?.length" class="mb-8">
          <div class="glass-panel cut-corners p-6 md:p-7 mb-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="font-os text-xl uppercase tracking-[0.16em] text-cyan-100">Experience</h2>
              <span class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[DATA_STREAM]</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(exp, i) in sortedExperiences" :key="i" class="glass-panel cut-corners p-5">
              <div class="flex items-start gap-4">
                <div class="w-2 h-20 bg-gradient-to-b from-cyan-400/60 to-transparent rounded-sm" />
                <div class="flex-1 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 class="font-os text-lg text-cyan-100 uppercase tracking-[0.12em]">{{ exp.position }}</h3>
                    <span class="font-mono text-sm text-gray-400">{{ exp.startDate }} – {{ exp.endDate || 'Present' }}</span>
                  </div>
                  <p class="font-mono text-sm text-cyan-300 uppercase tracking-[0.18em]">{{ exp.company }}</p>
                  <div class="experience-content text-gray-300 text-sm leading-relaxed" v-html="sanitizeHtml(exp.description)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="about?.education?.length" class="mb-8">
          <div class="glass-panel cut-corners p-6 md:p-7 mb-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="font-os text-xl uppercase tracking-[0.16em] text-cyan-100">Education</h2>
              <span class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[RECORDS]</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(edu, i) in sortedEducation" :key="i" class="glass-panel cut-corners p-5">
              <div class="flex items-start gap-4">
                <div class="w-2 h-20 bg-gradient-to-b from-purple-400/60 to-transparent rounded-sm" />
                <div class="flex-1 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 class="font-os text-lg text-cyan-100 uppercase tracking-[0.12em]">{{ edu.degree }} in {{ edu.field }}</h3>
                    <span class="font-mono text-sm text-gray-400">{{ edu.startDate }} – {{ edu.endDate || 'Present' }}</span>
                  </div>
                  <p class="font-mono text-sm text-cyan-300 uppercase tracking-[0.18em]">{{ edu.institution }}</p>
                  <p v-if="edu.gpa" class="font-mono text-sm text-gray-300">GPA: {{ edu.gpa }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="licensesCertifications.length" class="mb-8">
          <div class="glass-panel cut-corners p-6 md:p-7 mb-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="font-os text-xl uppercase tracking-[0.16em] text-cyan-100">Licenses &amp; Certifications</h2>
              <span class="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">[VERIFIED_MODULES]</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(item, i) in licensesCertifications" :key="`${item.name}-${item.issuer}-${i}`" class="glass-panel cut-corners p-5">
              <div class="flex items-start gap-4">
                <div class="text-cyan-400 text-lg mt-1">»</div>
                <div class="flex-1 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 class="font-os text-lg text-cyan-100 uppercase tracking-[0.12em]">{{ item.name }}</h3>
                    <span v-if="item.issueDate || item.expirationDate" class="font-mono text-sm text-gray-400">
                      {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'No expiration' }}
                    </span>
                  </div>
                  <p v-if="item.issuer" class="font-mono text-sm text-cyan-300 uppercase tracking-[0.18em]">{{ item.issuer }}</p>
                  <p v-if="item.credentialId" class="font-mono text-xs text-gray-400">ID: {{ item.credentialId }}</p>
                  <a
                    v-if="item.credentialUrl"
                    :href="item.credentialUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-xs text-cyan-300 hover:text-cyan-200 transition-colors font-mono uppercase tracking-[0.18em]"
                  >
                    [VERIFY]
                  </a>
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
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { hasAnyContactInfo, getPublicSocialLinks } from '@/utils/aboutPresentation'
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
const hasContactInfo = computed(() => hasAnyContactInfo(about.value))

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
