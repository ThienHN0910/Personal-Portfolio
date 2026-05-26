<template>
  <section class="hero">
    <div class="hero__bg" />

    <div class="hero__container glass-panel cut-corners p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="md:col-span-2">
          <div class="hero__badge font-mono text-sm text-cyan-300">Ã¢â‚¬Â¢ SYSTEM: READY</div>

          <h1 class="hero__title font-os text-4xl mt-3 text-cyan-100">
            {{ data.heroTitle || 'Hi, I\'m' }}
            <br />
            <span class="highlight">{{ data.heroSubtitle || 'A Developer' }}</span>
          </h1>

          <p class="hero__description font-mono text-gray-300 mt-4">
            {{ data.heroDescription || 'Building beautiful and functional web experiences.' }}
          </p>

          <div class="hero__cta mt-6 flex gap-3">
            <RouterLink :to="data.ctaLink || '/projects'" class="btn btn--primary btn--lg font-os">
              {{ data.ctaText || 'View My Work' }}
            </RouterLink>
            <RouterLink to="/contact" class="btn btn--secondary btn--lg font-mono">Get In Touch</RouterLink>
          </div>
        </div>

        <div class="hero__image-wrapper flex justify-center">
          <div class="hero__image-glow" />
          <img
            v-if="data.profileImage"
            :src="data.profileImage"
            alt="Profile"
            class="hero__image rounded-md border border-white/6"
          />
          <div v-else class="hero__image w-36 h-36 flex items-center justify-center bg-white/3 rounded-md">
            <svg width="80" height="80" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" class="text-cyan-200 opacity-60">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HomeData } from '@/types'

withDefaults(
  defineProps<{
    data: Partial<HomeData>
  }>(),
  {
    data: () => ({
      heroTitle: "Hi, I'm",
      heroSubtitle: 'A Full Stack Developer',
      heroDescription: 'I build modern, scalable web applications with cutting-edge technologies.',
      ctaText: 'View My Work',
      ctaLink: '/projects',
    }),
  },
)
</script>
