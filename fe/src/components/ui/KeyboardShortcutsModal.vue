<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isShortcutsOpen"
        class="fixed inset-0 z-[9995] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6 bg-ink/35 backdrop-blur-md"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts HUD"
        @click.self="closeShortcuts"
        @keydown.esc.prevent="closeShortcuts"
      >
        <div
          class="relative w-full max-w-xl editorial-card shadow-island overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          data-lenis-prevent
        >
          <div class="editorial-card__inner p-6 sm:p-8 flex flex-col space-y-6">
            <!-- Header Bar -->
            <div class="flex items-center justify-between pb-4 border-b border-stroke">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
                  <span class="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary">Keyboard HUD</span>
                </div>
                <h3 class="font-serif text-xl sm:text-2xl font-light text-ink">Power-User Shortcuts</h3>
              </div>

              <button
                type="button"
                class="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-bone transition-colors"
                aria-label="Close shortcuts"
                @click="closeShortcuts"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Shortcuts Sections -->
            <div class="space-y-6">
              <!-- System & Global -->
              <div class="space-y-3">
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">
                  System &amp; Actions
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="sc in systemShortcuts"
                    :key="sc.label"
                    class="p-3 rounded-lg bg-bone border border-stroke flex items-center justify-between gap-3"
                  >
                    <span class="text-xs font-sans text-ink-secondary">{{ sc.label }}</span>
                    <div class="flex items-center gap-1 shrink-0">
                      <kbd
                        v-for="key in sc.keys"
                        :key="key"
                        class="px-2 py-0.5 rounded bg-surface border border-stroke font-mono text-[10px] text-ink font-semibold shadow-xs"
                      >
                        {{ key }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <div class="space-y-3">
                <span class="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider block">
                  Reading &amp; Navigation
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="sc in navigationShortcuts"
                    :key="sc.label"
                    class="p-3 rounded-lg bg-bone border border-stroke flex items-center justify-between gap-3"
                  >
                    <span class="text-xs font-sans text-ink-secondary">{{ sc.label }}</span>
                    <div class="flex items-center gap-1 shrink-0">
                      <kbd
                        v-for="key in sc.keys"
                        :key="key"
                        class="px-2 py-0.5 rounded bg-surface border border-stroke font-mono text-[10px] text-ink font-semibold shadow-xs"
                      >
                        {{ key }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Hint -->
            <div class="pt-4 border-t border-stroke flex items-center justify-between text-[11px] font-mono text-ink-tertiary">
              <span>Press <kbd class="px-1.5 py-0.5 rounded bg-bone border border-stroke text-ink text-[10px]">ESC</kbd> to dismiss</span>
              <span class="text-pastel-blue-text">Tactile 60fps</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const { isShortcutsOpen, closeShortcuts } = useKeyboardShortcuts()

const systemShortcuts = [
  { label: 'Command Palette', keys: ['⌘ / Ctrl', 'K'] },
  { label: 'Cycle Theme Palette', keys: ['T'] },
  { label: 'Shortcuts HUD Guide', keys: ['?'] },
  { label: 'Dismiss Overlays', keys: ['ESC'] },
]

const navigationShortcuts = [
  { label: 'Next Case Study / Down', keys: ['J'] },
  { label: 'Previous Case / Up', keys: ['K'] },
]
</script>
