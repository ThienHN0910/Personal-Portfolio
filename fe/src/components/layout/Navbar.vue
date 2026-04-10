<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <RouterLink to="/" class="navbar__logo">Portfolio</RouterLink>

    <ul class="navbar__links" :class="{ 'is-open': menuOpen }">
      <li v-for="link in navLinks" :key="link.to">
        <RouterLink :to="link.to" class="navbar__link" @click="menuOpen = false">
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>

    <button class="navbar__toggle" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
      <svg v-if="!menuOpen" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const menuOpen = ref(false)
const scrolled = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
