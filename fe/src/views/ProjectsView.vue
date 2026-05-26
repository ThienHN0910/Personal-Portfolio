<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="text-center mb-12">
        <h1 class="section-title">
          My <span class="highlight">Projects</span>
        </h1>
        <p class="section-subtitle mx-auto">Explore my portfolio of web applications and open source projects.</p>
      </div>

      <div class="max-w-2xl mx-auto mb-8 space-y-4 glass-panel cut-corners p-4">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects, categories, technologies..."
            class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div class="flex flex-wrap gap-3 justify-center">
          <button
            class="btn btn--sm"
            :class="activeCategory === '' ? 'btn--primary' : 'btn--secondary'"
            @click="activeCategory = ''"
          >
            All
          </button>
          <button
            v-for="category in projectCategoryOptions"
            :key="category"
            class="btn btn--sm"
            :class="activeCategory === category ? 'btn--primary' : 'btn--secondary'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <LoadingSpinner v-if="initialLoading" />

      <div v-else-if="projectsStore.projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard v-for="project in projectsStore.projects" :key="project._id" :project="project" />
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useCategoriesStore } from '@/stores/categories'
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
const categoriesStore = useCategoriesStore()
const searchQuery = ref('')
const activeCategory = ref('')
const initialLoading = ref(true)
const loadingMore = ref(false)
const hasMoreProjects = ref(true)
const currentPage = ref(1)
const pageSize = 9
const sentinelRef = ref<HTMLDivElement | null>(null)
let pageObserver: IntersectionObserver | null = null
let searchDebounce: ReturnType<typeof setTimeout> | null = null

function disconnectObserver(): void {
  pageObserver?.disconnect()
  pageObserver = null
}

function resetPagination(): void {
  currentPage.value = 1
  hasMoreProjects.value = true
}

async function loadProjects(reset = false): Promise<void> {
  if (reset) {
    resetPagination()
  }

  const pagination = await projectsStore.fetchProjects({
    page: currentPage.value,
    limit: pageSize,
    query: searchQuery.value,
    category: activeCategory.value,
    append: !reset && currentPage.value > 1,
  })

  if (pagination) {
    currentPage.value = pagination.page
    hasMoreProjects.value = pagination.hasMore
  } else {
    hasMoreProjects.value = false
  }
}

async function loadNextPage(): Promise<void> {
  if (loadingMore.value || !hasMoreProjects.value) return

  loadingMore.value = true
  currentPage.value += 1
  const pagination = await projectsStore.fetchProjects({
    page: currentPage.value,
    limit: pageSize,
    query: searchQuery.value,
    category: activeCategory.value,
    append: true,
  })

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

const projectCategoryOptions = computed(() => categoriesStore.categorySettings.projectCategories)

watch([searchQuery, activeCategory], () => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(async () => {
    initialLoading.value = true
    await loadProjects(true)
    initialLoading.value = false
    await nextTick()
    setupObserver()
  }, 250)
})

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    loadProjects(true),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

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
  if (searchDebounce) clearTimeout(searchDebounce)
})
</script>
