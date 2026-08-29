<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="project" class="space-y-10">
        <!-- Top Nav & Breadcrumb Bar -->
        <div class="flex items-center justify-between gap-4">
          <RouterLink
            to="/projects"
            class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Case Studies</span>
          </RouterLink>

          <div class="flex items-center gap-2">
            <span v-if="project.featured" class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-amber text-pastel-amber-text uppercase font-medium">
              Featured Architecture
            </span>
            <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary tabular-nums">
              Case #{{ project.slug || project._id?.slice(-4) }}
            </span>
          </div>
        </div>

        <!-- ── Editorial Hero Header Card ──────────────────────────────── -->
        <header class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-14 flex flex-col justify-between gap-8">
            <div class="flex items-center justify-between gap-3">
              <span class="eyebrow-tag">
                <span class="status-dot"></span>
                Architecture &amp; System Case Study
              </span>
              <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">
                {{ project.duration || '2025 – 2026' }}
              </span>
            </div>

            <div class="space-y-4 max-w-4xl">
              <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
                {{ project.title }}
              </h1>
              <p class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light max-w-3xl">
                {{ project.description }}
              </p>
            </div>

            <!-- Header Quick Spec Strip -->
            <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stroke text-xs font-mono">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-ink-tertiary">Core Technologies:</span>
                <span
                  v-for="tech in (project.technologies || []).slice(0, 5)"
                  :key="tech"
                  class="px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink text-[11px]"
                >
                  {{ tech }}
                </span>
                <span v-if="(project.technologies || []).length > 5" class="text-ink-tertiary">
                  +{{ project.technologies.length - 5 }} more
                </span>
              </div>

              <div class="flex items-center gap-3">
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ink text-surface font-sans font-medium text-xs active:scale-[0.98] transition-all"
                >
                  <span>Launch Live App</span>
                  <span class="w-4 h-4 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                    <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                    </svg>
                  </span>
                </a>

                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-2 rounded-md bg-bone border border-stroke text-ink-secondary hover:text-ink font-sans font-medium text-xs transition-colors"
                >
                  Repository
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- ── Main Showcase Grid: Asymmetric Split ────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- Left / Main Column: Media & Case Content (Col 8) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Main Hero Image Frame -->
            <div class="editorial-card">
              <div class="editorial-card__inner overflow-hidden bg-bone border border-stroke p-0">
                <img
                  v-if="project.imageUrl"
                  :src="project.imageUrl"
                  :alt="project.title"
                  class="w-full h-auto max-h-[560px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                />
                <div
                  v-else
                  class="h-80 flex flex-col items-center justify-center gap-3 text-ink-tertiary bg-bone"
                >
                  <svg class="w-12 h-12 text-ink-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
                  </svg>
                  <span class="font-mono text-xs">Production Architecture Showcase</span>
                </div>
              </div>
            </div>

            <!-- Additional Gallery Images if available -->
            <div v-if="galleryImages.length > 1" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="(img, idx) in galleryImages.slice(1)"
                :key="idx"
                class="editorial-card"
              >
                <div class="editorial-card__inner overflow-hidden bg-bone border border-stroke p-0 aspect-[16/10]">
                  <img
                    :src="img"
                    :alt="`${project.title} gallery frame ${idx + 2}`"
                    class="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <!-- Deep Dive / Technical Overview Body -->
            <div v-if="sanitizedProjectContent" class="editorial-card">
              <div ref="projectBodyRef" class="editorial-card__inner p-8 sm:p-12">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div class="prose-editorial" v-html="sanitizedProjectContent" />
              </div>
            </div>
          </div>

          <ImageLightboxModal
            :is-open="lightbox.isOpen"
            :src="lightbox.src"
            :alt="lightbox.alt"
            :caption="lightbox.caption"
            @close="closeLightbox"
          />

          <!-- Right Column: Sticky Spec Rail & Metrics (Col 4) -->
          <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <!-- Specs Card -->
            <div class="editorial-card">
              <div class="editorial-card__inner p-6 space-y-6">
                <div class="flex items-center justify-between pb-3 border-b border-stroke">
                  <h2 class="text-sm font-mono uppercase tracking-widest text-ink-tertiary">System Spec Rail</h2>
                  <span class="w-1.5 h-1.5 rounded-full" :class="project.liveUrl ? 'bg-pastel-green-text animate-pulse-soft' : 'bg-ink-tertiary'"></span>
                </div>

                <!-- Status & Lifecycle -->
                <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div class="p-3 rounded-lg bg-bone border border-stroke">
                    <span class="text-[10px] text-ink-tertiary uppercase block">Status</span>
                    <span class="text-ink mt-1 block font-medium">{{ project.liveUrl ? 'Active in Prod' : 'Completed' }}</span>
                  </div>
                  <div class="p-3 rounded-lg bg-bone border border-stroke">
                    <span class="text-[10px] text-ink-tertiary uppercase block">Timeline</span>
                    <span class="text-ink mt-1 block tabular-nums">{{ project.duration || '2025' }}</span>
                  </div>
                </div>

                <!-- Category Tags -->
                <div v-if="project.categories && project.categories.length" class="space-y-2">
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Domain Classification</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="cat in project.categories"
                      :key="cat"
                      class="px-2.5 py-1 rounded-full bg-pastel-blue text-pastel-blue-text text-[10px] font-mono tracking-wide"
                    >
                      {{ cat }}
                    </span>
                  </div>
                </div>

                <!-- Technology Matrix -->
                <div class="space-y-2">
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Technologies &amp; Libraries</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tech in project.technologies"
                      :key="tech"
                      class="px-2 py-0.5 rounded bg-bone border border-stroke text-ink-secondary text-[11px] font-mono"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Actions / Links -->
                <div class="space-y-2 pt-3 border-t border-stroke">
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group w-full py-2.5 px-4 rounded-md bg-ink text-surface font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <span class="w-4 h-4 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                      <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </a>

                  <a
                    v-if="project.githubUrl"
                    :href="project.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full py-2.5 px-4 rounded-md bg-bone border border-stroke text-ink-secondary font-sans font-medium text-xs text-center hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all block"
                  >
                    View Source Code
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-4">
          <p class="text-base text-ink font-serif font-normal">Case study not found.</p>
          <RouterLink to="/projects" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-medium active:scale-[0.98] transition-all">
            ← Return to Case Studies Archive
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ImageLightboxModal from '@/components/ui/ImageLightboxModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useRichContentEnhancer } from '@/composables/useRichContentEnhancer'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getProjectDetailSeoMeta } from '@/utils/seoPriority'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const projectBodyRef = ref<HTMLElement | null>(null)

