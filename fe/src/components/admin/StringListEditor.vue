<template>
  <div class="space-y-3">
    <div class="flex items-end gap-2">
      <div class="form-group flex-1">
        <label>{{ label }}</label>
        <input v-model="newItem" type="text" :placeholder="placeholder" @keydown.enter.prevent="addItem" />
      </div>
      <button type="button" class="btn btn--secondary" @click="addItem">Add</button>
    </div>

    <p v-if="description" class="text-xs text-gray-500">{{ description }}</p>

    <div v-if="items.length" class="flex flex-wrap gap-2">
      <button
        v-for="item in items"
        :key="item"
        type="button"
        class="card__tag inline-flex items-center gap-2"
        @click="removeItem(item)"
      >
        <span>{{ item }}</span>
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <p v-else class="text-sm text-gray-500">No categories added yet.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string[]
  label: string
  placeholder?: string
  description?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const newItem = ref('')

const items = computed(() => props.modelValue || [])

function normalizeItem(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function addItem(): void {
  const value = normalizeItem(newItem.value)
  if (!value) return

  const nextItems = Array.from(new Set([...items.value, value]))
  emit('update:modelValue', nextItems)
  newItem.value = ''
}

function removeItem(item: string): void {
  emit('update:modelValue', items.value.filter((value) => value !== item))
}
</script>
