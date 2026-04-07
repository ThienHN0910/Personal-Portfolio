<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="flex items-center justify-between mb-8">
        <h1 class="section-title mb-0">Manage <span class="highlight">Blog</span></h1>
        <button class="btn btn--primary" @click="openModal()">+ New Post</button>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Title</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400 hidden md:table-cell">Tags</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400 hidden sm:table-cell">Status</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in blogStore.posts"
              :key="post._id"
              class="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <td class="py-4 px-4 text-white font-medium">{{ post.title }}</td>
              <td class="py-4 px-4 hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="card__tag">{{ tag }}</span>
                </div>
              </td>
              <td class="py-4 px-4 hidden sm:table-cell">
                <span :class="post.published ? 'text-green-400' : 'text-amber-400'" class="text-sm">
                  {{ post.published ? '● Published' : '○ Draft' }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn btn--secondary btn--sm" @click="openModal(post)">Edit</button>
                  <button class="btn btn--danger btn--sm" @click="handleDelete(post._id!)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold text-white mb-6">{{ editingPost ? 'Edit' : 'New' }} Post</h2>

          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Title</label>
              <input v-model="form.title" type="text" required placeholder="Post title" />
            </div>
            <div class="form-group">
              <label>Excerpt</label>
              <textarea v-model="form.excerpt" rows="2" required placeholder="Brief description..." />
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea v-model="form.content" rows="10" required placeholder="Post content (HTML supported)..." />
            </div>
            <div class="form-group">
              <label>Cover Image URL</label>
              <ImageDropUpload v-model="form.coverImage" folder="portfolio/blog" />
            </div>
            <div class="form-group">
              <label>Tags (comma separated)</label>
              <input v-model="tagsInput" type="text" placeholder="Vue, TypeScript, Tutorial" />
            </div>
            <div class="flex items-center gap-3 mb-6">
              <input id="published" v-model="form.published" type="checkbox" class="w-4 h-4 accent-blue-500" />
              <label for="published" class="text-gray-400 text-sm cursor-pointer">Publish post</label>
            </div>

            <div class="flex gap-3 justify-end">
              <button type="button" class="btn btn--secondary" @click="showModal = false">Cancel</button>
              <button type="submit" class="btn btn--primary" :disabled="blogStore.loading">
                {{ editingPost ? 'Update' : 'Publish' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import { useBlogStore } from '@/stores/blog'
import type { BlogPost } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const blogStore = useBlogStore()
const loading = computed(() => blogStore.loading)
const showModal = ref(false)
const editingPost = ref<BlogPost | null>(null)
const tagsInput = ref('')

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  published: false,
})

function openModal(post?: BlogPost) {
  editingPost.value = post || null
  if (post) {
    form.title = post.title
    form.excerpt = post.excerpt
    form.content = post.content
    form.coverImage = post.coverImage || ''
    form.published = post.published
    tagsInput.value = post.tags.join(', ')
  } else {
    form.title = ''
    form.excerpt = ''
    form.content = ''
    form.coverImage = ''
    form.published = false
    tagsInput.value = ''
  }
  showModal.value = true
}

async function handleSubmit() {
  const tags = tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean)
  const data = { ...form, tags }

  if (editingPost.value?._id) {
    await blogStore.updatePost(editingPost.value._id, data)
  } else {
    await blogStore.createPost(data)
  }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this post?')) {
    await blogStore.deletePost(id)
  }
}

blogStore.fetchPosts()
</script>
