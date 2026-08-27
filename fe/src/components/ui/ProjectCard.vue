<template>
  <article
    class="glass-panel p-5 border border-cyber-border/30 hover:border-cyan-400/50 hover:shadow-cyan-glow-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full active:scale-[0.99]"
    :class="[
      `project-card--${layout}`,
      { 'border-cyan-400/40 bg-gradient-to-b from-cyan-950/20 via-slate-900/80 to-slate-950/90 shadow-cyan-glow': project.featured }
    ]"
    role="link"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <!-- Card Media & Thumbnail -->
    <div class="overflow-hidden rounded-xl relative mb-4 bg-slate-900 border border-white/10 shadow-inner-glow" :class="mediaClass">
      <template v-if="showTwoImages">
        <div class="flex flex-col w-full h-full">
          <img :src="galleryImages[0]" :alt="project.title" class="w-full object-cover h-1/2 group-hover:scale-105 transition duration-500" />
          <img :src="galleryImages[1]" :alt="project.title" class="w-full object-cover h-1/2 group-hover:scale-105 transition duration-500" />
        </div>
      </template>
      <template v-else>
        <img
          v-if="galleryImages.length"
          :src="galleryImages[0]"
          :alt="project.title"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-cyan-400/30"
        >
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
      </template>

      <!-- Overlay Badges -->
      <div v-if="project.featured" class="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span class="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          ★ FEATURED
        </span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <!-- Categories -->
        <div v-if="categoryPreview.length" class="flex flex-wrap items-center gap-1.5">
          <span
            v-for="category in categoryPreview"
            :key="category"
            class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
          >
            {{ category }}
          </span>
          <span v-if="categoryOverflowCount > 0" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
            +{{ categoryOverflowCount }}
          </span>
        </div>

        <!-- Title & Description -->
        <h3 class="text-lg font-bold font-display text-white group-hover:text-cyan-400 transition-colors leading-snug tracking-tight">
          {{ project.title }}
        </h3>

        <p class="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {{ project.description }}
        </p>
      </div>

      <!-- Tech Stack Badges -->
      <div class="flex flex-wrap gap-1.5 pt-2">
        <span
          v-for="tech in project.technologies.slice(0, 4)"
          :key="tech"
          class="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-inner-glow"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 4"
          class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10"
        >
          +{{ project.technologies.length - 4 }}
        </span>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
      <div class="flex items-center gap-1.5 text-xs font-mono text-slate-400">
        <span class="w-2 h-2 rounded-full" :class="project.liveUrl ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'"></span>
        <span class="tabular-nums">{{ project.liveUrl ? 'LIVE DEMO' : 'ARCHIVED' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <component
          v-for="action in actionItems"
          :key="action.key"
          :is="action.to ? RouterLink : 'a'"
          v-bind="action.to ? { to: action.to } : { href: action.href, target: '_blank', rel: 'noopener noreferrer' }"
          class="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all active:scale-95 shadow-inner-glow"
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

  if (props.project._id) {
    actions.push({
      key: 'detail',
      label: 'Project Case Study',
      icon: 'detail',
      to: `/projects/${props.project.slug || props.project._id}`,
    })
  }

  if (props.project.relatedBlogId) {
    actions.push({
      key: 'blog',
      label: 'Related Technical Article',
      icon: 'article',
      to: `/blog/${props.project.relatedBlogId}`,
    })
  }

  if (props.project.githubUrl) {
    actions.push({
      key: 'github',
      label: 'GitHub Repository',
      icon: 'repository',
      href: props.project.githubUrl,
    })
  }

  if (props.project.liveUrl) {
    actions.push({
      key: 'live',
      label: 'Live Production Demo',
      icon: 'external',
      href: props.project.liveUrl,
    })
  }

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