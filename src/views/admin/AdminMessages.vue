<template>
  <div class="section min-h-screen pt-24">
    <div class="container">
      <h1 class="section-title mb-8">Contact <span class="highlight">Messages</span></h1>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="messages.length" class="space-y-4">
        <div
          v-for="msg in messages"
          :key="msg._id"
          class="card p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 class="font-bold text-white">{{ msg.name }}</h3>
              <a :href="`mailto:${msg.email}`" class="text-blue-400 text-sm hover:underline">{{ msg.email }}</a>
            </div>
            <span class="text-gray-500 text-xs">{{ formatDate(msg.createdAt) }}</span>
          </div>
          <p class="text-purple-400 font-medium text-sm mb-3">{{ msg.subject }}</p>
          <p class="text-gray-400 leading-relaxed">{{ msg.message }}</p>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        No messages yet.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useContactStore } from '@/stores/contact'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const contactStore = useContactStore()
const loading = computed(() => contactStore.loading)
const messages = computed(() => contactStore.messages)

function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => contactStore.fetchMessages())
</script>
