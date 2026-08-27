<template>
  <div class="flex items-center justify-center" :class="wrapperClass">
    <div class="relative flex items-center justify-center" :class="sizeClass">
      <!-- Outer Ring -->
      <div
        class="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin"
        style="animation-duration: 0.9s;"
      />
      <!-- Inner Ring -->
      <div
        class="absolute inset-1.5 rounded-full border-2 border-indigo-400/20 border-b-indigo-400 animate-spin"
        style="animation-duration: 1.4s; animation-direction: reverse;"
      />
      <!-- Center Glow Core -->
      <div class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse" />
    </div>
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
