<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md"
        data-lenis-prevent
        @click.self="emit('close')"
      >
        <div class="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center space-y-3">
          <!-- Close button -->
          <button
            type="button"
            class="absolute -top-10 right-0 sm:top-2 sm:right-2 w-9 h-9 rounded-full bg-bone border border-stroke text-ink flex items-center justify-center text-sm font-mono hover:border-ink/40 transition-all z-10 shadow-lg cursor-pointer"
            @click="emit('close')"
            aria-label="Close Lightbox"
          >
            ✕
          </button>

          <!-- Main Image Frame -->
          <div class="relative overflow-hidden rounded-xl border border-stroke bg-bone shadow-2xl max-h-[80vh] flex items-center justify-center">
            <img
              :src="src"
              :alt="alt"
              class="w-auto h-auto max-h-[80vh] max-w-full object-contain"
            />
          </div>

          <!-- Caption -->
          <p v-if="caption" class="text-xs font-mono text-ink-secondary text-center max-w-2xl px-4 py-1.5 rounded-full bg-bone/90 border border-stroke">
            {{ caption }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  src: string
  alt?: string
  caption?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
