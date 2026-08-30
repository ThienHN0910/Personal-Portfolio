<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container">
      <AdminSectionHeader kicker="Content Lab" title-before="Manage " title-highlight="Blog">
        <template #actions>
          <button class="btn btn--primary inline-flex items-center gap-2" @click="openModal()">
            <IconGlyph name="add" :size="14" />
            New Post
          </button>
        </template>
      </AdminSectionHeader>

      <LoadingSpinner v-if="loading" />

      <div v-else class="admin-panel overflow-x-auto p-2">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th class="hidden md:table-cell">Categories</th>
              <th class="hidden md:table-cell">Tags</th>
              <th class="hidden sm:table-cell">Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in blogStore.posts"
              :key="post._id"
            >
              <td class="text-white font-medium">{{ post.title }}</td>
              <td class="hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="category in (post.categories || []).slice(0, 2)" :key="category" class="card__tag">{{ category }}</span>
                </div>
              </td>
              <td class="hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="card__tag">{{ tag }}</span>
                </div>
              </td>
              <td class="hidden sm:table-cell">
                <span :class="post.published ? 'text-green-400' : 'text-amber-400'" class="text-sm">
                  {{ post.published ? '● Published' : '○ Draft' }}
                </span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn btn--secondary btn--sm inline-flex items-center gap-1.5" @click="openModal(post)">
                    <IconGlyph name="edit" :size="12" />
                    Edit
                  </button>
                  <button class="btn btn--danger btn--sm inline-flex items-center gap-1.5" @click="handleDelete(post._id!)">
                    <IconGlyph name="trash" :size="12" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <Teleport to="body">
        <Transition name="admin-fade-scale">
          <div v-if="showModal" class="admin-modal-backdrop" data-lenis-prevent @click.self="showModal = false">
            <div class="admin-modal max-w-3xl" data-lenis-prevent>
              <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div>
                  <p class="admin-kicker mb-1">Blog Builder</p>
                  <h2 class="admin-modal__title !mb-0">{{ isEditing ? 'Edit' : 'New' }} Post</h2>
                </div>
                <button
                  type="button"
                  class="text-gray-400 hover:text-white text-lg font-mono w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  @click="showModal = false"
                >
                  ✕
                </button>
              </div>
              <p class="admin-modal__desc mb-5 text-xs text-slate-400">Cover image will be taken from the first image inside content.</p>

              <form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <label>Title</label>
                  <input v-model="form.title" type="text" required placeholder="Post title" />
                </div>
                <div class="form-group">
                  <label>Content</label>
                  <FullRichEditor
                    v-model="form.content"
                    :editor-key="editorInstanceKey"
                    :sticky-top="0"
                    upload-folder="portfolio/blog/content"
                    placeholder="Write your post content here..."
                  />
                </div>
                <div class="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    class="btn btn--sm text-xs py-1 px-3 border border-indigo-400/40 rounded bg-slate-900/90 text-indigo-300 hover:text-white hover:bg-indigo-600/30 flex items-center gap-1.5 transition-all"
                    :disabled="isGeneratingMetadata || (!form.title && !form.content)"
                    @click="handleGenerateMetadata"
                  >
                    <span v-if="isGeneratingMetadata" class="animate-spin">⏳</span>
                    <span v-else>✨</span>
                    {{ isGeneratingMetadata ? 'Analyzing...' : 'AI Auto-Detect Tags & Category' }}
                  </button>
                </div>

                <div class="form-group">
                  <CategoryCheckboxGroup
                    v-model="selectedCategories"
                    label="Blog categories"
                    description="Choose one or more categories for this post."
                    :options="blogCategoryOptions"
                    empty-message="No blog categories available. Open Admin Categories to add some."
                  />
                </div>
                <div class="form-group">
                  <label>Tags (comma separated)</label>
                  <input v-model="tagsInput" type="text" placeholder="Vue, TypeScript, Tutorial" />
                </div>
                <div class="flex items-center gap-3 mb-6">
                  <input id="published" v-model="form.published" type="checkbox" class="w-4 h-4 accent-blue-500" />
                  <label for="published" class="text-gray-400 text-sm cursor-pointer">Publish post</label>
                </div>

                <div class="admin-modal__actions">
                  <button type="button" class="btn btn--secondary" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn--primary" :disabled="blogStore.loading">
                    {{ isEditing ? 'Update' : 'Publish' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>

      <ConfirmDialog
        :open="isDeleteDialogOpen"
        title="Delete post"
        message="This post will be permanently removed. This action cannot be undone."
        confirm-text="Delete"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import CategoryCheckboxGroup from '@/components/admin/CategoryCheckboxGroup.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EditorLoadingSkeleton from '@/components/ui/EditorLoadingSkeleton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useBlogStore } from '@/stores/blog'
import { useCategoriesStore } from '@/stores/categories'
import api from '@/utils/api'
import type { BlogPost } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

interface BlogFormState {
  title: string
  content: string
  published: boolean
}

const EXCERPT_MAX_LENGTH = 160

function createInitialFormState(): BlogFormState {
  return {
    title: '',
    content: '',
    published: false,
  }
}

const FullRichEditor = defineAsyncComponent({
  loader: () => import('@/components/admin/FullRichEditor.vue'),
  loadingComponent: EditorLoadingSkeleton,
  delay: 120,
  timeout: 15000,
})

const blogStore = useBlogStore()
const categoriesStore = useCategoriesStore()
const loading = computed(() => blogStore.loading)
const showModal = ref(false)
const editingPost = ref<BlogPost | null>(null)
const { isOpen: isDeleteDialogOpen, request: requestDelete, cancel: cancelDelete, consume: consumeDelete } = useConfirmDialog()
const tagsInput = ref('')
const selectedCategories = ref<string[]>([])
const editorRenderKey = ref(0)
const isGeneratingMetadata = ref(false)
const isEditing = computed(() => Boolean(editingPost.value?._id))
const editorInstanceKey = computed(() => `${editingPost.value?._id || 'new'}-${editorRenderKey.value}`)
const blogCategoryOptions = computed(() => categoriesStore.categorySettings.blogCategories)

const form = reactive<BlogFormState>(createInitialFormState())

function resetForm(): void {
  Object.assign(form, createInitialFormState())
  tagsInput.value = ''
  selectedCategories.value = []
}

function fillFormFromPost(post: BlogPost): void {
  form.title = post.title
  form.content = post.content
  form.published = post.published
  tagsInput.value = post.tags.join(', ')
  selectedCategories.value = [...(post.categories || [])]
}

function openModal(post?: BlogPost) {
  editingPost.value = post || null
  if (post) {
    fillFormFromPost(post)
  } else {
    resetForm()
  }
  editorRenderKey.value += 1
  showModal.value = true
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildExcerpt(htmlContent: string): string {
  const plainText = htmlToPlainText(htmlContent)
  if (plainText.length <= EXCERPT_MAX_LENGTH) return plainText
  return `${plainText.slice(0, EXCERPT_MAX_LENGTH - 3).trim()}...`
}

function extractFirstImageUrl(html: string): string {
  const matched = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return matched?.[1] || ''
}

function parseTags(value: string): string[] {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return Array.from(new Set(tags))
}

async function handleGenerateMetadata() {
  if (!form.title && !form.content) {
    alert('Please enter a title or write some content first.')
    return
  }

  isGeneratingMetadata.value = true
  try {
    const res = await api.post<{ success: boolean; data: { excerpt?: string; tags?: string[]; suggestedCategory?: string } }>('/ai/generate-metadata', {
      title: form.title,
      content: form.content,
    })

    if (res.data.success && res.data.data) {
      const { tags, suggestedCategory } = res.data.data
      if (Array.isArray(tags) && tags.length && !tagsInput.value) {
        tagsInput.value = tags.join(', ')
      }
      if (suggestedCategory && !selectedCategories.value.length) {
        const matched = blogCategoryOptions.value.find(c => c.toLowerCase() === suggestedCategory.toLowerCase())
        if (matched) selectedCategories.value = [matched]
        else if (blogCategoryOptions.value.length) selectedCategories.value = [blogCategoryOptions.value[0]]
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  } finally {
    isGeneratingMetadata.value = false
  }
}

async function handleSubmit() {
  const contentText = htmlToPlainText(form.content)
  if (!contentText) {
    alert('Post content cannot be empty.')
    return
  }

  const tags = parseTags(tagsInput.value)
  const data = {
    ...form,
    excerpt: buildExcerpt(form.content),
    coverImage: extractFirstImageUrl(form.content),
    categories: selectedCategories.value,
    tags,
  }

  if (editingPost.value?._id) {
    await blogStore.updatePost(editingPost.value._id, data)
  } else {
    await blogStore.createPost(data)
  }
  showModal.value = false
}

async function handleDelete(id: string) {
  requestDelete(id)
}

async function confirmDelete() {
  const id = consumeDelete()
  if (!id) return
  await blogStore.deletePost(id)
}

onMounted(() => {
  blogStore.fetchPosts(true)
  categoriesStore.fetchCategories()
})
</script>
