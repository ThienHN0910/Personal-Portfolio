<template>
  <div class="form-group">
    <label>Avatar URL</label>
    <ImageDropUpload v-model="avatarUrl" folder="portfolio/about" />
  </div>
  <div class="form-group">
    <label>Resume PDF</label>
    <FileDropUpload
      v-model="resumeUrl"
      folder="portfolio/cv"
      resource-type="raw"
      accept="application/pdf"
      title="Keo tha CV PDF vao day hoac bam de chon file"
      hint="PDF, toi da 8MB"
    />
  </div>
</template>

<script setup lang="ts">
import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import FileDropUpload from '@/components/ui/FileDropUpload.vue'

const avatarUrl = defineModel<string>('avatarUrl', { default: '' })
const resumeUrl = defineModel<string>('resumeUrl', { default: '' })
</script>
