<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <LoadingSpinner />
      <p class="text-gray-400 mt-4">Completing authentication...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    try {
      await authStore.handleCallback(token)
      router.push('/admin')
    } catch {
      router.push('/')
    }
  } else {
    router.push('/')
  }
})
</script>
