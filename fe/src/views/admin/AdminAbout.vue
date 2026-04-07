<template>
  <div class="section admin-shell min-h-screen pt-24">
    <div class="container max-w-3xl">
      <AdminSectionHeader kicker="Site Identity" title-before="Edit " title-highlight="Content" />

      <!-- Tab navigation -->
      <div class="admin-panel flex gap-3 mb-8 border-b border-white/10 pb-4 px-4 pt-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="btn btn--sm"
          :class="activeTab === tab.id ? 'btn--primary' : 'btn--secondary'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <!-- Home Tab -->
      <div v-else-if="activeTab === 'home'" class="admin-panel p-6">
        <h2 class="text-xl font-bold text-white mb-6">Home Page</h2>
        <form @submit.prevent="saveHome">
          <div class="form-group">
            <label>Hero Title</label>
            <input v-model="homeForm.heroTitle" type="text" placeholder="Hi, I'm" />
          </div>
          <div class="form-group">
            <label>Hero Subtitle</label>
            <input v-model="homeForm.heroSubtitle" type="text" placeholder="Full Stack Developer" />
          </div>
          <div class="form-group">
            <label>Hero Description</label>
            <textarea v-model="homeForm.heroDescription" rows="3" placeholder="Brief introduction..." />
          </div>
          <div class="form-group">
            <label>CTA Button Text</label>
            <input v-model="homeForm.ctaText" type="text" placeholder="View My Work" />
          </div>
          <div class="form-group">
            <label>CTA Button Link</label>
            <input v-model="homeForm.ctaLink" type="text" placeholder="/projects" />
          </div>
          <div class="form-group">
            <label>Profile Image URL</label>
            <ImageDropUpload v-model="homeForm.profileImage" folder="portfolio/home" />
          </div>
          <button type="submit" class="btn btn--primary" :disabled="homeStore.loading">Save Home</button>
        </form>
      </div>

      <!-- About Tab -->
      <div v-else-if="activeTab === 'about'" class="admin-panel p-6">
        <h2 class="text-xl font-bold text-white mb-6">About Page</h2>
        <form @submit.prevent="saveAbout">
          <div class="form-group">
            <label>Name</label>
            <input v-model="aboutForm.name" type="text" placeholder="Your name" />
          </div>
          <div class="form-group">
            <label>Title</label>
            <input v-model="aboutForm.title" type="text" placeholder="Full Stack Developer" />
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea v-model="aboutForm.bio" rows="5" placeholder="Tell your story..." />
          </div>
          <div class="form-group">
            <label>Skills (comma separated)</label>
            <input v-model="skillsInput" type="text" placeholder="Vue, TypeScript, Node.js, MongoDB" />
          </div>
          <div class="form-group">
            <label>Avatar URL</label>
            <ImageDropUpload v-model="aboutForm.avatarUrl" folder="portfolio/about" />
          </div>
          <div class="form-group">
            <label>Resume URL</label>
            <input v-model="aboutForm.resumeUrl" type="url" placeholder="https://..." />
          </div>
          <h3 class="text-white font-semibold mb-4 mt-2">Social Links</h3>
          <div class="form-group">
            <label>GitHub</label>
            <input v-model="aboutForm.socialLinks.github" type="url" placeholder="https://github.com/..." />
          </div>
          <div class="form-group">
            <label>LinkedIn</label>
            <input v-model="aboutForm.socialLinks.linkedin" type="url" placeholder="https://linkedin.com/in/..." />
          </div>
          <div class="form-group">
            <label>Twitter</label>
            <input v-model="aboutForm.socialLinks.twitter" type="url" placeholder="https://twitter.com/..." />
          </div>
          <button type="submit" class="btn btn--primary" :disabled="aboutStore.loading">Save About</button>
        </form>
      </div>

      <p v-if="saved" class="text-green-400 text-sm mt-4">✓ Saved successfully!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import { useHomeStore } from '@/stores/home'
import { useAboutStore } from '@/stores/about'
import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const homeStore = useHomeStore()
const aboutStore = useAboutStore()

const activeTab = ref('home')
const loading = ref(false)
const saved = ref(false)
const skillsInput = ref('')

const tabs = [
  { id: 'home', label: 'Home Page' },
  { id: 'about', label: 'About Page' },
]

const homeForm = reactive({
  heroTitle: '',
  heroSubtitle: '',
  heroDescription: '',
  ctaText: '',
  ctaLink: '',
  profileImage: '',
})

const aboutForm = reactive({
  name: '',
  title: '',
  bio: '',
  avatarUrl: '',
  resumeUrl: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    email: '',
  },
})

watch(
  () => homeStore.homeData,
  (data) => {
    if (data) {
      homeForm.heroTitle = data.heroTitle || ''
      homeForm.heroSubtitle = data.heroSubtitle || ''
      homeForm.heroDescription = data.heroDescription || ''
      homeForm.ctaText = data.ctaText || ''
      homeForm.ctaLink = data.ctaLink || ''
      homeForm.profileImage = data.profileImage || ''
    }
  },
  { immediate: true },
)

watch(
  () => aboutStore.aboutData,
  (data) => {
    if (data) {
      aboutForm.name = data.name || ''
      aboutForm.title = data.title || ''
      aboutForm.bio = data.bio || ''
      aboutForm.avatarUrl = data.avatarUrl || ''
      aboutForm.resumeUrl = data.resumeUrl || ''
      aboutForm.socialLinks = {
        github: data.socialLinks.github || '',
        linkedin: data.socialLinks.linkedin || '',
        twitter: data.socialLinks.twitter || '',
        email: data.socialLinks.email || '',
      }
      skillsInput.value = (data.skills || []).join(', ')
    }
  },
  { immediate: true },
)

async function saveHome() {
  await homeStore.updateHomeData({ ...homeForm })
  showSaved()
}

async function saveAbout() {
  const skills = skillsInput.value.split(',').map((s) => s.trim()).filter(Boolean)
  await aboutStore.updateAboutData({ ...aboutForm, skills })
  showSaved()
}

function showSaved() {
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}

onMounted(async () => {
  loading.value = true
  await Promise.all([homeStore.fetchHomeData(), aboutStore.fetchAboutData()])
  loading.value = false
})
</script>
