<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container">
      <AdminSectionHeader kicker="Portfolio Control" title-before="Manage " title-highlight="Case Studies">
        <template #actions>
          <button class="btn btn--primary inline-flex items-center gap-2" @click="openModal()">
            <IconGlyph name="add" :size="14" />
            Add Case Study
          </button>
        </template>
      </AdminSectionHeader>

      <LoadingSpinner v-if="loading" />

      <div v-else class="admin-panel overflow-x-auto p-2">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th class="hidden md:table-cell">Priority</th>
              <th class="hidden xl:table-cell">Duration</th>
              <th class="hidden md:table-cell">Categories</th>
              <th class="hidden md:table-cell">Technologies</th>
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
              <td class="hidden md:table-cell text-gray-200">{{ project.priority || 0 }}</td>
              <td class="hidden xl:table-cell text-gray-300 text-sm">{{ project.duration || '-' }}</td>
              <td class="hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="category in (project.categories || []).slice(0, 2)" :key="category" class="card__tag">{{ category }}</span>
                </div>
              </td>
              <td class="hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tech in project.technologies.slice(0, 3)" :key="tech" class="card__tag">{{ tech }}</span>
                </div>
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
      <Teleport to="body">
        <Transition name="admin-fade-scale">
          <div v-if="showModal" class="admin-modal-backdrop">
            <div class="admin-modal max-w-2xl">
              <p class="admin-kicker mb-2">Case Study &amp; Architecture Editor</p>
              <h2 class="admin-modal__title">{{ isEditing ? 'Edit' : 'Add' }} Case Study</h2>

              <form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <label>Title</label>
                  <input v-model="form.title" type="text" required placeholder="Project title" />
                </div>
                <div class="form-group">
                  <label>Executive Overview (Short summary for cards &amp; overview)</label>
                  <textarea
                    v-model="form.description"
                    required
                    rows="3"
                    class="w-full bg-slate-900/80 border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Brief executive summary of the system architecture and objectives..."
                  />
                </div>
                <div class="form-group">
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <label class="!mb-0">Technical Context / Architecture Dossier (Rich CKEditor)</label>
                    <button
                      type="button"
                      class="btn btn--sm text-xs py-1 px-3 border border-indigo-400/40 rounded bg-slate-900/90 text-indigo-300 hover:text-white hover:bg-indigo-600/30 flex items-center gap-1.5 transition-all"
                      :disabled="isGeneratingMetadata || (!form.title && !form.description && !form.context)"
                      @click="handleGenerateMetadata"
                    >
                      <span v-if="isGeneratingMetadata" class="animate-spin">⏳</span>
                      <span v-else>✨</span>
                      {{ isGeneratingMetadata ? 'Analyzing...' : 'AI Auto-Detect Category & Stack' }}
                    </button>
                  </div>
                  <FullRichEditor
                    v-model="form.context"
                    :editor-key="editorRenderKey"
                    :sticky-top="0"
                    upload-folder="portfolio/projects/content"
                    placeholder="Write detailed system design breakdown, paste raw CONTEXT.md, or use AI assistant..."
                  />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="form-group">
                    <label>Duration / Timeline</label>
                    <input v-model="form.duration" type="text" placeholder="3 months (2025)" />
                  </div>
                  <div class="form-group">
                    <label>Priority (higher first)</label>
                    <input v-model.number="form.priority" type="number" min="0" step="1" />
                  </div>
                </div>

                <div class="form-group">
                  <CategoryCheckboxGroup
                    v-model="selectedCategories"
                    label="Case study categories"
                    description="Choose the best categories for this case study."
                    :options="projectCategoryOptions"
                    empty-message="No case study categories available. Open Admin Categories to add some."
                  />
                </div>
                <div class="form-group">
                  <label>Technologies (select from Skills)</label>
                  <p v-if="!technologyOptions.length" class="text-xs text-amber-300 mb-2">
                    Chưa có skills trong Admin About. Hãy cập nhật Skills trước.
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
                  <label>GitHub Repository URL</label>
                  <input v-model="form.githubUrl" type="url" placeholder="https://github.com/..." />
                </div>
                <div class="form-group">
                  <label>Live Deployment URL</label>
                  <input v-model="form.liveUrl" type="url" placeholder="https://..." />
                </div>
                <div class="form-group">
                  <label>Main Cover Image</label>
                  <ImageDropUpload v-model="form.imageUrl" folder="portfolio/projects" />
                </div>
                <div class="flex items-center gap-3 mb-6">
                  <input id="featured" v-model="form.featured" type="checkbox" class="w-4 h-4 accent-blue-500" />
                  <label for="featured" class="text-gray-400 text-sm cursor-pointer">Featured Case Study</label>
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
      </Teleport>

      <ConfirmDialog
        :open="isDeleteDialogOpen"
        title="Delete case study"
        message="This case study will be permanently removed."
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
import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import api from '@/utils/api'
import { useAboutStore } from '@/stores/about'
import { useCategoriesStore } from '@/stores/categories'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types'

