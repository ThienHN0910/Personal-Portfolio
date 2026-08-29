<template>
  <article
    class="editorial-card flex flex-col group cursor-pointer h-full active:scale-[0.99] transition-transform duration-200"
    :class="project.featured ? 'ring-0' : ''"
    role="link"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="editorial-card__inner flex flex-col flex-1 p-0">
      <!-- Card Media -->
      <div class="overflow-hidden relative bg-bone border-b border-stroke" :class="mediaClass">
        <template v-if="showTwoImages">
          <div class="flex flex-col w-full h-full">
            <img :src="galleryImages[0]" :alt="project.title" class="w-full object-cover h-1/2 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
            <img :src="galleryImages[1]" :alt="project.title" class="w-full object-cover h-1/2 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
          </div>
        </template>
        <template v-else>
          <img
            v-if="galleryImages.length"
            :src="galleryImages[0]"
            :alt="project.title"
            class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <!-- Code icon — thin SVG, monochrome -->
            <svg class="w-10 h-10 text-ink-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
              <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
            </svg>
          </div>
        </template>

        <!-- Featured badge -->
        <div v-if="project.featured" class="absolute top-3 left-3 z-10">
          <span class="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-pastel-amber text-pastel-amber-text uppercase font-medium">
            Featured
          </span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="flex-1 flex flex-col justify-between p-5 gap-4">
        <div class="space-y-2.5">
          <!-- Categories -->
          <div v-if="categoryPreview.length" class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="category in categoryPreview"
              :key="category"
              class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-blue text-pastel-blue-text uppercase tracking-wide"
            >
              {{ category }}
            </span>
            <span v-if="categoryOverflowCount > 0" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone border border-stroke text-ink-tertiary">
              +{{ categoryOverflowCount }}
            </span>
          </div>

          <!-- Title & Description -->
          <h3 class="text-base font-sans font-semibold text-ink group-hover:text-ink/70 transition-colors duration-300 leading-snug tracking-tight">
            {{ project.title }}
          </h3>

          <p class="text-sm text-ink-secondary line-clamp-2 leading-relaxed font-light">
            {{ project.description }}
          </p>
        </div>

        <!-- Tech Stack -->
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tech in project.technologies.slice(0, 4)"
            :key="tech"
            class="text-[10px] font-mono px-2.5 py-0.5 rounded-sm bg-bone border border-stroke text-ink-secondary"
          >
            {{ tech }}
          </span>
          <span
            v-if="project.technologies.length > 4"
            class="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-bone border border-stroke text-ink-tertiary"
          >
            +{{ project.technologies.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="px-5 py-3.5 border-t border-stroke flex items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 text-[10px] font-mono text-ink-secondary">
          <span class="w-1.5 h-1.5 rounded-full" :class="project.liveUrl ? 'bg-pastel-green-text animate-pulse-soft' : 'bg-ink-tertiary'"></span>
          <span class="uppercase tracking-wide">{{ project.liveUrl ? 'Live' : 'Archived' }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <component
            v-for="action in actionItems"
            :key="action.key"
            :is="action.to ? RouterLink : 'a'"
            v-bind="action.to ? { to: action.to } : { href: action.href, target: '_blank', rel: 'noopener noreferrer' }"
            class="w-7 h-7 rounded-md bg-bone border border-stroke text-ink-secondary hover:text-ink hover:border-ink/20 hover:bg-bone/80 flex items-center justify-center transition-all duration-200 active:scale-95"
            data-card-action="true"
            :aria-label="action.label"
            :title="action.label"
          >
            <IconGlyph :name="action.icon" :size="13" />
          </component>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

import IconGlyph from '@/components/ui/IconGlyph.vue'
import type { Project } from '@/types'

const props = withDefaults(
  defineProps<{
    project: Project
    layout?: 'featured' | 'tall' | 'wide' | 'standard'
  }>(),
  {
    layout: 'standard',
  },
)

const router = useRouter()
const CATEGORY_PREVIEW_LIMIT = 2

type ActionIcon = 'detail' | 'article' | 'repository' | 'external'
type CardAction = { key: string; label: string; icon: ActionIcon; to?: string; href?: string }

const categoryPreview = computed(() => (props.project.categories || []).slice(0, CATEGORY_PREVIEW_LIMIT))
const categoryOverflowCount = computed(() => Math.max((props.project.categories || []).length - CATEGORY_PREVIEW_LIMIT, 0))

const mediaClass = computed(() => {
  if (props.layout === 'featured') return 'h-56 md:h-64'
  if (props.layout === 'tall') return 'h-52 md:h-60'
  if (props.layout === 'wide') return 'h-44 md:h-52'
  return 'h-44 md:h-48'
})

const rawProject = props.project as any
const galleryImages = computed(() => {
  const imgs: string[] = []
  if (rawProject.imageUrl) imgs.push(rawProject.imageUrl)
  if (Array.isArray(rawProject.images) && rawProject.images.length) {
    for (const i of rawProject.images) {
      if (imgs.length >= 2) break
      if (typeof i === 'string') imgs.push(i)
    }
  }
  if (rawProject.secondaryImage && imgs.length < 2) imgs.push(rawProject.secondaryImage)
  return imgs
})

const showTwoImages = computed(() => galleryImages.value.length >= 2 && (props.layout === 'tall' || props.layout === 'featured'))

const actionItems = computed<CardAction[]>(() => {
  const actions: CardAction[] = []
  if (props.project._id) actions.push({ key: 'detail', label: 'Project Case Study', icon: 'detail', to: `/projects/${props.project.slug || props.project._id}` })
  if (props.project.relatedBlogId) actions.push({ key: 'blog', label: 'Related Article', icon: 'article', to: `/blog/${props.project.relatedBlogId}` })
  if (props.project.githubUrl) actions.push({ key: 'github', label: 'GitHub Repository', icon: 'repository', href: props.project.githubUrl })
  if (props.project.liveUrl) actions.push({ key: 'live', label: 'Live Demo', icon: 'external', href: props.project.liveUrl })
  return actions
})

function openDetail(): void {
  if (!props.project._id) return
  void router.push(`/projects/${props.project.slug || props.project._id}`)
}

function handleCardClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null
  if (target?.closest('[data-card-action="true"]')) return
  openDetail()
}
</script>

