<template>
  <footer class="mt-20 border-t border-cyber-border/30 bg-gradient-to-b from-slate-950/60 to-slate-950 py-12 px-4 sm:px-6 relative overflow-hidden">
    <!-- Top Ambient Accent Light -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"></div>

    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/5">
        <!-- Brand Info Column -->
        <div class="md:col-span-5 flex flex-col gap-4">
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyber-cyan/40 flex items-center justify-center">
              <span class="font-mono text-cyber-cyan font-bold text-base">&lt;T/&gt;</span>
            </div>
            <span class="font-sans font-bold text-lg text-slate-100">{{ brandName }}</span>
          </RouterLink>

          <p class="text-sm text-slate-400 leading-relaxed max-w-md">
            {{ brandDescription || 'Full Stack Software Engineer chuyên nghiệp phát triển các ứng dụng Web cao cấp, hiện đại và tối ưu hiệu năng.' }}
          </p>

          <div class="flex items-center gap-3 pt-2">
            <a
              v-for="link in socialIconLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all"
              :aria-label="link.label"
            >
              <IconGlyph :name="link.icon" :size="18" />
            </a>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div class="md:col-span-3 flex flex-col gap-3">
          <h4 class="font-mono text-xs text-cyber-cyan uppercase tracking-wider font-semibold">Điều Hướng</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                <span class="text-xs text-cyber-cyan/50">›</span>
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Connection & Socials -->
        <div class="md:col-span-4 flex flex-col gap-3">
          <h4 class="font-mono text-xs text-cyber-cyan uppercase tracking-wider font-semibold">Kết Nối</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in connectLinks" :key="link.label">
              <a :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-slate-300 hover:text-cyber-cyan transition-colors flex items-center gap-2">
                <span class="text-xs text-cyber-cyan/50">↗</span>
                {{ link.label }}
              </a>
            </li>
            <li v-if="contactItems && contactItems.length" class="pt-2">
              <div v-for="item in contactItems" :key="item.label" class="text-xs text-slate-400">
                <span class="font-mono text-slate-500">{{ item.label }}:</span>
                <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="ml-1 text-slate-300 hover:text-cyber-cyan">{{ item.value }}</a>
                <span v-else class="ml-1 text-slate-300">{{ item.value }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Credits & Back to Top -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span>© {{ currentYear }} {{ brandName }}. Built with Vue 3 & TypeScript.</span>
        </div>

        <button
          type="button"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all"
          @click="scrollToTop"
        >
          <span>Về đầu trang</span>
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
  { to: '/', label: 'Trang Chủ' },
  { to: '/about', label: 'Giới Thiệu' },
  { to: '/projects', label: 'Dự Án' },
  { to: '/blog', label: 'Bài Viết' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Liên Hệ' },
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
