import { ref } from 'vue'

const isOpen = ref(false)

export function useCommandPalette() {
  function openPalette() {
    isOpen.value = true
  }

  function closePalette() {
    isOpen.value = false
  }

  function togglePalette() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    openPalette,
    closePalette,
    togglePalette,
  }
}
