<template>
  <section class="relative w-full pt-2 pb-8">
    <div class="bento-grid">
      <!-- Main Hero Card (Span 8) -->
      <div class="col-span-12 lg:col-span-8 glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow flex flex-col justify-between space-y-6">
        <!-- Status Tag -->
        <div class="flex items-center justify-between gap-3">
          <div class="brutal-badge">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Hồ Ngọc Thiện // Full Stack Engineer</span>
          </div>
          <span class="hidden sm:inline-block font-mono text-xs text-slate-400 font-medium tracking-wider tabular-nums">
            PORTFOLIO // 2026
          </span>
        </div>

        <!-- Heading -->
        <div class="space-y-3">
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1]">
            {{ data.heroTitle || 'Hello, I am' }}
            <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 font-extrabold">
              {{ data.heroSubtitle || 'Hồ Ngọc Thiện' }}
            </span>
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed border-l-2 border-cyan-400/60 pl-4 font-normal mt-4 max-w-2xl">
            {{ data.heroDescription || 'Full Stack Software Engineer specializing in Vue 3, React, Node.js, and TypeScript. Focused on building high-performance web applications, scalable architectures, and modern UI/UX experiences.' }}
          </p>
        </div>

        <!-- Tech Pills -->
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <span
            v-for="tech in techPills"
            :key="tech"
            class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200 font-medium hover:border-cyan-400/50 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all shadow-inner-glow cursor-default"
          >
            #{{ tech }}
          </span>
        </div>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center gap-3.5 pt-4 border-t border-white/10">
          <RouterLink
            :to="data.ctaLink || '/projects'"
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(0,229,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-2px_rgba(0,229,255,0.55)] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>{{ data.ctaText || 'Explore Projects' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </RouterLink>

          <RouterLink
            to="/cv"
            class="px-5 py-3 rounded-xl bg-white/5 text-cyan-400 font-semibold font-mono text-xs uppercase tracking-wider border border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-inner-glow"
          >
            View CV
          </RouterLink>

          <RouterLink
            to="/contact"
            class="px-5 py-3 rounded-xl bg-white/5 text-slate-200 font-medium font-mono text-xs uppercase tracking-wider border border-white/15 hover:border-white/30 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            Contact Me
          </RouterLink>
        </div>
      </div>

      <!-- Avatar & Status Bento Card (Span 4) -->
      <div class="col-span-12 lg:col-span-4 glass-panel p-6 border border-cyber-border/30 shadow-glass-card flex flex-col justify-between space-y-5">
        <div class="relative w-full aspect-square rounded-2xl overflow-hidden border border-cyber-border/40 bg-slate-900 shadow-inner-glow group">
          <img
            v-if="data.profileImage"
            :src="data.profileImage"
            alt="Hồ Ngọc Thiện (ThienHN)"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div class="w-20 h-20 rounded-2xl bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-mono text-2xl font-extrabold mb-3 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              HN
            </div>
            <span class="font-bold text-xl text-white font-display">Hồ Ngọc Thiện</span>
            <span class="text-xs font-mono text-cyan-400 font-medium mt-1">@ThienHN</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs space-y-2.5 shadow-inner-glow">
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-400">AVAILABILITY:</span>
            <span class="text-emerald-400 font-semibold flex items-center gap-1.5 tabular-nums">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open to Work
            </span>
          </div>
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-400">LOCATION:</span>
            <span class="text-white font-medium">Vietnam / Remote</span>
          </div>
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-400">ROLE:</span>
            <span class="text-cyan-400 font-semibold">Full Stack / Frontend</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ data: any }>()

const techPills = ['Vue.js 3', 'TypeScript', 'Node.js', 'React', 'Tailwind CSS', 'System Design', 'REST API']
</script>