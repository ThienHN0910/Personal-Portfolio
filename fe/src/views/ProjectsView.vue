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

      <LoadingSpinner v-if="initialLoading" />

      <div v-else-if="filteredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard v-for="project in filteredProjects" :key="project._id" :project="project" />
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        No projects found.
      </div>

      <div ref="sentinelRef" class="flex justify-center py-10">
        <div v-if="hasMoreProjects || loadingMore" class="flex items-center gap-3 text-sm text-gray-400">
          <LoadingSpinner v-if="loadingMore" />
          <span>{{ loadingMore ? 'Loading more projects...' : 'Scroll to load more' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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
const initialLoading = ref(true)
const loadingMore = ref(false)
const hasMoreProjects = ref(true)
const currentPage = ref(1)
const pageSize = 9
const sentinelRef = ref<HTMLDivElement | null>(null)
let pageObserver: IntersectionObserver | null = null

function disconnectObserver(): void {
  pageObserver?.disconnect()
  pageObserver = null
}

async function loadNextPage(): Promise<void> {
  if (loadingMore.value || !hasMoreProjects.value) return

  loadingMore.value = true
  const nextPage = currentPage.value + 1
  const pagination = await projectsStore.fetchProjects({ page: nextPage, limit: pageSize, append: true })

  if (pagination) {
    currentPage.value = pagination.page
    hasMoreProjects.value = pagination.hasMore
  } else {
    hasMoreProjects.value = false
  }

  loadingMore.value = false
}

function setupObserver(): void {
  disconnectObserver()

  if (!hasMoreProjects.value || !sentinelRef.value || !('IntersectionObserver' in window)) return

  pageObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        void loadNextPage()
      }
    },
    { rootMargin: '400px 0px' },
  )

  pageObserver.observe(sentinelRef.value)
}

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
  const [projectsPagination] = await Promise.all([
    projectsStore.fetchProjects({ page: 1, limit: pageSize }),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  currentPage.value = 1
  hasMoreProjects.value = projectsPagination?.hasMore ?? false
  initialLoading.value = false

  await nextTick()
  setupObserver()

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

onBeforeUnmount(() => {
  disconnectObserver()
})
</script>
