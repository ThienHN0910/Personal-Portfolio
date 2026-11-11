<template>
  <div class="form-group">
    <label>Hero Title</label>
    <input v-model="model.heroTitle" type="text" placeholder="Hi, I'm" />
  </div>
  <div class="form-group">
    <label>Hero Subtitle</label>
    <input v-model="model.heroSubtitle" type="text" placeholder="Full Stack Developer" />
  </div>
  <div class="form-group">
    <label>Hero Description</label>
    <textarea v-model="model.heroDescription" rows="3" placeholder="Brief introduction..." />
  </div>
  <div class="form-group">
    <label>CTA Button Text</label>
    <input v-model="model.ctaText" type="text" placeholder="View My Work" />
  </div>
  <div class="form-group">
    <label>CTA Button Link</label>
    <input v-model="model.ctaLink" type="text" placeholder="/projects" />
  </div>
  <div class="form-group">
    <label>Profile Image URL</label>
    <ImageDropUpload v-model="model.profileImage" folder="portfolio/home" />
  </div>
</template>

<script setup lang="ts">
import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import type { HomeFormData } from './types'

const model = defineModel<HomeFormData>({ required: true })
</script>
