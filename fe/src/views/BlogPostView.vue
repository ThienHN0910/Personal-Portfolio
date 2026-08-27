<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%)]" />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="post" class="space-y-8">
        <!-- Breadcrumb Link -->
        <RouterLink to="/blog" class="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono group active:scale-95">
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Articles</span>
        </RouterLink>

        <!-- Article Header Card -->
        <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="tag in post.tags" :key="tag" class="text-xs font-mono px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-semibold shadow-inner-glow">
              #{{ tag }}
            </span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            {{ post.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-3 border-t border-white/10">
            <span class="tabular-nums">Published on {{ formatDate(post.createdAt) }}</span>
            <span>•</span>
            <span>Author: Hồ Ngọc Thiện (ThienHN)</span>
          </div>
        </div>

        <!-- Cover Image -->
        <div v-if="post.coverImage" class="glass-panel overflow-hidden border border-cyber-border/40 rounded-2xl bg-slate-950 shadow-inner-glow">
          <img
            :src="post.coverImage"
            :alt="post.title"
            class="w-full h-auto max-h-[480px] object-cover"
          />
        </div>

        <!-- Article Body -->
        <article class="glass-panel p-6 sm:p-10 border border-cyber-border/30 shadow-glass-card">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blog-content max-w-none" v-html="sanitizedContent" />
        </article>
      </div>

      <div v-else class="glass-panel p-12 text-center text-slate-400 font-mono space-y-4">
        <p class="text-lg text-slate-200 font-sans font-medium">Article not found.</p>
        <RouterLink to="/blog" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 text-sm font-semibold hover:bg-cyan-400 hover:text-slate-950 active:scale-[0.98] transition-all">
          ← Back to Articles List
        </RouterLink>
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
  color: #cbd5e1;
  line-height: 1.85;
  font-size: 1rem;
}

.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4) {
  color: #f8fafc;
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.875rem;
  line-height: 1.35;
}

.blog-content :deep(p) {
  margin-bottom: 1.25rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.blog-content :deep(ul) {
  list-style: disc;
}

.blog-content :deep(ol) {
  list-style: decimal;
}

.blog-content :deep(blockquote) {
  margin: 1.5rem 0;
  border-left: 4px solid #00f2ff;
  background: rgba(0, 242, 255, 0.05);
  padding: 1rem 1.25rem;
  border-radius: 0 0.75rem 0.75rem 0;
  color: #a5f3fc;
}

.blog-content :deep(pre) {
  background: #090d16;
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  margin-bottom: 1.25rem;
}

.blog-content :deep(a) {
  color: #00f2ff;
  text-decoration: underline;
}
</style>
