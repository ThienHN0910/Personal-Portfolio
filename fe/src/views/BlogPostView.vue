<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="post" class="max-w-3xl mx-auto">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-8 text-sm"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to Blog
        </RouterLink>
        <img
          v-if="post.coverImage"
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-64 object-cover rounded-xl mb-8"
        />
        <div class="card__tags mb-4">
          <span v-for="tag in post.tags" :key="tag" class="card__tag">{{
            tag
          }}</span>
        </div>

        <h1 class="text-4xl font-bold text-white mb-4">{{ post.title }}</h1>

        <p class="text-gray-500 text-sm mb-8">
          Published {{ formatDate(post.createdAt) }}
        </p>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="blog-content max-w-none" v-html="sanitizedContent" />
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-xl">Post not found.</p>
        <RouterLink to="/blog" class="btn btn--primary mt-4"
          >Back to Blog</RouterLink
        >
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
    })
  } else {
    post.value = null
    applySeo({
      title: 'Post Not Found',
      description: 'The requested blog post does not exist or has been removed.',
      url: `/blog/${id}`,
      noindex: true,
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
  color: #d1d5db;
  line-height: 1.8;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4) {
  color: #f8fafc;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.blog-content :deep(p) {
  margin-bottom: 1rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-left: 1.25rem;
  margin-bottom: 1rem;
}

.blog-content :deep(ul) {
  list-style: disc;
}

.blog-content :deep(ol) {
  list-style: decimal;
}

.blog-content :deep(blockquote) {
  margin: 1.25rem 0;
  border-left: 3px solid rgba(59, 130, 246, 0.75);
  padding-left: 1rem;
  color: #93c5fd;
}

.blog-content :deep(pre) {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.blog-content :deep(a) {
  color: #93c5fd;
  text-decoration: underline;
}

.blog-content :deep(.image) {
  display: table;
  margin: 1.25rem auto;
}

.blog-content :deep(.image img) {
  border-radius: 0.75rem;
  max-width: 100%;
  height: auto;
}

.blog-content :deep(.image-style-side) {
  float: right;
  margin-left: 1rem;
  max-width: 50%;
}

.blog-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.blog-content :deep(th),
.blog-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 0.75rem;
}

.blog-content :deep(.media) {
  margin: 1.25rem 0;
}

.blog-content :deep(.rich-embed__ratio) {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.85);
}

.blog-content :deep(.rich-embed__ratio iframe) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
