<template>
  <div class="space-y-8 max-w-5xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stroke">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-pastel-blue-text animate-pulse-soft"></span>
          <span class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Design System & Identity</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-serif text-ink font-light tracking-tight">Theme & Appearance</h1>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-bone border border-stroke text-ink-secondary hover:text-ink text-xs font-mono transition-all duration-200"
          @click="resetToDefault"
        >
          Reset Default
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-lg bg-ink text-canvas hover:opacity-90 text-xs font-mono font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          :disabled="loading"
          @click="saveTheme"
        >
          {{ loading ? 'Saving...' : 'Save Appearance' }}
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading && !isReady" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left: Theme Preset Picker (Col 7) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="p-6 rounded-2xl bg-surface border border-stroke shadow-sm space-y-5">
          <div>
            <h2 class="text-sm font-sans font-semibold text-ink">Default Site Theme</h2>
            <p class="text-xs text-ink-secondary mt-0.5">Choose the default aesthetic palette delivered to new visitors.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="preset in THEME_PRESETS"
              :key="preset.id"
              type="button"
              class="flex flex-col p-4 rounded-xl border text-left transition-all duration-200 group"
              :class="form.activeThemeId === preset.id ? 'bg-bone border-ink/40 shadow-sm' : 'bg-surface border-stroke hover:border-stroke/80 hover:bg-bone/40'"
              @click="form.activeThemeId = preset.id; themeStore.setThemeId(preset.id, false)"
            >
              <div class="flex items-center justify-between w-full mb-3">
                <span
                  class="w-4 h-4 rounded-full border border-stroke shadow-inner flex-shrink-0"
                  :style="{ background: preset.swatchBg, borderColor: preset.swatchBorder }"
                />
                <span
                  v-if="form.activeThemeId === preset.id"
                  class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pastel-green text-pastel-green-text border border-pastel-green-text/20 font-medium"
                >
                  Active
                </span>
              </div>
              <span class="text-xs font-medium text-ink group-hover:text-ink">{{ preset.name }}</span>
              <span class="text-[10px] text-ink-tertiary mt-0.5 leading-relaxed">{{ preset.description }}</span>
            </button>
          </div>
        </div>

        <!-- Custom Identifiers -->
        <div class="p-6 rounded-2xl bg-surface border border-stroke shadow-sm space-y-4">
          <div>
            <h2 class="text-sm font-sans font-semibold text-ink">System Metadata</h2>
            <p class="text-xs text-ink-secondary mt-0.5">Customize global branding labels and animation settings.</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-ink-secondary mb-1.5">System Name</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3.5 py-2.5 rounded-lg bg-bone border border-stroke text-ink text-xs font-mono focus:border-ink/40 focus:outline-none"
                placeholder="Editorial Design System"
              />
            </div>

            <label class="flex items-center gap-3 cursor-pointer pt-2">
              <input
                v-model="form.useAnimatedGlow"
                type="checkbox"
                class="w-4 h-4 rounded border-stroke text-pastel-blue-text focus:ring-0 bg-bone"
              />
              <span class="text-xs font-sans text-ink">Enable ambient drift glow effects in background</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Right: Live Preview Panel (Col 5) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="p-6 rounded-2xl bg-surface border border-stroke shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-stroke">
            <span class="text-xs font-mono uppercase tracking-widest text-ink-tertiary">Live Specimen</span>
            <span class="text-[10px] font-mono text-pastel-blue-text">{{ selectedPresetName }}</span>
          </div>

          <!-- Mock Preview Card -->
          <div class="p-5 rounded-xl bg-bone border border-stroke space-y-3">
            <div class="flex items-center justify-between">
              <span class="article-badge article-badge--green">60fps Composited</span>
              <span class="text-[10px] font-mono text-ink-tertiary">v2.4.0</span>
            </div>
            <h3 class="text-lg font-serif font-light text-ink leading-snug">
              Typography &amp; Surface Harmony
            </h3>
            <p class="text-xs text-ink-secondary font-sans leading-relaxed">
              This preview illustrates how headings, lead text, buttons, and semantic badges dynamically adapt to the active theme tokens.
            </p>
            <div class="pt-2 flex items-center gap-2">
              <span class="px-2.5 py-1 rounded bg-surface border border-stroke text-[10px] font-mono text-ink">
                Button Spec
              </span>
              <span class="px-2.5 py-1 rounded bg-pastel-blue text-[10px] font-mono text-pastel-blue-text">
                #Architecture
              </span>
            </div>
          </div>

          <div class="p-3.5 rounded-lg bg-bone/60 border border-stroke/60 text-[11px] text-ink-secondary leading-relaxed font-mono">
            ℹ Theme settings apply globally and are stored in MongoDB Atlas, ensuring consistent branding across all client devices.
          </div>
        </div>

        <p v-if="saved" class="text-pastel-green-text text-xs font-mono flex items-center gap-1.5 p-3 rounded-lg bg-pastel-green/40 border border-pastel-green-text/20">
          ✓ Appearance settings saved successfully to production!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { DEFAULT_THEME, THEME_PRESETS, useThemeStore } from '@/stores/theme'
import type { ThemeId, ThemeSettings } from '@/types'

const themeStore = useThemeStore()
const loading = computed(() => themeStore.loading)
const isReady = ref(false)
const saved = ref(false)

const form = reactive<ThemeSettings>({
  ...DEFAULT_THEME,
  activeThemeId: 'editorial-dark',
})

const selectedPresetName = computed(() => {
  const p = THEME_PRESETS.find((item) => item.id === form.activeThemeId)
  return p ? p.name : 'Custom'
})

function syncFormFromStore(): void {
  Object.assign(form, {
    ...DEFAULT_THEME,
    ...themeStore.theme,
    activeThemeId: themeStore.theme.activeThemeId || 'editorial-dark',
  })
}

async function saveTheme(): Promise<void> {
  await themeStore.updateTheme({
    name: form.name?.trim() || DEFAULT_THEME.name,
    activeThemeId: form.activeThemeId as ThemeId,
    useAnimatedGlow: Boolean(form.useAnimatedGlow),
  })
  syncFormFromStore()
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}

function resetToDefault(): void {
  form.activeThemeId = 'editorial-dark'
  form.name = DEFAULT_THEME.name
  form.useAnimatedGlow = true
  themeStore.setThemeId('editorial-dark', false)
}

onMounted(async () => {
  if (!themeStore.initialized) {
    await themeStore.fetchTheme()
  }
  syncFormFromStore()
  isReady.value = true
})
</script>
