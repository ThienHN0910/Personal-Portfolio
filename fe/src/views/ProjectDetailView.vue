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

        <!-- ── Editorial Hero Header Card with Embedded System Spec Rail ── -->
        <header data-aos="fade-up" class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Header: Eyebrow, Title & Overview (Col 8) -->
            <div class="lg:col-span-8 space-y-6">
              <div class="flex items-center gap-3">
                <span class="eyebrow-tag">
                  <span class="status-dot"></span>
                  Architecture &amp; System Case Study
                </span>
                <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary tabular-nums">
                  Case #{{ project.slug || project._id?.slice(-4) }}
                </span>
              </div>

              <div class="space-y-4 max-w-3xl">
                <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
                  {{ project.title }}
                </h1>
                <p class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light">
                  {{ project.description }}
                </p>
              </div>
            </div>

            <!-- Right Header: System Spec Rail (Col 4) -->
            <div class="lg:col-span-4 p-5 rounded-xl bg-bone border border-stroke space-y-4 text-xs font-mono">
              <div class="flex items-center justify-between pb-2.5 border-b border-stroke">
                <span class="text-[10px] text-ink-tertiary uppercase tracking-widest">System Spec Rail</span>
                <span class="w-2 h-2 rounded-full" :class="project.liveUrl ? 'bg-pastel-green-text animate-pulse-soft' : 'bg-ink-tertiary'"></span>
              </div>

              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-ink-tertiary uppercase">Status</span>
                  <span class="text-pastel-green-text font-medium">{{ project.liveUrl ? 'Active in Prod' : 'Completed' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-ink-tertiary uppercase">Timeline</span>
                  <span class="text-ink tabular-nums">{{ project.duration || '3 months' }}</span>
                </div>
                <div v-if="project.categories && project.categories.length" class="space-y-1.5 pt-1 border-t border-stroke/60">
                  <span class="text-[10px] text-ink-tertiary uppercase block">Domain Classification</span>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="cat in project.categories"
                      :key="cat"
                      class="px-2 py-0.5 rounded bg-pastel-blue text-pastel-blue-text text-[10px] font-mono"
                    >
                      {{ cat }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- ── 2-Column Layout: Left Sticky Tech Stack & Right Main Canvas ── -->
        <div class="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8 items-start">
          <!-- ── LEFT STICKY RAIL: Tech Stack & System Actions ────────────── -->
          <aside data-aos="fade-right" data-aos-delay="100" class="xl:sticky xl:top-24 xl:self-start space-y-4">
            <div class="editorial-card">
              <div class="editorial-card__inner p-6 space-y-6">
                <div class="flex items-center justify-between pb-3 border-b border-stroke">
                  <h2 class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Tech Stack</h2>
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-amber-text"></span>
                </div>

                <!-- Technology Matrix -->
                <div class="space-y-2.5">
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Core Technologies</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tech in project.technologies"
                      :key="tech"
                      class="px-2.5 py-1 rounded bg-bone border border-stroke text-ink text-xs font-mono hover:border-ink/30 transition-colors"
                      data-cursor="explore"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Actions / Links -->
                <div class="space-y-2.5 pt-4 border-t border-stroke">
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="visit"
                    data-cursor-label="Visit"
                    class="group w-full py-3 px-4 rounded-md bg-ink text-surface font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
                  >
                    <span>Launch Live App</span>
                    <span class="w-4 h-4 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform">
                      <svg class="w-2 h-2" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                      </svg>
                    </span>
                  </a>

                  <a
                    v-if="project.githubUrl"
                    :href="project.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="code"
                    data-cursor-label="Code"
                    class="group w-full py-3 px-4 rounded-md bg-bone border border-stroke text-ink-secondary hover:text-ink hover:border-ink/30 font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
                  >
                    <span>Source Repository</span>
                    <span class="group-hover:translate-x-0.5 transition-transform">↗</span>
                  </a>

                  <RouterLink
                    to="/projects"
                    class="w-full py-2 px-3 text-center text-[11px] font-mono text-ink-tertiary hover:text-ink transition-colors block pt-2"
                  >
                    ← All Case Studies
                  </RouterLink>
                </div>
              </div>
            </div>
          </aside>

          <!-- ── RIGHT MAIN CANVAS: Image, Overview, Context Dossier ──────── -->
          <div class="space-y-8 min-w-0">
            <!-- Hero Image Frame -->
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

            <!-- Executive Overview Card -->
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

            <!-- Architecture Dossier Card -->
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
                  <div class="prose-editorial" v-html="sanitizedProjectContext" />
                </div>
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

        <!-- ── Related Case Studies & Connected Technical Articles ─────── -->
        <section v-if="relatedProjects.length || relatedArticles.length" class="space-y-8 pt-12 border-t border-stroke">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div class="space-y-1">
              <span class="eyebrow-tag">
                <span class="status-dot"></span>
                Connected Research &amp; Deployments
              </span>
              <h2 class="text-2xl sm:text-4xl font-serif font-light text-ink">Related Systems &amp; Publications</h2>
            </div>
            <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Dynamic Cross-Reference</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <!-- Related Projects -->
            <div
              v-for="relProj in relatedProjects"
              :key="relProj._id"
              class="editorial-card group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
            >
              <div class="editorial-card__inner p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="overflow-hidden rounded-md bg-bone border border-stroke aspect-[16/9] relative">
                    <img
                      v-if="relProj.imageUrl"
                      :src="relProj.imageUrl"
                      :alt="relProj.title"
                      class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-ink-tertiary text-xs font-mono">
                      Case Study
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-[10px] font-mono">
                    <span class="px-2 py-0.5 rounded bg-pastel-blue text-pastel-blue-text uppercase">Case Study</span>
                    <span class="text-ink-tertiary">{{ relProj.duration || '2025' }}</span>
                  </div>

                  <h3 class="font-serif text-lg font-medium text-ink group-hover:text-ink/80 transition-colors line-clamp-1">
                    {{ relProj.title }}
                  </h3>
                  <p class="text-xs text-ink-secondary line-clamp-2 font-sans font-light leading-relaxed">
                    {{ relProj.description }}
                  </p>
                </div>

                <div class="pt-3 border-t border-stroke/60 flex items-center justify-between text-xs font-mono">
                  <span class="text-[10px] text-ink-tertiary uppercase truncate max-w-[120px]">
                    {{ relProj.technologies?.[0] || 'System' }}
                  </span>
                  <RouterLink
                    :to="`/projects/${relProj.slug || relProj._id}`"
                    class="text-ink font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Case</span>
                    <span>↗</span>
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Related Articles -->
            <div
              v-for="relPost in relatedArticles"
              :key="relPost._id"
              class="editorial-card group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
            >
              <div class="editorial-card__inner p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="overflow-hidden rounded-md bg-bone border border-stroke aspect-[16/9] relative">
                    <img
                      v-if="relPost.coverImage"
                      :src="relPost.coverImage"
                      :alt="relPost.title"
                      class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-ink-tertiary text-xs font-mono">
                      Technical Article
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-[10px] font-mono">
                    <span class="px-2 py-0.5 rounded bg-pastel-green text-pastel-green-text uppercase">Article</span>
                    <span class="text-ink-tertiary">{{ relPost.categories?.[0] || 'Publication' }}</span>
                  </div>

                  <h3 class="font-serif text-lg font-medium text-ink group-hover:text-ink/80 transition-colors line-clamp-1">
                    {{ relPost.title }}
                  </h3>
                  <p class="text-xs text-ink-secondary line-clamp-2 font-sans font-light leading-relaxed">
                    {{ relPost.excerpt }}
                  </p>
                </div>

                <div class="pt-3 border-t border-stroke/60 flex items-center justify-between text-xs font-mono">
                  <span class="text-[10px] text-ink-tertiary uppercase truncate max-w-[120px]">
                    #{{ relPost.tags?.[0] || 'Guide' }}
                  </span>
                  <RouterLink
                    :to="`/blog/${relPost.slug || relPost._id}`"
                    class="text-ink font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Note</span>
                    <span>↗</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </section>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ImageLightboxModal from '@/components/ui/ImageLightboxModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useRichContentEnhancer } from '@/composables/useRichContentEnhancer'
import { useProjectsStore } from '@/stores/projects'
import { useBlogStore } from '@/stores/blog'
import type { Project } from '@/types'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getProjectDetailSeoMeta } from '@/utils/seoPriority'
import { getRelatedArticlesForProject, getRelatedProjectsForProject } from '@/utils/relatedRecommender'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const projectBodyRef = ref<HTMLElement | null>(null)

const { lightbox, closeLightbox, scheduleEnhance } = useRichContentEnhancer(projectBodyRef)

const sanitizedProjectContext = computed(() => {
  const raw = project.value?.context || ''
  return raw ? sanitizeRichContent(raw) : ''
})

const relatedProjects = computed(() => {
  if (!project.value) return []
  return getRelatedProjectsForProject(project.value, projectsStore.projects, 2)
})

const relatedArticles = computed(() => {
  if (!project.value) return []
  return getRelatedArticlesForProject(project.value, blogStore.posts, 2)
})

watch(sanitizedProjectContext, () => {
  scheduleEnhance()
})

onMounted(async () => {
  if (!projectsStore.projects.length) {
    void projectsStore.fetchProjects({ limit: 12 })
  }
  if (!blogStore.posts.length) {
    void blogStore.fetchPosts({ limit: 6 })
  }
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
