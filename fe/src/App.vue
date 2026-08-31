<template>
  <div id="app">
    <!-- Accessible Skip to Content Link -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[500] focus:px-4 focus:py-2.5 focus:rounded-md focus:bg-ink focus:text-surface focus:font-mono focus:font-medium focus:shadow-island focus:outline-none"
    >
      Skip to main content
    </a>


    <Analytics />
    <Navbar v-if="!isAdminRoute" />
    <main id="main-content" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Footer v-if="!isAdminRoute" />

    <!-- Global Command Palette, Notifications & Fluid Cursor -->
    <CustomCursor v-if="!isAdminRoute" />
    <CommandPalette />
    <ToastNotification />
    <!-- Scroll to Top FAB (public pages only) -->
    <ScrollToTopButton v-if="!isAdminRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Analytics } from '@vercel/analytics/vue'

import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CustomCursor from '@/components/ui/CustomCursor.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton.vue'
import { useCommandPalette } from '@/composables/useCommandPalette'
import { useSmoothScroll } from '@/composables/useSmoothScroll'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const { togglePalette } = useCommandPalette()
const { initSmoothScroll, destroySmoothScroll, scrollTo } = useSmoothScroll()

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    togglePalette()
  }
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/admin')) {
      destroySmoothScroll()
    } else {
      initSmoothScroll()
      scrollTo(0, { immediate: true })
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (!isAdminRoute.value) {
    initSmoothScroll()
  }
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  destroySmoothScroll()
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
