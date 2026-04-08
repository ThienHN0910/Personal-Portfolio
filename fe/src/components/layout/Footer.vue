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
            <svg v-if="link.icon === 'github'" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <svg v-else-if="link.icon === 'linkedin'" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <svg v-else width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-.956 1.844l-7.5 5.25a2.25 2.25 0 0 1-2.588 0l-7.5-5.25A2.25 2.25 0 0 1 2.25 6.993V6.75" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useAboutStore } from '@/stores/about'

type FooterLink = {
  label: string
  href: string
}

type FooterContact = {
  label: string
  value: string
  href?: string
}

const aboutStore = useAboutStore()
const about = computed(() => aboutStore.aboutData)

const currentYear = computed(() => new Date().getFullYear())
const brandName = computed(() => about.value?.name?.trim() || 'Portfolio')
const brandDescription = computed(
  () => about.value?.bio?.trim() || 'A passionate developer building modern web experiences with cutting-edge technologies.',
)

const connectLinks = computed<FooterLink[]>(() => {
  const links: FooterLink[] = []

  if (about.value?.socialLinks?.github) {
    links.push({ label: 'GitHub', href: about.value.socialLinks.github })
  }

  if (about.value?.socialLinks?.linkedin) {
    links.push({ label: 'LinkedIn', href: about.value.socialLinks.linkedin })
  }

  if (about.value?.contactInfo?.website) {
    links.push({ label: 'Website', href: about.value.contactInfo.website })
  }

  const email = about.value?.socialLinks?.email || about.value?.contactInfo?.email
  if (email) {
    links.push({ label: 'Email', href: `mailto:${email}` })
  }

  return links
})

const contactItems = computed<FooterContact[]>(() => {
  const items: FooterContact[] = []

  if (about.value?.contactInfo?.email) {
    items.push({
      label: 'Email',
      value: about.value.contactInfo.email,
      href: `mailto:${about.value.contactInfo.email}`,
    })
  }

  if (about.value?.contactInfo?.phone) {
    items.push({
      label: 'Phone',
      value: about.value.contactInfo.phone,
      href: `tel:${about.value.contactInfo.phone}`,
    })
  }

  if (about.value?.contactInfo?.location) {
    items.push({
      label: 'Location',
      value: about.value.contactInfo.location,
    })
  }

  return items
})

const socialIconLinks = computed(() => {
  const links: Array<{ label: string; href: string; icon: 'github' | 'linkedin' | 'mail' }> = []

  if (about.value?.socialLinks?.github) {
    links.push({ label: 'GitHub', href: about.value.socialLinks.github, icon: 'github' })
  }

  if (about.value?.socialLinks?.linkedin) {
    links.push({ label: 'LinkedIn', href: about.value.socialLinks.linkedin, icon: 'linkedin' })
  }

  const email = about.value?.socialLinks?.email || about.value?.contactInfo?.email
  if (email) {
    links.push({ label: 'Email', href: `mailto:${email}`, icon: 'mail' })
  }

  return links
})

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
