<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="project" class="space-y-8">
        <RouterLink to="/projects" class="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Projects
        </RouterLink>

        <header class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-bold text-white">{{ project.title }}</h1>
          <p class="text-sm text-gray-400">Project Detail</p>
        </header>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <article class="card xl:col-span-2 overflow-hidden">
            <img
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.title"
              class="card__image h-80 md:h-[26rem]"
            />

            <div
              v-else
              class="h-80 md:h-[26rem] flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20"
            >
              <svg width="72" height="72" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="text-blue-400 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
          </article>

          <aside class="card p-6 xl:sticky xl:top-28 space-y-6">
            <section class="space-y-3">
              <h2 class="text-lg font-semibold text-white">Overview</h2>
              <div class="grid grid-cols-2 gap-3">
                <div class="border border-white/10 rounded-lg px-3 py-2 bg-white/[0.03]">
                  <p class="text-xs uppercase tracking-wider text-gray-500">Priority</p>
                  <p class="text-base font-semibold text-blue-300">{{ project.priority || 0 }}</p>
                </div>
                <div class="border border-white/10 rounded-lg px-3 py-2 bg-white/[0.03]">
                  <p class="text-xs uppercase tracking-wider text-gray-500">Duration</p>
                  <p class="text-base font-semibold text-gray-200">{{ project.duration || 'N/A' }}</p>
                </div>
              </div>
            </section>

            <section class="space-y-2">
              <h2 class="text-lg font-semibold text-white">Description</h2>
              <p class="text-gray-300 leading-7">{{ project.description }}</p>
            </section>

            <section class="space-y-3">
              <h2 class="text-lg font-semibold text-white">Technologies</h2>
              <div class="card__tags mb-0">
                <span v-for="tech in project.technologies" :key="tech" class="card__tag">{{ tech }}</span>
              </div>
            </section>

            <section class="space-y-3">
              <h2 class="text-lg font-semibold text-white">URLs</h2>

              <div v-if="hasProjectLinks" class="flex flex-col gap-2">
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="card__link"
                >
                  GitHub Repository
                </a>

                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="card__link"
                >
                  Live Demo
                </a>
              </div>

              <p v-else class="text-sm text-gray-500">No public URLs available.</p>
            </section>
          </aside>
        </div>

        <section v-if="relatedPost" class="card p-6 md:p-8 space-y-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p class="text-sm uppercase tracking-[0.12em] text-blue-300 mb-2">Related Blog</p>
              <h2 class="text-2xl font-bold text-white">{{ relatedPost.title }}</h2>
              <div class="card__tags mt-3 mb-0">
                <span v-for="tag in relatedPost.tags" :key="tag" class="card__tag">{{ tag }}</span>
              </div>
              <p class="text-gray-500 text-sm mt-3">Published {{ formatDate(relatedPost.createdAt) }}</p>
            </div>

            <RouterLink :to="`/blog/${relatedPost._id}`" class="card__link shrink-0">
              Open Full Post
            </RouterLink>
          </div>

          <!-- <img
            v-if="relatedPost.coverImage"
            :src="relatedPost.coverImage"
            :alt="relatedPost.title"
            class="w-full h-64 object-cover rounded-xl"
          /> -->

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blog-content" v-html="sanitizedRelatedContent" />
        </section>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-xl">Project not found.</p>
        <RouterLink to="/projects" class="btn btn--primary mt-4">Back to Projects</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useBlogStore } from '@/stores/blog'
import { useProjectsStore } from '@/stores/projects'
import type { BlogPost, Project } from '@/types'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getProjectDetailSeoMeta } from '@/utils/seoPriority'

const route = useRoute()
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
  project.value = fetchedProject
  relatedPost.value = null

  if (fetchedProject?.relatedBlogId) {
    relatedPost.value = await blogStore.fetchPost(fetchedProject.relatedBlogId)
  }

  if (fetchedProject) {
    applySeo({
      ...getProjectDetailSeoMeta(fetchedProject, relatedPost.value),
      url: `/projects/${id}`,
    })
  } else {
    applySeo({
      title: 'Project Not Found',
      description: 'The requested project does not exist or has been removed.',
      url: `/projects/${id}`,
      noindex: true,
    })
  }

  loading.value = false
}

watch(
  () => route.params.id,
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
  color: #d1d5db;
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

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-left: 1.25rem;
  margin-bottom: 1rem;
}

.blog-content :deep(ul) {
  list-style: disc;
}

.blog-content :deep(ol) {
  list-style: decimal;
}

.blog-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 3px solid rgba(59, 130, 246, 0.75);
  padding-left: 1rem;
  color: #93c5fd;
}

.blog-content :deep(pre) {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.blog-content :deep(a) {
  color: #93c5fd;
  text-decoration: underline;
}

.blog-content :deep(.image) {
  display: table;
  margin: 1.25rem auto;
}

.blog-content :deep(.image img) {
  border-radius: 0.75rem;
  max-width: 100%;
  height: auto;
}

.blog-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.blog-content :deep(th),
.blog-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 0.75rem;
}

.blog-content :deep(.media) {
  margin: 1.25rem 0;
}

.blog-content :deep(.rich-embed__ratio) {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.85);
}

.blog-content :deep(.rich-embed__ratio iframe) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
