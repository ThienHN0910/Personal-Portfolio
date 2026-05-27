<template>
  <section class="hero relative min-h-[70vh] flex items-center pt-24 pb-12 overflow-hidden">
    <!-- Background Layer (Local to Hero if needed) -->
    <div class="hero__bg pointer-events-none absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,rgba(0,242,255,0.15),transparent_50%)]" />

    <div class="container relative z-10 mx-auto px-6">
      <div class="hero__container glass-panel cut-corners p-8 md:p-12 bg-surface-glass border border-border-cyan/30 backdrop-blur-xl relative overflow-hidden">
        <!-- Scanline decorative effect -->
        <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] z-0"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10">
          
          <!-- Content Side -->
          <div class="md:col-span-7 space-y-8">
            <div class="space-y-2">
              <div class="font-mono text-[10px] tracking-[0.3em] text-cyan-400 uppercase opacity-80 flex items-center gap-2">
                <span class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]"></span>
                System Identity // Initializing
              </div>
              <h1 class="hero__title font-display-os text-5xl md:text-6xl lg:text-7xl text-white uppercase tracking-[0.12em] leading-[1.1]">
                {{ data.heroTitle || "HI, I'M" }}
                <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                  {{ data.heroSubtitle || 'THIÊN' }}
                </span>
              </h1>
            </div>

            <p class="hero__description font-mono text-gray-400 max-w-xl leading-relaxed text-base border-l-2 border-border-cyan/20 pl-6">
              {{ data.heroDescription || 'Architecting high-performance digital ecosystems with a focus on tactical UI/UX and scalable backend systems.' }}
            </p>

            <div class="hero__cta flex flex-wrap gap-4">
              <RouterLink 
                :to="data.ctaLink || '/projects'" 
                class="group relative px-8 py-4 bg-cyan-500 text-black font-display-os uppercase tracking-[0.2em] text-sm cut-corners-sm hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center gap-2"
              >
                {{ data.ctaText || 'Execute_Projects' }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </RouterLink>
              <RouterLink 
                to="/contact" 
                class="px-8 py-4 border border-cyan-500/50 text-cyan-400 font-mono uppercase tracking-[0.2em] text-sm cut-corners-sm hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
              >
                Connect_Link
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </RouterLink>
            </div>            
          </div>

          <!-- Image Side -->
          <div class="md:col-span-5 flex justify-center md:justify-end">
            <div class="relative w-full max-w-[340px]">
              <!-- Decorative Frame Elements -->
              <div class="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40 z-20"></div>
              <div class="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/40 z-20"></div>
              
              <div class="hero__image-wrapper glass-panel cut-corners p-1.5 relative bg-surface-bright/20 border border-border-cyan/40 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                <div class="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent z-0"></div>
                
                <img
                  v-if="data.profileImage"
                  :src="data.profileImage"
                  alt="System_Operator"
                  class="hero__image w-full aspect-[4/5] object-cover cut-corners grayscale-[10%] hover:grayscale-0 transition-all duration-700 relative z-10"
                />
                <div v-else class="hero__image w-full aspect-[4/5] flex items-center justify-center bg-surface-container-high rounded-sm relative z-10">
                  <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="0.5" viewBox="0 0 24 24" class="text-cyan-500/40">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>

                <!-- Telemetry Overlays -->
                <div class="absolute top-6 right-6 px-2 py-1 bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[9px] font-mono tracking-[0.2em] text-cyan-300 z-20 flex flex-col items-end">
                  <span>VIEWFINDER_01 // ARCH_S</span>
                  <span class="text-[7px] text-cyan-500/60 mt-0.5">REC [00:42:15]</span>
                </div>
                
                <div class="absolute bottom-6 left-6 font-mono text-[8px] text-cyan-500/70 vertical-text z-20 tracking-[0.25em]">
                  LN_COORD: 10.8231 / 106.6297
                </div>

                <div class="absolute bottom-6 right-6 font-mono text-[8px] text-cyan-300 z-20 tracking-tighter bg-black/40 px-1">
                  USER_ID: 9823-X
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HeroSection.vue
 * Part of THIEN.OS Portfolio System
 * Refactored for Cyber Tactical OS Design System
 */
interface HomeData {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  ctaText: string
  ctaLink: string
  profileImage: string
}

withDefaults(
  defineProps<{
    data: Partial<HomeData>
  }>(),
  {
    data: () => ({
      heroTitle: "HI, I'M",
      heroSubtitle: 'THIÊN',
      heroDescription: 'Architecting high-performance digital ecosystems with a focus on tactical UI/UX and scalable backend systems.',
      ctaText: 'Execute_Projects',
      ctaLink: '/projects',
    }),
  },
)
</script>

<style scoped>
.font-display-os {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 700;
}

.glass-panel {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.cut-corners {
  clip-path: polygon(
    0 20px, 20px 0, 
    calc(100% - 20px) 0, 100% 20px, 
    100% calc(100% - 20px), calc(100% - 20px) 100%, 
    20px 100%, 0 calc(100% - 20px)
  );
}

.cut-corners-sm {
  clip-path: polygon(
    0 10px, 10px 0, 
    calc(100% - 10px) 0, 100% 10px, 
    100% calc(100% - 10px), calc(100% - 10px) 100%, 
    10px 100%, 0 calc(100% - 10px)
  );
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.hero__container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(0, 242, 255, 0.1), transparent);
  animation: scanline 8s linear infinite;
  z-index: 1;
}
</style>