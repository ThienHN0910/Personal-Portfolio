<template>
  <header class="system-status-bar glass-panel cut-corners">
    <div class="flex items-center gap-3">
      <div class="status-dot" aria-hidden="true"></div>
      <div class="font-semibold">SYSTEM ONLINE</div>
    </div>

    <nav class="mx-auto hidden md:flex items-center gap-6 font-os text-sm">
      <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="uppercase text-xs tracking-widest text-gray-200">{{ link.label }}</RouterLink>
    </nav>

    <div class="flex items-center gap-4 mono text-xs text-gray-300">
      <div>{{ timeString }}</div>
      <div class="px-3 py-1 rounded border border-white/6 text-sm text-cyan-400">Auth Status: Admin</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const timeString = ref(new Date().toLocaleTimeString())
let tick: number | null = null

function updateTime() {
  timeString.value = new Date().toLocaleTimeString()
}

onMounted(() => {
  tick = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (tick) clearInterval(tick)
})
</script>
