<template>
  <div class="section admin-shell min-h-screen py-8">
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
          <AboutHomeEditor v-model="homeForm" />
          <button type="submit" class="btn btn--primary" :disabled="homeStore.loading">Save Home</button>
        </form>
      </div>

      <!-- About Tab -->
      <div v-else-if="activeTab === 'about'" class="admin-panel p-6">
        <h2 class="text-xl font-bold text-white mb-6">About Page</h2>
        <form @submit.prevent="saveAbout">
          <AboutIntroEditor v-model="aboutForm" />
          <AboutSkillMatrixEditor v-model="skillsInput" />
          <AboutWorkChronologyEditor v-model="aboutForm.experience" />
          <AboutEducationEditor v-model="aboutForm.education" />
          <AboutLicensesCertificationsEditor v-model="aboutForm.licensesCertifications" />
          <AboutMediaEditor
            v-model:avatar-url="aboutForm.avatarUrl"
            v-model:resume-url="aboutForm.resumeUrl"
          />
          <AboutSocialLinksEditor v-model="aboutForm.socialLinks" />
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
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AboutHomeEditor from '@/components/admin/about/AboutHomeEditor.vue'
import AboutIntroEditor from '@/components/admin/about/AboutIntroEditor.vue'
import AboutSkillMatrixEditor from '@/components/admin/about/AboutSkillMatrixEditor.vue'
import AboutWorkChronologyEditor from '@/components/admin/about/AboutWorkChronologyEditor.vue'
import AboutEducationEditor from '@/components/admin/about/AboutEducationEditor.vue'
import AboutLicensesCertificationsEditor from '@/components/admin/about/AboutLicensesCertificationsEditor.vue'
import AboutMediaEditor from '@/components/admin/about/AboutMediaEditor.vue'
import AboutSocialLinksEditor from '@/components/admin/about/AboutSocialLinksEditor.vue'
import {
  type ExperienceForm,
  type EducationForm,
  type LicenseCertificationForm,
  type SocialLinkForm,
  type PillarForm,
  createEditorId,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyLicenseCertification,
  createEmptySocialLink,
  defaultPillars,
} from '@/components/admin/about/types'
import { useHomeStore } from '@/stores/home'
import { useAboutStore } from '@/stores/about'
import type { SocialLink } from '@/types'
import { sortExperiencesDescending } from '@/utils/experienceSort'

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
  availabilityStatus: 'Available for Architecture',
  telemetry: {
    location: 'Ho Chi Minh City, VN',
    timezone: 'GMT+7 (Indochina)',
    focus: 'Distributed Systems & Web Apps',
    status: 'Production Active',
  },
  pillars: [...defaultPillars] as PillarForm[],
  contactInfo: {
    email: '',
    phone: '',
    location: '',
    website: '',
  },
  experience: [createEmptyExperience()] as ExperienceForm[],
  education: [createEmptyEducation()] as EducationForm[],
  licensesCertifications: [createEmptyLicenseCertification()] as LicenseCertificationForm[],
  avatarUrl: '',
  resumeUrl: '',
  socialLinks: [createEmptySocialLink()] as SocialLinkForm[],
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
      const normalizedExperience = (data.experience?.length ? data.experience : [createEmptyExperience()]).map((exp) => ({
        _editorId: createEditorId(),
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
      }))
      aboutForm.experience = sortExperiencesDescending(normalizedExperience)
      const incomingEducation = Array.isArray(data.education)
        ? data.education
        : []
      aboutForm.education = (incomingEducation.length ? incomingEducation : [createEmptyEducation()]).map((edu) => ({
        _editorId: createEditorId(),
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        gpa: edu.gpa || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      }))
      const incomingLicensesCertifications = Array.isArray(data.licensesCertifications)
        ? data.licensesCertifications
        : []
      aboutForm.licensesCertifications = (incomingLicensesCertifications.length ? incomingLicensesCertifications : [createEmptyLicenseCertification()]).map((item) => ({
        _editorId: createEditorId(),
        name: item.name || '',
        issuer: item.issuer || '',
        issueDate: item.issueDate || '',
        expirationDate: item.expirationDate || '',
        credentialId: item.credentialId || '',
        credentialUrl: item.credentialUrl || '',
      }))
      aboutForm.availabilityStatus = data.availabilityStatus || 'Available for Architecture'
      aboutForm.telemetry = {
        location: data.telemetry?.location || 'Ho Chi Minh City, VN',
        timezone: data.telemetry?.timezone || 'GMT+7 (Indochina)',
        focus: data.telemetry?.focus || 'Distributed Systems & Web Apps',
        status: data.telemetry?.status || 'Production Active',
      }
      const incomingPillars = Array.isArray(data.pillars) && data.pillars.length ? data.pillars : defaultPillars
      aboutForm.pillars = incomingPillars.map((p) => ({
        _editorId: createEditorId(),
        tag: p.tag || '',
        title: p.title || '',
        description: p.description || '',
      }))
      aboutForm.avatarUrl = data.avatarUrl || ''
      aboutForm.resumeUrl = data.resumeUrl || ''
      const incomingSocialLinks = Array.isArray(data.socialLinks)
        ? data.socialLinks
        : []
      aboutForm.socialLinks = (incomingSocialLinks.length ? incomingSocialLinks : [createEmptySocialLink()]).map((link) => ({
        _editorId: createEditorId(),
        label: link.label || '',
        url: link.url || '',
      }))
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

  const normalizeUrl = (value: string): string => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed
    return `https://${trimmed}`
  }

  const socialLinks = aboutForm.socialLinks
    .map(({ _editorId: _id, ...link }) => {
      const url = normalizeUrl(link.url)
      const label = link.label.trim()

      if (!url) return null

      const fallbackLabel = (() => {
        if (url.startsWith('mailto:')) return 'Email'
        if (url.startsWith('tel:')) return 'Phone'
        try {
          return new URL(url).hostname.replace(/^www\./, '')
        } catch {
          return 'Link'
        }
      })()

      return {
        label: label || fallbackLabel,
        url,
      }
    })
    .filter((link): link is SocialLink => Boolean(link))

  const pillars = aboutForm.pillars
    .map(({ _editorId: _id, ...pillar }) => ({
      tag: pillar.tag.trim(),
      title: pillar.title.trim(),
      description: pillar.description.trim(),
    }))
    .filter((pillar) => pillar.title || pillar.description || pillar.tag)

  const experience = sortExperiencesDescending(
    aboutForm.experience
    .map(({ _editorId: _id, ...exp }) => ({
      ...exp,
      company: exp.company.trim(),
      position: exp.position.trim(),
      startDate: exp.startDate.trim(),
      endDate: exp.endDate?.trim() || '',
      description: exp.description,
    }))
    .filter((exp) => exp.company || exp.position || exp.description),
  )

  const education = sortExperiencesDescending(
    aboutForm.education
      .map(({ _editorId: _id, ...edu }) => ({
        institution: edu.institution.trim(),
        degree: edu.degree.trim(),
        field: edu.field.trim(),
        gpa: edu.gpa?.trim() || '',
        startDate: edu.startDate.trim(),
        endDate: edu.endDate?.trim() || '',
      }))
      .filter((edu) => edu.institution || edu.degree || edu.field || edu.gpa || edu.startDate || edu.endDate),
  )

  const licensesCertifications = aboutForm.licensesCertifications
    .map(({ _editorId: _id, ...item }) => ({
      name: item.name.trim(),
      issuer: item.issuer.trim(),
      issueDate: item.issueDate.trim(),
      expirationDate: item.expirationDate?.trim() || '',
      credentialId: item.credentialId?.trim() || '',
      credentialUrl: normalizeUrl(item.credentialUrl || ''),
    }))
    .filter((item) => item.name || item.issuer || item.issueDate || item.expirationDate || item.credentialId || item.credentialUrl)

  await aboutStore.updateAboutData({
    ...aboutForm,
    pillars,
    skills,
    experience,
    education,
    licensesCertifications,
    socialLinks,
  })
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
