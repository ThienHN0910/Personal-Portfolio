<template>
  <section class="py-10">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 bento-card border-2 border-cyber-cyan/30 bg-slate-950/80 shadow-[4px_4px_0px_0px_rgba(0,242,255,0.2)]">
        <div>
          <div class="brutal-badge mb-2">
            <span>FEATURED SHOWCASE</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-indigo-400">Projects & Engineering</span>
          </h2>
        </div>

        <RouterLink
          to="/projects"
          class="px-4 py-2 rounded-xl bg-cyber-cyan/10 border-2 border-cyber-cyan/40 text-cyber-cyan font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyber-cyan hover:text-slate-950 transition-all shadow-[2px_2px_0px_0px_#00f2ff] inline-flex items-center gap-2"
        >
          <span>View All Projects</span>
          <span>→</span>
        </RouterLink>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="featuredProjects.length" class="bento-grid">
        <div
          v-for="(project, index) in featuredProjects"
          :key="project._id"
          :class="[
            index === 0 ? 'col-span-12 lg:col-span-8' : 'col-span-12 md:col-span-6 lg:col-span-4'
          ]"
        >
          <ProjectCard :project="project" :layout="index === 0 ? 'featured' : 'standard'" />
        </div>
      </div>

      <div v-else class="bento-card p-8 text-center text-slate-400 font-mono text-xs">
        No featured projects currently marked.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const loading = computed(() => projectsStore.loading)
const featuredProjects = computed(() => projectsStore.projects.filter((p) => p.featured).slice(0, 3))

onMounted(() => {
  if (!projectsStore.projects.length) {
    void projectsStore.fetchProjects()
  }
})
</script>
