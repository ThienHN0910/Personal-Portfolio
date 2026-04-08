import type { AboutData } from '@/types'

export type AboutLinkItem = {
  label: string
  href: string
}

export type AboutContactItem = {
  label: string
  value: string
  href?: string
}

export function getBrandName(about: AboutData | null | undefined): string {
  return about?.name?.trim() || 'Portfolio'
}

export function getBrandDescription(about: AboutData | null | undefined): string {
  return about?.bio?.trim() || 'A passionate developer building modern web experiences with cutting-edge technologies.'
}

export function hasAnyContactInfo(about: AboutData | null | undefined): boolean {
  return Boolean(
    about?.contactInfo?.email
      || about?.contactInfo?.phone
      || about?.contactInfo?.location
      || about?.contactInfo?.website,
  )
}

export function getPublicSocialLinks(about: AboutData | null | undefined): AboutLinkItem[] {
  const links: AboutLinkItem[] = []

  if (about?.socialLinks?.github) {
    links.push({ label: 'GitHub', href: about.socialLinks.github })
  }

  if (about?.socialLinks?.linkedin) {
    links.push({ label: 'LinkedIn', href: about.socialLinks.linkedin })
  }

  return links
}

export function getFooterConnectLinks(about: AboutData | null | undefined): AboutLinkItem[] {
  const links: AboutLinkItem[] = [...getPublicSocialLinks(about)]

  if (about?.contactInfo?.website) {
    links.push({ label: 'Website', href: about.contactInfo.website })
  }

  const email = about?.socialLinks?.email || about?.contactInfo?.email
  if (email) {
    links.push({ label: 'Email', href: `mailto:${email}` })
  }

  return links
}

export function getFooterContactItems(about: AboutData | null | undefined): AboutContactItem[] {
  const items: AboutContactItem[] = []

  if (about?.contactInfo?.email) {
    items.push({
      label: 'Email',
      value: about.contactInfo.email,
      href: `mailto:${about.contactInfo.email}`,
    })
  }

  if (about?.contactInfo?.phone) {
    items.push({
      label: 'Phone',
      value: about.contactInfo.phone,
      href: `tel:${about.contactInfo.phone}`,
    })
  }

  if (about?.contactInfo?.location) {
    items.push({
      label: 'Location',
      value: about.contactInfo.location,
    })
  }

  return items
}

export function getFooterIconLinks(about: AboutData | null | undefined): Array<AboutLinkItem & { icon: 'github' | 'linkedin' | 'mail' }> {
  const links: Array<AboutLinkItem & { icon: 'github' | 'linkedin' | 'mail' }> = []

  if (about?.socialLinks?.github) {
    links.push({ label: 'GitHub', href: about.socialLinks.github, icon: 'github' })
  }

  if (about?.socialLinks?.linkedin) {
    links.push({ label: 'LinkedIn', href: about.socialLinks.linkedin, icon: 'linkedin' })
  }

  const email = about?.socialLinks?.email || about?.contactInfo?.email
  if (email) {
    links.push({ label: 'Email', href: `mailto:${email}`, icon: 'mail' })
  }

  return links
}
