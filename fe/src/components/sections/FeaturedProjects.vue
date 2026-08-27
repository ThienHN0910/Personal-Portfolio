<template>
  <section class="py-10">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 sm:p-8 border border-cyber-border/30 shadow-cyan-glow">
        <div>
          <div class="brutal-badge mb-2">
            <span>FEATURED SHOWCASE</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Featured <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Projects & Engineering</span>
          </h2>
        </div>

        <RouterLink
          to="/projects"
          class="px-5 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-inner-glow hover:shadow-[0_4px_20px_rgba(0,229,255,0.4)] active:scale-[0.98] inline-flex items-center gap-2 shrink-0"
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
