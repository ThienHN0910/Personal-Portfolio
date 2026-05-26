<template>
  <header class="system-status-bar glass-panel cut-corners">
    <div class="flex items-center gap-3">
      <div class="status-dot" aria-hidden="true"></div>
      <div class="font-semibold">SYSTEM ONLINE</div>
    </div>

    <nav class="mx-auto flex items-center gap-6 font-os text-sm">
      <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="uppercase text-xs tracking-widest text-gray-200 hover:text-cyan-300 transition-colors">{{ link.label }}</RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]
</script>
