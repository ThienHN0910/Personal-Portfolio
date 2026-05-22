import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CategorySettings } from '@/types'
import api from '@/utils/api'

const DEFAULT_CATEGORIES: CategorySettings = {
  projectCategories: ['AI', 'E-commerce', 'Management System', 'Multiplatform', 'Web App', 'Mobile App'],
  blogCategories: ['Dev Log', 'Overview', 'Interview Test', 'Case Study', 'Tutorial', 'Release Notes'],
}

export const useCategoriesStore = defineStore('categories', () => {
  const categorySettings = ref<CategorySettings>({ ...DEFAULT_CATEGORIES })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<{ success: boolean; data: CategorySettings }>('/categories')
      if (response.data.success && response.data.data) {
        categorySettings.value = {
          projectCategories: response.data.data.projectCategories.length ? response.data.data.projectCategories : DEFAULT_CATEGORIES.projectCategories,
          blogCategories: response.data.data.blogCategories.length ? response.data.data.blogCategories : DEFAULT_CATEGORIES.blogCategories,
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch category settings'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function updateCategories(data: CategorySettings): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.put<{ success: boolean; data: CategorySettings }>('/categories', data)
      if (response.data.success && response.data.data) {
        categorySettings.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to update category settings'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categorySettings,
    loading,
    error,
    fetchCategories,
    updateCategories,
  }
})
