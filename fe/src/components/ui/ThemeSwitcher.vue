<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore, THEME_PRESETS } from '@/stores/theme'
import type { ThemeId } from '@/types'

const themeStore = useThemeStore()
const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

function togglePopover() {
  isOpen.value = !isOpen.value
}

function selectTheme(id: ThemeId) {
  themeStore.setThemeId(id)
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (
    isOpen.value &&
    popoverRef.value &&
    !popoverRef.value.contains(e.target as Node) &&
    triggerRef.value &&
    !triggerRef.value.contains(e.target as Node)
  ) {
    isOpen.value = false
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- Trigger Pill Button -->
    <button
      ref="triggerRef"
      type="button"
      class="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-bone border border-stroke hover:border-ink/25 text-ink-secondary hover:text-ink transition-all duration-200 text-xs font-mono group active:scale-[0.98] shadow-sm"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      aria-label="Select Palette & Theme"
      @click.stop="togglePopover"
    >
      <!-- Swatch Dot -->
      <span
        class="w-2.5 h-2.5 rounded-full border border-stroke/60 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        :style="{ background: themeStore.activePreset.swatchBg, borderColor: themeStore.activePreset.swatchBorder }"
      />

      <!-- Current Theme Label -->
      <span class="hidden sm:inline font-sans text-xs tracking-tight font-medium text-ink">
        {{ themeStore.activePreset.name }}
      </span>

      <!-- Chevron -->
      <svg
        class="w-3 h-3 text-ink-tertiary transition-transform duration-200"
        :class="isOpen ? 'rotate-180 text-ink' : ''"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Glassmorphic Dropdown Popover -->
    <Transition
      enter-active-class="transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="popoverRef"
        class="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-surface/95 border border-stroke/90 shadow-2xl backdrop-blur-xl z-[300] focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <!-- Popover Header -->
        <div class="px-3 py-2 border-b border-stroke/60 mb-1 flex items-center justify-between">
          <span class="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary">Editorial Themes</span>
          <span class="text-[10px] font-mono text-pastel-blue-text font-medium">Taste-Skill UI</span>
        </div>

        <!-- Theme Options List -->
        <div class="space-y-1">
          <button
            v-for="preset in THEME_PRESETS"
            :key="preset.id"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group"
            :class="themeStore.currentThemeId === preset.id ? 'bg-bone text-ink font-medium shadow-sm' : 'text-ink-secondary hover:bg-bone/50 hover:text-ink'"
            @click="selectTheme(preset.id)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <!-- Swatch Circle -->
              <span
                class="w-3.5 h-3.5 rounded-full border border-stroke flex-shrink-0 shadow-inner"
                :style="{ background: preset.swatchBg, borderColor: preset.swatchBorder }"
              />
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-sans truncate font-medium text-ink group-hover:text-ink">
                  {{ preset.name }}
                </span>
                <span class="text-[10px] font-mono text-ink-tertiary truncate">
                  {{ preset.description }}
                </span>
              </div>
            </div>

            <!-- Active Checkmark -->
            <svg
              v-if="themeStore.currentThemeId === preset.id"
              class="w-4 h-4 text-pastel-green-text flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
