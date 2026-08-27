<template>
  <footer class="mt-20 border-t border-cyber-border/30 bg-gradient-to-b from-slate-950/70 to-slate-950 py-12 px-4 sm:px-6 relative overflow-hidden">
    <!-- Top Ambient Accent Light -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>

    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/10">
        <!-- Brand Info Column -->
        <div class="md:col-span-5 flex flex-col gap-4">
          <RouterLink to="/" class="flex items-center gap-3 group active:scale-[0.98] transition-transform">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyber-border/40 flex items-center justify-center shadow-inner-glow group-hover:border-cyan-400/60 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all duration-300">
              <span class="font-mono text-cyan-400 font-bold text-sm tracking-tighter">&lt;T/&gt;</span>
            </div>
            <span class="font-display font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">{{ brandName }}</span>
          </RouterLink>

          <p class="text-sm text-slate-400 leading-relaxed max-w-md">
            {{ brandDescription || 'Full Stack Software Engineer specializing in modern, high-performance web applications and scalable software architecture.' }}
          </p>

          <div class="flex items-center gap-2.5 pt-2">
            <a
              v-for="link in socialIconLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:-translate-y-0.5 active:scale-95 transition-all shadow-inner-glow"
              :aria-label="link.label"
            >
              <IconGlyph :name="link.icon" :size="17" />
            </a>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div class="md:col-span-3 flex flex-col gap-3">
          <h4 class="font-mono text-xs text-cyan-400 uppercase tracking-wider font-semibold">NAVIGATION</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="text-sm text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                <span class="text-xs text-cyan-400/40 group-hover:translate-x-0.5 transition-transform">›</span>
                <span>{{ link.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Connection & Socials -->
        <div class="md:col-span-4 flex flex-col gap-3">
          <h4 class="font-mono text-xs text-cyan-400 uppercase tracking-wider font-semibold">CONNECT</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in connectLinks" :key="link.label">
              <a :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                <span class="text-xs text-cyan-400/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                <span>{{ link.label }}</span>
              </a>
            </li>
            <li v-if="contactItems && contactItems.length" class="pt-2 border-t border-white/5 mt-1 space-y-1">
              <div v-for="item in contactItems" :key="item.label" class="text-xs text-slate-400">
                <span class="font-mono text-slate-400">{{ item.label }}:</span>
                <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="ml-1 text-slate-300 hover:text-cyan-400 font-mono">{{ item.value }}</a>
                <span v-else class="ml-1 text-slate-300 font-mono">{{ item.value }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Credits & Back to Top -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div class="flex items-center gap-3">
          <span>© {{ currentYear }} {{ brandName }}</span>
          <span>•</span>
          <RouterLink to="/privacy" class="hover:text-cyan-400 transition-colors font-sans">Privacy Policy</RouterLink>
        </div>

        <button
          type="button"
          class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 hover:-translate-y-0.5 active:scale-95 transition-all shadow-inner-glow"
          @click="scrollToTop"
        >
          <span>Back to top</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
const brandName = computed(() => getBrandName(about.value) || 'Hồ Ngọc Thiện (ThienHN)')
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
