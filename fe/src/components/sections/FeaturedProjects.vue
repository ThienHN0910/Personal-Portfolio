<template>
  <section ref="sectionEl" class="space-y-8">
    <!-- ── Section Header ──────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-2">
        <span class="eyebrow-tag">
          <span class="status-dot"></span>
          Selected Architectures
        </span>
        <h2
          class="font-serif text-3xl sm:text-5xl font-light tracking-[-0.03em] leading-tight text-ink reveal"
          :class="isVisible ? 'is-visible' : ''"
        >
          Featured case studies
          <span class="italic text-ink-secondary">&amp; deployments</span>
        </h2>
      </div>

      <RouterLink
        to="/projects"
        class="group self-start sm:self-auto inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-ink text-surface text-xs font-sans font-medium active:scale-[0.98] transition-transform duration-200 shrink-0"
      >
        <span>View Full Archive</span>
        <span class="w-5 h-5 rounded-full bg-surface/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
          <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
          </svg>
        </span>
      </RouterLink>
    </div>

    <!-- Divider Line -->
    <div class="w-full h-px bg-stroke"></div>

    <LoadingSpinner v-if="loading" />

    <!-- ── Asymmetric Projects Grid ────────────────────────────────── -->
    <div v-else-if="featuredProjects.length" class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div
        v-for="(project, index) in featuredProjects"
        :key="project._id"
        class="reveal"
        :class="[
          index === 0 ? 'lg:col-span-8' : (index === 1 ? 'lg:col-span-4' : 'lg:col-span-12'),
          isVisible ? 'is-visible' : ''
        ]"
        :style="`transition-delay: ${60 + index * 90}ms`"
      >
        <ProjectCard :project="project" :layout="index === 0 ? 'featured' : (index === 2 ? 'wide' : 'standard')" />
      </div>
    </div>

    <div v-else class="editorial-card">
      <div class="editorial-card__inner p-12 text-center text-ink-tertiary">
        <p class="font-mono text-xs">No featured projects found in archive.</p>
      </div>
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
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.05 }
  )
  if (sectionEl.value) observer.observe(sectionEl.value)
})
</script>

