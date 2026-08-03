<template>
  <section class="relative w-full pt-6 pb-12 overflow-hidden">
    <div class="glass-panel p-6 sm:p-10 lg:p-14 border border-cyber-border/40 shadow-cyan-glow relative overflow-hidden">
      <!-- Background Ambient Grid Lines -->
      <div class="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00f2ff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        <!-- Left Content -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <!-- Status Tag -->
          <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs tracking-wider">
            <span class="w-2 h-2 rounded-full bg-cyber-cyan animate-ping"></span>
            <span class="font-semibold uppercase">Hồ Ngọc Thiện // Full Stack Engineer</span>
          </div>

          <!-- Hero Heading -->
          <div class="space-y-2">
            <h1 class="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {{ data.heroTitle || 'Xin chào, tôi là' }}
              <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-indigo-400 to-violet-400 drop-shadow-[0_0_25px_rgba(0,242,255,0.4)]">
                {{ data.heroSubtitle || 'Hồ Ngọc Thiện' }}
              </span>
            </h1>
          </div>

          <!-- Hero Description -->
          <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl border-l-2 border-cyber-cyan/40 pl-4 font-normal">
            {{ data.heroDescription || 'Chuyên gia phát triển ứng dụng Web cao cấp với Vue 3, React, Node.js và TypeScript. Tập trung xây dựng sản phẩm tối ưu hiệu năng, kiến trúc chuẩn SEO/GEO và trải nghiệm người dùng tuyệt vời.' }}
          </p>

          <!-- Core Tech Pills -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <span v-for="tech in techPills" :key="tech" class="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:border-cyber-cyan/40 hover:text-cyber-cyan transition-all">
              #{{ tech }}
            </span>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap items-center gap-4 pt-4">
            <RouterLink
              :to="data.ctaLink || '/projects'"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-indigo-500 text-slate-950 font-bold text-sm hover:shadow-[0_0_25px_rgba(0,242,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span>{{ data.ctaText || 'Khám Phá Dự Án' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l7-7m7 7H3" />
              </svg>
            </RouterLink>

            <RouterLink
              to="/cv"
              class="px-6 py-3 rounded-xl bg-white/5 border border-cyber-cyan/30 text-cyber-cyan font-semibold text-sm hover:bg-cyber-cyan/15 hover:border-cyber-cyan/60 transition-all duration-300 flex items-center gap-2"
            >
              <span>Xem CV</span>
            </RouterLink>

            <RouterLink
              to="/contact"
              class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium text-sm hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              Liên Hệ
            </RouterLink>
          </div>
        </div>

        <!-- Right Avatar / Visual Showcase -->
        <div class="lg:col-span-5 flex flex-col items-center justify-center">
          <div class="relative w-full max-w-[300px] sm:max-w-[340px] aspect-[4/5] group">
            <!-- Glow background circle -->
            <div class="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-indigo-500 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-700"></div>

            <div class="relative w-full h-full rounded-2xl bg-slate-900 border border-cyber-cyan/30 overflow-hidden shadow-2xl">
              <img
                v-if="data.profileImage"
                :src="data.profileImage"
                alt="Hồ Ngọc Thiện (ThienHN)"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div class="w-20 h-20 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-mono text-2xl font-bold mb-4">
                  HN
                </div>
                <span class="font-bold text-lg text-slate-200">Hồ Ngọc Thiện</span>
                <span class="text-xs font-mono text-cyber-cyan mt-1">@ThienHN</span>
              </div>

              <!-- Overlay Card Badge -->
              <div class="absolute bottom-3 left-3 right-3 p-3 rounded-xl glass-panel bg-slate-950/80 border-cyber-border/40 backdrop-blur-md flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-xs font-mono text-slate-300">Sẵn sàng nhận dự án</span>
                </div>
                <span class="text-[10px] font-mono text-cyber-cyan uppercase">Full-Time / Freelance</span>
              </div>
            </div>
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