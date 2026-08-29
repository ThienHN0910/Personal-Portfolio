<template>
  <div class="min-h-[80vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 relative bg-canvas">
    <div class="max-w-xl w-full mx-auto relative z-10 text-center space-y-8">
      <!-- 404 Visual Header -->
      <div class="space-y-4">
        <span class="eyebrow-tag">
          <span class="w-1.5 h-1.5 rounded-full bg-pastel-red-text animate-pulse-soft"></span>
          Error 404 · Unresolved Route
        </span>

        <h1 class="font-serif text-8xl sm:text-9xl font-light tracking-[-0.04em] text-ink select-none leading-none">
          404
        </h1>

        <h2 class="text-xl sm:text-2xl font-serif font-light text-ink">
          Page not found
        </h2>

        <p class="text-ink-secondary text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans font-light">
          The requested route, case study, or resource could not be found. It may have been relocated or renamed.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-6">
          <div class="flex flex-wrap items-center justify-center gap-3">
            <RouterLink
              to="/"
              class="group px-5 py-2.5 rounded-md bg-ink text-surface text-xs font-sans font-medium active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <span>Return Home</span>
              <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                </svg>
              </span>
            </RouterLink>

            <RouterLink
              to="/projects"
              class="px-4 py-2.5 rounded-md bg-bone border border-stroke text-ink-secondary text-xs font-sans font-medium hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all"
            >
              Explore Projects Archive
            </RouterLink>

            <button
              type="button"
              class="px-4 py-2.5 rounded-md bg-bone border border-stroke text-ink-secondary text-xs font-mono hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
              @click="openPalette"
            >
              <span>Search (Ctrl+K)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { useCommandPalette } from '@/composables/useCommandPalette'
import { applySeo } from '@/utils/seo'

const { openPalette } = useCommandPalette()

onMounted(() => {
  applySeo({
    title: '404 - Page Not Found',
    description: 'The requested page could not be found on this portfolio.',
    noindex: true,
  })
})
</script>
