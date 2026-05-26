<template>
  <div
      class="card project-card glass-panel encrypted-file cut-corners glitch-hover"
      :class="{ 'card--featured': project.featured, 'project-card--clickable': Boolean(project._id) }"
      role="link"
      tabindex="0"
      @click="handleCardClick"
      @keydown.enter.prevent="openDetail"
      @keydown.space.prevent="openDetail"
    >
      <div class="project-card__media overflow-hidden relative">
        <img
          v-if="project.imageUrl"
          :src="project.imageUrl"
          :alt="project.title"
          class="card__image"
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

        <div class="scanline" aria-hidden="true"></div>
        <span v-if="project.featured" class="project-card__badge text-xs px-2 py-1 bg-cyan-900/20 border border-white/6 rounded">FEATURED</span>
      </div>

      <div class="card__body project-card__body">
        <div v-if="categoryPreview.length" class="card__tags mb-3 project-card__categories">
          <span v-for="category in categoryPreview" :key="category" class="card__tag card__tag--secondary text-xs tracking-wider font-mono px-2 py-1 bg-white/2 border border-white/6 rounded">
            {{ category }}
          </span>
          <span v-if="categoryOverflowCount > 0" class="card__tag card__tag--secondary project-card__more-tag text-xs">+{{ categoryOverflowCount }}</span>
        </div>

        <h3 class="card__title font-os tracking-wider text-cyan-200">{{ project.title }}</h3>
        <p class="card__description font-mono text-sm text-gray-300">{{ project.description }}</p>

        <div class="mt-3 flex gap-2 flex-wrap">
          <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" class="text-xs font-mono text-cyan-100 bg-white/2 px-2 py-1 rounded">{{ tech }}</span>
          <span v-if="project.technologies.length > 4" class="text-xs font-mono text-gray-300 px-2 py-1 rounded">+{{ project.technologies.length - 4 }}</span>
        </div>
      </div>

      <div class="card__footer project-card__footer flex items-center gap-3">
        <div class="flex-1 text-xs text-gray-400 font-mono">TECH: {{ project.technologies?.length || 0 }} • CATEGORIES: {{ (project.categories || []).length }} • STATUS: <span class="text-cyan-300">{{ project.liveUrl ? 'DEPLOYED' : 'LOCAL' }}</span></div>

        <div class="flex items-center gap-2">
          <component
            v-for="action in actionItems"
            :key="action.key"
            :is="action.to ? RouterLink : 'a'"
            v-bind="action.to ? { to: action.to } : { href: action.href, target: '_blank', rel: 'noopener noreferrer' }"
            class="project-card__action p-2 rounded border border-white/6 bg-white/2"
            data-card-action="true"
            :aria-label="action.label"
            :title="action.label"
          >
            <IconGlyph :name="action.icon" :size="16" />
          </component>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

import IconGlyph from '@/components/ui/IconGlyph.vue'
import type { Project } from '@/types'

const props = defineProps<{
  project: Project
}>()

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
