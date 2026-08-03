<template>
  <section class="relative w-full pt-4 pb-10">
    <div class="bento-grid">
      <!-- Main Hero Card (Span 8) -->
      <div class="col-span-12 lg:col-span-8 bento-card border-2 border-cyber-cyan/40 bg-slate-950/90 shadow-[6px_6px_0px_0px_rgba(0,242,255,0.25)] flex flex-col justify-between space-y-6">
        <!-- Status Tag -->
        <div class="flex items-center justify-between">
          <div class="brutal-badge">
            <span class="w-2 h-2 rounded-full bg-cyber-cyan animate-ping"></span>
            <span>Hồ Ngọc Thiện // Full Stack Engineer</span>
          </div>
          <span class="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">SEC_VER: 2026.08</span>
        </div>

        <!-- Heading -->
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {{ data.heroTitle || 'Hello, I am' }}
            <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-indigo-400 to-purple-400 font-extrabold">
              {{ data.heroSubtitle || 'Hồ Ngọc Thiện' }}
            </span>
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed border-l-4 border-cyber-cyan pl-4 font-normal mt-4">
            {{ data.heroDescription || 'Full Stack Software Engineer specializing in Vue 3, React, Node.js, and TypeScript. Focused on building high-performance web applications, scalable architectures, and modern UI/UX experiences.' }}
          </p>
        </div>

        <!-- Tech Pills -->
        <div class="flex flex-wrap items-center gap-2 pt-2">
          <span v-for="tech in techPills" :key="tech" class="px-3 py-1 rounded-md bg-white/5 border border-white/20 text-xs font-mono text-slate-200 font-medium hover:border-cyber-cyan hover:text-cyber-cyan transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
            #{{ tech }}
          </span>
        </div>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
          <RouterLink
            :to="data.ctaLink || '/projects'"
            class="px-6 py-3 rounded-xl bg-cyber-cyan text-slate-950 font-extrabold font-mono text-xs uppercase tracking-wider border-2 border-cyber-cyan shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#ffffff] transition-all flex items-center gap-2"
          >
            <span>{{ data.ctaText || 'Explore Projects' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l7-7m7 7H3" />
            </svg>
          </RouterLink>

          <RouterLink
            to="/cv"
            class="px-6 py-3 rounded-xl bg-slate-900 text-cyber-cyan font-bold font-mono text-xs uppercase tracking-wider border-2 border-cyber-cyan/50 shadow-[4px_4px_0px_0px_rgba(0,242,255,0.3)] hover:border-cyber-cyan hover:shadow-[6px_6px_0px_0px_#00f2ff] transition-all"
          >
            View CV
          </RouterLink>

          <RouterLink
            to="/contact"
            class="px-6 py-3 rounded-xl bg-white/5 text-slate-200 font-semibold font-mono text-xs uppercase tracking-wider border-2 border-white/20 hover:border-white hover:text-white transition-all"
          >
            Contact Me
          </RouterLink>
        </div>
      </div>

      <!-- Avatar & Status Bento Card (Span 4) -->
      <div class="col-span-12 lg:col-span-4 bento-card bento-card--stark flex flex-col justify-between">
        <div class="relative w-full aspect-[4/4] rounded-xl overflow-hidden border-2 border-cyber-cyan/40 bg-slate-900 shadow-[4px_4px_0px_0px_#00f2ff] mb-4">
          <img
            v-if="data.profileImage"
            :src="data.profileImage"
            alt="Hồ Ngọc Thiện (ThienHN)"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div class="w-20 h-20 rounded-xl bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center text-cyber-cyan font-mono text-2xl font-extrabold mb-3 shadow-[3px_3px_0px_0px_#00f2ff]">
              HN
            </div>
            <span class="font-extrabold text-xl text-white">Hồ Ngọc Thiện</span>
            <span class="text-xs font-mono text-cyber-cyan font-semibold mt-1">@ThienHN</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-white/5 border-2 border-white/10 font-mono text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-400">AVAILABILITY:</span>
            <span class="text-emerald-400 font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open to Work
            </span>
          </div>
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-400">LOCATION:</span>
            <span class="text-white font-bold">Vietnam / Remote</span>
          </div>
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-400">ROLE:</span>
            <span class="text-cyber-cyan font-bold">Full Stack / Frontend</span>
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