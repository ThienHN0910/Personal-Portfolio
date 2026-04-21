import DOMPurify from 'dompurify'

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/

function parseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function parseYouTubeStartSeconds(url: URL): number {
  const start = url.searchParams.get('start')
  if (start && /^\d+$/.test(start)) {
    return Number(start)
  }

  const t = url.searchParams.get('t')
  if (!t) return 0

  if (/^\d+$/.test(t)) {
    return Number(t)
  }

  const match = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i)
  if (!match) return 0

  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  return hours * 3600 + minutes * 60 + seconds
}

function toYouTubeEmbedUrl(url: URL): string | null {
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  let videoId = ''

  if (host === 'youtu.be') {
    videoId = url.pathname.split('/').filter(Boolean)[0] || ''
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v') || ''
    } else {
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') {
        videoId = parts[1] || ''
      }
    }
  } else if (host === 'youtube-nocookie.com') {
    const parts = url.pathname.split('/').filter(Boolean)
    if (parts[0] === 'embed') {
      videoId = parts[1] || ''
    }
  }

  if (!YOUTUBE_ID_PATTERN.test(videoId)) {
    return null
  }

  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`)
  const startSeconds = parseYouTubeStartSeconds(url)
  if (startSeconds > 0) {
    embedUrl.searchParams.set('start', String(startSeconds))
  }

  return embedUrl.toString()
}

function toVimeoEmbedUrl(url: URL): string | null {
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  const parts = url.pathname.split('/').filter(Boolean)

  if (host === 'vimeo.com') {
    const videoId = parts[0] || ''
    if (!/^\d+$/.test(videoId)) return null
    return `https://player.vimeo.com/video/${videoId}`
  }

  if (host === 'player.vimeo.com') {
    if (parts[0] !== 'video' || !/^\d+$/.test(parts[1] || '')) return null
    return `https://player.vimeo.com/video/${parts[1]}`
  }

  return null
}

function toTrustedEmbedUrl(rawUrl: string): string | null {
  const parsed = parseUrl(rawUrl)
  if (!parsed) return null

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null
  }

  const youtube = toYouTubeEmbedUrl(parsed)
  if (youtube) return youtube

  const vimeo = toVimeoEmbedUrl(parsed)
  if (vimeo) return vimeo

  return null
}

function createTrustedIframe(doc: Document, embedUrl: string): HTMLIFrameElement {
  const iframe = doc.createElement('iframe')
  iframe.setAttribute('src', embedUrl)
  iframe.setAttribute('title', 'Embedded media')
  iframe.setAttribute('loading', 'lazy')
  iframe.setAttribute('allowfullscreen', 'true')
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
  )
  return iframe
}

function normalizeEmbeddedMedia(html: string): string {
  if (!html.trim() || typeof window === 'undefined') {
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const oEmbeds = Array.from(doc.querySelectorAll('figure.media oembed[url], oembed[url]'))
  for (const oEmbed of oEmbeds) {
    const url = oEmbed.getAttribute('url') || ''
    const trustedEmbed = toTrustedEmbedUrl(url)
    if (!trustedEmbed) {
      oEmbed.remove()
      continue
    }

    const figure = oEmbed.closest('figure.media') || doc.createElement('figure')
    figure.classList.add('media')

    const wrapper = doc.createElement('div')
    wrapper.className = 'rich-embed__ratio'
    wrapper.appendChild(createTrustedIframe(doc, trustedEmbed))

    figure.innerHTML = ''
    figure.appendChild(wrapper)

    if (!figure.parentElement) {
      oEmbed.replaceWith(figure)
    }
  }

  const iframes = Array.from(doc.querySelectorAll('iframe[src]'))
  for (const iframe of iframes) {
    const trustedEmbed = toTrustedEmbedUrl(iframe.getAttribute('src') || '')
    if (!trustedEmbed) {
      iframe.remove()
      continue
    }

    const safeIframe = createTrustedIframe(doc, trustedEmbed)
    iframe.replaceWith(safeIframe)
  }

  return doc.body.innerHTML
}

export function sanitizeRichContent(html: string): string {
  const normalized = normalizeEmbeddedMedia(html || '')

  return DOMPurify.sanitize(normalized, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
  })
}
