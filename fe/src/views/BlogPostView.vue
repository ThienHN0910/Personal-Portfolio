<template>
  <div class="min-h-[100dvh] bg-canvas relative">
    <!-- ── Top Reading Progress Bar ──────────────────────────────────────── -->
    <div
      class="fixed top-0 left-0 right-0 h-[2.5px] bg-ink z-[300] transition-transform duration-75 origin-left"
      :style="{ transform: `scaleX(${readingProgress})` }"
      aria-hidden="true"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="post" class="space-y-10">
        <!-- Breadcrumb & Topic Bar -->
        <div class="flex items-center justify-between gap-4">
          <RouterLink
            to="/blog"
            class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Publications</span>
          </RouterLink>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary tabular-nums">
              {{ estimatedReadTime }} min read
            </span>
          </div>
        </div>

        <!-- ── Editorial Article Header Card ───────────────────────────── -->
        <header class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-14 space-y-8">
            <!-- Topic / Tags -->
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="tag in (post.tags || [])"
                :key="tag"
                class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-blue text-pastel-blue-text uppercase tracking-wider font-medium"
              >
                #{{ tag }}
              </span>
              <span
                v-for="cat in (post.categories || [])"
                :key="cat"
                class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary uppercase tracking-wider"
              >
                {{ cat }}
              </span>
            </div>

            <!-- Title -->
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.05] text-ink text-balance">
              {{ post.title }}
            </h1>

            <!-- Author & Metadata Rail -->
            <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stroke text-xs font-mono">
              <div class="flex items-center gap-3">
                <!-- Author Squircle Monogram -->
                <div class="w-9 h-9 rounded-lg bg-bone border border-stroke flex items-center justify-center font-mono text-ink font-semibold text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  HN
                </div>
                <div>
                  <span class="font-sans font-medium text-ink block text-sm">Hồ Ngọc Thiện</span>
                  <span class="text-[11px] text-ink-tertiary block">Author · Full Stack Engineer</span>
                </div>
              </div>

              <div class="flex items-center gap-4 text-ink-tertiary tabular-nums">
                <span>Published {{ formatDate(post.createdAt) }}</span>
                <span>·</span>
                <span>{{ estimatedReadTime }} min read</span>
              </div>
            </div>
          </div>
        </header>

        <!-- ── Cover Image Frame ───────────────────────────────────────── -->
        <div v-if="post.coverImage" class="editorial-card">
          <div class="editorial-card__inner overflow-hidden bg-bone border border-stroke p-0">
            <img
              :src="post.coverImage"
              :alt="post.title"
              class="w-full h-auto max-h-[500px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>

        <!-- ── Article Body Core ───────────────────────────────────────── -->
        <article class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-14">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="prose-editorial max-w-none" v-html="sanitizedContent" />
          </div>
        </article>

        <!-- ── Article Footer & Author Bio Card ────────────────────────── -->
        <footer class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-bone border border-stroke flex items-center justify-center font-mono text-ink font-semibold text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                HN
              </div>
              <div class="space-y-1">
                <h3 class="font-sans font-semibold text-sm text-ink">Written by Hồ Ngọc Thiện</h3>
                <p class="text-xs text-ink-secondary font-light max-w-sm">
                  Full Stack Engineer specializing in Vue 3, TypeScript, and high-performance system design.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <RouterLink
                to="/blog"
                class="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-sans font-medium active:scale-[0.98] transition-all"
              >
                <span>Browse All Articles</span>
                <span class="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </RouterLink>
            </div>
          </div>
        </footer>
      </div>

      <!-- Not Found State -->
      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-4">
          <p class="text-base text-ink font-serif font-normal">Article not found.</p>
          <RouterLink to="/blog" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-medium active:scale-[0.98] transition-all">
            ← Return to Publications
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import type { BlogPost } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getBlogDetailSeoMeta } from '@/utils/seoPriority'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const post = ref<BlogPost | null>(null)
const loading = ref(true)
const readingProgress = ref(0)

const sanitizedContent = computed(() => {
  const html = post.value?.content || ''
  return sanitizeRichContent(html)
})

const estimatedReadTime = computed(() => {
  if (!post.value?.content) return 3
  const wordCount = post.value.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 200))
})

function updateReadingProgress() {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  if (totalHeight <= 0) {
    readingProgress.value = 0
    return
  }
  readingProgress.value = Math.min(1, Math.max(0, window.scrollY / totalHeight))
}

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function loadPost(id: string): Promise<void> {
  loading.value = true
  const fetchedPost = await blogStore.fetchPost(id)

  if (fetchedPost) {
    if (fetchedPost.slug && fetchedPost.slug !== id) {
      void router.replace(`/blog/${fetchedPost.slug}`)
      return
    }
    post.value = fetchedPost
    applySeo({
      ...getBlogDetailSeoMeta(fetchedPost),
      url: `/blog/${fetchedPost.slug || id}`,
      noindex: false,
    })
  } else {
    post.value = null
    applySeo({
      title: 'Article Details',
      description: 'Technical article details.',
      url: `/blog/${id}`,
      noindex: false,
    })
  }

  loading.value = false
}

watch(
  () => route.params.slug,
  (value) => {
    if (typeof value === 'string' && value) {
      void loadPost(value)
    }
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>


