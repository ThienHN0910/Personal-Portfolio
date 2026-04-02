<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
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
            <div>
              <h1 class="section-title mb-2">{{ about?.name || 'About Me' }}</h1>
              <p class="text-xl text-blue-400 font-medium mb-3">{{ about?.title || 'Full Stack Developer' }}</p>
              <div v-if="about?.socialLinks" class="flex gap-4">
                <a v-if="about.socialLinks.github" :href="about.socialLinks.github" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a>
                <a v-if="about.socialLinks.linkedin" :href="about.socialLinks.linkedin" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-blue-400 transition-colors">LinkedIn</a>
                <a v-if="about.socialLinks.twitter" :href="about.socialLinks.twitter" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-blue-400 transition-colors">Twitter</a>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4">About Me</h2>
            <p class="text-gray-400 leading-relaxed text-lg">
              {{ about?.bio || 'A passionate developer who loves building great web experiences.' }}
            </p>
          </div>

          <!-- Skills -->
          <div v-if="about?.skills?.length" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4">Skills</h2>
            <div class="flex flex-wrap gap-3">
              <SkillBadge v-for="skill in about.skills" :key="skill" :skill="skill" />
            </div>
          </div>

          <!-- Experience -->
          <div v-if="about?.experience?.length" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-6">Experience</h2>
            <div class="space-y-6">
              <div
                v-for="(exp, i) in about.experience"
                :key="i"
                class="border border-white/10 rounded-xl p-6 bg-white/[0.02]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 class="text-lg font-bold text-white">{{ exp.position }}</h3>
                  <span class="text-sm text-gray-500">{{ exp.startDate }} – {{ exp.endDate || 'Present' }}</span>
                </div>
                <p class="text-blue-400 font-medium mb-2">{{ exp.company }}</p>
                <p class="text-gray-400 text-sm leading-relaxed">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div v-if="about?.education?.length" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-6">Education</h2>
            <div class="space-y-6">
              <div
                v-for="(edu, i) in about.education"
                :key="i"
                class="border border-white/10 rounded-xl p-6 bg-white/[0.02]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 class="text-lg font-bold text-white">{{ edu.degree }} in {{ edu.field }}</h3>
                  <span class="text-sm text-gray-500">{{ edu.startDate }} – {{ edu.endDate || 'Present' }}</span>
                </div>
                <p class="text-blue-400 font-medium">{{ edu.institution }}</p>
              </div>
            </div>
          </div>

          <!-- Resume -->
          <div v-if="about?.resumeUrl">
            <a :href="about.resumeUrl" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              Download Resume
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAboutStore } from '@/stores/about'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import SkillBadge from '@/components/ui/SkillBadge.vue'

const aboutStore = useAboutStore()
const loading = computed(() => aboutStore.loading)
const about = computed(() => aboutStore.aboutData)

onMounted(() => aboutStore.fetchAboutData())
</script>
