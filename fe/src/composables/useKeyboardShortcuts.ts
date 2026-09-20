import { ref } from 'vue'

const isShortcutsOpen = ref(false)

export function useKeyboardShortcuts() {
  function openShortcuts(): void {
    isShortcutsOpen.value = true
  }

  function closeShortcuts(): void {
    isShortcutsOpen.value = false
  }

  function toggleShortcuts(): void {
    isShortcutsOpen.value = !isShortcutsOpen.value
  }

  return {
    isShortcutsOpen,
    openShortcuts,
    closeShortcuts,
    toggleShortcuts,
  }
}
