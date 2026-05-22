<template>
  <RouterLink :to="`/blog/${post._id}`" class="card block no-underline">
    <div class="overflow-hidden">
      <img
        v-if="post.coverImage"
        :src="post.coverImage"
        :alt="post.title"
        class="card__image"
      />
      <div
        v-else
        class="card__image flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-blue-600/20"
      >
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-purple-400 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
    </div>

    <div class="card__body">
      <div class="card__tags mb-3">
        <span v-for="category in (post.categories || []).slice(0, 2)" :key="category" class="card__tag">
          {{ category }}
        </span>
      </div>
      <div class="card__tags mb-3">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="card__tag">
          {{ tag }}
        </span>
      </div>
      <h3 class="card__title">{{ post.title }}</h3>
      <p class="card__description">{{ post.excerpt }}</p>
    </div>

    <div class="card__footer">
      <span class="text-xs text-gray-500">
        {{ formatDate(post.createdAt) }}
      </span>
      <span class="card__link">
        Read more
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { BlogPost } from '@/types'

defineProps<{
  post: BlogPost
}>()

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
