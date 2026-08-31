<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="w-full max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-14 space-y-12 sm:space-y-16">

      <!-- ── Page Header: Avant-Garde Editorial Masthead ─────────────── -->
      <header class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-14 flex flex-col justify-between gap-8">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Selected Engineering Archive
            </span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary tabular-nums">
                {{ projectsStore.projects.length }} Case Studies Indexed
              </span>
              <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-amber text-pastel-amber-text uppercase font-medium">
                Production Ready
              </span>
            </div>
          </div>

          <div class="space-y-4 max-w-4xl">
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
              Case studies &amp;
              <span class="block italic text-ink-secondary mt-1">production architectures</span>
            </h1>
            <p class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light max-w-3xl">
              Production-grade web platforms, scalable backend services, distributed systems, and interactive user interfaces engineered with Vue 3, TypeScript, Node.js, and Cloud Infrastructure.
            </p>
          </div>

          <!-- Quick Metrics Bar (Dynamic Telemetry) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stroke text-xs font-mono">
            <div class="p-3 rounded-lg bg-bone border border-stroke space-y-1">
              <span class="text-[10px] text-ink-tertiary uppercase">Catalog Total</span>
              <span class="text-ink text-sm font-medium block tabular-nums">{{ projectsStore.projects.length }} Architectures</span>
            </div>
            <div class="p-3 rounded-lg bg-bone border border-stroke space-y-1">
              <span class="text-[10px] text-ink-tertiary uppercase">Primary Stack</span>
              <span class="text-ink text-sm font-medium block truncate">{{ primaryStack }}</span>
            </div>
            <div class="p-3 rounded-lg bg-bone border border-stroke space-y-1">
              <span class="text-[10px] text-ink-tertiary uppercase">Category Filter</span>
              <span class="text-pastel-blue-text text-sm font-medium block truncate">{{ activeCategory || 'All Disciplines' }}</span>
            </div>
            <div class="p-3 rounded-lg bg-bone border border-stroke space-y-1">
              <span class="text-[10px] text-ink-tertiary uppercase">Status Check</span>
              <span class="text-pastel-green-text text-sm font-medium block truncate">
                {{ liveDeployedCount > 0 ? `${liveDeployedCount} Live Deployed` : '100% Verified' }}
              </span>
            </div>
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
              placeholder="Search case studies, technologies, architectures (Vue 3, TypeScript, Node.js, Cloud, Docker...)"
              class="w-full pl-11 pr-10 py-3 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/40 transition-all"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-bone border border-stroke text-ink-tertiary hover:text-ink flex items-center justify-center text-xs transition-colors"
              @click="searchQuery = ''"
            >
              ✕
            </button>
          </div>

          <!-- Filter Pills -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-md text-xs font-mono transition-all border active:scale-95 duration-200 inline-flex items-center gap-2"
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

      <!-- ── Projects Grid Showcase: Asymmetric Broken Bento ─────────── -->
      <LoadingSpinner v-if="initialLoading" />

      <div
        v-else-if="projectsStore.projects.length"
        ref="projectsGridRef"
        class="grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-8"
      >
        <div
          v-for="(project, index) in projectsStore.projects"
          :key="project._id"
          :class="[
            index % 6 === 0 ? 'col-span-12 xl:col-span-8' :
            index % 6 === 1 ? 'col-span-12 xl:col-span-4' :
            index % 6 === 2 ? 'col-span-12 md:col-span-5 xl:col-span-5' :
            index % 6 === 3 ? 'col-span-12 md:col-span-7 xl:col-span-7' :
            index % 6 === 4 ? 'col-span-12 xl:col-span-6' :
                               'col-span-12 xl:col-span-6'
          ]"
        >
          <ProjectCard :project="project" :layout="getMasonryLayout(index)" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 sm:p-16 text-center text-ink-tertiary space-y-4 max-w-lg mx-auto">
          <div class="w-12 h-12 rounded-full bg-bone border border-stroke flex items-center justify-center text-ink-tertiary mx-auto">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p class="text-lg text-ink font-serif font-light">No case studies matching your criteria</p>
          <p class="text-xs text-ink-secondary font-mono leading-relaxed">
            Try adjusting your search query or reset your domain filter to view the complete catalog.
          </p>
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-ink text-surface text-xs font-mono font-medium active:scale-95 transition-all"
            @click="searchQuery = ''; activeCategory = ''"
          >
            Reset All Filters
          </button>
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
import { useScrollReveal } from '@/composables/useScrollReveal'
import { applySeo } from '@/utils/seo'
import { getProjectsSeoMeta } from '@/utils/seoPriority'

const projectsStore = useProjectsStore()
const homeStore = useHomeStore()
const { reveal } = useScrollReveal()
const projectsGridRef = ref<HTMLElement | null>(null)
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

const primaryStack = computed(() => {
  const counts: Record<string, number> = {}
  projectsStore.projects.forEach((p) => {
    p.technologies?.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tech]) => tech)
  return top.length ? top.join(' · ') : 'Vue 3 · TS · Node'
})

const liveDeployedCount = computed(() => {
  return projectsStore.projects.filter((p) => Boolean(p.liveUrl)).length
})

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
    if (projectsGridRef.value && projectsGridRef.value.children.length) {
      reveal(Array.from(projectsGridRef.value.children), { y: 30, stagger: 0.08, duration: 0.65, scale: 0.98 })
    }
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
  if (projectsGridRef.value && projectsGridRef.value.children.length) {
    reveal(Array.from(projectsGridRef.value.children), { y: 30, stagger: 0.08, duration: 0.65, scale: 0.98 })
  }

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