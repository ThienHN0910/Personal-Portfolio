<template>
  <div class="space-y-3">
    <div class="flex items-end justify-between gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">{{ label }}</label>
        <p v-if="description" class="text-xs text-gray-500">{{ description }}</p>
      </div>
      <button type="button" class="btn btn--secondary btn--sm" @click="clearSelection">Clear</button>
    </div>

    <div v-if="options.length" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <label
        v-for="option in options"
        :key="option"
        class="flex items-center gap-2 text-sm text-gray-300 border border-white/10 rounded-lg px-2 py-1"
      >
        <input v-model="selectedValues" :value="option" type="checkbox" class="w-4 h-4 accent-blue-500" />
        <span>{{ option }}</span>
      </label>
    </div>

    <p v-else class="text-sm text-gray-500">{{ emptyMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string[]
  options: string[]
  label: string
  description?: string
  emptyMessage?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedValues = computed({
  get: () => props.modelValue || [],
  set: (value: string[]) => emit('update:modelValue', Array.from(new Set(value))),
})

const emptyMessage = computed(() => props.emptyMessage || 'No categories available.')

function clearSelection(): void {
  emit('update:modelValue', [])
}
</script>
