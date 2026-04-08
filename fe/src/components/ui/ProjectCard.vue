<template>
  <div class="card project-card" :class="{ 'card--featured': project.featured }">
    <div class="project-card__media overflow-hidden">
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
      <div class="project-card__glow" />
      <span v-if="project.featured" class="project-card__badge">Featured</span>
    </div>

    <div class="card__body project-card__body">
      <h3 class="card__title">{{ project.title }}</h3>
      <p class="card__description" :class="{ 'card__description--expanded': isExpanded }">{{ project.description }}</p>
      <button
        v-if="canToggleDescription"
        type="button"
        class="card__link card__toggle"
        @click="toggleDescription"
      >
        {{ isExpanded ? 'View Less' : 'Read more' }}
      </button>

      <div class="card__tags">
        <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" class="card__tag">
          {{ tech }}
        </span>
        <span v-if="project.technologies.length > 4" class="card__tag">
          +{{ project.technologies.length - 4 }}
        </span>
      </div>
    </div>

    <div class="card__footer project-card__footer">
      <RouterLink
        v-if="project._id"
        :to="`/projects/${project._id}`"
        class="project-card__action"
        aria-label="Project detail"
        title="Project detail"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75 21 21m-4.5-9a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
        </svg>
      </RouterLink>
      <RouterLink
        v-if="project.relatedBlogId"
        :to="`/blog/${project.relatedBlogId}`"
        class="project-card__action"
        aria-label="Related blog"
        title="Related blog"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 6.75H8.25a2.25 2.25 0 0 0-2.25 2.25v11.25A2.25 2.25 0 0 0 8.25 22.5H19.5a2.25 2.25 0 0 0 2.25-2.25V9a2.25 2.25 0 0 0-2.25-2.25ZM6 15H4.5A2.25 2.25 0 0 1 2.25 12.75V3.75A2.25 2.25 0 0 1 4.5 1.5h9A2.25 2.25 0 0 1 15.75 3.75v1.5" />
        </svg>
      </RouterLink>
      <a
        v-if="project.githubUrl"
        :href="project.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="project-card__action"
        aria-label="GitHub repository"
        title="GitHub repository"
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      <a
        v-if="project.liveUrl"
        :href="project.liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="project-card__action"
        aria-label="Live demo"
        title="Live demo"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Project } from '@/types'

const props = defineProps<{
  project: Project
}>()

const DESCRIPTION_TOGGLE_THRESHOLD = 120

const isExpanded = ref(false)

const canToggleDescription = computed(() => props.project.description.length > DESCRIPTION_TOGGLE_THRESHOLD)

function toggleDescription(): void {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped lang="scss">
.project-card {
  position: relative;
  backdrop-filter: blur(10px);
}

.project-card__media {
  position: relative;
}

.project-card__glow {
  position: absolute;
  inset: auto 0 0 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(2, 6, 23, 0.8) 100%);
  pointer-events: none;
}

.project-card__badge {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e2e8f0;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(8px);
}

.project-card__body {
  position: relative;
}

.project-card__footer {
  justify-content: flex-end;
  gap: 0.5rem;
}

.project-card__action {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #93c5fd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  background: rgba(15, 23, 42, 0.6);
}

.project-card__action:hover {
  color: #ffffff;
  border-color: rgba(59, 130, 246, 0.75);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.22);
}
</style>
