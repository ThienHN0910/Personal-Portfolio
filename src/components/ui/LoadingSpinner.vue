<template>
  <div class="flex items-center justify-center" :class="wrapperClass">
    <div
      class="animate-spin rounded-full border-2 border-transparent"
      :class="[sizeClass, 'border-t-blue-500 border-r-blue-500']"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    fullScreen?: boolean
  }>(),
  { size: 'md', fullScreen: false },
)

const sizeClass = computed(() => ({
  sm: 'w-5 h-5',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}[props.size]))

const wrapperClass = computed(() => props.fullScreen ? 'min-h-screen' : 'py-12')
</script>
