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

          <h3 class="text-white font-semibold mb-4 mt-2">Education</h3>
          <div class="space-y-5 mb-5">
            <div
              v-for="(edu, index) in aboutForm.education"
              :key="edu._editorId"
              class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="form-group mb-0">
                  <label>Institution</label>
                  <input v-model="edu.institution" type="text" placeholder="University / Academy" />
                </div>
                <div class="form-group mb-0">
                  <label>Degree</label>
                  <input v-model="edu.degree" type="text" placeholder="Bachelor / Master / Diploma" />
                </div>
                <div class="form-group mb-0">
                  <label>Field</label>
                  <input v-model="edu.field" type="text" placeholder="Computer Science" />
                </div>
                <div class="form-group mb-0">
                  <label>GPA</label>
                  <input v-model="edu.gpa" type="text" placeholder="3.75/4.0" />
                </div>
                <div class="form-group mb-0">
                  <label>Start Date</label>
                  <input v-model="edu.startDate" type="text" placeholder="Sep 2018" />
                </div>
                <div class="form-group mb-0">
                  <label>End Date</label>
                  <input v-model="edu.endDate" type="text" placeholder="Jun 2022" />
                </div>
              </div>

              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  class="btn btn--danger btn--sm"
                  :disabled="aboutForm.education.length === 1"
                  @click="removeEducation(index)"
                >
                  Remove Education
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn--secondary mb-5" @click="addEducation">+ Add Education</button>

          <h3 class="text-white font-semibold mb-4 mt-2">Licenses &amp; Certifications</h3>
          <div class="space-y-5 mb-5">
            <div
              v-for="(item, index) in aboutForm.licensesCertifications"
              :key="item._editorId"
              class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="form-group mb-0">
                  <label>Name</label>
                  <input v-model="item.name" type="text" placeholder="AWS Certified Developer" />
                </div>
                <div class="form-group mb-0">
                  <label>Issuer</label>
                  <input v-model="item.issuer" type="text" placeholder="Amazon Web Services" />
                </div>
                <div class="form-group mb-0">
                  <label>Issue Date</label>
                  <input v-model="item.issueDate" type="text" placeholder="Jan 2025" />
                </div>
                <div class="form-group mb-0">
                  <label>Expiration Date</label>
                  <input v-model="item.expirationDate" type="text" placeholder="Jan 2028" />
                </div>
                <div class="form-group mb-0">
                  <label>Credential ID</label>
                  <input v-model="item.credentialId" type="text" placeholder="ABC-12345" />
                </div>
                <div class="form-group mb-0">
                  <label>Credential URL</label>
                  <input v-model="item.credentialUrl" type="text" placeholder="https://verify.example.com/..." />
                </div>
              </div>

              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  class="btn btn--danger btn--sm"
                  :disabled="aboutForm.licensesCertifications.length === 1"
                  @click="removeLicenseCertification(index)"
                >
                  Remove Item
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn--secondary mb-5" @click="addLicenseCertification">+ Add License/Certification</button>

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
          <div class="space-y-4 mb-5">
            <div
              v-for="(link, index) in aboutForm.socialLinks"
              :key="link._editorId"
              class="border border-white/10 rounded-xl p-4 bg-slate-900/40"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="form-group mb-0">
                  <label>Label</label>
                  <input v-model="link.label" type="text" placeholder="GitHub, LinkedIn, Portfolio..." />
                </div>
                <div class="form-group mb-0">
                  <label>URL</label>
                  <input v-model="link.url" type="text" placeholder="https://..." />
                </div>
              </div>

              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  class="btn btn--danger btn--sm"
                  :disabled="aboutForm.socialLinks.length === 1"
                  @click="removeSocialLink(index)"
                >
                  Remove Link
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn--secondary mb-5" @click="addSocialLink">+ Add Social Link</button>
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
import type { Education, Experience, LicenseCertification, SocialLink } from '@/types'
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

type ExperienceForm = Experience & { _editorId: string }
type EducationForm = Education & { _editorId: string }
type LicenseCertificationForm = LicenseCertification & { _editorId: string }
type SocialLinkForm = SocialLink & { _editorId: string }

function createEditorId(): string {
  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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

function createEmptySocialLink(): SocialLinkForm {
  return {
    _editorId: createEditorId(),
    label: '',
    url: '',
  }
}

function createEmptyEducation(): EducationForm {
  return {
    _editorId: createEditorId(),
    institution: '',
    degree: '',
    field: '',
    gpa: '',
    startDate: '',
    endDate: '',
  }
}

function createEmptyLicenseCertification(): LicenseCertificationForm {
  return {
    _editorId: createEditorId(),
    name: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
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
    skills,
    experience,
    education,
    licensesCertifications,
    socialLinks,
  })
  showSaved()
}

function addExperience(): void {
  aboutForm.experience.push(createEmptyExperience())
}

function removeExperience(index: number): void {
  if (aboutForm.experience.length === 1) return
  aboutForm.experience.splice(index, 1)
}

function addSocialLink(): void {
  aboutForm.socialLinks.push(createEmptySocialLink())
}

function removeSocialLink(index: number): void {
  if (aboutForm.socialLinks.length === 1) return
  aboutForm.socialLinks.splice(index, 1)
}

function addEducation(): void {
  aboutForm.education.push(createEmptyEducation())
}

function removeEducation(index: number): void {
  if (aboutForm.education.length === 1) return
  aboutForm.education.splice(index, 1)
}

function addLicenseCertification(): void {
  aboutForm.licensesCertifications.push(createEmptyLicenseCertification())
}

function removeLicenseCertification(index: number): void {
  if (aboutForm.licensesCertifications.length === 1) return
  aboutForm.licensesCertifications.splice(index, 1)
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
