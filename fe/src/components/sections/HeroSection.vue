<template>
  <section class="hero relative w-full pt-4 pb-12 overflow-hidden">
    <div class="hero__container glass-panel cut-corners p-6 md:p-10 lg:p-12 bg-surface-glass border border-border-cyan/30 backdrop-blur-md relative overflow-hidden">
      
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] z-0"></div>
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">
        
        <div class="lg:col-span-7 space-y-6 min-w-0 w-full text-left">
          <div class="space-y-2">
            <div class="font-mono text-[10px] tracking-[0.3em] text-cyan-400 uppercase opacity-80 flex items-center gap-2">
              <span class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]"></span>
              System Identity // Initializing
            </div>
            
            <h1 class="font-display-os text-4xl sm:text-5xl xl:text-6xl text-white uppercase tracking-[0.1em] leading-[1.1] break-words">
              {{ data.heroTitle || "HI, I'M" }}
              <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                {{ data.heroSubtitle || 'THIÊN' }}
              </span>
            </h1>
          </div>

          <p class="font-mono text-sm lg:text-base text-gray-400 max-w-xl leading-relaxed border-l-2 border-border-cyan/20 pl-6">
            {{ data.heroDescription || 'Architecting high-performance digital ecosystems with a focus on tactical UI/UX and scalable backend systems.' }}
          </p>

          <div class="flex flex-wrap gap-4 pt-2">
            <RouterLink 
              :to="data.ctaLink || '/projects'" 
              class="group relative px-6 py-3 bg-cyan-500 text-black font-display-os uppercase tracking-[0.2em] text-xs cut-corners-sm hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center gap-2"
            >
              {{ data.ctaText || 'Execute_Projects' }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </RouterLink>
            <RouterLink 
              to="/contact" 
              class="px-6 py-3 border border-cyan-500/50 text-cyan-400 font-mono uppercase tracking-[0.2em] text-xs cut-corners-sm hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
            >
              Connect_Link
            </RouterLink>
          </div>            
        </div>

        <div class="lg:col-span-5 flex justify-center lg:justify-end w-full">
          <div class="relative w-full max-w-[280px] xl:max-w-[320px] aspect-[4/5]">
            <div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-500/40 z-20"></div>
            <div class="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40 z-20"></div>
            
            <div class="hero__image-wrapper absolute inset-0 p-1 bg-surface-bright/20 border border-border-cyan/40 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] rounded-sm">
              <img
                v-if="data.profileImage"
                :src="data.profileImage"
                alt="System_Operator"
                class="hero__image w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700 relative z-10"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ data: any }>()
</script>

<style scoped>
.font-display-os {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}
.cut-corners {
  clip-path: polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px));
}
.cut-corners-sm {
  clip-path: polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px));
}
</style>