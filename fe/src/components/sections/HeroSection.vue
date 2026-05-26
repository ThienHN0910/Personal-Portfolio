<template>
  <section class="hero">
    <div class="hero__bg" />

    <div class="hero__container glass-panel cut-corners p-6 md:p-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div class="md:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-3 px-3 py-2 bg-white/3 border border-white/6 rounded-md font-mono text-[10px] tracking-[0.2em] uppercase text-cyan-300">
            <span class="status-dot !w-2 !h-2"></span>
            SYSTEM: READY
          </div>

          <h1 class="hero__title font-os text-4xl md:text-5xl lg:text-6xl mt-2 text-cyan-100 uppercase tracking-[0.16em] leading-tight">
            {{ data.heroTitle || 'Hi, I\'m' }}
            <br />
            <span class="highlight">{{ data.heroSubtitle || 'A Developer' }}</span>
          </h1>

          <p class="hero__description font-mono text-gray-300 max-w-2xl leading-relaxed text-sm md:text-base">
            {{ data.heroDescription || 'Building beautiful and functional web experiences.' }}
          </p>

          <div class="hero__cta flex flex-wrap gap-3">
            <RouterLink :to="data.ctaLink || '/projects'" class="btn btn--primary btn--lg font-os uppercase tracking-[0.18em]">
              {{ data.ctaText || 'View My Work' }}
            </RouterLink>
            <RouterLink to="/contact" class="btn btn--secondary btn--lg font-mono uppercase tracking-[0.18em]">Get In Touch</RouterLink>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div class="glass-panel cut-corners p-4">
              <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">Core Stack</div>
              <div class="mt-2 font-os text-sm text-white uppercase">Frontend / Backend</div>
            </div>
            <div class="glass-panel cut-corners p-4">
              <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">Focus</div>
              <div class="mt-2 font-os text-sm text-white uppercase">UI Systems</div>
            </div>
            <div class="glass-panel cut-corners p-4">
              <div class="font-mono text-[10px] tracking-[0.2em] text-cyan-300 uppercase">Mode</div>
              <div class="mt-2 font-os text-sm text-white uppercase">Available</div>
            </div>
          </div>
        </div>

        <div class="md:col-span-5 flex justify-center md:justify-end">
          <div class="relative w-full max-w-sm">
            <div class="absolute inset-0 -translate-x-3 translate-y-3 border border-cyan-300/15 rounded-md"></div>
            <div class="absolute inset-0 -translate-x-5 translate-y-5 border border-purple-500/10 rounded-md"></div>
            <div class="hero__image-wrapper glass-panel cut-corners p-2 relative">
              <div class="hero__image-glow" />
              <img
                v-if="data.profileImage"
                :src="data.profileImage"
                alt="Profile"
                class="hero__image rounded-md border border-white/6 object-cover"
              />
              <div v-else class="hero__image w-full aspect-[4/5] flex items-center justify-center bg-white/3 rounded-md">
                <svg width="80" height="80" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" class="text-cyan-200 opacity-60">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div class="absolute top-4 right-4 px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] font-mono tracking-[0.2em] text-cyan-200">VIEWFINDER_01</div>
            </div>
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
