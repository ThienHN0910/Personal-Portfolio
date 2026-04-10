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
  const links = about?.socialLinks || []
  return links
    .map((item) => ({
      label: item.label?.trim() || 'Link',
      href: item.url?.trim() || '',
    }))
    .filter((item) => Boolean(item.href))
}

export function getFooterConnectLinks(about: AboutData | null | undefined): AboutLinkItem[] {
  const links: AboutLinkItem[] = [...getPublicSocialLinks(about)]

  if (about?.contactInfo?.website) {
    links.push({ label: 'Website', href: about.contactInfo.website })
  }

  const email = about?.contactInfo?.email
  if (email) {
    const normalized = `mailto:${email}`
    if (!links.some((item) => item.href.toLowerCase() === normalized.toLowerCase())) {
      links.push({ label: 'Email', href: normalized })
    }
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

function inferIcon(label: string, href: string): 'github' | 'linkedin' | 'mail' | 'external' {
  const lowerLabel = label.toLowerCase()
  const lowerHref = href.toLowerCase()

  if (lowerHref.startsWith('mailto:') || lowerLabel.includes('mail') || lowerLabel.includes('email')) {
    return 'mail'
  }

  if (lowerHref.includes('github.com') || lowerLabel.includes('github')) {
    return 'github'
  }

  if (lowerHref.includes('linkedin.com') || lowerLabel.includes('linkedin')) {
    return 'linkedin'
  }

  return 'external'
}

export function getFooterIconLinks(about: AboutData | null | undefined): Array<AboutLinkItem & { icon: 'github' | 'linkedin' | 'mail' | 'external' }> {
  const links = getPublicSocialLinks(about)
    .map((item) => ({
      ...item,
      icon: inferIcon(item.label, item.href),
    }))

  const email = about?.contactInfo?.email
  if (email) {
    const normalized = `mailto:${email}`
    if (!links.some((item) => item.href.toLowerCase() === normalized.toLowerCase())) {
      links.push({
        label: 'Email',
        href: normalized,
        icon: 'mail',
      })
    }
  }

  return links
}
