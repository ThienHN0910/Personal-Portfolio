export type SeoType = 'website' | 'article'

export interface SeoMetaInput {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: SeoType
  keywords?: string
  noindex?: boolean
}

const SITE_NAME = 'ThienHN Portfolio'
const DEFAULT_TITLE = SITE_NAME
const DEFAULT_DESCRIPTION = 'Personal portfolio showcasing projects, technical skills, and blog posts.'
const DEFAULT_IMAGE = '/logo0004Croped.png'
const DEFAULT_KEYWORDS =
  'portfolio, full stack developer, web developer, vue portfolio, javascript, typescript, projects, blog'

function resolveSiteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim()
  if (configured) {
    try {
      return new URL(configured).origin
    } catch {
      // Ignore invalid env value and continue with safe fallback.
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return 'https://example.com'
}

function toAbsoluteUrl(value: string): string {
  if (!value) {
    return new URL('/', resolveSiteOrigin()).toString()
  }

  try {
    return new URL(value).toString()
  } catch {
    const normalizedPath = value.startsWith('/') ? value : `/${value}`
    return new URL(normalizedPath, resolveSiteOrigin()).toString()
  }
}

function upsertMetaByName(name: string, content: string): void {
  const selector = `meta[name="${name}"]`
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertMetaByProperty(property: string, content: string): void {
  const selector = `meta[property="${property}"]`
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function normalizeDescription(description: string): string {
  const compact = description.replace(/\s+/g, ' ').trim()
  if (!compact) return DEFAULT_DESCRIPTION
  if (compact.length <= 170) return compact
  return `${compact.slice(0, 167).trimEnd()}...`
}

function buildTitle(title?: string): string {
  if (!title) return DEFAULT_TITLE
  if (title.includes(SITE_NAME)) return title
  return `${title} | ${SITE_NAME}`
}

export function applySeo(meta: SeoMetaInput = {}): void {
  if (typeof document === 'undefined') return

  const pageTitle = buildTitle(meta.title)
  const pageDescription = normalizeDescription(meta.description || DEFAULT_DESCRIPTION)
  const canonicalUrl = toAbsoluteUrl(meta.url || (typeof window !== 'undefined' ? window.location.pathname : '/'))
  const imageUrl = toAbsoluteUrl(meta.image || DEFAULT_IMAGE)
  const seoType: SeoType = meta.type || 'website'
  const robotsContent = meta.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  document.title = pageTitle

  upsertCanonicalLink(canonicalUrl)
  upsertMetaByName('description', pageDescription)
  upsertMetaByName('keywords', meta.keywords || DEFAULT_KEYWORDS)
  upsertMetaByName('robots', robotsContent)

  upsertMetaByProperty('og:type', seoType)
  upsertMetaByProperty('og:site_name', SITE_NAME)
  upsertMetaByProperty('og:locale', 'vi_VN')
  upsertMetaByProperty('og:title', pageTitle)
  upsertMetaByProperty('og:description', pageDescription)
  upsertMetaByProperty('og:url', canonicalUrl)
  upsertMetaByProperty('og:image', imageUrl)
  upsertMetaByProperty('og:image:alt', pageTitle)

  upsertMetaByName('twitter:card', 'summary_large_image')
  upsertMetaByName('twitter:title', pageTitle)
  upsertMetaByName('twitter:description', pageDescription)
  upsertMetaByName('twitter:image', imageUrl)
}
