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

const homeStore = useHomeStore()

onMounted(() => homeStore.fetchHomeData())
</script>
