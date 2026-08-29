<template>
  <RouterLink
    :to="`/blog/${post.slug || post._id}`"
    class="editorial-card group flex flex-col h-full active:scale-[0.99] transition-transform duration-200"
    :class="[`blog-card--${layout}`]"
  >
    <div class="editorial-card__inner flex flex-col flex-1 p-0 overflow-hidden">
      <!-- ── Media / Cover Image Frame ────────────────────────────────── -->
      <div class="overflow-hidden relative bg-bone border-b border-stroke" :class="mediaClass">
        <template v-if="showTwoImages">
          <div class="grid grid-cols-2 w-full h-full gap-px bg-stroke">
            <img :src="galleryImages[0]" :alt="post.title" class="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700" />
            <img :src="galleryImages[1]" :alt="post.title" class="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700" />
          </div>
        </template>
        <template v-else>
          <img
            v-if="galleryImages.length"
            :src="galleryImages[0]"
            :alt="post.title"
            class="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center bg-bone text-ink-tertiary gap-2"
          >
            <svg class="w-8 h-8 text-ink-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10M6 10h10"/>
            </svg>
            <span class="font-mono text-[10px] uppercase tracking-wider">Engineering Note</span>
          </div>
        </template>
      </div>

      <!-- ── Body Core ────────────────────────────────────────────────── -->
      <div class="flex-1 flex flex-col justify-between p-6 gap-5">
        <div class="space-y-3">
          <!-- Categories & Tags -->
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
          <h3 class="font-serif text-xl sm:text-2xl font-light text-ink group-hover:text-ink/80 transition-colors leading-snug tracking-tight">
            {{ post.title }}
          </h3>

          <p class="text-sm text-ink-secondary line-clamp-2 leading-relaxed font-light font-sans">
            {{ post.excerpt }}
          </p>
        </div>

        <!-- Tags Row -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="text-[10px] font-mono px-2 py-0.5 rounded bg-bone border border-stroke text-ink-secondary"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- ── Footer Strip ─────────────────────────────────────────────── -->
      <div class="px-6 py-4 border-t border-stroke flex items-center justify-between gap-3 text-xs font-mono bg-bone/40">
        <span class="text-ink-tertiary tabular-nums">{{ formatTimestamp(post.createdAt) }}</span>
        <span class="text-ink font-sans font-medium text-xs flex items-center gap-2 group-hover:translate-x-0.5 transition-transform duration-200">
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
  if (props.layout === 'featured') return 'h-64 md:h-72'
  if (props.layout === 'tall') return 'h-60 md:h-68'
  if (props.layout === 'wide') return 'h-48 md:h-56'
  return 'h-48 md:h-52'
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


