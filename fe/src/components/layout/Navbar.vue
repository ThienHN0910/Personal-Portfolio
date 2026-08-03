<template>
  <header class="sticky top-0 z-50 w-full px-4 py-3 sm:px-6 transition-all duration-300">
    <div class="max-w-6xl mx-auto glass-panel px-4 py-2.5 sm:px-6 flex items-center justify-between shadow-cyan-glow border-cyber-border/40">
      <!-- Logo & Brand -->
      <RouterLink to="/" class="flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyber-cyan/30 flex items-center justify-center shadow-sm group-hover:border-cyber-cyan/70 transition-all duration-300">
          <span class="font-mono text-cyber-cyan font-bold text-base">&lt;T/&gt;</span>
        </div>
        <div class="flex flex-col">
          <span class="font-sans font-bold text-sm tracking-wide text-slate-100 group-hover:text-cyber-cyan transition-colors">Hồ Ngọc Thiện</span>
          <span class="font-mono text-[10px] text-slate-400 tracking-wider">FULL STACK DEV</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-1 font-sans text-sm font-medium" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 relative group"
          active-class="text-cyber-cyan font-semibold bg-cyber-cyan/10 border border-cyber-cyan/20"
        >
          {{ link.label }}
          <span class="absolute bottom-1 left-4 right-4 h-0.5 bg-cyber-cyan rounded-full opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300"></span>
        </RouterLink>
      </nav>

      <!-- Right Actions: Status & Mobile Menu Button -->
      <div class="flex items-center gap-3">
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
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Trang Chủ' },
  { to: '/about', label: 'Giới Thiệu' },
  { to: '/projects', label: 'Dự Án' },
  { to: '/blog', label: 'Bài Viết' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Liên Hệ' },
]
</script>
