<template>
  <article
    class="card project-card glass-panel encrypted-file cut-corners glow-hover h-full flex flex-col"
    :class="[
      `project-card--${layout}`,
      { 'card--featured': project.featured, 'project-card--clickable': Boolean(project._id) },
    ]"
    role="link"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="project-card__media overflow-hidden relative" :class="mediaClass">
      <template v-if="showTwoImages">
        <div class="flex flex-col w-full h-full">
          <img :src="galleryImages[0]" :alt="project.title" class="w-full object-cover h-1/2" />
          <img :src="galleryImages[1]" :alt="project.title" class="w-full object-cover h-1/2" />
        </div>
      </template>
      <template v-else>
        <img
          v-if="galleryImages.length"
          :src="galleryImages[0]"
          :alt="project.title"
          class="card__image w-full h-full object-cover"
        />
        <div
          v-else
          class="card__image flex items-center justify-center"
          style="background: linear-gradient(135deg, rgba(0,242,255,0.03), rgba(112,0,255,0.03));"
        >
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-cyan-300 opacity-40">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
        </div>
      </template>

      <div class="scanline" aria-hidden="true"></div>
      <span class="absolute top-4 left-4 z-20 text-[10px] font-mono tracking-[0.2em] px-2 py-1 border border-white/10 bg-black/40 text-cyan-200 rounded">
        0x{{ projectCode }}
      </span>
      <span v-if="project.featured" class="absolute top-4 right-4 z-20 text-[10px] font-mono tracking-[0.2em] px-2 py-1 border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 rounded">
        PRIMARY
      </span>
    </div>

    <div class="card__body project-card__body flex-1 flex flex-col gap-4">
      <div v-if="categoryPreview.length" class="card__tags project-card__categories">
        <span
          v-for="category in categoryPreview"
          :key="category"
          class="card__tag card__tag--secondary text-[10px] tracking-[0.2em] font-mono px-2 py-1 bg-white/2 border border-white/6 rounded"
        >
          {{ category }}
        </span>
        <span v-if="categoryOverflowCount > 0" class="card__tag card__tag--secondary project-card__more-tag text-[10px] tracking-[0.2em] font-mono px-2 py-1 bg-white/2 border border-white/6 rounded">
          +{{ categoryOverflowCount }}
        </span>
      </div>

      <div class="space-y-3 flex-1">
            <h3 class="card__title font-os tracking-[0.18em] uppercase text-cyan-100">{{ project.title }}</h3>
            <p :class="['card__description font-mono text-sm text-gray-300 leading-relaxed', { 'card__description--expanded': descriptionExpanded }]">{{ project.description }}</p>
          </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in project.technologies.slice(0, 4)"
          :key="tech"
          class="text-[10px] font-mono text-cyan-100 bg-white/2 px-2 py-1 rounded border border-white/6"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 4"
          class="text-[10px] font-mono text-gray-300 bg-white/2 px-2 py-1 rounded border border-white/6"
        >
          +{{ project.technologies.length - 4 }}
        </span>
      </div>
    </div>

    <div class="card__footer project-card__footer mt-auto flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase">
        <span class="text-cyan-200">STATUS:</span>
        <span>{{ project.liveUrl ? 'DEPLOYED' : 'LOCAL' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <component
          v-for="action in actionItems"
          :key="action.key"
          :is="action.to ? RouterLink : 'a'"
          v-bind="action.to ? { to: action.to } : { href: action.href, target: '_blank', rel: 'noopener noreferrer' }"
          class="project-card__action p-2 rounded border border-white/6 bg-white/2 hover:border-cyan-300/40 hover:bg-cyan-300/10 transition-colors"
          data-card-action="true"
          :aria-label="action.label"
          :title="action.label"
        >
          <IconGlyph :name="action.icon" :size="16" />
        </component>
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

type CardAction = {
  key: string
  label: string
  icon: ActionIcon
  to?: string
  href?: string
}

const categoryPreview = computed(() => (props.project.categories || []).slice(0, CATEGORY_PREVIEW_LIMIT))
const categoryOverflowCount = computed(() => Math.max((props.project.categories || []).length - CATEGORY_PREVIEW_LIMIT, 0))
const projectCode = computed(() => (props.project._id ? props.project._id.slice(-4).toUpperCase() : '0000'))

const mediaClass = computed(() => {
  if (props.layout === 'featured') return 'h-64 md:h-96'
  if (props.layout === 'tall') return 'h-56 md:h-80'
  if (props.layout === 'wide') return 'h-52 md:h-64'
  return 'h-48 md:h-56'
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
const descriptionExpanded = computed(() => (props.layout === 'tall' || props.layout === 'featured') && galleryImages.value.length < 2)

const actionItems = computed<CardAction[]>(() => {
  const actions: CardAction[] = []

  if (props.project._id) {
    actions.push({
      key: 'detail',
      label: 'Project detail',
      icon: 'detail',
      to: `/projects/${props.project._id}`,
    })
  }

  if (props.project.relatedBlogId) {
    actions.push({
      key: 'blog',
      label: 'Related blog',
      icon: 'article',
      to: `/blog/${props.project.relatedBlogId}`,
    })
  }

  if (props.project.githubUrl) {
    actions.push({
      key: 'github',
      label: 'GitHub repository',
      icon: 'repository',
      href: props.project.githubUrl,
    })
  }

  if (props.project.liveUrl) {
    actions.push({
      key: 'live',
      label: 'Live demo',
      icon: 'external',
      href: props.project.liveUrl,
    })
  }

  return actions
})

function openDetail(): void {
  if (!props.project._id) return
  void router.push(`/projects/${props.project._id}`)
}

function handleCardClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null
  if (target?.closest('[data-card-action="true"]')) return
  openDetail()
}
</script>