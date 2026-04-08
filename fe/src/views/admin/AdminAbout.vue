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

          <h3 class="text-white font-semibold mb-4 mt-2">Contact Info</h3>
          <div class="form-group">
            <label>Email</label>
            <input v-model="aboutForm.contactInfo.email" type="email" placeholder="you@email.com" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="aboutForm.contactInfo.phone" type="text" placeholder="+84 ..." />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input v-model="aboutForm.contactInfo.location" type="text" placeholder="Ho Chi Minh City, Vietnam" />
          </div>
          <div class="form-group">
            <label>Website</label>
            <input v-model="aboutForm.contactInfo.website" type="url" placeholder="https://yourdomain.com" />
          </div>

          <div class="form-group">
            <label>Skills (comma separated)</label>
            <input v-model="skillsInput" type="text" placeholder="Vue, TypeScript, Node.js, MongoDB" />
          </div>

          <h3 class="text-white font-semibold mb-4 mt-2">Experience</h3>
          <div class="space-y-5 mb-5">
            <div
              v-for="(exp, index) in aboutForm.experience"
              :key="exp._editorId"
              class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div class="form-group mb-0">
                  <label>Company</label>
                  <input v-model="exp.company" type="text" placeholder="Company" />
                </div>
                <div class="form-group mb-0">
                  <label>Position</label>
                  <input v-model="exp.position" type="text" placeholder="Position" />
                </div>
                <div class="form-group mb-0">
                  <label>Start Date</label>
                  <input v-model="exp.startDate" type="text" placeholder="Jan 2022" />
                </div>
                <div class="form-group mb-0">
                  <label>End Date</label>
                  <input v-model="exp.endDate" type="text" placeholder="Present" />
                </div>
              </div>

              <div class="form-group mb-0">
                <label>Description</label>
                <FullRichEditor v-model="exp.description" :editor-key="exp._editorId" />
              </div>

              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  class="btn btn--danger btn--sm"
                  :disabled="aboutForm.experience.length === 1"
                  @click="removeExperience(index)"
                >
                  Remove Experience
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn--secondary mb-5" @click="addExperience">+ Add Experience</button>

          <div class="form-group">
            <label>Avatar URL</label>
            <ImageDropUpload v-model="aboutForm.avatarUrl" folder="portfolio/about" />
          </div>
          <div class="form-group">
            <label>Resume PDF</label>
            <FileDropUpload
              v-model="aboutForm.resumeUrl"
              folder="portfolio/cv"
              resource-type="raw"
              accept="application/pdf"
              title="Keo tha CV PDF vao day hoac bam de chon file"
              hint="PDF, toi da 8MB"
            />
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
          <div class="form-group">
            <label>Social Email (optional)</label>
            <input v-model="aboutForm.socialLinks.email" type="email" placeholder="you@email.com" />
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
import FullRichEditor from '@/components/admin/FullRichEditor.vue'
import FileDropUpload from '@/components/ui/FileDropUpload.vue'
import { useHomeStore } from '@/stores/home'
import { useAboutStore } from '@/stores/about'
import ImageDropUpload from '@/components/ui/ImageDropUpload.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { Experience } from '@/types'

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

type ExperienceForm = Experience & { _editorId: string }

function createEditorId(): string {
  return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createEmptyExperience(): ExperienceForm {
  return {
    _editorId: createEditorId(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  }
}

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
  contactInfo: {
    email: '',
    phone: '',
    location: '',
    website: '',
  },
  experience: [createEmptyExperience()] as ExperienceForm[],
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
      aboutForm.contactInfo = {
        email: data.contactInfo?.email || '',
        phone: data.contactInfo?.phone || '',
        location: data.contactInfo?.location || '',
        website: data.contactInfo?.website || '',
      }
      aboutForm.experience = (data.experience?.length ? data.experience : [createEmptyExperience()]).map((exp) => ({
        _editorId: createEditorId(),
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
      }))
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
  const experience = aboutForm.experience
    .map(({ _editorId: _id, ...exp }) => ({
      ...exp,
      company: exp.company.trim(),
      position: exp.position.trim(),
      startDate: exp.startDate.trim(),
      endDate: exp.endDate?.trim() || '',
      description: exp.description,
    }))
    .filter((exp) => exp.company || exp.position || exp.description)

  await aboutStore.updateAboutData({ ...aboutForm, skills, experience })
  showSaved()
}

function addExperience(): void {
  aboutForm.experience.push(createEmptyExperience())
}

function removeExperience(index: number): void {
  if (aboutForm.experience.length === 1) return
  aboutForm.experience.splice(index, 1)
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
