<template>
  <section class="py-12">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs mb-2">
            <span>DỰ ÁN TIÊU BIỂU</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sản Phẩm & <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-indigo-400">Dự Án Đã Triển Khai</span>
          </h2>
        </div>

        <RouterLink
          to="/projects"
          class="inline-flex items-center gap-2 text-sm font-semibold text-cyber-cyan hover:text-white transition-colors group"
        >
          <span>Xem tất cả dự án</span>
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </RouterLink>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="featuredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <ProjectCard v-for="project in featuredProjects" :key="project._id" :project="project" />
      </div>

      <div v-else class="glass-panel p-8 text-center text-slate-400">
        Hiện chưa có dự án nổi bật nào được đánh dấu.
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
    void projectsStore.fetchProjects()
  }
})
</script>
