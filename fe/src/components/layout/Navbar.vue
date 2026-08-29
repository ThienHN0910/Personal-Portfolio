<template>
  <header class="sticky top-0 z-[200] w-full flex justify-center pt-5 px-4 pointer-events-none">
    <!-- Floating Island Pill -->
    <div
      class="pointer-events-auto flex items-center justify-between gap-6 px-4 py-2.5 rounded-full bg-surface/90 border border-stroke shadow-island w-full max-w-3xl backdrop-blur-md transition-all duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="isScrolled ? 'shadow-island-hover border-stroke/90' : 'shadow-island'"
    >
      <!-- Logo & Brand -->
      <RouterLink to="/" class="flex items-center gap-2.5 group active:scale-[0.98] transition-transform duration-200">
        <!-- Double-bezel logo mark -->
        <div class="w-8 h-8 rounded-full bg-bone border border-stroke flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-ink/30 transition-colors duration-300">
          <span class="font-mono text-ink text-xs font-semibold tracking-tighter">T/</span>
        </div>
        <div class="flex flex-col leading-none">
          <span class="font-sans font-semibold text-sm tracking-tight text-ink group-hover:text-ink/80 transition-colors duration-300">Hồ Ngọc Thiện</span>
          <span class="font-mono text-[9px] text-ink-tertiary tracking-widest uppercase">Portfolio</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-0.5 font-sans text-sm font-medium" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative px-3 py-1.5 text-ink-secondary hover:text-ink transition-colors duration-200 rounded-md hover:bg-bone group"
          active-class="text-ink font-semibold"
        >
          {{ link.label }}
          <!-- Underline reveal -->
          <span class="absolute bottom-0.5 left-3 right-3 h-px bg-ink rounded-full opacity-0 scale-x-0 group-[.router-link-active]:opacity-100 group-[.router-link-active]:scale-x-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
        </RouterLink>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-2">
        <!-- Availability tag — desktop only -->
        <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pastel-green border border-pastel-green-text/20 text-pastel-green-text text-[10px] font-mono font-medium uppercase tracking-wider">
          <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text animate-pulse-soft"></span>
          <span>Available</span>
        </div>

        <!-- Desktop Search trigger -->
        <button
          type="button"
          class="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bone border border-stroke hover:border-ink/20 hover:bg-bone/80 text-ink-secondary hover:text-ink transition-all duration-200 text-xs font-mono group active:scale-[0.98]"
          @click="openPalette"
          aria-label="Open command palette"
        >
          <!-- Magnifier — thin SVG icon -->
          <svg class="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <kbd class="px-1.5 py-0.5 rounded bg-stroke/60 border border-stroke text-[10px] font-mono text-ink-secondary">
            {{ isMac ? '⌘K' : 'Ctrl K' }}
          </kbd>
        </button>

        <!-- Mobile search icon -->
        <button
          type="button"
          class="sm:hidden p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-bone transition-colors duration-200"
          @click="openPalette"
          aria-label="Open Search"
        >
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <!-- Hamburger / X morph button — mobile only -->
        <button
          type="button"
          class="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-ink hover:text-ink transition-colors duration-200"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle Navigation Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span
            class="block h-px w-5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            :class="isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''"
          ></span>
          <span
            class="block h-px w-5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            :class="isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''"
          ></span>
        </button>
      </div>
    </div>

    <!-- Mobile Full-Screen Overlay -->
    <Transition
      enter-active-class="transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden pointer-events-auto fixed inset-0 top-0 z-[199] flex flex-col items-center justify-center bg-canvas/95 backdrop-blur-xl"
        @click.self="isMobileMenuOpen = false"
      >
        <!-- Close region click -->
        <nav class="flex flex-col items-center gap-2" aria-label="Mobile Navigation">
          <RouterLink
            v-for="(link, index) in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-3xl font-serif font-light text-ink-secondary hover:text-ink transition-colors duration-300 py-2 opacity-0 translate-y-4"
            :style="`animation: fadeUp 500ms cubic-bezier(0.16,1,0.3,1) ${100 + index * 70}ms both`"
            active-class="text-ink font-medium"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Divider -->
        <div class="mt-8 w-10 h-px bg-stroke opacity-0" style="animation: fadeUp 500ms cubic-bezier(0.16,1,0.3,1) 600ms both"></div>

        <!-- Bottom meta -->
        <p class="mt-6 font-mono text-[10px] text-ink-tertiary tracking-widest uppercase opacity-0" style="animation: fadeUp 500ms cubic-bezier(0.16,1,0.3,1) 700ms both">
          Hồ Ngọc Thiện · Full Stack Engineer
        </p>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { openPalette } = useCommandPalette()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isMac = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  if (typeof navigator !== 'undefined') {
    isMac.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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


