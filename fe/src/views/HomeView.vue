<template>
    <div class="container">
      <HeroSection :data="homeStore.homeData || {}" />
      <div class="mt-8">
        <FeaturedProjects />
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAboutStore } from '@/stores/about'
import { useBlogStore } from '@/stores/blog'
import { useHomeStore } from '@/stores/home'
import { useProjectsStore } from '@/stores/projects'
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturedProjects from '@/components/sections/FeaturedProjects.vue'
import { applySeo } from '@/utils/seo'
import { getHomeSeoMeta } from '@/utils/seoPriority'

const homeStore = useHomeStore()
const aboutStore = useAboutStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

onMounted(async () => {
  await Promise.all([
    homeStore.fetchHomeData(),
    aboutStore.aboutData ? Promise.resolve() : aboutStore.fetchAboutData(),
    projectsStore.projects.length ? Promise.resolve() : projectsStore.fetchProjects(),
    blogStore.posts.length ? Promise.resolve() : blogStore.fetchPosts(),
  ])

  applySeo({
    ...getHomeSeoMeta({
      home: homeStore.homeData,
      about: aboutStore.aboutData,
      projects: projectsStore.projects,
      posts: blogStore.posts,
    }),
    url: '/',
  })
})
</script>
