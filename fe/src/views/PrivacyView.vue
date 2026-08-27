<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%)]" />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Breadcrumb Link -->
      <RouterLink to="/" class="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-mono group active:scale-95">
        <span class="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Back to Home</span>
      </RouterLink>

      <!-- Page Header -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow">
        <div class="brutal-badge mb-3">
          <span>DATA PROTECTION & PRIVACY</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Privacy <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Policy</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base leading-relaxed border-l-2 border-cyan-400/60 pl-4 font-normal">
          Information regarding data collection, system security logging, and user rights.
        </p>
      </div>

      <!-- Main Privacy Content -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/30 shadow-glass-card space-y-8 text-slate-300 text-sm leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-cyber-cyan font-mono">01.</span> Overview & Legal Basis
          </h2>
          <p>
            This website (<span class="text-cyber-cyan font-mono">thienhn0910.vercel.app</span>) operates in full compliance with global data protection principles (such as GDPR) and Vietnam's Personal Data Protection Regulation (Decree 13/2023/NĐ-CP).
          </p>
          <p>
            We process minimal technical data based on <strong class="text-white">Legitimate Interest</strong> to ensure server infrastructure security, prevent abuse/DDoS attacks, and analyze aggregate web traffic performance.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-cyber-cyan font-mono">02.</span> Information We Collect
          </h2>
          <p>When you visit or interact with this portfolio website, technical telemetry data is logged automatically:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-400 font-mono text-xs">
            <li><strong class="text-slate-200">Internet Protocol (IP) Address</strong>: Used for network security and geographical distribution analysis.</li>
            <li><strong class="text-slate-200">Request Path & Timestamp</strong>: The page paths accessed (e.g., `/projects`, `/blog`) and access times.</li>
            <li><strong class="text-slate-200">User-Agent & Referrer</strong>: Browser identifier type and originating link source.</li>
            <li><strong class="text-slate-200">Contact Form Inputs</strong>: Name, email address, and message content submitted voluntarily via the Contact form.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-cyber-cyan font-mono">03.</span> How We Use Your Data
          </h2>
          <p>Data collected is strictly used for:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-400 font-mono text-xs">
            <li>Maintaining server health, detecting malicious traffic, and mitigating bot attacks.</li>
            <li>Analyzing aggregate visitor statistics to improve site architecture and content quality.</li>
            <li>Responding to user-initiated inquiry messages.</li>
          </ul>
          <p class="text-xs text-amber-400/90 font-mono bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
            🔒 We NEVER sell, rent, trade, or share your IP address or personal data with third-party advertising networks.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-cyber-cyan font-mono">04.</span> Data Retention & Admin Purging
          </h2>
          <p>
            Visitor access logs are stored securely in encrypted databases and are subject to routine administrative cleanup. Old access logs older than 30 days are purged periodically by the system administrator.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-cyber-cyan font-mono">05.</span> Contact & Data Rights
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request removal of your contact submission data, please contact:
          </p>
          <div class="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-200">
            <div><strong class="text-cyber-cyan">Name:</strong> Hồ Ngọc Thiện (ThienHN)</div>
            <div><strong class="text-cyber-cyan">Role:</strong> Developer & System Administrator</div>
            <div><strong class="text-cyber-cyan">Email:</strong> Contact via <RouterLink to="/contact" class="text-cyber-cyan hover:underline">Contact Form</RouterLink></div>
          </div>
        </section>
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
