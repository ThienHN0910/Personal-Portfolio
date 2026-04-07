import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BlogPost } from '@/types'
import api from '@/utils/api'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts(includeAll = false) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: BlogPost[] }>('/blog', {
        params: includeAll ? { all: 'true' } : undefined,
      })
      if (response.data.success && response.data.data) {
        posts.value = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to fetch blog posts'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPost(id: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<{ success: boolean; data: BlogPost }>(`/blog/${id}`)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function createPost(data: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ success: boolean; data: BlogPost }>('/blog', data)
      if (response.data.success && response.data.data) {
        posts.value.unshift(response.data.data)
      }
    } catch (err) {
      error.value = 'Failed to create post'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePost(id: string, data: Partial<BlogPost>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<{ success: boolean; data: BlogPost }>(`/blog/${id}`, data)
      if (response.data.success && response.data.data) {
        const index = posts.value.findIndex((p) => p._id === id)
        if (index !== -1) posts.value[index] = response.data.data
      }
    } catch (err) {
      error.value = 'Failed to update post'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePost(id: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/blog/${id}`)
      posts.value = posts.value.filter((p) => p._id !== id)
    } catch (err) {
      error.value = 'Failed to delete post'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { posts, loading, error, fetchPosts, fetchPost, createPost, updatePost, deletePost }
})
