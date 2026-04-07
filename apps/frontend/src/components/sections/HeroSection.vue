<template>
  <section class="hero">
    <div class="hero__bg" />

    <div class="hero__container">
      <div class="hero__content">
        <div class="hero__badge">
          <span class="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Available for work
        </div>

        <h1 class="hero__title">
          {{ data.heroTitle || 'Hi, I\'m' }}
          <br />
          <span class="highlight">{{ data.heroSubtitle || 'A Developer' }}</span>
        </h1>

        <p class="hero__description">
          {{ data.heroDescription || 'Building beautiful and functional web experiences.' }}
        </p>

        <div class="hero__cta">
          <RouterLink :to="data.ctaLink || '/projects'" class="btn btn--primary btn--lg">
            {{ data.ctaText || 'View My Work' }}
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </RouterLink>
          <RouterLink to="/contact" class="btn btn--secondary btn--lg">
            Get In Touch
          </RouterLink>
        </div>
      </div>

      <div class="hero__image-wrapper">
        <div class="hero__image-glow" />
        <img
          v-if="data.profileImage"
          :src="data.profileImage"
          alt="Profile"
          class="hero__image"
        />
        <div
          v-else
          class="hero__image flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30"
        >
          <svg width="80" height="80" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" class="text-blue-400 opacity-60">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
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