const { lightbox, closeLightbox, scheduleEnhance } = useRichContentEnhancer(projectBodyRef)

const sanitizedProjectContent = computed(() => {
  const raw = (project.value as any)?.content || (project.value as any)?.details || project.value?.description || ''
  return sanitizeRichContent(raw)
})

watch(sanitizedProjectContent, () => {
  scheduleEnhance()
})

const rawProject = computed(() => project.value as any)
const galleryImages = computed<string[]>(() => {
  if (!rawProject.value) return []
  const imgs: string[] = []
  if (rawProject.value.imageUrl) imgs.push(rawProject.value.imageUrl)
  if (Array.isArray(rawProject.value.images) && rawProject.value.images.length) {
    for (const img of rawProject.value.images) {
      if (typeof img === 'string' && !imgs.includes(img)) imgs.push(img)
    }
  }
  if (rawProject.value.secondaryImage && !imgs.includes(rawProject.value.secondaryImage)) {
    imgs.push(rawProject.value.secondaryImage)
  }
  return imgs
})

async function loadProject(id: string): Promise<void> {
  loading.value = true
  const fetchedProject = await projectsStore.fetchProject(id)

  if (fetchedProject) {
    if (fetchedProject.slug && fetchedProject.slug !== id) {
      void router.replace(`/projects/${fetchedProject.slug}`)
      return
    }
    project.value = fetchedProject

    applySeo({
      ...getProjectDetailSeoMeta(fetchedProject),
      url: `/projects/${fetchedProject.slug || id}`,
      noindex: false,
    })
  } else {
    project.value = null
    applySeo({
      title: 'Project Details',
      description: 'Project case study details.',
      url: `/projects/${id}`,
      noindex: false,
    })
  }

  loading.value = false
}

watch(
  () => route.params.slug,
  (value) => {
    if (typeof value === 'string' && value) {
      void loadProject(value)
    }
  },
  { immediate: true },
)
</script>

