<template>
  <header class="sticky top-0 z-50 w-full px-4 py-3 sm:px-6 transition-all duration-300">
    <div class="max-w-6xl mx-auto glass-panel px-4 py-2.5 sm:px-6 flex items-center justify-between shadow-cyan-glow border-cyber-border/40">
      <!-- Logo & Brand -->
      <RouterLink to="/" class="flex items-center gap-3 group active:scale-[0.98] transition-transform">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyber-border/40 flex items-center justify-center shadow-inner-glow group-hover:border-cyan-400/60 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all duration-300">
          <span class="font-mono text-cyan-400 font-bold text-sm tracking-tighter">&lt;T/&gt;</span>
        </div>
        <div class="flex flex-col">
          <span class="font-display font-bold text-sm tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">Hồ Ngọc Thiện</span>
          <span class="font-mono text-[10px] text-slate-400 tracking-wider">FULL STACK DEV</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-1 font-sans text-sm font-medium" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 relative group active:scale-[0.98]"
          active-class="text-cyan-400 font-semibold bg-cyan-400/10 border border-cyan-400/25 shadow-[0_0_12px_rgba(0,229,255,0.12)]"
        >
          {{ link.label }}
          <span class="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-cyan-400 rounded-full opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300"></span>
        </RouterLink>
      </nav>

      <!-- Right Actions: Search Trigger, Status & Mobile Menu Button -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Desktop Search Trigger Button -->
        <button
          type="button"
          class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyber-border/40 hover:border-cyan-400/50 hover:bg-cyan-400/5 text-slate-400 hover:text-white transition-all text-xs font-mono group active:scale-[0.98] shadow-inner-glow"
          @click="openPalette"
          aria-label="Open Command Palette (Ctrl+K or Cmd+K)"
        >
          <svg class="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-slate-300 font-sans">Search...</span>
          <kbd class="ml-1 px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] text-slate-300 group-hover:border-cyan-400/40 group-hover:text-cyan-400 transition-colors tabular-nums">
            {{ isMac ? '⌘K' : 'Ctrl K' }}
          </kbd>
        </button>

        <!-- Mobile Search Icon Button -->
        <button
          type="button"
          class="sm:hidden p-2 rounded-lg text-slate-300 hover:text-cyber-cyan hover:bg-white/10 transition-colors"
          @click="openPalette"
          aria-label="Open Search"
        >
          <svg class="w-5 h-5 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- Status Indicator Pill -->
        <div class="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AVAILABLE</span>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle Navigation Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden mt-2 max-w-6xl mx-auto glass-panel p-4 flex flex-col gap-2 border-cyber-border/40">
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs mb-1"
          @click="isMobileMenuOpen = false; openPalette()"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search & Commands...</span>
          </span>
          <kbd class="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[10px]">Ctrl K</kbd>
        </button>

        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2.5 rounded-lg text-slate-200 hover:text-cyber-cyan hover:bg-white/5 transition-all text-sm font-medium"
          active-class="text-cyber-cyan font-bold bg-cyber-cyan/15 border border-cyber-cyan/30"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { openPalette } = useCommandPalette()
const isMobileMenuOpen = ref(false)
const isMac = ref(false)

onMounted(() => {
  if (typeof navigator !== 'undefined') {
    isMac.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)
  }
})

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Articles' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
]
</script>
