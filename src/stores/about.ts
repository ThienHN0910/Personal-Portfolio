import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AboutData } from '@/types'
import api from '@/utils/api'

export const useAboutStore = defineStore('about', () => {
  const aboutData = ref<AboutData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAboutData() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: AboutData }>('/about')
      if (response.data.success && response.data.data) {
        aboutData.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to fetch about data'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function updateAboutData(data: Partial<AboutData>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<{ success: boolean; data: AboutData }>('/about', data)
      if (response.data.success && response.data.data) {
        aboutData.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to update about data'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { aboutData, loading, error, fetchAboutData, updateAboutData }
})
