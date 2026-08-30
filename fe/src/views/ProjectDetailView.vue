<template>
  <div class="min-h-[100dvh] bg-canvas">
    <!-- Outer balanced canvas wrapper -->
    <div class="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="project" class="space-y-8">
        <!-- Top Nav & Breadcrumb Bar -->
        <div class="flex items-center justify-between gap-4 px-2">
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
          </div>
        </header>

        <!-- ── 3-Column Sticky Rail Layout ────────────────────────────── -->
        <!--
          xl+:  [220px sticky left rail] [flex-1 center] [200px sticky right rail]
          < xl: stacks single-column: left rail → center → right rail
        -->
        <div class="xl:grid xl:grid-cols-[220px_1fr_200px] xl:items-start xl:gap-0">

          <!-- ── LEFT RAIL: System Spec Rail (sticky) ──────────────────── -->
          <aside
            class="xl:sticky xl:top-24 xl:self-start
                   xl:pr-4 xl:pl-1
                   space-y-4
                   mb-6 xl:mb-0"
          >
            <div class="editorial-card">
              <div class="editorial-card__inner p-5 space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-stroke">
                  <h2 class="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary">System Spec Rail</h2>
                  <span class="w-1.5 h-1.5 rounded-full" :class="project.liveUrl ? 'bg-pastel-green-text animate-pulse-soft' : 'bg-ink-tertiary'"></span>
                </div>

                <!-- Status & Lifecycle -->
                <div class="grid grid-cols-1 gap-2 text-xs font-mono">
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
              </div>
            </div>
          </aside>

          <!-- ── CENTER: Main Editorial Content ────────────────────────── -->
          <div class="xl:px-8 space-y-8 min-w-0">
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

            <!-- ── Executive Overview Card ──────────────────────────────── -->
            <div class="editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 space-y-4">
                <div class="flex items-center gap-2 pb-3 border-b border-stroke">
                  <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse-soft"></span>
                  <span class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Executive Overview</span>
                </div>
                <div class="text-ink-secondary text-base sm:text-lg leading-relaxed font-sans font-light">
                  <p class="whitespace-pre-line">{{ project.description }}</p>
                </div>
              </div>
            </div>

            <!-- ── Architecture Dossier Card (if context exists) ───────── -->
            <div v-if="sanitizedProjectContext" class="editorial-card">
              <div class="editorial-card__inner p-8 sm:p-12 space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-stroke">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-green-400"></span>
                      <span class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">System Architecture Dossier</span>
                    </div>
                    <p class="text-xs text-ink-tertiary font-mono">Technical Context &amp; Engineering Seams</p>
                  </div>
                </div>

                <div ref="projectBodyRef">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="prose-editorial" v-html="sanitizedProjectContext" />
                </div>
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

          <!-- ── RIGHT RAIL: Tech Stack + CTA (sticky) ──────────────────── -->
          <aside
            class="xl:sticky xl:top-24 xl:self-start
                   xl:pl-4 xl:pr-1
                   space-y-4
                   mt-6 xl:mt-0"
          >
            <div class="editorial-card">
              <div class="editorial-card__inner p-5 space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-stroke">
                  <h2 class="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary">Tech Stack</h2>
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-amber-text"></span>
                </div>

                <!-- Technology Matrix -->
                <div class="space-y-2">
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Core Technologies</span>
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
                    class="w-full py-2.5 px-4 rounded-md bg-bone border border-stroke text-ink-secondary font-sans font-medium text-xs text-center hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all block"
                  >
                    Repository
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

const sanitizedProjectContext = computed(() => {
  const raw = project.value?.context || ''
  return raw ? sanitizeRichContent(raw) : ''
})

watch(sanitizedProjectContext, () => {
  scheduleEnhance()
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
      title: 'Case Study Details',
      description: 'Production architecture case study and engineering breakdown.',
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
