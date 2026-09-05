<template>
  <div class="min-h-[100dvh] bg-transparent">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <!-- Breadcrumb Link -->
      <RouterLink to="/" class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95">
        <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>Back to Home</span>
      </RouterLink>

      <!-- Page Header -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-12 flex flex-col justify-between gap-6">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Compliance &amp; Privacy
            </span>
            <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">
              Data Terms
            </span>
          </div>

          <div class="space-y-3 max-w-2xl">
            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05] text-ink">
              Privacy Policy
              <span class="block italic text-ink-secondary mt-1">&amp; telemetry transparency</span>
            </h1>
            <p class="text-base text-ink-secondary leading-relaxed font-sans font-light">
              Clear disclosure regarding data handling, system logging, telemetry collection, and privacy rights.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Privacy Content -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-12 space-y-8 text-ink-secondary text-sm leading-relaxed font-light font-sans">
          <section class="space-y-3">
            <h2 class="text-xl font-serif font-light text-ink flex items-center gap-2">
              <span class="font-mono text-xs text-ink-tertiary">01.</span> Overview &amp; Legal Basis
            </h2>
            <p>
              This portfolio operates in adherence to standard data protection principles and Vietnam's Personal Data Protection Regulation (Decree 13/2023/NĐ-CP).
            </p>
            <p>
              We process minimal technical telemetry based on <strong class="font-medium text-ink">Legitimate Interest</strong> to ensure infrastructure security, prevent abuse/DDoS attacks, and analyze aggregate web traffic performance.
            </p>
          </section>

          <section class="space-y-3 pt-4 border-t border-stroke">
            <h2 class="text-xl font-serif font-light text-ink flex items-center gap-2">
              <span class="font-mono text-xs text-ink-tertiary">02.</span> Information Collected
            </h2>
            <p>When you browse this portfolio website, standard technical telemetry is processed automatically:</p>
            <ul class="list-disc list-inside space-y-1.5 pl-2 text-ink-secondary font-mono text-xs">
              <li><strong class="text-ink">IP Address</strong>: Used for network security and geographical distribution analysis.</li>
              <li><strong class="text-ink">Request Timestamp &amp; Path</strong>: Pages requested (e.g. `/projects`, `/blog`) and access times.</li>
              <li><strong class="text-ink">User-Agent</strong>: Browser identifier type and originating source.</li>
              <li><strong class="text-ink">Contact Inputs</strong>: Name, email address, and message submitted voluntarily via the Contact form.</li>
            </ul>
          </section>

          <section class="space-y-3 pt-4 border-t border-stroke">
            <h2 class="text-xl font-serif font-light text-ink flex items-center gap-2">
              <span class="font-mono text-xs text-ink-tertiary">03.</span> Usage of Data
            </h2>
            <p>Telemetry data is used exclusively for:</p>
            <ul class="list-disc list-inside space-y-1.5 pl-2 text-ink-secondary font-mono text-xs">
              <li>Maintaining server health, detecting malicious traffic, and mitigating bot attacks.</li>
              <li>Evaluating anonymous aggregate traffic to improve site performance.</li>
              <li>Responding to user-initiated messages submitted via the contact form.</li>
            </ul>
            <div class="p-3.5 rounded-md bg-bone border border-stroke text-xs font-mono text-ink-secondary">
              Personal information is never sold, rented, or distributed to advertising networks.
            </div>
          </section>

          <section class="space-y-3 pt-4 border-t border-stroke">
            <h2 class="text-xl font-serif font-light text-ink flex items-center gap-2">
              <span class="font-mono text-xs text-ink-tertiary">04.</span> Inquiries &amp; Rights
            </h2>
            <p>
              To request information or deletion of any voluntarily submitted contact data, please get in touch:
            </p>
            <div class="p-4 rounded-lg bg-bone border border-stroke font-mono text-xs text-ink-secondary space-y-1">
              <div><span class="text-ink-tertiary">Name:</span> <span class="text-ink">Hồ Ngọc Thiện (ThienHN)</span></div>
              <div><span class="text-ink-tertiary">Role:</span> Full Stack Software Engineer</div>
              <div><span class="text-ink-tertiary">Channel:</span> <RouterLink to="/contact" class="text-ink underline">Direct Contact Form</RouterLink></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'

import { useAboutStore } from '@/stores/about'
import { useHomeStore } from '@/stores/home'
import { applySeo } from '@/utils/seo'

const aboutStore = useAboutStore()
const homeStore = useHomeStore()

onMounted(async () => {
  await Promise.all([
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
  ])

  applySeo({
    title: 'Privacy Policy',
    description: 'Privacy policy and telemetry data protection terms for the portfolio of Hồ Ngọc Thiện (ThienHN).',
    url: '/privacy',
  })
})
</script>
