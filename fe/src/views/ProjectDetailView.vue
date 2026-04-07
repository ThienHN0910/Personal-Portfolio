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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <article class="card" :class="project.relatedBlogId ? 'lg:col-span-2' : 'lg:col-span-3'">
            <img
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.title"
              class="card__image h-72"
            />

            <div class="card__body">
              <h1 class="text-3xl font-bold text-white mb-4">{{ project.title }}</h1>
              <p class="text-gray-300 leading-7 mb-5">{{ project.description }}</p>

              <div class="card__tags mb-0">
                <span v-for="tech in project.technologies" :key="tech" class="card__tag">{{ tech }}</span>
              </div>
            </div>

            <div class="card__footer">
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="card__link"
              >
                GitHub
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
          </article>

          <aside v-if="project.relatedBlogId" class="space-y-4">
            <h2 class="text-xl font-semibold text-white">Related Blog</h2>

            <BlogCard
              v-if="relatedPost"
              :post="relatedPost"
            />

            <div v-else class="card p-5 text-gray-400 text-sm">
              Related blog is unavailable.
            </div>
          </aside>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-xl">Project not found.</p>
        <RouterLink to="/projects" class="btn btn--primary mt-4">Back to Projects</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import BlogCard from '@/components/ui/BlogCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useBlogStore } from '@/stores/blog'
import { useProjectsStore } from '@/stores/projects'
import type { BlogPost, Project } from '@/types'

const route = useRoute()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

const project = ref<Project | null>(null)
const relatedPost = ref<BlogPost | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  const fetchedProject = await projectsStore.fetchProject(id)
  project.value = fetchedProject

  if (fetchedProject?.relatedBlogId) {
    relatedPost.value = await blogStore.fetchPost(fetchedProject.relatedBlogId)
  }

  loading.value = false
})
</script>
