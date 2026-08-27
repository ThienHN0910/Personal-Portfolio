<template>
  <div class="min-h-[80vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 relative overflow-hidden">
    <!-- Ambient Radial Glow -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.09),transparent_50%)]" />

    <div class="max-w-xl w-full mx-auto relative z-10 text-center space-y-8">
      <!-- 404 Visual Header -->
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs shadow-inner-glow">
          <span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
          <span>HTTP 404 // NOT FOUND</span>
        </div>

        <div class="relative">
          <h1 class="text-7xl sm:text-9xl font-extrabold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 select-none">
            404
          </h1>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 blur-xl bg-cyan-400/20 -z-10" />
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Page Not Found
        </h2>

        <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          The requested route, case study, or resource could not be found. It may have been relocated, renamed, or is temporarily unavailable.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="glass-panel p-6 border border-cyber-border/30 shadow-glass-card space-y-4">
        <div class="flex flex-wrap items-center justify-center gap-3">
          <RouterLink
            to="/"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(0,229,255,0.4)] hover:shadow-[0_8px_28px_-2px_rgba(0,229,255,0.55)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            Return Home
          </RouterLink>

          <RouterLink
            to="/projects"
            class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 font-medium font-mono text-xs uppercase tracking-wider hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-400/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-inner-glow"
          >
            Explore Projects
          </RouterLink>

          <button
            type="button"
            class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 font-medium font-mono text-xs uppercase tracking-wider hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-400/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-inner-glow inline-flex items-center gap-2"
            @click="openPalette"
          >
            <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search (Ctrl+K)</span>
          </button>
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
