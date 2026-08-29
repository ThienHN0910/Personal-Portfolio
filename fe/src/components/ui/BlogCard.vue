<template>
  <RouterLink
    :to="`/blog/${post.slug || post._id}`"
    class="editorial-card group flex flex-col h-full active:scale-[0.99] transition-transform duration-200"
    :class="[`blog-card--${layout}`]"
  >
    <div class="editorial-card__inner flex flex-col flex-1 p-0">
      <!-- Media / Cover Image -->
      <div class="overflow-hidden relative bg-bone border-b border-stroke" :class="mediaClass">
        <template v-if="showTwoImages">
          <div class="flex flex-col w-full h-full">
            <img :src="galleryImages[0]" :alt="post.title" class="w-full object-cover h-1/2 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
            <img :src="galleryImages[1]" :alt="post.title" class="w-full object-cover h-1/2 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
          </div>
        </template>
        <template v-else>
          <img
            v-if="galleryImages.length"
            :src="galleryImages[0]"
            :alt="post.title"
            class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-bone text-ink-tertiary"
          >
            <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10M6 10h10"/>
            </svg>
          </div>
        </template>
      </div>

      <!-- Body -->
      <div class="flex-1 flex flex-col justify-between p-5 gap-4">
        <div class="space-y-2.5">
          <!-- Categories -->
          <div v-if="post.categories && post.categories.length" class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="category in post.categories.slice(0, 2)"
              :key="category"
              class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-green text-pastel-green-text uppercase tracking-wider font-medium"
            >
              {{ category }}
            </span>
          </div>

          <!-- Title & Excerpt -->
          <h3 class="text-base font-serif font-normal text-ink group-hover:text-ink/75 transition-colors duration-300 leading-snug tracking-tight">
            {{ post.title }}
          </h3>

          <p class="text-sm text-ink-secondary line-clamp-2 leading-relaxed font-light">
            {{ post.excerpt }}
          </p>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-bone border border-stroke text-ink-secondary"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-5 py-3.5 border-t border-stroke flex items-center justify-between gap-3 text-xs font-mono">
        <span class="text-ink-tertiary tabular-nums">{{ formatTimestamp(post.createdAt) }}</span>
        <span class="text-ink font-sans font-medium text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
          <span>Read Article</span>
          <span class="w-5 h-5 rounded-full bg-bone border border-stroke flex items-center justify-center group-hover:bg-ink group-hover:text-surface group-hover:border-ink transition-all duration-300">
            <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
            </svg>
          </span>
        </span>
      </div>
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

