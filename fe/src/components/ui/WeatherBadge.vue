<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import type { WeatherCondition } from '@/types'

const weatherStore = useWeatherStore()
const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

const previewConditions: Array<{ id: WeatherCondition; label: string; icon: string }> = [
  { id: 'clear', label: 'Clear', icon: '☀️' },
  { id: 'cloudy', label: 'Cloudy', icon: '☁️' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'thunderstorm', label: 'Storm', icon: '⛈️' },
  { id: 'snow', label: 'Snow', icon: '❄️' },
]

function togglePopover() {
  isOpen.value = !isOpen.value
}

function selectPreview(cond: WeatherCondition) {
  weatherStore.setPreviewCondition(cond)
}

function resetToLive() {
  weatherStore.setPreviewCondition(null)
}

function toggleEnabled() {
  weatherStore.toggleWeather()
}

async function handleRefresh() {
  await weatherStore.fetchWeather(true)
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
      class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-bone border border-stroke hover:border-ink/25 text-ink-secondary hover:text-ink transition-all duration-200 text-xs font-mono group active:scale-[0.98] shadow-sm cursor-pointer"
      :class="{ 'border-ink/40 bg-surface': isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      aria-label="Weather Telemetry & Ambient Atmosphere"
      @click.stop="togglePopover"
    >
      <!-- Weather Icon / Emoji -->
      <span class="text-xs sm:text-sm select-none transition-transform duration-300 group-hover:scale-110">
        {{ weatherStore.conditionEmoji }}
      </span>

      <!-- Temperature -->
      <span class="font-mono text-xs font-medium text-ink">
        {{ weatherStore.temperatureDisplay }}
      </span>

      <!-- City / Region (desktop only) -->
      <span class="hidden md:inline font-sans text-xs text-ink-secondary truncate max-w-[90px]">
        {{ weatherStore.weatherData?.city || 'Local' }}
      </span>

      <!-- Live Sync / Preview Indicator Dot -->
      <span
        v-if="!weatherStore.isWeatherEnabled"
        class="w-1.5 h-1.5 rounded-full bg-ink-tertiary/60 flex-shrink-0"
        title="Adaptive canvas disabled"
      />
      <span
        v-else-if="weatherStore.previewOverride"
        class="w-1.5 h-1.5 rounded-full bg-pastel-amber-text flex-shrink-0"
        title="Preview mode active"
      />
      <span
        v-else
        class="w-1.5 h-1.5 rounded-full bg-pastel-green-text flex-shrink-0 animate-pulse-soft"
        title="Live 1-hour IP sync active"
      />
    </button>

    <!-- Popover Card -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="popoverRef"
        class="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-surface border border-stroke shadow-island p-4 z-[250] focus:outline-none backdrop-blur-xl"
        role="dialog"
        aria-label="Weather Atmosphere Settings"
      >
        <!-- Header: Condition Info -->
        <div class="flex items-start justify-between gap-2 pb-3 border-b border-stroke/60">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ weatherStore.conditionEmoji }}</span>
              <div>
                <h4 class="font-sans font-semibold text-sm text-ink leading-tight">
                  {{ weatherStore.conditionLabel }}
                </h4>
                <p class="font-mono text-[11px] text-ink-secondary leading-tight mt-0.5">
                  {{ weatherStore.temperatureDisplay }} • {{ weatherStore.locationDisplay }}
                </p>
              </div>
            </div>
          </div>

          <!-- Refresh Button -->
          <button
            type="button"
            class="p-1.5 rounded-lg border border-stroke hover:bg-bone text-ink-secondary hover:text-ink transition-all active:scale-95 disabled:opacity-50"
            :disabled="weatherStore.loading"
            title="Refresh weather from IP"
            @click="handleRefresh"
          >
            <svg
              class="w-3.5 h-3.5"
              :class="{ 'animate-spin': weatherStore.loading }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
        </div>

        <!-- Telemetry Status Bar -->
        <div class="py-2.5 flex items-center justify-between text-[11px] font-mono text-ink-secondary">
          <span class="flex items-center gap-1.5">
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="weatherStore.isWeatherEnabled ? 'bg-pastel-green-text' : 'bg-ink-tertiary'"
            />
            {{ weatherStore.isWeatherEnabled ? 'Adaptive Canvas Active' : 'Adaptive Canvas Disabled' }}
          </span>
          <button
            type="button"
            class="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-stroke hover:bg-bone hover:text-ink transition-colors"
            @click="toggleEnabled"
          >
            {{ weatherStore.isWeatherEnabled ? 'Turn Off' : 'Turn On' }}
          </button>
        </div>

        <!-- Simulation / Preview Overrides -->
        <div class="pt-2 border-t border-stroke/60">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-mono font-medium text-ink-secondary uppercase tracking-wider">
              Atmosphere Simulator
            </span>
            <button
              v-if="weatherStore.previewOverride"
              type="button"
              class="text-[10px] font-mono text-pastel-amber-text hover:underline"
              @click="resetToLive"
            >
              Reset to Live
            </button>
          </div>

          <div class="grid grid-cols-5 gap-1.5">
            <button
              v-for="cond in previewConditions"
              :key="cond.id"
              type="button"
              class="flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all active:scale-95"
              :class="
                weatherStore.previewOverride === cond.id
                  ? 'border-ink bg-bone text-ink font-medium shadow-sm'
                  : 'border-stroke hover:border-ink/30 hover:bg-bone/50 text-ink-secondary'
              "
              :title="`Preview ${cond.label}`"
              @click="selectPreview(cond.id)"
            >
              <span class="text-base select-none mb-1">{{ cond.icon }}</span>
              <span class="font-sans text-[10px] leading-none">{{ cond.label }}</span>
            </button>
          </div>
        </div>

        <!-- Footnote / Sync Info -->
        <div class="mt-3 pt-2 border-t border-stroke/40 flex items-center justify-between text-[10px] font-mono text-ink-tertiary">
          <span>Auto-syncs hourly via IP</span>
          <span>Open-Meteo • 60fps</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
