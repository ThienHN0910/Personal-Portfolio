<template>
  <RouterLink
    :to="`/blog/${post.slug || post._id}`"
    class="editorial-card spotlight-card group flex flex-col h-full active:scale-[0.99] transition-all duration-300"
    :class="[`blog-card--${layout}`]"
    data-cursor="read"
    data-cursor-label="Read"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div class="editorial-card__inner flex flex-col flex-1 p-0 overflow-hidden">
      <!-- ── Media / Cover Image Frame ────────────────────────────────── -->
      <div class="overflow-hidden relative bg-bone border-b border-stroke" :class="mediaClass">
        <template v-if="showTwoImages">
          <div class="grid grid-cols-2 w-full h-full gap-px bg-stroke">
            <img :src="galleryImages[0]" :alt="post.title" class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
            <img :src="galleryImages[1]" :alt="post.title" class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
          </div>
        </template>
        <template v-else>
          <img
            v-if="galleryImages.length"
            :src="galleryImages[0]"
            :alt="post.title"
            class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center bg-bone text-ink-tertiary gap-2.5 p-6 text-center"
          >
            <div class="w-10 h-10 rounded-full bg-canvas border border-stroke flex items-center justify-center text-ink-tertiary">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M6 6h10M6 10h10"/>
              </svg>
            </div>
            <span class="font-mono text-[11px] uppercase tracking-wider text-ink-secondary">Engineering Publication</span>
          </div>
        </template>

        <!-- Top Badges Overlay -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span v-if="post.categories && post.categories.length" class="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-pastel-green text-pastel-green-text uppercase font-medium shadow-sm backdrop-blur-sm">
            {{ post.categories[0] }}
          </span>
          <span v-else class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone/80 border border-stroke text-ink-tertiary backdrop-blur-sm">
            Article
          </span>

          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone/80 border border-stroke text-ink-tertiary tabular-nums backdrop-blur-sm">
            {{ estimatedReadTime }}
          </span>
        </div>
      </div>

      <!-- ── Body Core ────────────────────────────────────────────────── -->
      <div class="flex-1 flex flex-col justify-between p-6 sm:p-7 gap-5">
        <div class="space-y-3.5">
          <!-- Additional Categories if multiple -->
          <div v-if="post.categories && post.categories.length > 1" class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="category in post.categories.slice(1, 3)"
              :key="category"
              class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary uppercase tracking-wider font-medium"
            >
              {{ category }}
            </span>
          </div>

          <!-- Title & Excerpt -->
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-ink group-hover:text-ink/80 transition-colors leading-[1.15] tracking-tight">
            {{ post.title }}
          </h3>

          <p class="text-sm text-ink-secondary line-clamp-2 leading-relaxed font-sans font-light">
            {{ post.excerpt }}
          </p>
        </div>

        <!-- Tags Row -->
        <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="text-[10px] font-mono px-2.5 py-0.5 rounded bg-bone border border-stroke text-ink-secondary"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- ── Footer Strip ─────────────────────────────────────────────── -->
      <div class="px-6 sm:px-7 py-4 border-t border-stroke flex items-center justify-between gap-3 text-xs font-mono bg-bone/40">
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
import { RouterLink } from 'vue-router'
import { useSpotlight } from '@/composables/useSpotlight'
import { use3DTilt } from '@/composables/use3DTilt'
import type { BlogPost } from '@/types'

const { handleSpotlightMove } = useSpotlight()
const { handleTiltMove, handleTiltLeave } = use3DTilt({ maxTilt: 5, scale: 1.012 })

function onMouseMove(e: MouseEvent) {
  handleSpotlightMove(e)
  handleTiltMove(e)
}

function onMouseLeave(e: MouseEvent) {
  handleTiltLeave(e)
}

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
  if (props.layout === 'featured') return 'h-64 sm:h-80'
  if (props.layout === 'tall') return 'h-60 sm:h-72'
  if (props.layout === 'wide') return 'h-48 sm:h-60'
  return 'h-48 sm:h-56'
})

const estimatedReadTime = computed(() => {
  const content = props.post.content || props.post.excerpt || ''
  const words = content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
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
