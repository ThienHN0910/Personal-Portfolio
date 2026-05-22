<template>
  <div
    class="card project-card"
    :class="{ 'card--featured': project.featured, 'project-card--clickable': Boolean(project._id) }"
    role="link"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="project-card__media overflow-hidden">
      <img
        v-if="project.imageUrl"
        :src="project.imageUrl"
        :alt="project.title"
        class="card__image"
      />
      <div
        v-else
        class="card__image flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20"
      >
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-blue-400 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      </div>
      <div class="project-card__glow" />
      <span v-if="project.featured" class="project-card__badge">Featured</span>
    </div>

    <div class="card__body project-card__body">
      <h3 class="card__title">{{ project.title }}</h3>
      <p class="card__description" :class="{ 'card__description--expanded': isExpanded }">{{ project.description }}</p>
      <button
        v-if="canToggleDescription"
        type="button"
        class="card__link card__toggle"
        data-card-action="true"
        @click="toggleDescription"
      >
        {{ isExpanded ? 'View Less' : 'Read more' }}
      </button>

      <div class="card__tags">
        <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" class="card__tag">
          {{ tech }}
        </span>
        <span v-if="project.technologies.length > 4" class="card__tag">
          +{{ project.technologies.length - 4 }}
        </span>
      </div>
    </div>

    <div class="card__footer project-card__footer">
      <component
        v-for="action in actionItems"
        :key="action.key"
        :is="action.to ? RouterLink : 'a'"
        v-bind="action.to ? { to: action.to } : { href: action.href, target: '_blank', rel: 'noopener noreferrer' }"
        class="project-card__action"
        data-card-action="true"
        :aria-label="action.label"
        :title="action.label"
      >
        <IconGlyph :name="action.icon" :size="18" />
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

import IconGlyph from '@/components/ui/IconGlyph.vue'
import type { Project } from '@/types'

const props = defineProps<{
  project: Project
}>()

const router = useRouter()

const DESCRIPTION_TOGGLE_THRESHOLD = 120

const isExpanded = ref(false)

type ActionIcon = 'detail' | 'article' | 'repository' | 'external'

type CardAction = {
  key: string
  label: string
  icon: ActionIcon
  to?: string
  href?: string
}

const canToggleDescription = computed(() => props.project.description.length > DESCRIPTION_TOGGLE_THRESHOLD)

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

function toggleDescription(): void {
  isExpanded.value = !isExpanded.value
}

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
