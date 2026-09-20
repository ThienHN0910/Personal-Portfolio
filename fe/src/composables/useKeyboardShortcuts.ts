import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useCommandPalette } from '@/composables/useCommandPalette'

const isShortcutsOpen = ref(false)

export function useKeyboardShortcuts() {
  const { togglePalette } = useCommandPalette()

  function openShortcuts(): void {
    isShortcutsOpen.value = true
  }

  function closeShortcuts(): void {
    isShortcutsOpen.value = false
  }

  function toggleShortcuts(): void {
    isShortcutsOpen.value = !isShortcutsOpen.value
  }

  function navigateCaseStudies(direction: 1 | -1): void {
    if (typeof window === 'undefined') return

    const caseCards = Array.from(document.querySelectorAll<HTMLElement>('[data-case-card], [data-project-card], .editorial-card'))
    if (caseCards.length > 0) {
      if (direction === 1) {
        const target = caseCards.find((el) => el.getBoundingClientRect().top > 120)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      } else {
        const reversed = [...caseCards].reverse()
        const target = reversed.find((el) => el.getBoundingClientRect().bottom < window.innerHeight - 120)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      }
    }

    window.scrollBy({ top: direction * 380, behavior: 'smooth' })
  }

  function handleGlobalKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement | null
    const isInput =
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        Boolean(target.closest('[contenteditable="true"]')))

    // 1. Always handle Ctrl+K / Cmd+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      togglePalette()
      return
    }

    // 2. Ignore other shortcuts if inside input or modifier keys held
    if (isInput || e.metaKey || e.ctrlKey || e.altKey) {
      return
    }

    // 3. Ignore if on admin routes
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return
    }

    // 4. Handle Escape
    if (e.key === 'Escape') {
      if (isShortcutsOpen.value) {
        e.preventDefault()
        closeShortcuts()
      }
      return
    }

    // 5. Handle ? (Shift + /)
    if (e.key === '?') {
      e.preventDefault()
      toggleShortcuts()
      return
    }

    // 6. Handle T: Cycle Theme
    if (e.key.toLowerCase() === 't') {
      e.preventDefault()
      const themeStore = useThemeStore()
      themeStore.cycleTheme()
      return
    }

    // 7. Handle J / K: Next / Previous
    if (e.key.toLowerCase() === 'j') {
      e.preventDefault()
      navigateCaseStudies(1)
      return
    }
    if (e.key.toLowerCase() === 'k') {
      e.preventDefault()
      navigateCaseStudies(-1)
      return
    }
  }

  function initKeyboardListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleGlobalKeydown)
    }
  }

  function destroyKeyboardListeners(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleGlobalKeydown)
    }
  }

  return {
    isShortcutsOpen,
    openShortcuts,
    closeShortcuts,
    toggleShortcuts,
    handleGlobalKeydown,
    initKeyboardListeners,
    destroyKeyboardListeners,
  }
}
