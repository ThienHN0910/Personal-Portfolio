<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <div class="flex items-center justify-between mb-8">
        <h1 class="section-title mb-0">Manage <span class="highlight">Projects</span></h1>
        <button class="btn btn--primary" @click="openModal()">
          + Add Project
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Title</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400 hidden md:table-cell">Technologies</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400 hidden sm:table-cell">Featured</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projectsStore.projects"
              :key="project._id"
              class="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <td class="py-4 px-4 text-white font-medium">{{ project.title }}</td>
              <td class="py-4 px-4 hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="tech in project.technologies.slice(0, 3)" :key="tech" class="card__tag">{{ tech }}</span>
                </div>
              </td>
              <td class="py-4 px-4 hidden sm:table-cell">
                <span :class="project.featured ? 'text-green-400' : 'text-gray-500'" class="text-sm">
                  {{ project.featured ? '✓ Yes' : 'No' }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn btn--secondary btn--sm" @click="openModal(project)">Edit</button>
                  <button class="btn btn--danger btn--sm" @click="handleDelete(project._id!)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold text-white mb-6">{{ editingProject ? 'Edit' : 'Add' }} Project</h2>

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

            <div class="flex gap-3 justify-end">
              <button type="button" class="btn btn--secondary" @click="showModal = false">Cancel</button>
              <button type="submit" class="btn btn--primary" :disabled="projectsStore.loading">
                {{ editingProject ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAboutStore } from '@/stores/about'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types'

const projectsStore = useProjectsStore()
const aboutStore = useAboutStore()
const loading = computed(() => projectsStore.loading)
const showModal = ref(false)
const editingProject = ref<Project | null>(null)
const selectedTechnologies = ref<string[]>([])

const technologyOptions = computed(() => {
  const skills = aboutStore.aboutData?.skills || []
  const editingTech = editingProject.value?.technologies || []
  return Array.from(new Set([...skills, ...editingTech]))
})

const form = reactive({
  title: '',
  description: '',
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  featured: false,
})

function openModal(project?: Project) {
  editingProject.value = project || null
  if (project) {
    form.title = project.title
    form.description = project.description
    form.githubUrl = project.githubUrl || ''
    form.liveUrl = project.liveUrl || ''
    form.imageUrl = project.imageUrl || ''
    form.featured = project.featured
    selectedTechnologies.value = [...project.technologies]
  } else {
    form.title = ''
    form.description = ''
    form.githubUrl = ''
    form.liveUrl = ''
    form.imageUrl = ''
    form.featured = false
    selectedTechnologies.value = []
  }
  showModal.value = true
}

async function handleSubmit() {
  const technologies = selectedTechnologies.value
  if (technologies.length === 0) {
    alert('Hay chon it nhat 1 technology tu Skills.')
    return
  }

  const data = { ...form, technologies }

  if (editingProject.value?._id) {
    await projectsStore.updateProject(editingProject.value._id, data)
  } else {
    await projectsStore.createProject(data)
  }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this project?')) {
    await projectsStore.deleteProject(id)
  }
}

onMounted(async () => {
  await Promise.all([projectsStore.fetchProjects(), aboutStore.fetchAboutData()])
})
</script>
