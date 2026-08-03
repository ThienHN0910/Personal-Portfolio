<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%)]" />

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Page Header -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs mb-3">
          <span>TECHNICAL ARTICLES</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Articles & <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-indigo-400 to-violet-400">Engineering Insights</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base max-w-2xl leading-relaxed">
          In-depth articles covering Vue 3, TypeScript, web performance tuning, software architecture, and full-stack engineering practices by Hồ Ngọc Thiện (ThienHN).
        </p>
      </div>

      <!-- Search & Category Filters -->
      <div class="glass-panel p-4 sm:p-6 border border-cyber-border/30 shadow-glass-card space-y-4">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-cyan/60 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles, topics, tags (Vue 3, TypeScript, Performance...)"
            class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50 transition-all"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-mono transition-all border"
            :class="activeCategory === '' ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/50 font-bold' : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'"
            @click="activeCategory = ''"
          >
            All
          </button>
          <button
            v-for="category in blogCategoryOptions"
            :key="category"
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-mono transition-all border"
            :class="activeCategory === category ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/50 font-bold' : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="initialLoading" />

      <!-- Blog Grid -->
      <div
        v-else-if="blogStore.posts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <div
          v-for="(post, index) in blogStore.posts"
          :key="post._id"
        >
          <BlogCard :post="post" :layout="getMasonryLayout(index)" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="glass-panel p-12 text-center text-slate-400 font-mono">
        No articles found matching the selected search query or category.
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div ref="sentinelRef" class="flex justify-center py-8">
        <div v-if="hasMorePosts || loadingMore" class="glass-panel px-6 py-3 flex items-center gap-3 text-sm text-slate-300 font-mono">
          <LoadingSpinner v-if="loadingMore" />
          <span>{{ loadingMore ? 'Loading more articles...' : 'Scroll to load more' }}</span>
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
import BlogCard from '@/components/ui/BlogCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { applySeo } from '@/utils/seo'
import { getBlogSeoMeta } from '@/utils/seoPriority'

const blogStore = useBlogStore()
const homeStore = useHomeStore()
const aboutStore = useAboutStore()
const projectsStore = useProjectsStore()
const categoriesStore = useCategoriesStore()
const searchQuery = ref('')
const activeCategory = ref('')
const initialLoading = ref(true)
const loadingMore = ref(false)
const hasMorePosts = ref(true)
const currentPage = ref(1)
const pageSize = 6
const sentinelRef = ref<HTMLDivElement | null>(null)
let pageObserver: IntersectionObserver | null = null
let searchDebounce: ReturnType<typeof setTimeout> | null = null

function getMasonryLayout(index: number): 'featured' | 'tall' | 'wide' | 'standard' {
  if (index % 11 === 0) return 'featured'
  if (index % 5 === 0) return 'tall'
  if (index % 3 === 0) return 'wide'
  return 'standard'
}

function disconnectObserver(): void {
  pageObserver?.disconnect()
  pageObserver = null
}

function resetPagination(): void {
  currentPage.value = 1
  hasMorePosts.value = true
}

async function loadPosts(reset = false): Promise<void> {
  if (reset) {
    resetPagination()
  }

  const pagination = await blogStore.fetchPosts({
    page: currentPage.value,
    limit: pageSize,
    query: searchQuery.value,
    category: activeCategory.value,
    append: !reset && currentPage.value > 1,
  })

  if (pagination) {
    currentPage.value = pagination.page
    hasMorePosts.value = pagination.hasMore
  } else {
    hasMorePosts.value = false
  }
}

async function loadNextPage(): Promise<void> {
  if (loadingMore.value || !hasMorePosts.value) return

  loadingMore.value = true
  currentPage.value += 1
  const pagination = await blogStore.fetchPosts({
    page: currentPage.value,
    limit: pageSize,
    query: searchQuery.value,
    category: activeCategory.value,
    append: true,
  })

  if (pagination) {
    currentPage.value = pagination.page
    hasMorePosts.value = pagination.hasMore
  } else {
    hasMorePosts.value = false
  }

  loadingMore.value = false
}

function setupObserver(): void {
  disconnectObserver()

  if (!hasMorePosts.value || !sentinelRef.value || !('IntersectionObserver' in window)) return

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

const blogCategoryOptions = computed(() => categoriesStore.categorySettings.blogCategories)

watch([searchQuery, activeCategory], () => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(async () => {
    initialLoading.value = true
    await loadPosts(true)
    initialLoading.value = false
    await nextTick()
    setupObserver()
  }, 250)
})

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    loadPosts(true),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
  ])

  initialLoading.value = false
  await nextTick()
  setupObserver()

  applySeo({
    ...getBlogSeoMeta({
      posts: blogStore.posts,
      projects: projectsStore.projects,
      home: homeStore.homeData,
      about: aboutStore.aboutData,
    }),
    url: '/blog',
  })
})

onBeforeUnmount(() => {
  disconnectObserver()
  if (searchDebounce) clearTimeout(searchDebounce)
})
</script>
