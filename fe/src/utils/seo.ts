export type SeoType = 'website' | 'article'

export interface SeoMetaInput {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: SeoType
  keywords?: string
  noindex?: boolean
  author?: string
  datePublished?: string
  dateModified?: string
}

const AUTHOR_NAME = 'Hồ Ngọc Thiện (ThienHN)'
const SITE_NAME = 'Hồ Ngọc Thiện (ThienHN) - Personal Portfolio'
const DEFAULT_TITLE = SITE_NAME
const DEFAULT_DESCRIPTION =
  'Personal portfolio of Hồ Ngọc Thiện (ThienHN) - Full Stack Software Engineer specializing in Vue 3, React, Node.js, TypeScript, and modern Web Architecture.'
const DEFAULT_IMAGE = '/logo0004Croped.png'
const DEFAULT_KEYWORDS =
  'Hồ Ngọc Thiện, ThienHN, Ho Ngoc Thien, Full Stack Engineer, Web Developer, Vue.js, Node.js, TypeScript, React, Portfolio, Software Architecture'

function resolveSiteOrigin(): string {
  // 1. In browser runtime, dynamically adopt the active origin (Host-Aware Self-Referencing Canonical).
  // This guarantees that https://thienhn.io.vn and https://thienhn0910.vercel.app remain 100% independent,
  // without cross-domain link rot or broken canonical tags if the custom domain is ever discontinued.
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin
    if (origin && origin !== 'null' && !origin.startsWith('file:')) {
      return origin
    }
  }

  // 2. In SSR / build-time / fallback, use configured VITE_SITE_URL or canonical default
  const configured = import.meta.env.VITE_SITE_URL?.trim()
  if (configured) {
    try {
      return new URL(configured).origin
    } catch {
      // Ignore invalid env value and continue with safe fallback.
    }
  }

  return 'https://thienhn.io.vn'
}

function toAbsoluteUrl(value: string): string {
  const origin = resolveSiteOrigin()
  if (!value) {
    return new URL('/', origin).toString()
  }

  try {
    const parsed = new URL(value)
    // External assets (Cloudinary CDN, Gravatar, Unsplash, social embeds) preserve their host
    const isInternalHost =
      parsed.hostname.includes('vercel.app') ||
      parsed.hostname.includes('io.vn') ||
      parsed.hostname.includes('localhost') ||
      parsed.hostname === '127.0.0.1'

    if (!isInternalHost && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
      return parsed.toString()
    }

    // Internal URLs/pages rebase to the active origin
    return new URL(parsed.pathname + parsed.search + parsed.hash, origin).toString()
  } catch {
    const normalizedPath = value.startsWith('/') ? value : `/${value}`
    return new URL(normalizedPath, origin).toString()
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

function upsertJsonLdSchema(data: object): void {
  const id = 'json-ld-schema'
  let script = document.head.querySelector(`#${id}`) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('id', id)
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data, null, 2)
}

function normalizeDescription(description: string): string {
  const compact = description.replace(/\s+/g, ' ').trim()
  if (!compact) return DEFAULT_DESCRIPTION
  if (compact.length <= 170) return compact
  return `${compact.slice(0, 167).trimEnd()}...`
}

function buildTitle(title?: string): string {
  if (!title) return DEFAULT_TITLE
  if (title.includes('Hồ Ngọc Thiện') || title.includes('ThienHN')) return title
  return `${title} | ${SITE_NAME}`
}

export function applySeo(meta: SeoMetaInput = {}): void {
  if (typeof document === 'undefined') return

  const pageTitle = buildTitle(meta.title)
  const pageDescription = normalizeDescription(meta.description || DEFAULT_DESCRIPTION)
  const canonicalUrl = toAbsoluteUrl(meta.url || (typeof window !== 'undefined' ? window.location.pathname : '/'))
  const imageUrl = toAbsoluteUrl(meta.image || DEFAULT_IMAGE)
  const seoType: SeoType = meta.type || 'website'
  const robotsContent = meta.noindex === true
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  document.title = pageTitle

  upsertCanonicalLink(canonicalUrl)
  upsertMetaByName('description', pageDescription)
  upsertMetaByName('keywords', meta.keywords || DEFAULT_KEYWORDS)
  upsertMetaByName('author', AUTHOR_NAME)
  upsertMetaByName('robots', robotsContent)

  upsertMetaByProperty('og:type', seoType)
  upsertMetaByProperty('og:site_name', SITE_NAME)
  upsertMetaByProperty('og:locale', 'en_US')
  upsertMetaByProperty('og:title', pageTitle)
  upsertMetaByProperty('og:description', pageDescription)
  upsertMetaByProperty('og:url', canonicalUrl)
  upsertMetaByProperty('og:image', imageUrl)
  upsertMetaByProperty('og:image:alt', pageTitle)

  upsertMetaByName('twitter:card', 'summary_large_image')
  upsertMetaByName('twitter:title', pageTitle)
  upsertMetaByName('twitter:description', pageDescription)
  upsertMetaByName('twitter:image', imageUrl)

  // GEO JSON-LD Structured Data Schema.org
  const origin = resolveSiteOrigin()
  const personEntity = {
    '@type': 'Person',
    '@id': `${origin}/#person`,
    name: 'Hồ Ngọc Thiện',
    alternateName: ['ThienHN', 'Ho Ngoc Thien'],
    jobTitle: 'Full Stack Software Engineer',
    description: 'Full Stack Software Engineer specializing in modern Web applications, high-performance architecture, and UX engineering.',
    url: origin,
    image: imageUrl,
    sameAs: [
      'https://github.com/ThienHN0910',
    ],
  }

  const websiteEntity = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: origin,
    name: SITE_NAME,
    publisher: { '@id': `${origin}/#person` },
    inLanguage: 'en-US',
  }

  let mainEntity: object = {
    '@type': 'ProfilePage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle,
    description: pageDescription,
    isPartOf: { '@id': `${origin}/#website` },
    mainEntity: { '@id': `${origin}/#person` },
  }

  if (seoType === 'article') {
    mainEntity = {
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      url: canonicalUrl,
      headline: pageTitle,
      description: pageDescription,
      image: imageUrl,
      author: personEntity,
      publisher: personEntity,
      mainEntityOfPage: canonicalUrl,
      datePublished: meta.datePublished || new Date().toISOString(),
      dateModified: meta.dateModified || meta.datePublished || new Date().toISOString(),
    }
  }

  upsertJsonLdSchema({
    '@context': 'https://schema.org',
    '@graph': [personEntity, websiteEntity, mainEntity],
  })
}
