<template>
  <section class="section bg-dark">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="section-title">
          Featured <span class="highlight">Projects</span>
        </h2>
        <p class="section-subtitle mx-auto">
          A selection of my best work. Check out the projects page for more.
        </p>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="featuredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project._id"
          :project="project"
        />
      </div>

      <div v-else class="text-center py-12 text-gray-500">
        No featured projects yet.
      </div>

      <div class="text-center mt-10">
        <RouterLink to="/projects" class="btn btn--outline btn--lg">
          View All Projects
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const projectsStore = useProjectsStore()
const loading = computed(() => projectsStore.loading)
const featuredProjects = computed(() => projectsStore.projects.filter((p) => p.featured).slice(0, 3))

onMounted(() => {
  if (!projectsStore.projects.length) {
    projectsStore.fetchProjects()
  }
})
</script>
