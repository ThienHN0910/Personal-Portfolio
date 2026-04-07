import { computed, ref } from 'vue'

export function useConfirmDialog() {
  const pendingId = ref<string | null>(null)
  const isOpen = computed(() => Boolean(pendingId.value))

  function request(id: string): void {
    pendingId.value = id
  }

  function cancel(): void {
    pendingId.value = null
  }

  function consume(): string | null {
    const value = pendingId.value
    pendingId.value = null
    return value
  }

  return {
    pendingId,
    isOpen,
    request,
    cancel,
    consume,
  }
}
