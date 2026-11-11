import type { Education, Experience, LicenseCertification, SocialLink } from '@/types'

export type ExperienceForm = Experience & { _editorId: string }
export type EducationForm = Education & { _editorId: string }
export type LicenseCertificationForm = LicenseCertification & { _editorId: string }
export type SocialLinkForm = SocialLink & { _editorId: string }
export type PillarForm = { _editorId: string; tag: string; title: string; description: string }

export interface HomeFormData {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  ctaText: string
  ctaLink: string
  profileImage: string
}

export interface AboutIntroFormData {
  name: string
  title: string
  bio: string
  availabilityStatus: string
  telemetry: {
    location?: string
    timezone?: string
    focus?: string
    status?: string
  }
  pillars: PillarForm[]
  contactInfo: {
    email?: string
    phone?: string
    location?: string
    website?: string
  }
}

export function createEditorId(): string {
  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createEmptyPillar(tag = '', title = '', description = ''): PillarForm {
  return {
    _editorId: createEditorId(),
    tag,
    title,
    description,
  }
}

export function createEmptyExperience(): ExperienceForm {
  return {
    _editorId: createEditorId(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  }
}

export function createEmptySocialLink(): SocialLinkForm {
  return {
    _editorId: createEditorId(),
    label: '',
    url: '',
  }
}

export function createEmptyEducation(): EducationForm {
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

export function createEmptyLicenseCertification(): LicenseCertificationForm {
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

export const defaultPillars: PillarForm[] = [
  createEmptyPillar('PILLAR 01 · ⚡ TYPE SAFETY', 'Contract-First Systems', 'End-to-end typing from database schemas to client state, preventing runtime mismatches and contract drift.'),
  createEmptyPillar('PILLAR 02 · ⚡ 60FPS UI', 'Sub-100ms Interactions', 'GPU-composited transforms, lightweight reactive trees, and optimized asset delivery for tactile micro-interactions.'),
  createEmptyPillar('PILLAR 03 · ⚡ RESILIENCE', 'Fault-Tolerant Seams', 'Graceful API degradation, robust fallbacks, and automated seam tests protecting critical system boundaries.'),
]
