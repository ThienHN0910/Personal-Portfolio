import { ref } from 'vue'

export interface ToastItem {
  id: string
  message: string
  type?: 'success' | 'info' | 'error' | 'warning'
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function showToast(message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success', duration = 3000) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const item: ToastItem = { id, message, type, duration }
    toasts.value.push(item)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
