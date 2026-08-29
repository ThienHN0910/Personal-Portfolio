<template>
  <footer class="mt-24 border-t border-stroke bg-bone py-12 px-4 sm:px-6 relative overflow-hidden">
    <!-- Subtle top gradient line -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent"></div>

    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-stroke">

        <!-- Brand Info Column -->
        <div class="md:col-span-5 flex flex-col gap-5">
          <RouterLink to="/" class="flex items-center gap-2.5 group active:scale-[0.98] transition-transform duration-200">
            <!-- Double-bezel logo mark -->
            <div class="w-8 h-8 rounded-full bg-surface border border-stroke flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] group-hover:border-ink/20 transition-colors duration-300">
              <span class="font-mono text-ink text-xs font-semibold tracking-tighter">T/</span>
            </div>
            <span class="font-sans font-semibold text-sm tracking-tight text-ink group-hover:text-ink/70 transition-colors duration-300">{{ brandName }}</span>
          </RouterLink>

          <p class="text-sm text-ink-secondary leading-relaxed max-w-sm font-light">
            {{ brandDescription || 'Full Stack Software Engineer focused on high-performance web applications and scalable software architecture.' }}
          </p>

          <!-- Social icons — double-bezel small circles -->
          <div class="flex items-center gap-2">
            <a
              v-for="link in socialIconLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-full bg-surface border border-stroke shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-ink-secondary hover:text-ink hover:border-ink/20 hover:-translate-y-px active:scale-95 transition-all duration-200"
              :aria-label="link.label"
            >
              <IconGlyph :name="link.icon" :size="15" />
            </a>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div class="md:col-span-3 flex flex-col gap-4">
          <h4 class="font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">Navigation</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="text-sm text-ink-secondary hover:text-ink transition-colors duration-200 font-light">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Connect -->
        <div class="md:col-span-4 flex flex-col gap-4">
          <h4 class="font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">Connect</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in connectLinks" :key="link.label">
              <a :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-ink-secondary hover:text-ink transition-colors duration-200 font-light flex items-center gap-1.5 group">
                <span>{{ link.label }}</span>
                <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.5 9.5 9.5 2.5M5 2.5h4.5V7"/>
                </svg>
              </a>
            </li>
            <li v-if="contactItems && contactItems.length" class="pt-2 border-t border-stroke mt-1 space-y-1.5">
              <div v-for="item in contactItems" :key="item.label" class="text-[11px] text-ink-secondary font-mono">
                <span class="text-ink-tertiary">{{ item.label }}:</span>
                <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="ml-1 text-ink-secondary hover:text-ink transition-colors">{{ item.value }}</a>
                <span v-else class="ml-1">{{ item.value }}</span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 font-mono text-[11px] text-ink-tertiary">
          <span>© {{ currentYear }} {{ brandName }}</span>
          <span class="text-stroke">·</span>
          <RouterLink to="/privacy" class="hover:text-ink-secondary transition-colors font-sans text-[11px]">Privacy Policy</RouterLink>
        </div>

        <button
          type="button"
          class="group flex items-center gap-1.5 text-[11px] font-mono text-ink-tertiary hover:text-ink transition-colors duration-200 active:scale-95"
          @click="scrollToTop"
        >
          <span>Back to top</span>
          <svg class="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-200" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9.5V2.5M2.5 6l3.5-3.5L9.5 6"/>
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import IconGlyph from '@/components/ui/IconGlyph.vue'
import { useAboutStore } from '@/stores/about'
import {
  getBrandDescription,
  getBrandName,
  getFooterConnectLinks,
  getFooterContactItems,
  getFooterIconLinks,
} from '@/utils/aboutPresentation'

const aboutStore = useAboutStore()
const about = computed(() => aboutStore.aboutData)

const currentYear = computed(() => new Date().getFullYear())
const brandName = computed(() => getBrandName(about.value) || 'Hồ Ngọc Thiện')
const brandDescription = computed(() => getBrandDescription(about.value))
const connectLinks = computed(() => getFooterConnectLinks(about.value))
const contactItems = computed(() => getFooterContactItems(about.value))
const socialIconLinks = computed(() => getFooterIconLinks(about.value))

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Articles' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
]

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  if (!aboutStore.aboutData) {
    void aboutStore.fetchAboutData()
  }
})
</script>
