<template>
  <footer class="glass-panel cut-corners cyan-glow p-6 mt-12">
    <div class="flex flex-col md:flex-row md:justify-between gap-6">
      <div>
        <div class="font-os text-lg font-bold">{{ brandName }}</div>
        <div class="text-sm text-gray-400 mt-2">{{ brandDescription }}</div>
      </div>

      <div class="flex gap-10">
        <div>
          <h4 class="text-xs text-gray-400 uppercase tracking-widest">Navigation</h4>
          <ul class="mt-2 space-y-2">
            <li v-for="link in navLinks" :key="link.to"><RouterLink :to="link.to" class="text-sm text-gray-300">{{ link.label }}</RouterLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs text-gray-400 uppercase tracking-widest">Connect</h4>
          <ul class="mt-2 space-y-2">
            <li v-for="link in connectLinks" :key="link.label"><a :href="link.href" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-300">{{ link.label }}</a></li>
            <li v-if="contactItems && contactItems.length" class="pt-2 text-sm text-gray-300">
              <div v-for="item in contactItems" :key="item.label">
                <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-300">{{ item.value }}</a>
                <span v-else class="text-sm text-gray-300">{{ item.value }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-6 border-t border-white/6 pt-4 flex items-center justify-between">
      <div class="text-xs text-gray-500">© {{ currentYear }} {{ brandName }}</div>
      <div class="flex items-center gap-3">
        <a v-for="link in socialIconLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer" class="text-gray-300"> <IconGlyph :name="link.icon" :size="16" /> </a>
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
const brandName = computed(() => getBrandName(about.value))
const brandDescription = computed(() => getBrandDescription(about.value))
const connectLinks = computed(() => getFooterConnectLinks(about.value))
const contactItems = computed(() => getFooterContactItems(about.value))
const socialIconLinks = computed(() => getFooterIconLinks(about.value))

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

onMounted(() => {
  if (!aboutStore.aboutData) {
    void aboutStore.fetchAboutData()
  }
})
</script>
