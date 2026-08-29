<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
      <!-- ── Page Header: Avant-Garde Editorial Architecture ─────────── -->
      <header class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-14 flex flex-col justify-between gap-8">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Selected Engineering Archive
            </span>
            <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest tabular-nums">
              {{ projectsStore.projects.length }} Case Studies Indexed
            </span>
          </div>

          <div class="space-y-4 max-w-3xl">
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
              Case studies &amp;
              <span class="block italic text-ink-secondary mt-1">production architectures</span>
            </h1>
            <p class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light max-w-2xl">
              Production-grade web platforms, scalable backend services, and interactive user interfaces engineered with Vue 3, TypeScript, and Node.js.
            </p>
          </div>
        </div>
      </header>

      <!-- ── Filter & Search Control Center ──────────────────────────── -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-5 sm:p-6 space-y-4">
          <!-- Search Input -->
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search projects, technologies, architectures (Vue 3, TypeScript, Node.js, AWS...)"
              class="w-full pl-11 pr-4 py-3 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/40 transition-all"
            />
          </div>

          <!-- Filter Pills -->
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-md text-xs font-mono transition-all border active:scale-95 duration-200 inline-flex items-center gap-1.5"
              :class="activeCategory === '' ? 'bg-ink text-surface border-ink font-medium shadow-sm' : 'bg-bone text-ink-secondary border-stroke hover:border-ink/20 hover:text-ink'"
              @click="activeCategory = ''"
            >
              <span>All Cases</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full tabular-nums" :class="activeCategory === '' ? 'bg-surface/20 text-surface' : 'bg-canvas text-ink-tertiary'">
                {{ projectsStore.projects.length }}
              </span>
            </button>
            <button
              v-for="category in projectCategoryOptions"
              :key="category"
              type="button"
              class="px-3.5 py-1.5 rounded-md text-xs font-mono transition-all border active:scale-95 duration-200 inline-flex items-center gap-1.5"
              :class="activeCategory === category ? 'bg-ink text-surface border-ink font-medium shadow-sm' : 'bg-bone text-ink-secondary border-stroke hover:border-ink/20 hover:text-ink'"
              @click="activeCategory = category"
            >
              <span>{{ category }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ── Projects Grid Showcase: Asymmetric Broken Masonry ───────── -->
      <LoadingSpinner v-if="initialLoading" />

      <div
        v-else-if="projectsStore.projects.length"
        class="grid grid-cols-1 md:grid-cols-12 gap-5"
      >
        <div
          v-for="(project, index) in projectsStore.projects"
          :key="project._id"
          :class="[
            index % 6 === 0 ? 'col-span-12 xl:col-span-7' :
            index % 6 === 1 ? 'col-span-12 xl:col-span-5' :
            index % 6 === 2 ? 'col-span-12 md:col-span-5 xl:col-span-4' :
            index % 6 === 3 ? 'col-span-12 md:col-span-7 xl:col-span-8' :
            index % 6 === 4 ? 'col-span-12 xl:col-span-8' :
                               'col-span-12 xl:col-span-4'
          ]"
        >
          <ProjectCard :project="project" :layout="getMasonryLayout(index)" />
        </div>
      </div>


      <!-- Empty State -->
      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-3">
          <div class="w-10 h-10 rounded-full bg-bone border border-stroke flex items-center justify-center text-ink-tertiary mx-auto">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p class="text-base text-ink font-serif font-normal">No case studies matching your criteria</p>
          <p class="text-xs text-ink-tertiary font-mono">Try adjusting your query or resetting category filters.</p>
        </div>
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div ref="sentinelRef" class="flex justify-center py-6">
        <div v-if="hasMoreProjects || loadingMore" class="editorial-card">
          <div class="editorial-card__inner px-6 py-2.5 flex items-center gap-3 text-xs text-ink-secondary font-mono">
            <LoadingSpinner v-if="loadingMore" size="sm" />
            <span class="tabular-nums">{{ loadingMore ? 'Loading next case studies...' : 'Scroll to load more' }}</span>
          </div>
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

function getMasonryLayout(index: number): 'featured' | 'tall' | 'wide' | 'standard' {
  if (index % 11 === 0) return 'featured'
  if (index % 5 === 0) return 'tall'
  if (index % 3 === 0) return 'wide'
  return 'standard'
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