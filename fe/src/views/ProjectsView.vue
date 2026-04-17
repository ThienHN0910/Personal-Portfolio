<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="text-center mb-12">
        <h1 class="section-title">
          My <span class="highlight">Projects</span>
        </h1>
        <p class="section-subtitle mx-auto">Explore my portfolio of web applications and open source projects.</p>
      </div>

      <!-- Filter -->
      <div class="flex flex-wrap gap-3 justify-center mb-10">
        <button
          class="btn btn--sm"
          :class="activeFilter === '' ? 'btn--primary' : 'btn--secondary'"
          @click="activeFilter = ''"
        >
          All
        </button>
        <button
          v-for="tech in allTechnologies"
          :key="tech"
          class="btn btn--sm"
          :class="activeFilter === tech ? 'btn--primary' : 'btn--secondary'"
          @click="activeFilter = tech"
        >
          {{ tech }}
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="filteredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard v-for="project in filteredProjects" :key="project._id" :project="project" />
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        No projects found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { applySeo } from '@/utils/seo'
import { getProjectsSeoMeta } from '@/utils/seoPriority'

const projectsStore = useProjectsStore()
const homeStore = useHomeStore()
const aboutStore = useAboutStore()
const blogStore = useBlogStore()
const activeFilter = ref('')
const loading = computed(() => projectsStore.loading)

const allTechnologies = computed(() => {
  const techs = new Set<string>()
  projectsStore.projects.forEach((p) => p.technologies.forEach((t) => techs.add(t)))
  return Array.from(techs).slice(0, 10)
})

const filteredProjects = computed(() =>
  activeFilter.value
    ? projectsStore.projects.filter((p) => p.technologies.includes(activeFilter.value))
    : projectsStore.projects,
)

onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  applySeo({
    ...getProjectsSeoMeta({
      projects: projectsStore.projects,
      home: homeStore.homeData,
      about: aboutStore.aboutData,
      posts: blogStore.posts,
    }),
    url: '/projects',
  })
})
</script>
