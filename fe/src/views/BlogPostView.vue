<template>
  <div class="min-h-[100dvh] bg-canvas relative">
    <!-- ── Top Reading Progress Bar ──────────────────────────────────────── -->
    <div
      class="fixed top-0 left-0 right-0 h-[2.5px] bg-ink z-[300] transition-transform duration-75 origin-left"
      :style="{ transform: `scaleX(${readingProgress})` }"
      aria-hidden="true"
    />

    <!-- Outer balanced canvas wrapper (matches ProjectDetailView) -->
    <div class="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="post" class="space-y-8">
        <!-- Top Nav & Breadcrumb Bar -->
        <div class="flex items-center justify-between gap-4 px-2">
          <RouterLink
            to="/blog"
            class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Publications</span>
          </RouterLink>

          <div class="flex items-center gap-2">
            <span
              v-for="cat in (post.categories || []).slice(0, 1)"
              :key="cat"
              class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-green text-pastel-green-text uppercase font-medium"
            >
              {{ cat }}
            </span>
            <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-bone border border-stroke text-ink-secondary tabular-nums">
              {{ estimatedReadTime }} min read
            </span>
          </div>
        </div>

        <!-- ── Editorial Hero Header Card with Embedded Publication Spec Rail ── -->
        <header class="editorial-card">
          <div class="editorial-card__inner p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Header: Eyebrow, Title & Overview (Col 8) -->
            <div class="lg:col-span-8 space-y-6">
              <div class="flex flex-wrap items-center gap-2">
                <span class="eyebrow-tag">
                  <span class="status-dot"></span>
                  Engineering Dossier &amp; Research Note
                </span>
                <span
                  v-for="tag in (post.tags || []).slice(0, 3)"
                  :key="tag"
                  class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pastel-blue text-pastel-blue-text uppercase tracking-wider font-medium"
                >
                  #{{ tag }}
                </span>
              </div>

              <div class="space-y-4 max-w-3xl">
                <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.035em] leading-[1.04] text-ink text-balance">
                  {{ post.title }}
                </h1>
                <p v-if="post.excerpt" class="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans font-light">
                  {{ post.excerpt }}
                </p>
              </div>
            </div>

            <!-- Right Header: Publication Spec Rail (Col 4) -->
            <div class="lg:col-span-4 p-5 rounded-xl bg-bone border border-stroke space-y-4 text-xs font-mono">
              <div class="flex items-center justify-between pb-2.5 border-b border-stroke">
                <span class="text-[10px] text-ink-tertiary uppercase tracking-widest">Publication Spec Rail</span>
                <span class="w-2 h-2 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
              </div>

              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-ink-tertiary uppercase">Status</span>
                  <span class="text-pastel-green-text font-medium">Published &amp; Active</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-ink-tertiary uppercase">Timeline</span>
                  <span class="text-ink tabular-nums">{{ formatDate(post.createdAt) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-ink-tertiary uppercase">Read Velocity</span>
                  <span class="text-ink tabular-nums">{{ estimatedReadTime }} min ({{ wordCount }} words)</span>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-stroke/60">
                  <span class="text-[10px] text-ink-tertiary uppercase">Author</span>
                  <span class="text-ink font-sans font-medium text-[11px]">Hồ Ngọc Thiện</span>
                </div>
                <div v-if="post.categories && post.categories.length" class="space-y-1.5 pt-1 border-t border-stroke/60">
                  <span class="text-[10px] text-ink-tertiary uppercase block">Taxonomy</span>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="cat in post.categories"
                      :key="cat"
                      class="px-2 py-0.5 rounded bg-pastel-green text-pastel-green-text text-[10px] font-mono"
                    >
                      {{ cat }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- ── 2-Column Layout: Left Sticky Rail & Right Main Content Canvas ── -->
        <div class="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8 items-start">
          <!-- ── LEFT STICKY RAIL: Table of Contents, Tags & Share Actions ── -->
          <aside class="xl:sticky xl:top-24 xl:self-start space-y-4">
            <!-- Table of Contents Card -->
            <div v-if="headings.length" class="editorial-card">
              <div class="editorial-card__inner p-6 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-stroke">
                  <h2 class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Table of Contents</h2>
                  <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text"></span>
                </div>

                <nav class="space-y-2 text-xs font-sans">
                  <button
                    v-for="item in headings"
                    :key="item.id"
                    type="button"
                    class="block w-full text-left font-light py-1 text-ink-secondary hover:text-ink transition-colors line-clamp-1 group"
                    :class="{ '!text-ink !font-medium': activeHeadingId === item.id }"
                    @click="scrollToHeading(item.id)"
                  >
                    <span class="inline-block w-1.5 h-1.5 rounded-full mr-2 transition-all duration-200" :class="activeHeadingId === item.id ? 'bg-ink scale-125' : 'bg-stroke group-hover:bg-ink-tertiary'"></span>
                    <span>{{ item.text }}</span>
                  </button>
                </nav>
              </div>
            </div>

            <!-- Tags & Actions Card -->
            <div class="editorial-card">
              <div class="editorial-card__inner p-6 space-y-6">
                <!-- Tags Stack -->
                <div v-if="post.tags && post.tags.length" class="space-y-2.5">
                  <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">Topic Tags</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in post.tags"
                      :key="tag"
                      class="px-2.5 py-1 rounded bg-bone border border-stroke text-ink text-xs font-mono hover:border-ink/30 transition-colors"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Actions / Share -->
                <div class="space-y-2.5 pt-4 border-t border-stroke">
                  <button
                    type="button"
                    class="w-full py-3 px-4 rounded-md bg-ink text-surface font-sans font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
                    @click="copyLink"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                    <span>{{ isCopied ? 'Link Copied to Clipboard!' : 'Copy Article Link' }}</span>
                  </button>

                  <div class="grid grid-cols-2 gap-2">
                    <a
                      :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="py-2.5 px-3 rounded-md bg-bone border border-stroke text-ink-secondary hover:text-ink hover:border-ink/30 font-mono text-[11px] text-center active:scale-[0.98] transition-all block"
                    >
                      Share on X ↗
                    </a>
                    <a
                      :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="py-2.5 px-3 rounded-md bg-bone border border-stroke text-ink-secondary hover:text-ink hover:border-ink/30 font-mono text-[11px] text-center active:scale-[0.98] transition-all block"
                    >
                      LinkedIn ↗
                    </a>
                  </div>

                  <RouterLink
                    to="/blog"
                    class="w-full py-2 px-3 text-center text-[11px] font-mono text-ink-tertiary hover:text-ink transition-colors block pt-2"
                  >
                    ← All Publications
                  </RouterLink>
                </div>
              </div>
            </div>
          </aside>

          <!-- ── RIGHT MAIN CANVAS: Cover, Article Core, Bio ────────────────── -->
          <div class="space-y-8 min-w-0">
            <!-- Cover Image Frame -->
            <div
              v-if="post.coverImage"
              class="editorial-card group cursor-zoom-in"
              @click="openLightbox(post.coverImage, post.title, 'Editorial Publication Cover Image')"
            >
              <div class="editorial-card__inner overflow-hidden bg-bone border border-stroke p-0 aspect-[21/9] relative">
                <img
                  :src="post.coverImage"
                  :alt="post.title"
                  class="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div class="absolute bottom-3 right-3 px-2 py-1 rounded bg-ink/70 backdrop-blur text-[10px] font-mono text-surface opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to Expand ↗
                </div>
              </div>
            </div>

            <!-- Article Body Core -->
            <article class="editorial-card">
              <div ref="articleBodyRef" class="editorial-card__inner p-8 sm:p-14">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div class="prose-editorial max-w-none" v-html="sanitizedContent" />
              </div>
            </article>

            <!-- Lightbox Modal -->
            <ImageLightboxModal
              :is-open="lightbox.isOpen"
              :src="lightbox.src"
              :alt="lightbox.alt"
              :caption="lightbox.caption"
              @close="closeLightbox"
            />

            <!-- Article Footer & Author Bio Card -->
            <footer class="editorial-card">
              <div class="editorial-card__inner p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-bone border border-stroke flex items-center justify-center font-mono text-ink font-semibold text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    HN
                  </div>
                  <div class="space-y-1">
                    <h3 class="font-sans font-semibold text-sm text-ink">Written by Hồ Ngọc Thiện</h3>
                    <p class="text-xs text-ink-secondary font-light max-w-sm">
                      Full Stack Engineer specializing in Vue 3, TypeScript, .NET Web API, and secure cloud system design.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <RouterLink
                    to="/blog"
                    class="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-sans font-medium active:scale-[0.98] transition-all"
                  >
                    <span>Browse All Publications</span>
                    <span class="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                  </RouterLink>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <!-- ── Related Case Studies & Connected Technical Articles ─────── -->
        <section v-if="relatedArticles.length || relatedProjects.length" class="space-y-8 pt-12 border-t border-stroke">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div class="space-y-1">
              <span class="eyebrow-tag">
                <span class="status-dot"></span>
                Connected Research &amp; Deployments
              </span>
              <h2 class="text-2xl sm:text-4xl font-serif font-light text-ink">Related Systems &amp; Publications</h2>
            </div>
            <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">Dynamic Cross-Reference</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <!-- Related Articles -->
            <div
              v-for="relPost in relatedArticles"
              :key="relPost._id"
              class="editorial-card group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
            >
              <div class="editorial-card__inner p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="overflow-hidden rounded-md bg-bone border border-stroke aspect-[16/9] relative">
                    <img
                      v-if="relPost.coverImage"
                      :src="relPost.coverImage"
                      :alt="relPost.title"
                      class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-ink-tertiary text-xs font-mono">
                      Technical Article
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-[10px] font-mono">
                    <span class="px-2 py-0.5 rounded bg-pastel-green text-pastel-green-text uppercase">Article</span>
                    <span class="text-ink-tertiary">{{ relPost.categories?.[0] || 'Publication' }}</span>
                  </div>

                  <h3 class="font-serif text-lg font-medium text-ink group-hover:text-ink/80 transition-colors line-clamp-1">
                    {{ relPost.title }}
                  </h3>
                  <p class="text-xs text-ink-secondary line-clamp-2 font-sans font-light leading-relaxed">
                    {{ relPost.excerpt }}
                  </p>
                </div>

                <div class="pt-3 border-t border-stroke/60 flex items-center justify-between text-xs font-mono">
                  <span class="text-[10px] text-ink-tertiary uppercase truncate max-w-[120px]">
                    #{{ relPost.tags?.[0] || 'Guide' }}
                  </span>
                  <RouterLink
                    :to="`/blog/${relPost.slug || relPost._id}`"
                    class="text-ink font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Note</span>
                    <span>↗</span>
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Related Projects -->
            <div
              v-for="relProj in relatedProjects"
              :key="relProj._id"
              class="editorial-card group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
            >
              <div class="editorial-card__inner p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="overflow-hidden rounded-md bg-bone border border-stroke aspect-[16/9] relative">
                    <img
                      v-if="relProj.imageUrl"
                      :src="relProj.imageUrl"
                      :alt="relProj.title"
                      class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-ink-tertiary text-xs font-mono">
                      Case Study
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-[10px] font-mono">
                    <span class="px-2 py-0.5 rounded bg-pastel-blue text-pastel-blue-text uppercase">Case Study</span>
                    <span class="text-ink-tertiary">{{ relProj.duration || '2025' }}</span>
                  </div>

                  <h3 class="font-serif text-lg font-medium text-ink group-hover:text-ink/80 transition-colors line-clamp-1">
                    {{ relProj.title }}
                  </h3>
                  <p class="text-xs text-ink-secondary line-clamp-2 font-sans font-light leading-relaxed">
                    {{ relProj.description }}
                  </p>
                </div>

                <div class="pt-3 border-t border-stroke/60 flex items-center justify-between text-xs font-mono">
                  <span class="text-[10px] text-ink-tertiary uppercase truncate max-w-[120px]">
                    {{ relProj.technologies?.[0] || 'System' }}
                  </span>
                  <RouterLink
                    :to="`/projects/${relProj.slug || relProj._id}`"
                    class="text-ink font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Case</span>
                    <span>↗</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Not Found State -->
      <div v-else class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-4">
          <p class="text-base text-ink font-serif font-normal">Publication not found.</p>
          <RouterLink to="/blog" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-medium active:scale-[0.98] transition-all">
            ← Return to Publications Archive
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageLightboxModal from '@/components/ui/ImageLightboxModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useRichContentEnhancer } from '@/composables/useRichContentEnhancer'
import { useBlogStore } from '@/stores/blog'
import { useProjectsStore } from '@/stores/projects'
import type { BlogPost } from '@/types'
import { sanitizeRichContent } from '@/utils/richContent'
import { applySeo } from '@/utils/seo'
import { getBlogDetailSeoMeta } from '@/utils/seoPriority'
import { getRelatedArticlesForPost, getRelatedProjectsForPost } from '@/utils/relatedRecommender'

interface HeadingItem {
  id: string
  text: string
}

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const projectsStore = useProjectsStore()

const post = ref<BlogPost | null>(null)
const loading = ref(true)
const readingProgress = ref(0)
const articleBodyRef = ref<HTMLElement | null>(null)
const headings = ref<HeadingItem[]>([])
const activeHeadingId = ref<string>('')
const isCopied = ref(false)

const currentUrl = computed(() => {
  if (typeof window !== 'undefined') return window.location.href
  return `https://thienhn0910.vercel.app/blog/${post.value?.slug || ''}`
})

const { lightbox, closeLightbox, scheduleEnhance } = useRichContentEnhancer(articleBodyRef)

function openLightbox(src: string, alt = '', caption = '') {
  lightbox.value.isOpen = true
  lightbox.value.src = src
  lightbox.value.alt = alt
  lightbox.value.caption = caption
}

const sanitizedContent = computed(() => {
  const html = post.value?.content || ''
  return sanitizeRichContent(html)
})

const relatedArticles = computed(() => {
  if (!post.value) return []
  return getRelatedArticlesForPost(post.value, blogStore.posts, 2)
})

const relatedProjects = computed(() => {
  if (!post.value) return []
  return getRelatedProjectsForPost(post.value, projectsStore.projects, 2)
})

const wordCount = computed(() => {
  if (!post.value?.content) return 0
  return post.value.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
})

const estimatedReadTime = computed(() => {
  return Math.max(1, Math.round(wordCount.value / 200))
})

function extractHeadings() {
  if (!articleBodyRef.value) return
  const h2Elements = articleBodyRef.value.querySelectorAll('h2')
  const items: HeadingItem[] = []

  h2Elements.forEach((el, index) => {
    let id = el.id
    if (!id) {
      id = 'heading-' + index + '-' + el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)
      el.id = id
    }
    items.push({
      id,
      text: el.textContent?.trim() || `Section ${index + 1}`
    })
  })

  headings.value = items
  if (items.length > 0 && !activeHeadingId.value) {
    activeHeadingId.value = items[0].id
  }
}

function scrollToHeading(id: string) {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeHeadingId.value = id
  }
}

function updateReadingProgress() {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight
  if (totalHeight <= 0) {
    readingProgress.value = 0
    return
  }
  readingProgress.value = Math.min(1, Math.max(0, window.scrollY / totalHeight))

  // Update active TOC heading based on scroll position
  if (headings.value.length > 0) {
    const scrollPos = window.scrollY + 180
    for (let i = headings.value.length - 1; i >= 0; i--) {
      const heading = document.getElementById(headings.value[i].id)
      if (heading && heading.offsetTop <= scrollPos) {
        activeHeadingId.value = headings.value[i].id
        break
      }
    }
  }
}

function copyLink() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    void navigator.clipboard.writeText(window.location.href)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  }
}

function formatDate(date?: string | Date): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

watch(sanitizedContent, () => {
  scheduleEnhance()
  void nextTick(() => {
    extractHeadings()
  })
})

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
      title: 'Publication Details',
      description: 'Technical article details.',
      url: `/blog/${id}`,
      noindex: false,
    })
  }

  loading.value = false
  void nextTick(() => {
    extractHeadings()
  })
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

onMounted(async () => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  if (!blogStore.posts.length) {
    void blogStore.fetchPosts({ limit: 12 })
  }
  if (!projectsStore.projects.length) {
    void projectsStore.fetchProjects({ limit: 12 })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>
