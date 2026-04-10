import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ThemeSettings } from '@/types'
import api from '@/utils/api'

const STORAGE_KEY = 'portfolio_theme_cache_v1'

export const DEFAULT_THEME: ThemeSettings = {
  name: 'Ocean Aurora',
  primaryColor: '#3b82f6',
  secondaryColor: '#06b6d4',
  accentColor: '#f59e0b',
  backgroundFrom: '#0f172a',
  backgroundTo: '#1e293b',
  surfaceFrom: '#111827',
  surfaceTo: '#0b1220',
  headingGradientFrom: '#38bdf8',
  headingGradientTo: '#f97316',
  textPrimary: '#e2e8f0',
  textMuted: '#94a3b8',
  useAnimatedGlow: true,
}

function applyThemeToRoot(theme: ThemeSettings): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.style.setProperty('--theme-primary', theme.primaryColor)
  root.style.setProperty('--theme-secondary', theme.secondaryColor)
  root.style.setProperty('--theme-accent', theme.accentColor)
  root.style.setProperty('--theme-bg-from', theme.backgroundFrom)
  root.style.setProperty('--theme-bg-to', theme.backgroundTo)
  root.style.setProperty('--theme-surface-from', theme.surfaceFrom)
  root.style.setProperty('--theme-surface-to', theme.surfaceTo)
  root.style.setProperty('--theme-heading-from', theme.headingGradientFrom)
  root.style.setProperty('--theme-heading-to', theme.headingGradientTo)
  root.style.setProperty('--theme-text-primary', theme.textPrimary)
  root.style.setProperty('--theme-text-muted', theme.textMuted)
  root.style.setProperty('--theme-glow-strength', theme.useAnimatedGlow ? '22%' : '0%')
}

function readThemeCache(): ThemeSettings | null {
  if (typeof localStorage === 'undefined') return null

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ThemeSettings>
    return {
      ...DEFAULT_THEME,
      ...parsed,
    }
  } catch {
    return null
  }
}

function writeThemeCache(theme: ThemeSettings): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeSettings>({ ...DEFAULT_THEME })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  function setTheme(next: ThemeSettings, persist = true): void {
    theme.value = { ...next }
    applyThemeToRoot(theme.value)
    if (persist) {
      writeThemeCache(theme.value)
    }
  }

  function applyDefaultTheme(): void {
    setTheme({ ...DEFAULT_THEME }, false)
  }

  function applyCachedTheme(): void {
    const cached = readThemeCache()
    if (!cached) return
    setTheme(cached, false)
  }

  async function fetchTheme(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<{ success: boolean; data: ThemeSettings }>('/theme')
      if (response.data.success && response.data.data) {
        setTheme({ ...DEFAULT_THEME, ...response.data.data })
      }
    } catch (err) {
      error.value = 'Failed to fetch theme settings'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function updateTheme(data: Partial<ThemeSettings>): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const payload = {
        ...theme.value,
        ...data,
      }
      const response = await api.put<{ success: boolean; data: ThemeSettings }>('/theme', payload)
      if (response.data.success && response.data.data) {
        setTheme({ ...DEFAULT_THEME, ...response.data.data })
      }
    } catch (err) {
      error.value = 'Failed to update theme settings'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function initializeTheme(): Promise<void> {
    applyDefaultTheme()
    applyCachedTheme()
    await fetchTheme()

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-ready')
    }

    initialized.value = true
  }

  return {
    theme,
    loading,
    error,
    initialized,
    initializeTheme,
    fetchTheme,
    updateTheme,
  }
})
