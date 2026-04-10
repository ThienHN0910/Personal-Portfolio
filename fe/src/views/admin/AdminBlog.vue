<template>
  <div class="section admin-shell min-h-screen pt-24">
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
          <div v-if="showModal" class="admin-modal-backdrop">
            <div class="admin-modal">
              <p class="admin-kicker mb-2">Blog Builder</p>
              <h2 class="admin-modal__title">{{ isEditing ? 'Edit' : 'New' }} Post</h2>
              <p class="admin-modal__desc mb-5">Cover image will be taken from the first image inside content.</p>

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
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EditorLoadingSkeleton from '@/components/ui/EditorLoadingSkeleton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useBlogStore } from '@/stores/blog'
import type { BlogPost } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

interface BlogFormState {
  title: string
  content: string
  published: boolean
}

const EXCERPT_MAX_LENGTH = 180

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
const loading = computed(() => blogStore.loading)
const showModal = ref(false)
const editingPost = ref<BlogPost | null>(null)
const { isOpen: isDeleteDialogOpen, request: requestDelete, cancel: cancelDelete, consume: consumeDelete } = useConfirmDialog()
const tagsInput = ref('')
const editorRenderKey = ref(0)
const isEditing = computed(() => Boolean(editingPost.value?._id))
const editorInstanceKey = computed(() => `${editingPost.value?._id || 'new'}-${editorRenderKey.value}`)

const form = reactive<BlogFormState>(createInitialFormState())

function resetForm(): void {
  Object.assign(form, createInitialFormState())
  tagsInput.value = ''
}

function fillFormFromPost(post: BlogPost): void {
  form.title = post.title
  form.content = post.content
  form.published = post.published
  tagsInput.value = post.tags.join(', ')
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
})
</script>
