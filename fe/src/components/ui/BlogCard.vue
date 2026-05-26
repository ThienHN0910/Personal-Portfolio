<template>
  <RouterLink :to="`/blog/${post._id}`" class="card block no-underline glass-panel cut-corners glitch-hover">
    <div class="relative overflow-hidden">
      <img
        v-if="post.coverImage"
        :src="post.coverImage"
        :alt="post.title"
        class="card__image"
      />
      <div
        v-else
        class="card__image flex items-center justify-center"
        style="background: linear-gradient(135deg, rgba(112,0,255,0.03), rgba(0,242,255,0.03));"
      >
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-cyan-300 opacity-40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      </div>

      <div class="scanline" aria-hidden="true"></div>
    </div>

    <div class="card__body">
      <div class="card__tags mb-3">
        <span v-for="category in (post.categories || []).slice(0, 2)" :key="category" class="card__tag font-mono text-xs text-cyan-100">{{ category }}</span>
      </div>
      <h3 class="card__title font-os tracking-wider text-cyan-200">{{ post.title }}</h3>
      <p class="card__description font-mono text-sm text-gray-300 scanning-text">{{ post.excerpt }}</p>
      <div class="card__tags card__tags--after-description">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="card__tag font-mono text-xs">{{ tag }}</span>
      </div>
    </div>

    <div class="card__footer flex items-center justify-between">
      <span class="text-xs text-gray-400 font-mono">[{{ formatTimestamp(post.createdAt) }}]</span>
      <span class="card__link font-mono text-cyan-200">Read more</span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { BlogPost } from '@/types'

defineProps<{
  post: BlogPost
}>()

function pad(n: number) { return n.toString().padStart(2, '0') }

function formatTimestamp(date?: string): string {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  return `${y}.${m}.${day} | ${hh}:${mm}:${ss}`
}
</script>
