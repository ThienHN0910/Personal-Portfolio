import { ref } from 'vue'
import gsap from 'gsap'

export type CursorMode =
  | 'default'
  | 'pointer'
  | 'view'
  | 'read'
  | 'copy'
  | 'code'
  | 'visit'
  | 'verify'
  | 'chat'
  | 'explore'
  | 'magnetic'
  | 'text'

export interface CustomCursorState {
  x: number
  y: number
  targetX: number
  targetY: number
  mode: CursorMode
  label: string
  isActive: boolean
  isVisible: boolean
}

const cursorState = ref<CustomCursorState>({
  x: -100,
  y: -100,
  targetX: -100,
  targetY: -100,
  mode: 'default',
  label: '',
  isActive: false,
  isVisible: false,
})

let isTouchDevice = false

const DEFAULT_LABELS: Record<string, string> = {
  view: 'View',
  read: 'Read',
  copy: 'Copy',
  code: 'Code',
  visit: 'Visit',
  verify: 'Verify',
  chat: 'Say Hi',
  explore: 'Explore',
}

export function useCustomCursor() {
  function setCursorMode(mode: CursorMode, label = '') {
    if (isTouchDevice) return
    cursorState.value.mode = mode
    cursorState.value.label = label || DEFAULT_LABELS[mode] || ''
  }

  function resetCursorMode() {
    cursorState.value.mode = 'default'
    cursorState.value.label = ''
  }

  function initCursor() {
    if (typeof window === 'undefined') return
    isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) return

    const onMouseMove = (e: MouseEvent) => {
      cursorState.value.targetX = e.clientX
      cursorState.value.targetY = e.clientY
      if (!cursorState.value.isVisible) {
        cursorState.value.isVisible = true
        cursorState.value.x = e.clientX
        cursorState.value.y = e.clientY
      }
    }

    const onMouseLeave = () => {
      cursorState.value.isVisible = false
    }

    const onMouseEnter = () => {
      cursorState.value.isVisible = true
    }

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const cardEl = target.closest('[data-cursor]') as HTMLElement | null
      if (cardEl) {
        const cursorType = cardEl.getAttribute('data-cursor') as CursorMode
        const customLabel = cardEl.getAttribute('data-cursor-label') || DEFAULT_LABELS[cursorType] || ''
        setCursorMode(cursorType || 'pointer', customLabel)
        return
      }

      const interactive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')
      if (interactive) {
        setCursorMode('pointer')
      } else {
        resetCursorMode()
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', handlePointerOver, { passive: true })

    // 60fps ticker loop for smooth inertia trailing
    const tickerCallback = () => {
      const dt = 0.18
      cursorState.value.x += (cursorState.value.targetX - cursorState.value.x) * dt
      cursorState.value.y += (cursorState.value.targetY - cursorState.value.y) * dt
    }

    gsap.ticker.add(tickerCallback)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', handlePointerOver)
      gsap.ticker.remove(tickerCallback)
    }
  }

  return {
    cursorState,
    setCursorMode,
    resetCursorMode,
    initCursor,
  }
}
