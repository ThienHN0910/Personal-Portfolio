<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <LoadingSpinner v-if="loading" />

      <div v-else-if="post" class="max-w-3xl mx-auto">
        <RouterLink to="/blog" class="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-8 text-sm">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Blog
        </RouterLink>

        <div class="card__tags mb-4">
          <span v-for="tag in post.tags" :key="tag" class="card__tag">{{ tag }}</span>
        </div>

        <h1 class="text-4xl font-bold text-white mb-4">{{ post.title }}</h1>

        <p class="text-gray-500 text-sm mb-8">
          Published {{ formatDate(post.createdAt) }}
        </p>

        <img
          v-if="post.coverImage"
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-64 object-cover rounded-xl mb-8"
        />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose prose-invert max-w-none" v-html="post.content" />
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-500 text-xl">Post not found.</p>
        <RouterLink to="/blog" class="btn btn--primary mt-4">Back to Blog</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import type { BlogPost } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const blogStore = useBlogStore()
const post = ref<BlogPost | null>(null)
const loading = ref(true)

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  const id = route.params.id as string
  post.value = await blogStore.fetchPost(id)
  loading.value = false
})
</script>
