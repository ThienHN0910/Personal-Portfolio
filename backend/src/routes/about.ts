import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import About from '../models/About'

const router = Router()

type SocialLinkItem = {
  label: string
  url: string
}

type EducationItem = {
  institution: string
  degree: string
  field: string
  gpa?: string
  startDate: string
  endDate?: string
}

type LicenseCertificationItem = {
  name: string
  issuer: string
  issueDate: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
}

function normalizeLinkUrl(url: string): string {
  const value = url.trim()
  if (!value) return ''

  if (/^(https?:|mailto:|tel:)/i.test(value)) {
    return value
  }

  return `https://${value}`
}

function normalizeSocialLinks(input: unknown): SocialLinkItem[] {
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        const obj = item as { label?: unknown; url?: unknown }
        const url = typeof obj.url === 'string' ? normalizeLinkUrl(obj.url) : ''
        const label = typeof obj.label === 'string' ? obj.label.trim() : ''

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

        return { label: label || fallbackLabel, url }
      })
      .filter((item): item is SocialLinkItem => Boolean(item))
  }

  if (input && typeof input === 'object') {
    const legacy = input as { github?: unknown; linkedin?: unknown; email?: unknown }
    const links: SocialLinkItem[] = []

    if (typeof legacy.github === 'string' && legacy.github.trim()) {
      links.push({ label: 'GitHub', url: normalizeLinkUrl(legacy.github) })
    }

    if (typeof legacy.linkedin === 'string' && legacy.linkedin.trim()) {
      links.push({ label: 'LinkedIn', url: normalizeLinkUrl(legacy.linkedin) })
    }

    if (typeof legacy.email === 'string' && legacy.email.trim()) {
      links.push({ label: 'Email', url: `mailto:${legacy.email.trim().replace(/^mailto:/i, '')}` })
    }

    return links
  }

  return []
}

function normalizeEducation(input: unknown): EducationItem[] {
  if (!Array.isArray(input)) return []

  const normalized: EducationItem[] = []

  for (const item of input) {
    const obj = item as {
      institution?: unknown
      degree?: unknown
      field?: unknown
      gpa?: unknown
      startDate?: unknown
      endDate?: unknown
    }

    const institution = typeof obj.institution === 'string' ? obj.institution.trim() : ''
    const degree = typeof obj.degree === 'string' ? obj.degree.trim() : ''
    const field = typeof obj.field === 'string' ? obj.field.trim() : ''
    const gpa = typeof obj.gpa === 'string' ? obj.gpa.trim() : ''
    const startDate = typeof obj.startDate === 'string' ? obj.startDate.trim() : ''
    const endDate = typeof obj.endDate === 'string' ? obj.endDate.trim() : ''

    if (!institution && !degree && !field && !gpa && !startDate && !endDate) {
      continue
    }

    normalized.push({
      institution,
      degree,
      field,
      gpa: gpa || undefined,
      startDate,
      endDate: endDate || undefined,
    })
  }

  return normalized
}

function normalizeLicensesCertifications(input: unknown): LicenseCertificationItem[] {
  if (!Array.isArray(input)) return []

  const normalized: LicenseCertificationItem[] = []

  for (const item of input) {
    const obj = item as {
      name?: unknown
      issuer?: unknown
      issueDate?: unknown
      expirationDate?: unknown
      credentialId?: unknown
      credentialUrl?: unknown
    }

    const name = typeof obj.name === 'string' ? obj.name.trim() : ''
    const issuer = typeof obj.issuer === 'string' ? obj.issuer.trim() : ''
    const issueDate = typeof obj.issueDate === 'string' ? obj.issueDate.trim() : ''
    const expirationDate = typeof obj.expirationDate === 'string' ? obj.expirationDate.trim() : ''
    const credentialId = typeof obj.credentialId === 'string' ? obj.credentialId.trim() : ''
    const credentialUrl = typeof obj.credentialUrl === 'string' ? normalizeLinkUrl(obj.credentialUrl) : ''

    if (!name && !issuer && !issueDate && !expirationDate && !credentialId && !credentialUrl) {
      continue
    }

    normalized.push({
      name,
      issuer,
      issueDate,
      expirationDate: expirationDate || undefined,
      credentialId: credentialId || undefined,
      credentialUrl: credentialUrl || undefined,
    })
  }

  return normalized
}

router.get('/', async (_req, res) => {
  await connectToDatabase()

  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create({
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'A passionate developer.',
        contactInfo: {},
        skills: [],
        experience: [],
        education: [],
        licensesCertifications: [],
        socialLinks: [],
      })
    } else {
      const normalizedEducation = normalizeEducation((about as unknown as { education?: unknown }).education)
      const currentEducation = (about.education || []).map((item: {
        institution?: string
        degree?: string
        field?: string
        gpa?: string
        startDate?: string
        endDate?: string
      }) => ({
        institution: item.institution || '',
        degree: item.degree || '',
        field: item.field || '',
        gpa: item.gpa || undefined,
        startDate: item.startDate || '',
        endDate: item.endDate || undefined,
      }))

      const normalizedLicenses = normalizeLicensesCertifications((about as unknown as { licensesCertifications?: unknown }).licensesCertifications)
      const currentLicenses = (about.licensesCertifications || []).map((item: {
        name?: string
        issuer?: string
        issueDate?: string
        expirationDate?: string
        credentialId?: string
        credentialUrl?: string
      }) => ({
        name: item.name || '',
        issuer: item.issuer || '',
        issueDate: item.issueDate || '',
        expirationDate: item.expirationDate || undefined,
        credentialId: item.credentialId || undefined,
        credentialUrl: item.credentialUrl || undefined,
      }))

      const normalizedSocialLinks = normalizeSocialLinks((about as unknown as { socialLinks?: unknown }).socialLinks)
      const currentSocialLinks = (about.socialLinks || []).map((item: { label?: string; url?: string }) => ({
        label: item.label || '',
        url: item.url || '',
      }))

      const educationChanged = JSON.stringify(currentEducation) !== JSON.stringify(normalizedEducation)
      const licensesChanged = JSON.stringify(currentLicenses) !== JSON.stringify(normalizedLicenses)
      const socialLinksChanged = JSON.stringify(currentSocialLinks) !== JSON.stringify(normalizedSocialLinks)

      if (educationChanged || licensesChanged || socialLinksChanged) {
        about.education = normalizedEducation
        about.licensesCertifications = normalizedLicenses
        about.socialLinks = normalizedSocialLinks
        await about.save()
      }
    }

    return res.status(200).json({ success: true, data: about })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch about data' })
  }
})

router.put('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const payload = {
      ...req.body,
      education: normalizeEducation((req.body as { education?: unknown }).education),
      licensesCertifications: normalizeLicensesCertifications((req.body as { licensesCertifications?: unknown }).licensesCertifications),
      socialLinks: normalizeSocialLinks((req.body as { socialLinks?: unknown }).socialLinks),
    }

    const about = await About.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
    })

    return res.status(200).json({ success: true, data: about })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update about data' })
  }
})

export default router
