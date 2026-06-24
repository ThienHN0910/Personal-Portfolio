import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContactMessage } from '@/types'
import api from '@/utils/api'

export const useContactStore = defineStore('contact', () => {
  const messages = ref<ContactMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function sendMessage(data: Omit<ContactMessage, '_id' | 'createdAt'> & { cfTurnstileResponse?: string }) {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await api.post<{ success: boolean; message: string }>('/contact', data)
      if (response.data.success) {
        success.value = true
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to send message'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMessages() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: ContactMessage[] }>('/contact')
      if (response.data.success && response.data.data) {
        messages.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to fetch messages'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function deleteMessage(id: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/contact/${id}`)
      messages.value = messages.value.filter((m) => m._id !== id)
    } catch (err) {
      error.value = 'Failed to delete message'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { messages, loading, error, success, sendMessage, fetchMessages, deleteMessage }
})
