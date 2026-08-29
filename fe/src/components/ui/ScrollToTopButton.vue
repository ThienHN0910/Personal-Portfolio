<template>
  <Transition name="scroll-fab">
    <button
      v-if="visible"
      type="button"
      aria-label="Scroll to top"
      class="scroll-fab"
      @click="handleClick"
    >
      <svg
        class="w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const SCROLL_THRESHOLD = 300
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > SCROLL_THRESHOLD
}

function handleClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.scroll-fab {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 200;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-ink, #1a1a1a);
  color: var(--color-surface, #f8f7f5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.18),
    0 1px 3px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition:
    transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 200ms ease,
    opacity 200ms ease;
  -webkit-tap-highlight-color: transparent;
}

.scroll-fab:hover {
  transform: translateY(-2px) scale(1.06);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.24),
    0 2px 6px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.scroll-fab:active {
  transform: scale(0.93);
}

/* Transition: slide up + fade */
.scroll-fab-enter-active {
  transition:
    opacity 260ms ease,
    transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scroll-fab-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.scroll-fab-enter-from,
.scroll-fab-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.88);
}
</style>
