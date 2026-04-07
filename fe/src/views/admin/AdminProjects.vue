<template>
  <div class="section admin-shell min-h-screen pt-24">
    <div class="container">
      <AdminSectionHeader kicker="Portfolio Control" title-before="Manage " title-highlight="Projects">
        <template #actions>
          <button class="btn btn--primary inline-flex items-center gap-2" @click="openModal()">
            <IconGlyph name="add" :size="14" />
            Add Project
          </button>
        </template>
      </AdminSectionHeader>

      <LoadingSpinner v-if="loading" />

      <div v-else class="admin-panel overflow-x-auto p-2">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th class="hidden md:table-cell">Technologies</th>
              <th class="hidden lg:table-cell">Related Blog</th>
              <th class="hidden sm:table-cell">Featured</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projectsStore.projects"
              :key="project._id"
            >
              <td class="text-white font-medium">{{ project.title }}</td>
              <td class="hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tech in project.technologies.slice(0, 3)" :key="tech" class="card__tag">{{ tech }}</span>
                </div>
              </td>
              <td class="hidden lg:table-cell text-gray-300 text-sm">
                {{ getRelatedBlogTitle(project.relatedBlogId) }}
              </td>
              <td class="hidden sm:table-cell">
                <span :class="project.featured ? 'text-green-400' : 'text-gray-500'" class="text-sm">
                  {{ project.featured ? '✓ Yes' : 'No' }}
                </span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn btn--secondary btn--sm inline-flex items-center gap-1.5" @click="openModal(project)">
                    <IconGlyph name="edit" :size="12" />
                    Edit
                  </button>
                  <button class="btn btn--danger btn--sm inline-flex items-center gap-1.5" @click="handleDelete(project._id!)">
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
      <Transition name="admin-fade-scale">
        <div v-if="showModal" class="admin-modal-backdrop">
          <div class="admin-modal max-w-lg">
            <p class="admin-kicker mb-2">Project Editor</p>
            <h2 class="admin-modal__title">{{ isEditing ? 'Edit' : 'Add' }} Project</h2>

            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Title</label>
                <input v-model="form.title" type="text" required placeholder="Project title" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="form.description" rows="3" required placeholder="Project description" />
              </div>
              <div class="form-group">
                <label>Technologies (select from Skills)</label>
                <p v-if="!technologyOptions.length" class="text-xs text-amber-300 mb-2">
                  Chua co skills trong Admin About. Hay cap nhat Skills truoc.
                </p>
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label
                    v-for="tech in technologyOptions"
                    :key="tech"
                    class="flex items-center gap-2 text-sm text-gray-300 border border-white/10 rounded-lg px-2 py-1"
                  >
                    <input v-model="selectedTechnologies" :value="tech" type="checkbox" class="w-4 h-4 accent-blue-500" />
                    <span>{{ tech }}</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>Related Blog</label>
                <select v-model="form.relatedBlogId">
                  <option value="">No related blog</option>
                  <option v-for="post in blogOptions" :key="post._id" :value="post._id">{{ post.title }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>GitHub URL</label>
                <input v-model="form.githubUrl" type="url" placeholder="https://github.com/..." />
              </div>
              <div class="form-group">
                <label>Live URL</label>
                <input v-model="form.liveUrl" type="url" placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <ImageDropUpload v-model="form.imageUrl" folder="portfolio/projects" />
              </div>
              <div class="flex items-center gap-3 mb-6">
                <input id="featured" v-model="form.featured" type="checkbox" class="w-4 h-4 accent-blue-500" />
                <label for="featured" class="text-gray-400 text-sm cursor-pointer">Featured project</label>
              </div>

              <div class="admin-modal__actions">
                <button type="button" class="btn btn--secondary" @click="showModal = false">Cancel</button>
                <button type="submit" class="btn btn--primary" :disabled="projectsStore.loading">
                  {{ isEditing ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <ConfirmDialog
        :open="isDeleteDialogOpen"
        title="Delete project"
        message="This project will be permanently removed."
        confirm-text="Delete"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types'

interface ProjectFormState {
  title: string
  description: string
  githubUrl: string
  liveUrl: string
  imageUrl: string
  relatedBlogId: string
  featured: boolean
}

function createInitialFormState(): ProjectFormState {
  return {
    title: '',
    description: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    relatedBlogId: '',
    featured: false,
  }
}

const projectsStore = useProjectsStore()
const aboutStore = useAboutStore()
const blogStore = useBlogStore()
const loading = computed(() => projectsStore.loading)
const showModal = ref(false)
const editingProject = ref<Project | null>(null)
const { isOpen: isDeleteDialogOpen, request: requestDelete, cancel: cancelDelete, consume: consumeDelete } = useConfirmDialog()
const selectedTechnologies = ref<string[]>([])
const isEditing = computed(() => Boolean(editingProject.value?._id))
const blogOptions = computed(() => blogStore.posts)
const blogTitleById = computed(() => {
  return blogStore.posts.reduce<Record<string, string>>((acc, post) => {
    if (post._id) acc[post._id] = post.title
    return acc
  }, {})
})

const technologyOptions = computed(() => {
  const skills = aboutStore.aboutData?.skills || []
  const editingTech = editingProject.value?.technologies || []
  return Array.from(new Set([...skills, ...editingTech]))
})

function getRelatedBlogTitle(relatedBlogId?: string): string {
  if (!relatedBlogId) return '-'
  return blogTitleById.value[relatedBlogId] || 'Unavailable'
}

const form = reactive<ProjectFormState>(createInitialFormState())

function resetForm(): void {
  Object.assign(form, createInitialFormState())
  selectedTechnologies.value = []
}

function fillFormFromProject(project: Project): void {
  form.title = project.title
  form.description = project.description
  form.githubUrl = project.githubUrl || ''
  form.liveUrl = project.liveUrl || ''
  form.imageUrl = project.imageUrl || ''
  form.relatedBlogId = project.relatedBlogId || ''
  form.featured = project.featured
  selectedTechnologies.value = [...project.technologies]
}

function openModal(project?: Project) {
  editingProject.value = project || null
  if (project) {
    fillFormFromProject(project)
  } else {
    resetForm()
  }
  showModal.value = true
}

async function handleSubmit() {
  const technologies = selectedTechnologies.value
  if (technologies.length === 0) {
    alert('Hay chon it nhat 1 technology tu Skills.')
    return
  }

  const data = {
    ...form,
    relatedBlogId: form.relatedBlogId || undefined,
    technologies,
  }

  if (editingProject.value?._id) {
    await projectsStore.updateProject(editingProject.value._id, data)
  } else {
    await projectsStore.createProject(data)
  }
  showModal.value = false
}

async function handleDelete(id: string) {
  requestDelete(id)
}

async function confirmDelete() {
  const id = consumeDelete()
  if (!id) return
  await projectsStore.deleteProject(id)
}

onMounted(async () => {
  await Promise.all([projectsStore.fetchProjects(), aboutStore.fetchAboutData(), blogStore.fetchPosts(true)])
})
</script>
