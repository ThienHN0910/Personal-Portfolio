<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="post" class="space-y-10">
        <!-- Breadcrumb Link -->
        <RouterLink to="/blog" class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95">
          <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Back to Articles</span>
        </RouterLink>

        <!-- Article Header Card -->
        <div class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-12 space-y-6">
            <div class="flex flex-wrap items-center gap-2">
              <span v-for="tag in post.tags" :key="tag" class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-blue text-pastel-blue-text uppercase tracking-wider font-medium">
                #{{ tag }}
              </span>
            </div>

            <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.08] text-ink">
              {{ post.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-tertiary pt-4 border-t border-stroke">
              <span class="tabular-nums">Published on {{ formatDate(post.createdAt) }}</span>
              <span>·</span>
              <span class="text-ink-secondary">Hồ Ngọc Thiện</span>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div v-if="post.coverImage" class="editorial-card">
          <div class="editorial-card__inner overflow-hidden bg-bone border border-stroke p-0">
            <img
              :src="post.coverImage"
              :alt="post.title"
              class="w-full h-auto max-h-[480px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>

        <!-- Article Body -->
        <article class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-12">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="blog-content max-w-none" v-html="sanitizedContent" />
          </div>
        </article>
      </div>

      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-4">
          <p class="text-base text-ink font-serif font-normal">Article not found.</p>
          <RouterLink to="/blog" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-medium active:scale-[0.98] transition-all">
            ← Back to Articles Archive
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
const sanitizedContent = computed(() => {
  const html = post.value?.content || ''
  return sanitizeRichContent(html)
})

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
</script>

<style scoped lang="scss">
.blog-content {
  color: var(--ink-secondary);
  line-height: 1.85;
  font-size: 1.0625rem;
  font-family: var(--font-sans);
  font-weight: 300;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4) {
  color: var(--ink);
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-top: 2.25rem;
  margin-bottom: 0.875rem;
  line-height: 1.25;
}

.blog-content :deep(h2) {
  font-size: 1.75rem;
}

.blog-content :deep(h3) {
  font-size: 1.35rem;
}

.blog-content :deep(p) {
  margin-bottom: 1.5rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.blog-content :deep(ul) {
  list-style: disc;
}

.blog-content :deep(ol) {
  list-style: decimal;
}

.blog-content :deep(blockquote) {
  margin: 1.75rem 0;
  border-left: 2px solid var(--ink);
  background: var(--bone);
  padding: 1.25rem 1.5rem;
  border-radius: 4px;
  color: var(--ink);
  font-style: italic;
  font-family: var(--font-serif);
}

.blog-content :deep(pre) {
  background: var(--bone);
  border: 1px solid var(--stroke);
  border-radius: 8px;
  padding: 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--ink);
}

.blog-content :deep(code) {
  font-family: var(--font-mono);
  background: var(--bone);
  border: 1px solid var(--stroke);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
  color: var(--ink);
}

.blog-content :deep(a) {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>

