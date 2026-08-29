<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
      <!-- ── Page Header: Avant-Garde Editorial Architecture ─────────── -->
      <header class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-14 flex flex-col justify-between gap-8">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Engineering Publications &amp; Insights
            </span>
            <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest tabular-nums">
              {{ blogStore.posts.length }} Articles Published
            </span>
          </div>

          <div class="space-y-4 max-w-3xl">
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
              Technical writings &amp;
              <span class="block italic text-ink-secondary mt-1">architectural notes</span>
            </h1>
            <p class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light max-w-2xl">
              Deep dives on Vue 3 reactivity internals, TypeScript system design patterns, web performance, and developer productivity by Hồ Ngọc Thiện.
            </p>
          </div>
        </div>
      </header>

      <!-- ── Search & Topic Filters ──────────────────────────────────── -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-5 sm:p-6 space-y-4">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search articles, technical topics, keywords (Vue 3, TypeScript, Performance...)"
              class="w-full pl-11 pr-4 py-3 rounded-lg bg-bone border border-stroke text-ink placeholder-ink-tertiary font-sans text-sm focus:outline-none focus:border-ink/40 transition-all"
            />
          </div>

          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-md text-xs font-mono transition-all border active:scale-95 duration-200 inline-flex items-center gap-1.5"
              :class="activeCategory === '' ? 'bg-ink text-surface border-ink font-medium shadow-sm' : 'bg-bone text-ink-secondary border-stroke hover:border-ink/20 hover:text-ink'"
              @click="activeCategory = ''"
            >
              <span>All Topics</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full tabular-nums" :class="activeCategory === '' ? 'bg-surface/20 text-surface' : 'bg-canvas text-ink-tertiary'">
                {{ blogStore.posts.length }}
              </span>
            </button>
            <button
              v-for="category in blogCategoryOptions"
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

      <!-- ── Articles Grid: Asymmetric Broken Masonry ────────────────── -->
      <LoadingSpinner v-if="initialLoading" />

      <div
        v-else-if="blogStore.posts.length"
        class="grid grid-cols-1 md:grid-cols-12 gap-5"
      >
        <div
          v-for="(post, index) in blogStore.posts"
          :key="post._id"
          :class="[
            index % 5 === 0 ? 'col-span-12 xl:col-span-7' :
            index % 5 === 1 ? 'col-span-12 xl:col-span-5' :
            index % 5 === 2 ? 'col-span-12 md:col-span-5 xl:col-span-4' :
            index % 5 === 3 ? 'col-span-12 md:col-span-7 xl:col-span-8' :
                               'col-span-12'
          ]"
        >
          <BlogCard :post="post" :layout="getMasonryLayout(index)" />
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
          <p class="text-base text-ink font-serif font-normal">No articles matching your topic query</p>
          <p class="text-xs text-ink-tertiary font-mono">Try adjusting your search keywords or resetting the topic filter.</p>
        </div>
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div ref="sentinelRef" class="flex justify-center py-6">
        <div v-if="hasMorePosts || loadingMore" class="editorial-card">
          <div class="editorial-card__inner px-6 py-2.5 flex items-center gap-3 text-xs text-ink-secondary font-mono">
            <LoadingSpinner v-if="loadingMore" size="sm" />
            <span class="tabular-nums">{{ loadingMore ? 'Loading next publications...' : 'Scroll to load more' }}</span>
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
