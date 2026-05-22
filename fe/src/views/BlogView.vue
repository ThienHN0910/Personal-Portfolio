<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="text-center mb-12">
        <h1 class="section-title">
          My <span class="highlight">Blog</span>
        </h1>
        <p class="section-subtitle mx-auto">Thoughts, tutorials, and insights on web development.</p>
      </div>

      <div class="max-w-2xl mx-auto mb-8 space-y-4">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts, categories, tags..."
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
            v-for="category in blogCategoryOptions"
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

      <div v-else-if="blogStore.posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard v-for="post in blogStore.posts" :key="post._id" :post="post" />
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        No blog posts found.
      </div>

      <div ref="sentinelRef" class="flex justify-center py-10">
        <div v-if="hasMorePosts || loadingMore" class="flex items-center gap-3 text-sm text-gray-400">
          <LoadingSpinner v-if="loadingMore" />
          <span>{{ loadingMore ? 'Loading more posts...' : 'Scroll to load more' }}</span>
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
