<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container">
      <AdminSectionHeader kicker="Inbox" title-before="Contact " title-highlight="Messages" />

      <LoadingSpinner v-if="loading" />

      <div v-else-if="messages.length" class="space-y-4">
        <div
          v-for="msg in messages"
          :key="msg._id"
          class="admin-panel p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 class="font-bold text-white">{{ msg.name }}</h3>
              <a :href="`mailto:${msg.email}`" class="text-blue-400 text-sm hover:underline">{{ msg.email }}</a>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-500 text-xs">{{ formatDate(msg.createdAt) }}</span>
              <button class="btn btn--danger btn--sm inline-flex items-center gap-1.5" @click="handleDelete(msg._id!)">
                <IconGlyph name="trash" :size="12" />
                Delete
              </button>
            </div>
          </div>
          <p class="text-purple-400 font-medium text-sm mb-3">{{ msg.subject }}</p>
          <p class="text-gray-400 leading-relaxed">{{ msg.message }}</p>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        No messages yet.
      </div>

      <ConfirmDialog
        :open="isDeleteDialogOpen"
        title="Delete message"
        message="This message will be removed permanently."
        confirm-text="Delete"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useContactStore } from '@/stores/contact'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const contactStore = useContactStore()
const loading = computed(() => contactStore.loading)
const messages = computed(() => contactStore.messages)
const { isOpen: isDeleteDialogOpen, request: requestDelete, cancel: cancelDelete, consume: consumeDelete } = useConfirmDialog()

async function handleDelete(id: string) {
  requestDelete(id)
}

async function confirmDelete() {
  const id = consumeDelete()
  if (!id) return
  await contactStore.deleteMessage(id)
}

function formatDate(date?: string): string {
  if (!date) return ''
  return dateFormatter.format(new Date(date))
}

onMounted(() => contactStore.fetchMessages())
</script>
