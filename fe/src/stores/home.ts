import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HomeData } from '@/types'
import api from '@/utils/api'

export const useHomeStore = defineStore('home', () => {
  const homeData = ref<HomeData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchHomeData() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: HomeData }>('/home')
      if (response.data.success && response.data.data) {
        homeData.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to fetch home data'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function updateHomeData(data: Partial<HomeData>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<{ success: boolean; data: HomeData }>('/home', data)
      if (response.data.success && response.data.data) {
        homeData.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to update home data'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { homeData, loading, error, fetchHomeData, updateHomeData }
})
