import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { setToken, setUser, clearAuth, getToken, getUser } from '@/utils/auth'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const user = ref<User | null>(getUser() as User | null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setAuthData(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    setToken(newToken)
    setUser(newUser as unknown as Record<string, unknown>)
  }

  function loginWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/google`
  }

  async function handleCallback(callbackToken: string) {
    try {
      const response = await api.get<{ success: boolean; data: { token: string; user: User } }>(
        `/auth/callback?token=${callbackToken}`,
      )
      if (response.data.success && response.data.data) {
        setAuthData(response.data.data.token, response.data.data.user)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    clearAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    loginWithGoogle,
    handleCallback,
    logout,
  }
})