const FullRichEditor = defineAsyncComponent({
  loader: () => import('@/components/admin/FullRichEditor.vue'),
  loadingComponent: EditorLoadingSkeleton,
})

interface ProjectFormState {
  title: string
  description: string
  context: string
  duration: string
  priority: number
  categories: string[]
  githubUrl: string
  liveUrl: string
  imageUrl: string
  featured: boolean
}

function createInitialFormState(): ProjectFormState {
  return {
    title: '',
    description: '',
    context: '',
    duration: '',
    priority: 0,
    categories: [],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
  }
}

const projectsStore = useProjectsStore()
const aboutStore = useAboutStore()
const categoriesStore = useCategoriesStore()

const loading = computed(() => projectsStore.loading)
const showModal = ref(false)
const editingProject = ref<Project | null>(null)
const { isOpen: isDeleteDialogOpen, request: requestDelete, cancel: cancelDelete, consume: consumeDelete } = useConfirmDialog()
const selectedTechnologies = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const editorRenderKey = ref(0)
const isGeneratingMetadata = ref(false)

const isEditing = computed(() => Boolean(editingProject.value?._id))
const projectCategoryOptions = computed(() => categoriesStore.categorySettings.projectCategories)

const technologyOptions = computed(() => {
  const skills = aboutStore.aboutData?.skills || []
  const editingTech = editingProject.value?.technologies || []
  return Array.from(new Set([...skills, ...editingTech]))
})

const form = reactive<ProjectFormState>(createInitialFormState())

function resetForm(): void {
  Object.assign(form, createInitialFormState())
  selectedTechnologies.value = []
  selectedCategories.value = []
}

function fillFormFromProject(project: Project): void {
  form.title = project.title
  form.description = project.description || ''
  form.context = project.context || ''
  form.duration = project.duration || ''
  form.priority = project.priority || 0
  form.categories = [...(project.categories || [])]
  form.githubUrl = project.githubUrl || ''
  form.liveUrl = project.liveUrl || ''
  form.imageUrl = project.imageUrl || ''
  form.featured = project.featured
  selectedTechnologies.value = [...project.technologies]
  selectedCategories.value = [...(project.categories || [])]
}

function openModal(project?: Project) {
  editingProject.value = project || null
  if (project) {
    fillFormFromProject(project)
  } else {
    resetForm()
  }
  editorRenderKey.value += 1
  showModal.value = true
}

async function handleGenerateMetadata() {
  const combinedContent = `${form.description}\n\n${form.context}`.trim()
  if (!form.title && !combinedContent) {
    alert('Please enter a case study title, description, or context first.')
    return
  }

  isGeneratingMetadata.value = true
  try {
    const res = await api.post<{ success: boolean; data: { excerpt?: string; tags?: string[]; suggestedCategory?: string } }>('/ai/generate-metadata', {
      title: form.title,
      content: combinedContent,
    })

    if (res.data.success && res.data.data) {
      const { tags, suggestedCategory } = res.data.data
      if (suggestedCategory && !selectedCategories.value.length) {
        const matched = projectCategoryOptions.value.find(c => c.toLowerCase() === suggestedCategory.toLowerCase())
        if (matched) selectedCategories.value = [matched]
        else if (projectCategoryOptions.value.length) selectedCategories.value = [projectCategoryOptions.value[0]]
      }

      if (Array.isArray(tags) && tags.length) {
        const matchedTechs = technologyOptions.value.filter(tech => 
          tags.some(t => tech.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(tech.toLowerCase()))
        )
        if (matchedTechs.length) {
          selectedTechnologies.value = Array.from(new Set([...selectedTechnologies.value, ...matchedTechs]))
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata for case study:', error)
  } finally {
    isGeneratingMetadata.value = false
  }
}

async function handleSubmit() {
  const technologies = selectedTechnologies.value
  if (technologies.length === 0) {
    alert('Please select at least 1 technology from Skills.')
    return
  }

  const data = {
    ...form,
    categories: selectedCategories.value,
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
  await Promise.all([
    projectsStore.fetchProjects(),
    aboutStore.fetchAboutData(),
    categoriesStore.fetchCategories(),
  ])
})
</script>
