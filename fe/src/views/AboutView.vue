<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="glass-panel cut-corners p-6 mb-8">
        <h2 class="section-title mb-2">IDENTITY DATA</h2>
        <p class="text-sm text-gray-300">Biography and identity records.</p>
      </div>
      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="flex flex-col md:flex-row items-center gap-8 mb-12">
            <img
              v-if="about?.avatarUrl"
              :src="about.avatarUrl"
              :alt="about.name"
              class="w-36 h-36 rounded-full object-cover border-4 border-blue-500/30 shadow-2xl"
            />
            <div
              v-else
              class="w-36 h-36 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center border-4 border-blue-500/30"
            >
              <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" class="text-blue-400 opacity-60">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div class="flex-1">
              <h1 class="section-title mb-2">{{ about?.name || 'About Me' }}</h1>
              <p class="text-xl text-blue-400 font-medium mb-3">{{ about?.title || 'Full Stack Developer' }}</p>
              <div v-if="publicSocialLinks.length" class="flex gap-4">
                <a
                  v-for="link in publicSocialLinks"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {{ link.label }}
                </a>
              </div>
            </div>
            <div v-if="about?.resumeUrl" class="w-full md:w-auto flex justify-end md:self-start">
              <RouterLink to="/cv" class="btn btn--primary">
                View My CV
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- Contact Info -->
          <div v-if="about?.contactInfo && hasContactInfo" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4">Contact</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-if="about.contactInfo.email" class="border border-white/10 rounded-xl px-4 py-3 bg-white/[0.02] text-sm">
                <p class="text-gray-500 mb-1">Email</p>
                <a :href="`mailto:${about.contactInfo.email}`" class="text-blue-300 hover:text-blue-200 transition-colors">{{ about.contactInfo.email }}</a>
              </div>
              <div v-if="about.contactInfo.phone" class="border border-white/10 rounded-xl px-4 py-3 bg-white/[0.02] text-sm">
                <p class="text-gray-500 mb-1">Phone</p>
                <a :href="`tel:${about.contactInfo.phone}`" class="text-blue-300 hover:text-blue-200 transition-colors">{{ about.contactInfo.phone }}</a>
              </div>
              <div v-if="about.contactInfo.location" class="border border-white/10 rounded-xl px-4 py-3 bg-white/[0.02] text-sm">
                <p class="text-gray-500 mb-1">Location</p>
                <p class="text-gray-300">{{ about.contactInfo.location }}</p>
              </div>
              <div v-if="about.contactInfo.website" class="border border-white/10 rounded-xl px-4 py-3 bg-white/[0.02] text-sm">
                <p class="text-gray-500 mb-1">Website</p>
                <a :href="about.contactInfo.website" target="_blank" rel="noopener noreferrer" class="text-blue-300 hover:text-blue-200 transition-colors">{{ about.contactInfo.website }}</a>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="mb-12 glass-panel cut-corners p-6">
            <h2 class="text-2xl font-os tracking-wider text-cyan-200 mb-4">Identity Data</h2>
            <p class="font-mono text-sm text-gray-300 leading-relaxed">
              {{ about?.bio || 'A passionate developer who loves building great web experiences.' }}
            </p>
          </div>

          <!-- Skills -->
          <div v-if="about?.skills?.length" class="mb-12 glass-panel cut-corners p-6">
            <h2 class="text-2xl font-os tracking-wider text-cyan-200 mb-4">Core Technologies</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div v-for="skill in about.skills" :key="skill" class="p-3 bg-white/3 border border-white/6 rounded-md font-mono text-sm text-cyan-100">
                <div class="text-sm">{{ skill }}</div>
                <div class="h-2 bg-white/6 mt-2 rounded overflow-hidden"><div class="h-2 bg-cyan-400/60" style="width:60%"></div></div>
              </div>
            </div>
          </div>

          <!-- Experience -->
          <div v-if="about?.experience?.length" class="mb-12">
            <h2 class="text-2xl font-os tracking-wider text-cyan-200 mb-6">Experience (Data Stream)</h2>
            <div class="space-y-6">
              <div v-for="(exp, i) in sortedExperiences" :key="i" class="glass-panel cut-corners p-4">
                <div class="flex items-start gap-4">
                  <div class="w-2 h-20 bg-gradient-to-b from-cyan-400/60 to-transparent rounded-sm" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h3 class="font-os text-lg text-cyan-100">{{ exp.position }}</h3>
                      <span class="font-mono text-sm text-gray-400">{{ exp.startDate }} – {{ exp.endDate || 'Present' }}</span>
                    </div>
                    <p class="font-mono text-sm text-cyan-200 mb-1">{{ exp.company }}</p>
                    <div class="experience-content text-gray-300 text-sm leading-relaxed" v-html="sanitizeHtml(exp.description)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div v-if="about?.education?.length" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-6">Education</h2>
            <div class="space-y-6">
              <div
                v-for="(edu, i) in sortedEducation"
                :key="i"
                class="border border-white/10 rounded-xl p-6 bg-white/[0.02]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 class="text-lg font-bold text-white">{{ edu.degree }} in {{ edu.field }}</h3>
                  <span class="text-sm text-gray-500">{{ edu.startDate }} – {{ edu.endDate || 'Present' }}</span>
                </div>
                <p class="text-blue-400 font-medium">{{ edu.institution }}</p>
                <p v-if="edu.gpa" class="text-sm text-gray-300 mt-1">GPA: {{ edu.gpa }}</p>
              </div>
            </div>
          </div>

          <!-- Licenses & Certifications -->
          <div v-if="licensesCertifications.length" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-6">Licenses &amp; Certifications</h2>
            <div class="space-y-6">
              <div
                v-for="(item, i) in licensesCertifications"
                :key="`${item.name}-${item.issuer}-${i}`"
                class="border border-white/10 rounded-xl p-6 bg-white/[0.02]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <h3 class="text-lg font-bold text-white">{{ item.name }}</h3>
                  <span v-if="item.issueDate || item.expirationDate" class="text-sm text-gray-500">
                    {{ item.issueDate || 'N/A' }} – {{ item.expirationDate || 'No expiration' }}
                  </span>
                </div>
                <p v-if="item.issuer" class="text-blue-400 font-medium mb-2">{{ item.issuer }}</p>
                <p v-if="item.credentialId" class="text-sm text-gray-400 mb-2">Credential ID: {{ item.credentialId }}</p>
                <a
                  v-if="item.credentialUrl"
                  :href="item.credentialUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Verify Credential
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
