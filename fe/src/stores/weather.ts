import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { WeatherCondition, WeatherData } from '@/types'
import api from '@/utils/api'

const STORAGE_WEATHER_DATA_KEY = 'portfolio_weather_data_v1'
const STORAGE_WEATHER_ENABLED_KEY = 'portfolio_weather_enabled_v1'
const STORAGE_WEATHER_LAST_FETCH_KEY = 'portfolio_weather_last_fetch_v1'
const ONE_HOUR_MS = 60 * 60 * 1000

export const useWeatherStore = defineStore('weather', () => {
  const weatherData = ref<WeatherData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const previewOverride = ref<WeatherCondition | null>(null)
  const isWeatherEnabled = ref<boolean>(true)
  const lastFetchedAt = ref<number>(0)
  let hourlyTimer: ReturnType<typeof setInterval> | null = null

  // Restore initial state from localStorage
  if (typeof window !== 'undefined') {
    try {
      const savedData = localStorage.getItem(STORAGE_WEATHER_DATA_KEY)
      if (savedData) {
        weatherData.value = JSON.parse(savedData)
      }
      const savedEnabled = localStorage.getItem(STORAGE_WEATHER_ENABLED_KEY)
      if (savedEnabled !== null) {
        isWeatherEnabled.value = savedEnabled === 'true'
      }
      const savedLastFetch = localStorage.getItem(STORAGE_WEATHER_LAST_FETCH_KEY)
      if (savedLastFetch) {
        lastFetchedAt.value = parseInt(savedLastFetch, 10) || 0
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  const effectiveCondition = computed<WeatherCondition>(() => {
    if (!isWeatherEnabled.value) return 'clear'
    if (previewOverride.value) return previewOverride.value
    return weatherData.value?.condition || 'clear'
  })

  const isDay = computed<boolean>(() => {
    if (weatherData.value) {
      return weatherData.value.isDay
    }
    // Fallback: day between 6 AM and 6 PM local time
    const hour = new Date().getHours()
    return hour >= 6 && hour < 18
  })

  const temperatureDisplay = computed<string>(() => {
    if (weatherData.value?.temperature !== undefined) {
      return `${Math.round(weatherData.value.temperature)}°C`
    }
    return '28°C'
  })

  const locationDisplay = computed<string>(() => {
    return weatherData.value?.city || 'Ho Chi Minh City'
  })

  const conditionLabel = computed<string>(() => {
    const cond = effectiveCondition.value
    switch (cond) {
      case 'clear':
        return isDay.value ? 'Clear Sky' : 'Starry Night'
      case 'cloudy':
        return 'Overcast / Cloudy'
      case 'rain':
        return 'Rain & Showers'
      case 'thunderstorm':
        return 'Thunderstorm'
      case 'snow':
        return 'Snow Flurries'
      default:
        return 'Atmospheric'
    }
  })

  const conditionEmoji = computed<string>(() => {
    const cond = effectiveCondition.value
    switch (cond) {
      case 'clear':
        return isDay.value ? '☀️' : '🌙'
      case 'cloudy':
        return '☁️'
      case 'rain':
        return '🌧️'
      case 'thunderstorm':
        return '⛈️'
      case 'snow':
        return '❄️'
      default:
        return '🌤️'
    }
  })

  async function fetchWeather(force = false): Promise<void> {
    if (typeof window === 'undefined') return

    const now = Date.now()
    // Skip if cached recently (less than 1 hour) unless forced
    if (!force && weatherData.value && now - lastFetchedAt.value < ONE_HOUR_MS) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.get<{ success: boolean; data: WeatherData }>('/weather')
      if (response.data?.success && response.data.data) {
        weatherData.value = response.data.data
        lastFetchedAt.value = now

        try {
          localStorage.setItem(STORAGE_WEATHER_DATA_KEY, JSON.stringify(weatherData.value))
          localStorage.setItem(STORAGE_WEATHER_LAST_FETCH_KEY, String(now))
        } catch {
          // Ignore storage errors
        }
      }
    } catch (err: any) {
      console.warn('Weather fetch failed, utilizing fallback data:', err?.message)
      error.value = err?.message || 'Weather fetch failed'
      // Set reasonable fallback if no data exists
      if (!weatherData.value) {
        weatherData.value = {
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          latitude: 10.8231,
          longitude: 106.6297,
          temperature: 29,
          weatherCode: 0,
          condition: 'clear',
          isDay: true,
          fallback: true,
        }
      }
    } finally {
      loading.value = false
    }
  }

  function setPreviewCondition(condition: WeatherCondition | null): void {
    previewOverride.value = condition
  }

  function toggleWeather(): void {
    isWeatherEnabled.value = !isWeatherEnabled.value
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_WEATHER_ENABLED_KEY, String(isWeatherEnabled.value))
    }
  }

  function initHourlyRefresh(): void {
    if (typeof window === 'undefined') return

    // Initial fetch
    void fetchWeather()

    // 1-Hour recurring background timer
    if (!hourlyTimer) {
      hourlyTimer = setInterval(() => {
        void fetchWeather(true)
      }, ONE_HOUR_MS)
    }

    // Refresh if user refocuses the tab after > 1 hour
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastFetchedAt.value
        if (elapsed >= ONE_HOUR_MS) {
          void fetchWeather(true)
        }
      }
    })
  }

  return {
    weatherData,
    loading,
    error,
    previewOverride,
    isWeatherEnabled,
    lastFetchedAt,
    effectiveCondition,
    isDay,
    temperatureDisplay,
    locationDisplay,
    conditionLabel,
    conditionEmoji,
    fetchWeather,
    setPreviewCondition,
    toggleWeather,
    initHourlyRefresh,
  }
})
