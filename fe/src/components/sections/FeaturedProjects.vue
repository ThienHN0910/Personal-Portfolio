<template>
  <section ref="sectionEl" class="py-0">
    <!-- Section header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div class="space-y-1">
        <span class="eyebrow-tag">Selected Work</span>
        <h2
          class="font-serif text-3xl sm:text-4xl font-light tracking-[-0.025em] leading-tight text-ink mt-2 reveal"
          :class="isVisible ? 'is-visible' : ''"
        >
          Featured projects
          <span class="italic text-ink-secondary">& engineering</span>
        </h2>
      </div>

      <RouterLink
        to="/projects"
        class="group self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-sm font-sans font-medium active:scale-[0.98] transition-transform duration-200 shrink-0"
      >
        <span>View All Projects</span>
        <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
          </svg>
        </span>
      </RouterLink>
    </div>

    <!-- Horizontal rule divider -->
    <div class="w-full h-px bg-stroke mb-8 reveal" :class="isVisible ? 'is-visible' : ''" style="transition-delay: 60ms"></div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="featuredProjects.length" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div
        v-for="(project, index) in featuredProjects"
        :key="project._id"
        class="reveal"
        :class="[
          index === 0 ? 'lg:col-span-8' : 'lg:col-span-4',
          isVisible ? 'is-visible' : ''
        ]"
        :style="`transition-delay: ${80 + index * 100}ms`"
      >
        <ProjectCard :project="project" :layout="index === 0 ? 'featured' : 'standard'" />
      </div>
    </div>

    <div v-else class="py-12 text-center">
      <p class="font-mono text-sm text-ink-tertiary">No featured projects marked yet.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const loading = computed(() => projectsStore.loading)
const featuredProjects = computed(() => projectsStore.projects.filter((p) => p.featured).slice(0, 3))

const sectionEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!projectsStore.projects.length) {
    void projectsStore.fetchProjects()
  }
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { isVisible.value = true; observer.disconnect() } },
    { threshold: 0.05 }
  )
  if (sectionEl.value) observer.observe(sectionEl.value)
})
</script>
