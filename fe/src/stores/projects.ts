import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaginationMeta, Project } from '@/types'
import api from '@/utils/api'

interface FetchProjectsOptions {
  page?: number
  limit?: number
  query?: string
  category?: string
  append?: boolean
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function sortProjects(items: Project[]): Project[] {
    return [...items].sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0)
      if (priorityDiff !== 0) return priorityDiff

      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
      }

      const timeA = a.createdAt ? Date.parse(a.createdAt) : 0
      const timeB = b.createdAt ? Date.parse(b.createdAt) : 0
      return timeB - timeA
    })
  }

  async function fetchProjects(options: FetchProjectsOptions = {}) {
    const { page, limit, query, category, append = false } = options

    loading.value = true
    error.value = null
    try {
      const params: Record<string, string> = {}
      if (page !== undefined) params.page = String(page)
      if (limit !== undefined) params.limit = String(limit)
      if (query?.trim()) params.q = query.trim()
      if (category?.trim()) params.category = category.trim()

      const response = await api.get<{ success: boolean; data: Project[]; pagination?: PaginationMeta }>('/projects', {
        params: Object.keys(params).length ? params : undefined,
      })
      if (response.data.success && response.data.data) {
        projects.value = append ? sortProjects([...projects.value, ...response.data.data]) : sortProjects(response.data.data)
      }
      return response.data.pagination ?? null
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error(err)
      return null
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
        projects.value = sortProjects([...projects.value, response.data.data])
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
        projects.value = sortProjects(projects.value)
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
