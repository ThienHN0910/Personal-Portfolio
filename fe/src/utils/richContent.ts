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

export interface YouTubeInfo {
  videoId: string
  embedUrl: string
}

export function parseYouTubeInfo(url: URL): YouTubeInfo | null {
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

  return { videoId, embedUrl: embedUrl.toString() }
}

function toYouTubeEmbedUrl(url: URL): string | null {
  const info = parseYouTubeInfo(url)
  return info ? info.embedUrl : null
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

function createYouTubeFacade(doc: Document, videoId: string, embedUrl: string): HTMLElement {
  const figure = doc.createElement('figure')
  figure.className = 'media video-facade'
  figure.setAttribute('data-video-id', videoId)
  figure.setAttribute('data-embed-url', embedUrl)

  const wrapper = doc.createElement('div')
  wrapper.className = 'video-facade__ratio'

  const img = doc.createElement('img')
  img.className = 'video-facade__poster'
  img.setAttribute('src', `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
  img.setAttribute('alt', 'Video Walkthrough')
  img.setAttribute('loading', 'lazy')
  wrapper.appendChild(img)

  const scrim = doc.createElement('div')
  scrim.className = 'video-facade__scrim'
  wrapper.appendChild(scrim)

  const badge = doc.createElement('div')
  badge.className = 'video-facade__badge'
  badge.innerHTML = '<span class="video-facade__pulse"></span><span>Full HD 1080p Telemetry</span>'
  wrapper.appendChild(badge)

  const expandBtn = doc.createElement('button')
  expandBtn.type = 'button'
  expandBtn.className = 'video-facade__expand'
  expandBtn.setAttribute('aria-label', 'Open Cinema Lightbox')
  expandBtn.setAttribute('title', 'Cinema Lightbox Mode')
  expandBtn.innerHTML =
    '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'
  wrapper.appendChild(expandBtn)

  const playBtn = doc.createElement('button')
  playBtn.type = 'button'
  playBtn.className = 'video-facade__play'
  playBtn.setAttribute('aria-label', 'Play Video Walkthrough')
  playBtn.innerHTML =
    '<svg class="video-facade__play-icon" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>'
  wrapper.appendChild(playBtn)

  const hint = doc.createElement('div')
  hint.className = 'video-facade__hint'
  hint.textContent = 'Click to Play with Sound'
  wrapper.appendChild(hint)

  figure.appendChild(wrapper)
  return figure
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
    const parsed = parseUrl(url)
    if (!parsed) {
      oEmbed.remove()
      continue
    }

    const ytInfo = parseYouTubeInfo(parsed)
    if (ytInfo) {
      const facade = createYouTubeFacade(doc, ytInfo.videoId, ytInfo.embedUrl)
      oEmbed.replaceWith(facade)
      continue
    }

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
    const src = iframe.getAttribute('src') || ''
    const parsed = parseUrl(src)
    if (!parsed) {
      iframe.remove()
      continue
    }

    const ytInfo = parseYouTubeInfo(parsed)
    if (ytInfo) {
      const facade = createYouTubeFacade(doc, ytInfo.videoId, ytInfo.embedUrl)
      iframe.replaceWith(facade)
      continue
    }

    const trustedEmbed = toTrustedEmbedUrl(src)
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
    USE_PROFILES: { html: true, svg: true },
    ADD_TAGS: ['iframe', 'button', 'svg', 'path', 'polygon', 'span'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'loading',
      'referrerpolicy',
      'data-video-id',
      'data-embed-url',
      'viewBox',
      'fill',
      'stroke',
      'stroke-width',
      'stroke-linecap',
      'stroke-linejoin',
      'points',
      'd',
      'aria-label',
      'title',
    ],
  })
}
