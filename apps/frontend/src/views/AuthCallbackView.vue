<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <LoadingSpinner />
      <p class="text-gray-400 mt-4">Completing authentication...</p>
      <p v-if="errorMessage" class="text-red-400 mt-3 text-sm">{{ errorMessage }}</p>
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

onMounted(async () => {
  const error = route.query.error as string
  const token = route.query.token as string

  if (error) {
    errorMessage.value = `Login failed: ${error}`
    setTimeout(() => {
      router.push(`/?error=${encodeURIComponent(error)}`)
    }, 1800)
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
