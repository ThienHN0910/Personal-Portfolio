<template>
  <RouterLink
    :to="`/blog/${post.slug || post._id}`"
    class="glass-panel p-5 border border-cyber-border/30 hover:border-cyan-400/50 hover:shadow-cyan-glow-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full active:scale-[0.99]"
    :class="[`blog-card--${layout}`]"
  >
    <!-- Media / Cover Image -->
    <div class="overflow-hidden rounded-xl relative mb-4 bg-slate-900 border border-white/10 shadow-inner-glow" :class="mediaClass">
      <template v-if="showTwoImages">
        <div class="flex flex-col w-full h-full">
          <img :src="galleryImages[0]" :alt="post.title" class="w-full object-cover h-1/2 group-hover:scale-105 transition duration-500" />
          <img :src="galleryImages[1]" :alt="post.title" class="w-full object-cover h-1/2 group-hover:scale-105 transition duration-500" />
        </div>
      </template>
      <template v-else>
        <img
          v-if="galleryImages.length"
          :src="galleryImages[0]"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-cyan-400/30"
        >
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      </template>
    </div>

    <!-- Body -->
    <div class="flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <!-- Categories -->
        <div v-if="post.categories && post.categories.length" class="flex flex-wrap items-center gap-1.5">
          <span
            v-for="category in post.categories.slice(0, 2)"
            :key="category"
            class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
          >
            {{ category }}
          </span>
        </div>

        <!-- Title & Excerpt -->
        <h3 class="text-lg font-bold font-display text-white group-hover:text-cyan-400 transition-colors leading-snug tracking-tight">
          {{ post.title }}
        </h3>

        <p class="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {{ post.excerpt }}
        </p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 pt-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-inner-glow"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
      <span class="text-slate-400 tabular-nums">{{ formatTimestamp(post.createdAt) }}</span>
      <span class="text-cyan-400 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
        <span>Read Article</span>
        <span>→</span>
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPost } from '@/types'

const props = withDefaults(
  defineProps<{
    post: BlogPost
    layout?: 'featured' | 'tall' | 'wide' | 'standard'
  }>(),
  {
    layout: 'standard',
  },
)

const mediaClass = computed(() => {
  if (props.layout === 'featured') return 'h-56 md:h-64'
  if (props.layout === 'tall') return 'h-52 md:h-60'
  if (props.layout === 'wide') return 'h-44 md:h-52'
  return 'h-44 md:h-48'
})

const rawPost = props.post as any
const galleryImages = computed(() => {
  const imgs: string[] = []
  if (rawPost.coverImage) imgs.push(rawPost.coverImage)
  if (Array.isArray(rawPost.images) && rawPost.images.length) {
    for (const i of rawPost.images) {
      if (imgs.length >= 2) break
      if (typeof i === 'string') imgs.push(i)
    }
  }
  if (rawPost.secondaryImage && imgs.length < 2) imgs.push(rawPost.secondaryImage)
  return imgs
})

const showTwoImages = computed(() => galleryImages.value.length >= 2 && (props.layout === 'tall' || props.layout === 'featured'))

function formatTimestamp(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
