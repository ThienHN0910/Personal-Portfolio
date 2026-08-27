<template>
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-glass-card transition-all font-mono text-xs"
        :class="getToastStyles(toast.type)"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center gap-2.5">
          <!-- Icon -->
          <span v-if="toast.type === 'success'" class="text-emerald-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span v-else-if="toast.type === 'error'" class="text-rose-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <span v-else-if="toast.type === 'warning'" class="text-amber-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <span v-else class="text-cyber-cyan">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>

          <span class="text-slate-100 font-medium leading-tight font-sans text-sm">{{ toast.message }}</span>
        </div>

        <button
          type="button"
          class="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          @click="removeToast(toast.id)"
          aria-label="Close notification"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function getToastStyles(type?: string) {
  switch (type) {
    case 'success':
      return 'bg-slate-900/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-emerald-400'
    case 'error':
      return 'bg-slate-900/90 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)] text-rose-400'
    case 'warning':
      return 'bg-slate-900/90 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-amber-400'
    case 'info':
    default:
      return 'bg-slate-900/90 border-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.2)] text-cyan-400'
  }
}
</script>
