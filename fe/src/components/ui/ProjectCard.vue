<template>
  <div class="card" :class="{ 'card--featured': project.featured }">
    <div class="overflow-hidden">
      <img
        v-if="project.imageUrl"
        :src="project.imageUrl"
        :alt="project.title"
        class="card__image"
      />
      <div
        v-else
        class="card__image flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20"
      >
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-blue-400 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      </div>
    </div>

    <div class="card__body">
      <h3 class="card__title">{{ project.title }}</h3>
      <p class="card__description">{{ project.description }}</p>

      <div class="card__tags">
        <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" class="card__tag">
          {{ tech }}
        </span>
        <span v-if="project.technologies.length > 4" class="card__tag">
          +{{ project.technologies.length - 4 }}
        </span>
      </div>
    </div>

    <div class="card__footer">
      <RouterLink
        v-if="project.relatedBlogId"
        :to="`/blog/${project.relatedBlogId}`"
        class="card__link"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.5v9A1.5 1.5 0 0 1 18 18H6a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 6 6h12a1.5 1.5 0 0 1 1.5 1.5Zm0 0L12 13.5 4.5 7.5" />
        </svg>
        Related Blog
      </RouterLink>
      <a
        v-if="project.githubUrl"
        :href="project.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="card__link"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </a>
      <a
        v-if="project.liveUrl"
        :href="project.liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="card__link"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        Live Demo
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '@/types'

defineProps<{
  project: Project
}>()
</script>
