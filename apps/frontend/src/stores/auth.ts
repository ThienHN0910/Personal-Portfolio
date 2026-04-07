import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { setToken, setUser, clearAuth, getToken, getUser } from '@/utils/auth'

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

  function resolveApiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  }

  function loginWithGoogle() {
    window.location.href = `${resolveApiBaseUrl()}/auth/google`
  }

  function decodeJwtPayload(payloadPart: string): string {
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  function parseUserFromToken(jwtToken: string): User {
    const parts = jwtToken.split('.')
    if (parts.length < 2) {
      throw new Error('Invalid auth token format')
    }

    const decoded = decodeJwtPayload(parts[1])
    const parsed = JSON.parse(decoded) as Partial<User>

    if (!parsed.id || !parsed.email || !parsed.name) {
      throw new Error('Missing required user fields in auth token')
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role === 'admin' ? 'admin' : 'user',
      avatar: parsed.avatar,
    }
  }

  async function handleCallback(callbackToken: string) {
    const parsedUser = parseUserFromToken(callbackToken)
    setAuthData(callbackToken, parsedUser)
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
