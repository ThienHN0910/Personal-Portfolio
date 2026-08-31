import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { ThemeId, ThemeSettings } from '@/types'
import api from '@/utils/api'

const STORAGE_THEME_ID_KEY = 'portfolio_theme_id_v2'

export interface ThemePresetOption {
  id: ThemeId
  name: string
  description: string
  swatchBg: string
  swatchBorder: string
  accentColor: string
  isDark: boolean
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'editorial-dark',
    name: 'Editorial Dark',
    description: 'High-end Creative Obsidian & Bone',
    swatchBg: '#090A0C',
    swatchBorder: 'rgba(255,255,255,0.15)',
    accentColor: '#60A5FA',
    isDark: true,
  },
  {
    id: 'editorial-light',
    name: 'Editorial Light',
    description: 'Warm Fine Paper & Crisp Typography',
    swatchBg: '#FAFAF8',
    swatchBorder: 'rgba(0,0,0,0.15)',
    accentColor: '#1D4ED8',
    isDark: false,
  },
  {
    id: 'monochrome-cyber',
    name: 'Monochrome Cyber',
    description: 'Deep Jet Black & Emerald Accent',
    swatchBg: '#000000',
    swatchBorder: 'rgba(255,255,255,0.2)',
    accentColor: '#10B981',
    isDark: true,
  },
  {
    id: 'warm-sepia',
    name: 'Warm Sepia',
    description: 'Newsprint Sepia & Warm Stone',
    swatchBg: '#F4EFE6',
    swatchBorder: 'rgba(45,37,30,0.18)',
    accentColor: '#8C5918',
    isDark: false,
  },
  {
    id: 'system',
    name: 'System Default',
    description: 'Follow Operating System Preference',
    swatchBg: 'linear-gradient(135deg, #090A0C 50%, #FAFAF8 50%)',
    swatchBorder: 'rgba(142,145,154,0.3)',
    accentColor: '#8E919A',
    isDark: true,
  },
]

export const DEFAULT_THEME: ThemeSettings = {
  name: 'Editorial Design System',
  activeThemeId: 'editorial-dark',
  primaryColor: '#3b82f6',
  secondaryColor: '#06b6d4',
  accentColor: '#f59e0b',
  backgroundFrom: '#090A0C',
  backgroundTo: '#12141A',
  surfaceFrom: '#181A22',
  surfaceTo: '#12141A',
  headingGradientFrom: '#F5F5F7',
  headingGradientTo: '#8E919A',
  textPrimary: '#F5F5F7',
  textMuted: '#8E919A',
  useAnimatedGlow: true,
}

function resolveEffectiveTheme(id: ThemeId): Exclude<ThemeId, 'system'> {
  if (id === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'editorial-dark' : 'editorial-light'
    }
    return 'editorial-dark'
  }
  return id
}

function applyThemeAttribute(id: ThemeId): void {
  if (typeof document === 'undefined') return
  const effective = resolveEffectiveTheme(id)
  const root = document.documentElement
  root.setAttribute('data-theme', effective)

  // Color scheme meta
  const isDark = effective === 'editorial-dark' || effective === 'monochrome-cyber'
  root.classList.toggle('dark', isDark)
  root.classList.toggle('light', !isDark)
}

export const useThemeStore = defineStore('theme', () => {
  const currentThemeId = ref<ThemeId>('editorial-dark')
  const theme = ref<ThemeSettings>({ ...DEFAULT_THEME })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const activePreset = computed(() => {
    return THEME_PRESETS.find((p) => p.id === currentThemeId.value) || THEME_PRESETS[0]
  })

  const isDarkMode = computed(() => {
    const effective = resolveEffectiveTheme(currentThemeId.value)
    return effective === 'editorial-dark' || effective === 'monochrome-cyber'
  })

  function setThemeId(id: ThemeId, persist = true): void {
    currentThemeId.value = id
    applyThemeAttribute(id)

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_THEME_ID_KEY, id)
    }
  }

  function cycleTheme(): void {
    const order: ThemeId[] = ['editorial-dark', 'editorial-light', 'monochrome-cyber', 'warm-sepia', 'system']
    const currentIndex = order.indexOf(currentThemeId.value)
    const nextIndex = (currentIndex + 1) % order.length
    setThemeId(order[nextIndex], true)
  }

  async function fetchTheme(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<{ success: boolean; data: ThemeSettings }>('/theme')
      if (response.data.success && response.data.data) {
        theme.value = { ...DEFAULT_THEME, ...response.data.data }

        // If user has not explicitly set a local preference, use backend activeThemeId
        if (typeof localStorage !== 'undefined' && !localStorage.getItem(STORAGE_THEME_ID_KEY)) {
          if (theme.value.activeThemeId) {
            setThemeId(theme.value.activeThemeId, false)
          }
        }
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
        theme.value = { ...DEFAULT_THEME, ...response.data.data }
        if (data.activeThemeId) {
          setThemeId(data.activeThemeId, true)
        }
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
    // 1. Read cached local ID
    if (typeof localStorage !== 'undefined') {
      const savedId = localStorage.getItem(STORAGE_THEME_ID_KEY) as ThemeId | null
      if (savedId && ['editorial-dark', 'editorial-light', 'monochrome-cyber', 'warm-sepia', 'system'].includes(savedId)) {
        currentThemeId.value = savedId
      }
    }

    // 2. Apply theme attribute immediately
    applyThemeAttribute(currentThemeId.value)

    // 3. Attach system preference listener
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', () => {
        if (currentThemeId.value === 'system') {
          applyThemeAttribute('system')
        }
      })
    }

    // 4. Fetch backend settings in background
    await fetchTheme()

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-ready')
    }

    initialized.value = true
  }

  return {
    currentThemeId,
    activePreset,
    isDarkMode,
    theme,
    loading,
    error,
    initialized,
    initializeTheme,
    setThemeId,
    cycleTheme,
    fetchTheme,
    updateTheme,
  }
})
