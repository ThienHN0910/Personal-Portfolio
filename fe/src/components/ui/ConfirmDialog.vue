<template>
  <Transition name="admin-fade-scale">
    <div v-if="open" class="admin-modal-backdrop" @click.self="emit('cancel')">
      <div class="admin-modal admin-modal--confirm">
        <p class="admin-kicker mb-2">Confirm Action</p>
        <h3 class="admin-modal__title">{{ title }}</h3>
        <p class="admin-modal__desc">{{ message }}</p>

        <div class="admin-modal__actions">
          <button type="button" class="btn btn--secondary" @click="emit('cancel')">{{ cancelText }}</button>
          <button type="button" class="btn" :class="confirmClass" @click="emit('confirm')">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'primary'
  }>(),
  {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const confirmClass = computed(() => (props.variant === 'danger' ? 'btn--danger' : 'btn--primary'))
</script>
