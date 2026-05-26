<template>
  <div class="section min-h-screen pt-24 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_36%),radial-gradient(circle_at_85%_20%,rgba(112,0,255,0.08),transparent_28%)]" />
    <div class="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(0,242,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.8)_1px,transparent_1px)] bg-[size:40px_40px]" />

    <div class="container relative z-10">
      <div class="glass-panel cut-corners p-6 md:p-8 mb-8">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="status-dot"></span>
            <span class="font-mono text-xs tracking-[0.2em] text-cyan-300 uppercase">Projects</span>
          </div>
          <div>
            <h1 class="section-title mb-3 font-os text-cyan-100 uppercase tracking-[0.16em]">
              My <span class="highlight">Projects</span>
            </h1>
            <p class="section-subtitle max-w-2xl text-gray-300">
              Explore my portfolio of web applications and open source projects.
            </p>
          </div>
        </div>
      </div>

      <div class="glass-panel cut-corners p-4 md:p-5 mb-8">
        <div class="grid gap-4">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300/60 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects, categories, technologies..."
              class="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-md text-white placeholder-gray-500 font-mono focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/30"
            />
          </div>

          <div class="flex flex-wrap gap-3 justify-center">
            <button
              class="btn btn--sm font-label-caps"
              :class="activeCategory === '' ? 'btn--primary' : 'btn--secondary'"
              @click="activeCategory = ''"
            >
              All
            </button>
            <button
              v-for="category in projectCategoryOptions"
              :key="category"
              class="btn btn--sm font-label-caps"
              :class="activeCategory === category ? 'btn--primary' : 'btn--secondary'"
              @click="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="initialLoading" />

      <div
        v-else-if="projectsStore.projects.length"
        class="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[minmax(220px,auto)] grid-flow-dense"
      >
        <div
          v-for="(project, index) in projectsStore.projects"
          :key="project._id"
          :class="getTileClass(index)"
        >
          <ProjectCard :project="project" :layout="getProjectLayout(index)" />
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-400 font-mono">
        No projects found.
      </div>

      <div ref="sentinelRef" class="flex justify-center py-10">
        <div v-if="hasMoreProjects || loadingMore" class="glass-panel cut-corners px-5 py-3 flex items-center gap-3 text-sm text-gray-300 font-mono">
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

function getProjectLayout(index: number): 'featured' | 'tall' | 'wide' | 'standard' {
  if (index === 0) return 'featured'
  if (index === 1) return 'tall'
  if (index === 2) return 'wide'
  return 'standard'
}

function getTileClass(index: number): string {
  const base = 'group'

  if (index === 0) return `${base} md:col-span-8 md:row-span-2`
  if (index === 1) return `${base} md:col-span-4 md:row-span-1`
  if (index === 2) return `${base} md:col-span-6 md:row-span-1`
  if (index === 3) return `${base} md:col-span-6 md:row-span-1`
  return `${base} md:col-span-4`
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