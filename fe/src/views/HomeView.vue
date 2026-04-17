<template>
  <div>
    <HeroSection :data="homeStore.homeData || {}" />
    <FeaturedProjects />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHomeStore } from '@/stores/home'
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturedProjects from '@/components/sections/FeaturedProjects.vue'
import { applySeo } from '@/utils/seo'

const homeStore = useHomeStore()

onMounted(async () => {
  await homeStore.fetchHomeData()
  const home = homeStore.homeData
  applySeo({
    title: 'Home',
    description:
      home?.heroDescription ||
      'Portfolio of ThienHN featuring selected projects, technical profile, and latest updates.',
    image: home?.profileImage,
    url: '/',
  })
})
</script>
