<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <template v-if="!errorMessage">
        <LoadingSpinner />
        <p class="text-gray-400 mt-4">Completing authentication...</p>
      </template>
      <template v-else>
        <p role="alert" class="text-red-400 text-sm">{{ errorMessage }}</p>
        <p class="text-gray-500 mt-2 text-xs">Redirecting to the home page...</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized_account: 'This Google account is not allowed to access the admin area.',
  access_denied: 'Google sign-in was cancelled.',
}

function describeError(code: string): string {
  return ERROR_MESSAGES[code] ?? `Login failed (${code}). Please try again.`
}

onMounted(async () => {
  const error = route.query.error as string
  const token = route.query.token as string

  if (error) {
    errorMessage.value = describeError(error)
    setTimeout(() => {
      router.push(`/?error=${encodeURIComponent(error)}`)
    }, 2500)
    return
  }

  if (token) {
    try {
      await authStore.handleCallback(token)
      router.push('/admin')
    } catch {
      errorMessage.value = 'Login failed. Please try again.'
      setTimeout(() => {
        router.push('/?error=auth_callback_failed')
      }, 1500)
    }
  } else {
    errorMessage.value = 'Missing auth token from Google callback.'
    setTimeout(() => {
      router.push('/?error=auth_token_missing')
    }, 1500)
  }
})
</script>
