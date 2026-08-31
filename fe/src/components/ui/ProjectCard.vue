<template>
  <article
    class="editorial-card spotlight-card flex flex-col group cursor-pointer h-full active:scale-[0.99] transition-all duration-300"
    role="link"
    tabindex="0"
    data-cursor="view"
    data-cursor-label="View"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="handleCardClick"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="editorial-card__inner flex flex-col flex-1 p-0 overflow-hidden">
      <!-- ── Card Media Frame ─────────────────────────────────────────── -->
      <div class="overflow-hidden relative bg-bone border-b border-stroke" :class="mediaClass">
        <template v-if="showTwoImages">
          <div class="grid grid-cols-2 w-full h-full gap-px bg-stroke">
            <img :src="galleryImages[0]" :alt="project.title" class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
            <img :src="galleryImages[1]" :alt="project.title" class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
          </div>
        </template>
        <template v-else>
          <img
            v-if="galleryImages.length"
            :src="galleryImages[0]"
            :alt="project.title"
            class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center bg-bone text-ink-tertiary gap-2.5 p-6 text-center"
          >
            <div class="w-10 h-10 rounded-full bg-canvas border border-stroke flex items-center justify-center text-ink-tertiary">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
              </svg>
            </div>
            <span class="font-mono text-[11px] uppercase tracking-wider text-ink-secondary">Production Architecture Showcase</span>
          </div>
        </template>

        <!-- Top Badges Overlay -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span v-if="project.featured" class="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-pastel-amber text-pastel-amber-text uppercase font-medium shadow-sm backdrop-blur-sm">
            Featured Architecture
          </span>
          <span v-else class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone/80 border border-stroke text-ink-tertiary backdrop-blur-sm">
            #{{ project.slug || project._id?.slice(-4) }}
          </span>

          <span v-if="project.duration" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone/80 border border-stroke text-ink-tertiary tabular-nums backdrop-blur-sm">
            {{ project.duration }}
          </span>
        </div>
      </div>

      <!-- ── Card Body Core ───────────────────────────────────────────── -->
      <div class="flex-1 flex flex-col justify-between p-6 sm:p-7 gap-5">
        <div class="space-y-3.5">
          <!-- Category Row -->
          <div v-if="categoryPreview.length" class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="category in categoryPreview"
              :key="category"
              class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-blue text-pastel-blue-text uppercase tracking-wide font-medium"
            >
              {{ category }}
            </span>
            <span v-if="categoryOverflowCount > 0" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bone border border-stroke text-ink-tertiary">
              +{{ categoryOverflowCount }}
            </span>
          </div>

          <!-- Title & Description -->
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-ink group-hover:text-ink/80 transition-colors leading-[1.15] tracking-tight">
            {{ project.title }}
          </h3>

          <p class="text-sm text-ink-secondary line-clamp-2 leading-relaxed font-sans font-light">
            {{ project.description }}
          </p>
        </div>

        <!-- Tech Stack Chips -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tech in project.technologies.slice(0, 4)"
            :key="tech"
            class="text-[10px] font-mono px-2.5 py-1 rounded bg-bone border border-stroke text-ink-secondary"
          >
            {{ tech }}
          </span>
          <span
            v-if="project.technologies.length > 4"
            class="text-[10px] font-mono px-2 py-1 rounded bg-bone border border-stroke text-ink-tertiary"
          >
            +{{ project.technologies.length - 4 }}
          </span>
        </div>
      </div>

      <!-- ── Card Footer Action Strip ─────────────────────────────────── -->
      <div class="px-6 sm:px-7 py-4 border-t border-stroke flex items-center justify-between gap-3 bg-bone/40">
        <div class="flex items-center gap-2 text-[10px] font-mono text-ink-secondary">
          <span class="w-1.5 h-1.5 rounded-full" :class="project.liveUrl ? 'bg-pastel-green-text animate-pulse-soft' : 'bg-ink-tertiary'"></span>
          <span class="uppercase tracking-wider font-medium">{{ project.liveUrl ? 'Active In Prod' : 'Completed' }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <component
            v-for="action in actionItems"
            :key="action.key"
            :is="action.to ? RouterLink : 'a'"
            v-bind="action.to ? { to: action.to } : { href: action.href, target: '_blank', rel: 'noopener noreferrer' }"
            class="w-7 h-7 rounded-md bg-bone border border-stroke text-ink-secondary hover:text-ink hover:border-ink/30 hover:bg-bone/80 flex items-center justify-center transition-all duration-200 active:scale-95"
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
import { useSpotlight } from '@/composables/useSpotlight'
import { use3DTilt } from '@/composables/use3DTilt'
import type { Project } from '@/types'

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
  if (props.layout === 'featured') return 'h-64 sm:h-80'
  if (props.layout === 'tall') return 'h-60 sm:h-72'
  if (props.layout === 'wide') return 'h-48 sm:h-60'
  return 'h-48 sm:h-56'
})

const galleryImages = computed(() => {
  const imgs: string[] = []
  if (props.project.imageUrl) imgs.push(props.project.imageUrl)
  return imgs
})

const showTwoImages = computed(() => galleryImages.value.length >= 2 && (props.layout === 'tall' || props.layout === 'featured'))

const actionItems = computed<CardAction[]>(() => {
  const items: CardAction[] = []
  if (props.project.liveUrl) {
    items.push({
      key: 'live',
      label: 'Launch Live Application',
      icon: 'external',
      href: props.project.liveUrl,
    })
  }
  if (props.project.githubUrl) {
    items.push({
      key: 'github',
      label: 'View Source Code',
      icon: 'repository',
      href: props.project.githubUrl,
    })
  }
  items.push({
    key: 'detail',
    label: 'Explore Architecture Dossier',
    icon: 'detail',
    to: `/projects/${props.project.slug || props.project._id}`,
  })
  return items
})

function openDetail(): void {
  void router.push(`/projects/${props.project.slug || props.project._id}`)
}

function handleCardClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null
  if (target?.closest('[data-card-action="true"]')) return
  openDetail()
}
</script>
