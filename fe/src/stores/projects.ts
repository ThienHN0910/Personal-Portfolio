import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types'
import api from '@/utils/api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: Project[] }>('/projects')
      if (response.data.success && response.data.data) {
        projects.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: string): Promise<Project | null> {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: Project }>(`/projects/${id}`)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      return null
    } catch (err) {
      error.value = 'Failed to fetch project'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ success: boolean; data: Project }>('/projects', data)
      if (response.data.success && response.data.data) {
        projects.value.unshift(response.data.data)
      }
    } catch (err) {
      error.value = 'Failed to create project'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: string, data: Partial<Project>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<{ success: boolean; data: Project }>(`/projects/${id}`, data)
      if (response.data.success && response.data.data) {
        const index = projects.value.findIndex((p) => p._id === id)
        if (index !== -1) projects.value[index] = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to update project'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter((p) => p._id !== id)
    } catch (err) {
      error.value = 'Failed to delete project'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { projects, loading, error, fetchProjects, fetchProject, createProject, updateProject, deleteProject }
})
