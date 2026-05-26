<template>
  <section class="section">
    <div class="container">
      <div class="text-center mb-8">
        <div class="glass-panel cut-corners p-4 inline-block">
          <h2 class="section-title mb-0">Featured <span class="highlight">Projects</span></h2>
          <p class="section-subtitle mt-1 text-sm">A selection of my best work.</p>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="featuredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard v-for="project in featuredProjects" :key="project._id" :project="project" />
      </div>

      <div v-else class="text-center py-12 text-gray-500">
        No featured projects yet.
      </div>

      <div class="text-center mt-10">
        <RouterLink to="/projects" class="btn btn--outline btn--lg font-os">View All Projects</RouterLink>
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
