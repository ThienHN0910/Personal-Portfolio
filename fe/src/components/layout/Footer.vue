<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo">{{ brandName }}</span>
          <p>{{ brandDescription }}</p>
        </div>

        <div>
          <h3 class="footer__nav-title">Navigation</h3>
          <ul class="footer__nav-links">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="footer__nav-link">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="footer__nav-title">Connect</h3>
          <ul class="footer__nav-links">
            <li v-for="link in connectLinks" :key="link.label">
              <a :href="link.href" target="_blank" rel="noopener noreferrer" class="footer__nav-link">{{ link.label }}</a>
            </li>
            <li v-if="!connectLinks.length" class="footer__nav-link">No social links yet</li>
          </ul>

          <h3 class="footer__nav-title mt-6">Contact</h3>
          <ul class="footer__nav-links">
            <li v-for="item in contactItems" :key="item.label">
              <a v-if="item.href" :href="item.href" class="footer__nav-link">{{ item.value }}</a>
              <span v-else class="footer__nav-link">{{ item.value }}</span>
            </li>
            <li v-if="!contactItems.length" class="footer__nav-link">No contact info yet</li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">
          &copy; {{ currentYear }} {{ brandName }}. All rights reserved.
        </p>
        <div class="footer__social">
          <a
            v-for="link in socialIconLinks"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="link.label"
            :title="link.label"
          >
            <IconGlyph :name="link.icon" :size="16" />
          </a>
        </div>
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
