<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%)]" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="project" class="space-y-8">
        <!-- Breadcrumb Link -->
        <RouterLink to="/projects" class="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono group active:scale-95">
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Projects</span>
        </RouterLink>

        <!-- Header -->
        <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 uppercase font-semibold">
              Case Study
            </span>
            <span v-if="project.featured" class="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              ★ Featured Project
            </span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            {{ project.title }}
          </h1>

          <p class="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl border-l-2 border-cyan-400/60 pl-4 font-normal">
            {{ project.description }}
          </p>
        </div>

        <!-- Project Main Body & Sidebar Specs -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Media / Showcase -->
          <div class="lg:col-span-8 space-y-6">
            <div class="glass-panel overflow-hidden border border-cyber-border/40 rounded-2xl bg-slate-950 shadow-inner-glow">
              <img
                v-if="project.imageUrl"
                :src="project.imageUrl"
                :alt="project.title"
                class="w-full h-auto max-h-[520px] object-cover"
              />
              <div
                v-else
                class="h-80 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-cyan-400/30"
              >
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Right Sidebar Specs -->
          <aside class="lg:col-span-4 glass-panel p-6 border border-cyber-border/30 shadow-glass-card space-y-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold font-display text-white pb-3 border-b border-white/10">Technical Specifications</h2>

            <!-- Duration & Status -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner-glow">
                <span class="text-[10px] font-mono uppercase text-slate-400 block">Duration</span>
                <span class="text-sm font-bold text-slate-200 mt-1 block font-mono tabular-nums">{{ project.duration || 'Ongoing' }}</span>
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner-glow">
                <span class="text-[10px] font-mono uppercase text-slate-400 block">Status</span>
                <span class="text-sm font-semibold text-cyan-400 mt-1 block font-mono">{{ project.liveUrl ? 'Active Live' : 'Completed' }}</span>
              </div>
            </div>

            <!-- Tech Stack -->
            <div class="space-y-2.5">
              <span class="text-xs font-mono text-slate-400 uppercase block">Tech Stack</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-2.5 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 text-xs font-mono shadow-inner-glow"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- External Links Buttons -->
            <div class="space-y-3 pt-2">
              <span class="text-xs font-mono text-slate-400 uppercase block">Links & Repository</span>

              <div v-if="hasProjectLinks" class="flex flex-col gap-2.5">
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs font-mono text-center shadow-[0_4px_20px_-2px_rgba(0,229,255,0.4)] hover:shadow-[0_8px_28px_-2px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch Live Demo ↗</span>
                </a>

                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-semibold text-xs font-mono text-center hover:bg-white/10 hover:border-cyan-400/40 hover:text-cyan-400 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-inner-glow flex items-center justify-center gap-2"
                >
                  <span>GitHub Repository</span>
                </a>
              </div>

              <p v-else class="text-xs text-slate-500 font-mono">No public links available.</p>
            </div>
          </aside>
        </div>

        <!-- Related Blog Post -->
        <section v-if="relatedPost" class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-glass-card space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span class="text-xs font-mono text-cyan-400 uppercase font-semibold">RELATED TECHNICAL ARTICLE</span>
              <h2 class="text-2xl font-bold font-display text-white mt-1">{{ relatedPost.title }}</h2>
              <p class="text-xs text-slate-400 mt-1 font-mono tabular-nums">Published on {{ formatDate(relatedPost.createdAt) }}</p>
            </div>

            <RouterLink :to="`/blog/${relatedPost.slug || relatedPost._id}`" class="px-5 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono font-semibold hover:bg-cyan-400 hover:text-slate-950 active:scale-[0.98] transition-all shrink-0">
              Read Full Article →
            </RouterLink>
          </div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blog-content" v-html="sanitizedRelatedContent" />
        </section>
      </div>

      <div v-else class="glass-panel p-12 text-center text-slate-400 font-mono space-y-4">
        <p class="text-lg text-slate-200 font-sans font-medium">Project not found.</p>
        <RouterLink to="/projects" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 text-sm font-semibold hover:bg-cyan-400 hover:text-slate-950 active:scale-[0.98] transition-all">
          ← Back to Projects List
        </RouterLink>
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
