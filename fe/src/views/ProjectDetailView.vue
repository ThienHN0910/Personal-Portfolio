<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="project" class="space-y-10">
        <!-- Breadcrumb Link -->
        <RouterLink to="/projects" class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95">
          <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Back to Projects Archive</span>
        </RouterLink>

        <!-- Header: Double Bezel -->
        <div class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-12 flex flex-col justify-between gap-6">
            <div class="flex flex-wrap items-center gap-2">
              <span class="eyebrow-tag">
                <span class="status-dot"></span>
                Case Study
              </span>
              <span v-if="project.featured" class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-amber text-pastel-amber-text uppercase font-medium">
                Featured Case
              </span>
            </div>

            <div class="space-y-4">
              <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.08] text-ink">
                {{ project.title }}
              </h1>

              <p class="text-base text-ink-secondary leading-relaxed max-w-3xl font-sans font-light">
                {{ project.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Project Media & Sidebar Specs Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <!-- Left Media / Showcase -->
          <div class="lg:col-span-8 editorial-card">
            <div class="editorial-card__inner overflow-hidden bg-bone border border-stroke p-0">
              <img
                v-if="project.imageUrl"
                :src="project.imageUrl"
                :alt="project.title"
                class="w-full h-auto max-h-[520px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
              />
              <div
                v-else
                class="h-80 flex items-center justify-center text-ink-tertiary bg-bone"
              >
                <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Right Sidebar Specs -->
          <aside class="lg:col-span-4 editorial-card lg:sticky lg:top-24">
            <div class="editorial-card__inner p-6 space-y-6">
              <h2 class="text-base font-serif font-light text-ink pb-3 border-b border-stroke">Technical Specifications</h2>

              <!-- Duration & Status -->
              <div class="grid grid-cols-2 gap-2">
                <div class="p-3 rounded-lg bg-bone border border-stroke">
                  <span class="text-[10px] font-mono uppercase text-ink-tertiary block">Duration</span>
                  <span class="text-xs font-mono text-ink mt-0.5 block tabular-nums">{{ project.duration || 'Ongoing' }}</span>
                </div>
                <div class="p-3 rounded-lg bg-bone border border-stroke">
                  <span class="text-[10px] font-mono uppercase text-ink-tertiary block">Status</span>
                  <span class="text-xs font-mono text-pastel-green-text mt-0.5 block font-medium">{{ project.liveUrl ? 'Active Live' : 'Completed' }}</span>
                </div>
              </div>

              <!-- Tech Stack -->
              <div class="space-y-2">
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Stack Matrix</span>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="px-2 py-0.5 rounded-sm bg-bone border border-stroke text-ink-secondary text-[11px] font-mono"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- External Links Buttons -->
              <div class="space-y-2 pt-2 border-t border-stroke">
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Deployment &amp; Code</span>

                <div v-if="hasProjectLinks" class="flex flex-col gap-2">
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group w-full py-2.5 px-4 rounded-md bg-ink text-surface font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-200"
                  >
                    <span>Launch Live Demo</span>
                    <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
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
                    class="w-full py-2.5 px-4 rounded-md bg-bone border border-stroke text-ink-secondary font-sans font-medium text-xs text-center hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all"
                  >
                    GitHub Repository
                  </a>
                </div>

                <p v-else class="text-xs text-ink-tertiary font-mono">No public links available.</p>
              </div>
            </div>
          </aside>
        </div>

        <!-- Related Blog Post -->
        <section v-if="relatedPost" class="editorial-card">
          <div class="editorial-card__inner p-6 sm:p-10 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stroke">
              <div>
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Related Article</span>
                <h2 class="text-xl font-serif font-light text-ink mt-1">{{ relatedPost.title }}</h2>
                <p class="text-xs text-ink-tertiary mt-1 font-mono tabular-nums">Published on {{ formatDate(relatedPost.createdAt) }}</p>
              </div>

              <RouterLink
                :to="`/blog/${relatedPost.slug || relatedPost._id}`"
                class="group px-4 py-2 rounded-md bg-ink text-surface text-xs font-sans font-medium hover:bg-ink/90 active:scale-[0.98] transition-all shrink-0 inline-flex items-center gap-1.5"
              >
                <span>Read Full Article</span>
                <span>→</span>
              </RouterLink>
            </div>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="blog-content font-light leading-relaxed text-ink-secondary text-sm" v-html="sanitizedRelatedContent" />
          </div>
        </section>
      </div>

      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-4">
          <p class="text-base text-ink font-serif font-normal">Project not found.</p>
          <RouterLink to="/projects" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-medium active:scale-[0.98] transition-all">
            ← Back to Projects Archive
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useBlogStore } from '@/stores/blog'
import { useProjectsStore } from '@/stores/projects'
import type { BlogPost, Project } from '@/types'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getProjectDetailSeoMeta } from '@/utils/seoPriority'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

const project = ref<Project | null>(null)
const relatedPost = ref<BlogPost | null>(null)
const loading = ref(true)
const hasProjectLinks = computed(() => Boolean(project.value?.githubUrl || project.value?.liveUrl))
const sanitizedRelatedContent = computed(() => {
  const html = relatedPost.value?.content || ''
  return sanitizeRichContent(html)
})

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function loadProject(id: string): Promise<void> {
  loading.value = true
  const fetchedProject = await projectsStore.fetchProject(id)

  if (fetchedProject) {
    if (fetchedProject.slug && fetchedProject.slug !== id) {
      void router.replace(`/projects/${fetchedProject.slug}`)
      return
    }
    project.value = fetchedProject
    relatedPost.value = null

    if (fetchedProject.relatedBlogId) {
      relatedPost.value = await blogStore.fetchPost(fetchedProject.relatedBlogId)
    }

    applySeo({
      ...getProjectDetailSeoMeta(fetchedProject, relatedPost.value),
      url: `/projects/${fetchedProject.slug || id}`,
      noindex: false,
    })
  } else {
    project.value = null
    relatedPost.value = null
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

<style scoped lang="scss">
.blog-content {
  color: #cbd5e1;
  line-height: 1.8;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4) {
  color: #f8fafc;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.blog-content :deep(p) {
  margin-bottom: 1rem;
}

.blog-content :deep(pre) {
  background: #090d16;
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}
</style>
