<template>
  <RouterLink
    :to="`/blog/${post.slug || post._id}`"
    class="card block no-underline glass-panel cut-corners glow-hover h-full flex flex-col"
    :class="[`blog-card--${layout}`]"
  >
    <div class="relative overflow-hidden" :class="mediaClass">
      <template v-if="showTwoImages">
        <div class="flex flex-col w-full h-full">
          <img :src="galleryImages[0]" :alt="post.title" class="w-full object-cover h-1/2" />
          <img :src="galleryImages[1]" :alt="post.title" class="w-full object-cover h-1/2" />
        </div>
      </template>
      <template v-else>
        <img
          v-if="galleryImages.length"
          :src="galleryImages[0]"
          :alt="post.title"
          class="card__image w-full h-full object-cover"
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
      </template>

      <div class="scanline" aria-hidden="true"></div>
      <span class="absolute top-4 left-4 z-20 text-[10px] font-mono tracking-[0.2em] px-2 py-1 border border-white/10 bg-black/40 text-cyan-200 rounded">
        0x{{ postCode }}
      </span>
      <span class="absolute top-4 right-4 z-20 text-[10px] font-mono tracking-[0.2em] px-2 py-1 border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 rounded uppercase">
        TRANSMISSION
      </span>
    </div>

    <div class="card__body flex-1 flex flex-col gap-4">
      <div class="card__tags mb-3">
        <span v-for="category in (post.categories || []).slice(0, 2)" :key="category" class="card__tag font-mono text-[10px] tracking-[0.2em] text-cyan-100 bg-white/2 border border-white/6 rounded px-2 py-1">{{ category }}</span>
      </div>
      <h3 class="card__title font-os tracking-[0.18em] uppercase text-cyan-100">{{ post.title }}</h3>
      <p :class="['card__description font-mono text-sm text-gray-300 scanning-text leading-relaxed', { 'card__description--expanded': descriptionExpanded }]">{{ post.excerpt }}</p>
      <div class="card__tags card__tags--after-description">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="card__tag font-mono text-[10px] tracking-[0.2em] px-2 py-1 bg-white/2 border border-white/6 rounded">{{ tag }}</span>
      </div>
    </div>

    <div class="card__footer flex items-center justify-between gap-3 mt-auto">
      <span class="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">{{ formatTimestamp(post.createdAt) }}</span>
      <span class="card__link font-mono text-cyan-200 text-[10px] tracking-[0.2em] uppercase">Read more</span>
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

const postCode = computed(() => (props.post._id ? props.post._id.slice(-4).toUpperCase() : '0000'))

const mediaClass = computed(() => {
  if (props.layout === 'featured') return 'h-64 md:h-96'
  if (props.layout === 'tall') return 'h-56 md:h-80'
  if (props.layout === 'wide') return 'h-52 md:h-64'
  return 'h-48 md:h-56'
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
const descriptionExpanded = computed(() => (props.layout === 'tall' || props.layout === 'featured') && galleryImages.value.length < 2)

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatTimestamp(date?: string): string {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} | ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>
