<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="text-center mb-12">
        <h1 class="section-title">
          My <span class="highlight">Blog</span>
        </h1>
        <p class="section-subtitle mx-auto">Thoughts, tutorials, and insights on web development.</p>
      </div>

      <!-- Search -->
      <div class="max-w-md mx-auto mb-10">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <LoadingSpinner v-if="initialLoading" />

      <div v-else-if="filteredPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard v-for="post in filteredPosts" :key="post._id" :post="post" />
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
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
const searchQuery = ref('')
const initialLoading = ref(true)
const loadingMore = ref(false)
const hasMorePosts = ref(true)
const currentPage = ref(1)
const pageSize = 6
const sentinelRef = ref<HTMLDivElement | null>(null)
let pageObserver: IntersectionObserver | null = null

function disconnectObserver(): void {
  pageObserver?.disconnect()
  pageObserver = null
}

async function loadNextPage(): Promise<void> {
  if (loadingMore.value || !hasMorePosts.value) return

  loadingMore.value = true
  const nextPage = currentPage.value + 1
  const pagination = await blogStore.fetchPosts({ page: nextPage, limit: pageSize, append: true })

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

const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return blogStore.posts
    .filter((p) => p.published)
    .filter(
      (p) =>
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)),
    )
})

onMounted(async () => {
  const [blogPagination] = await Promise.all([
    blogStore.fetchPosts({ page: 1, limit: pageSize }),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
  ])

  currentPage.value = 1
  hasMorePosts.value = blogPagination?.hasMore ?? false
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
})
</script>
