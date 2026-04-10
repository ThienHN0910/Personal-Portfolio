<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container max-w-5xl">
      <AdminSectionHeader kicker="Design System" title-before="Theme " title-highlight="Appearance" />

      <LoadingSpinner v-if="loading && !isReady" />

      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form class="admin-panel p-6 xl:col-span-2" @submit.prevent="saveTheme">
          <div class="form-group">
            <label>Theme Name</label>
            <input v-model="form.name" type="text" placeholder="Ocean Aurora" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="field in colorFields" :key="field.key" class="form-group mb-0">
              <label>{{ field.label }}</label>
              <div class="flex items-center gap-3">
                <input v-model="form[field.key]" type="color" class="h-11 w-14 p-1 rounded-lg border border-white/15 bg-transparent" />
                <input v-model="form[field.key]" type="text" placeholder="#3b82f6" />
              </div>
            </div>
          </div>

          <div class="mt-6 mb-2 flex items-center gap-3">
            <input id="animatedGlow" v-model="form.useAnimatedGlow" type="checkbox" class="w-4 h-4 accent-blue-500" />
            <label for="animatedGlow" class="text-sm text-gray-300">Enable animated gradient glow</label>
          </div>

          <div class="admin-modal__actions mt-8">
            <button type="button" class="btn btn--secondary" @click="resetToDefault">Reset Default</button>
            <button type="submit" class="btn btn--primary" :disabled="loading">Save Appearance</button>
          </div>
        </form>

        <aside class="admin-panel p-6">
          <p class="admin-kicker mb-2">Live Preview</p>
          <h3 class="text-xl font-bold text-white mb-4">{{ form.name || 'Theme' }}</h3>

          <div class="theme-preview-card mb-4" :style="previewStyle">
            <p class="text-sm font-semibold" :style="{ color: form.textPrimary }">Gradient Surface</p>
            <p class="text-xs mt-1" :style="{ color: form.textMuted }">Cards and modal surfaces will follow this tone.</p>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="chip in previewChips" :key="chip.label" class="theme-preview-chip" :style="chip.style">
              {{ chip.label }}
            </span>
          </div>

          <p class="text-xs text-slate-400 leading-relaxed">
            Theme applies globally and is cached locally, so visitors see default style instantly, then smooth update when server settings load.
          </p>
        </aside>
      </div>

      <p v-if="saved" class="text-green-400 text-sm mt-4">✓ Appearance saved successfully.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { DEFAULT_THEME, useThemeStore } from '@/stores/theme'
import type { ThemeSettings } from '@/types'

const themeStore = useThemeStore()
const loading = computed(() => themeStore.loading)
const isReady = ref(false)
const saved = ref(false)

const form = reactive<ThemeSettings>({
  ...DEFAULT_THEME,
})

const colorFields: Array<{ key: keyof ThemeSettings; label: string }> = [
  { key: 'primaryColor', label: 'Primary Color' },
  { key: 'secondaryColor', label: 'Secondary Color' },
  { key: 'accentColor', label: 'Accent Color' },
  { key: 'backgroundFrom', label: 'Background From' },
  { key: 'backgroundTo', label: 'Background To' },
  { key: 'surfaceFrom', label: 'Surface From' },
  { key: 'surfaceTo', label: 'Surface To' },
  { key: 'headingGradientFrom', label: 'Heading Gradient From' },
  { key: 'headingGradientTo', label: 'Heading Gradient To' },
  { key: 'textPrimary', label: 'Primary Text' },
  { key: 'textMuted', label: 'Muted Text' },
]

function syncFormFromStore(): void {
  Object.assign(form, {
    ...DEFAULT_THEME,
    ...themeStore.theme,
  })
}

function normalizeColor(input: string, fallback: string): string {
  const value = input.trim().toLowerCase()
  return /^#(?:[\da-f]{3}|[\da-f]{6})$/.test(value) ? value : fallback
}

function normalizedPayload(): ThemeSettings {
  const fallback = { ...DEFAULT_THEME }
  return {
    ...form,
    name: form.name?.trim() || fallback.name,
    primaryColor: normalizeColor(form.primaryColor, fallback.primaryColor),
    secondaryColor: normalizeColor(form.secondaryColor, fallback.secondaryColor),
    accentColor: normalizeColor(form.accentColor, fallback.accentColor),
    backgroundFrom: normalizeColor(form.backgroundFrom, fallback.backgroundFrom),
    backgroundTo: normalizeColor(form.backgroundTo, fallback.backgroundTo),
    surfaceFrom: normalizeColor(form.surfaceFrom, fallback.surfaceFrom),
    surfaceTo: normalizeColor(form.surfaceTo, fallback.surfaceTo),
    headingGradientFrom: normalizeColor(form.headingGradientFrom, fallback.headingGradientFrom),
    headingGradientTo: normalizeColor(form.headingGradientTo, fallback.headingGradientTo),
    textPrimary: normalizeColor(form.textPrimary, fallback.textPrimary),
    textMuted: normalizeColor(form.textMuted, fallback.textMuted),
    useAnimatedGlow: Boolean(form.useAnimatedGlow),
  }
}

const previewStyle = computed(() => ({
  background: `linear-gradient(145deg, ${form.surfaceFrom}, ${form.surfaceTo})`,
  borderColor: `${form.primaryColor}66`,
}))

const previewChips = computed(() => [
  {
    label: 'Primary',
    style: {
      background: `${form.primaryColor}1f`,
      color: form.primaryColor,
      borderColor: `${form.primaryColor}55`,
    },
  },
  {
    label: 'Secondary',
    style: {
      background: `${form.secondaryColor}1f`,
      color: form.secondaryColor,
      borderColor: `${form.secondaryColor}55`,
    },
  },
  {
    label: 'Accent',
    style: {
      background: `${form.accentColor}1f`,
      color: form.accentColor,
      borderColor: `${form.accentColor}55`,
    },
  },
])

async function saveTheme(): Promise<void> {
  await themeStore.updateTheme(normalizedPayload())
  syncFormFromStore()
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2500)
}

function resetToDefault(): void {
  Object.assign(form, { ...DEFAULT_THEME })
}

onMounted(async () => {
  if (!themeStore.initialized) {
    await themeStore.fetchTheme()
  }
  syncFormFromStore()
  isReady.value = true
})
</script>

<style scoped lang="scss">
.theme-preview-card {
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 1rem;
  padding: 1rem;
}

.theme-preview-chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.74rem;
  font-weight: 700;
}
</style>
