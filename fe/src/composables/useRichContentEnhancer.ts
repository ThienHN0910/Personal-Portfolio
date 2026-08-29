import { ref, nextTick, type Ref } from 'vue'

export interface LightboxState {
  isOpen: boolean
  src: string
  alt: string
  caption: string
}

export function useRichContentEnhancer(containerRef: Ref<HTMLElement | null>) {
  const lightbox = ref<LightboxState>({
    isOpen: false,
    src: '',
    alt: '',
    caption: '',
  })

  function enhanceRichContent(): void {
    const container = containerRef.value
    if (!container) return

    // 1. Enhance <pre> blocks with Copy Button & Language Badge
    const preBlocks = container.querySelectorAll('pre')
    preBlocks.forEach((pre) => {
      if (pre.dataset.enhanced === 'true') return
      pre.dataset.enhanced = 'true'
      pre.classList.add('relative', 'group')

      const codeElement = pre.querySelector('code')
      const codeText = codeElement ? codeElement.innerText : pre.innerText

      // Detect language from class e.g. language-typescript or fallback
      let lang = 'CODE'
      if (codeElement) {
        const classNames = Array.from(codeElement.classList)
        const langClass = classNames.find((c) => c.startsWith('language-') || c.startsWith('lang-'))
        if (langClass) {
          lang = langClass.replace(/^(language-|lang-)/, '').toUpperCase()
        }
      }

      // Create toolbar wrapper
      const toolbar = document.createElement('div')
      toolbar.className =
        'absolute top-2.5 right-2.5 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity z-10'

      // Language label
      const langBadge = document.createElement('span')
      langBadge.className =
        'text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase border border-white/10 select-none'
      langBadge.textContent = lang
      toolbar.appendChild(langBadge)

      // Copy button
      const copyBtn = document.createElement('button')
      copyBtn.type = 'button'
      copyBtn.className =
        'text-[10px] font-mono px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-white border border-white/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer select-none'
      copyBtn.innerHTML = '<span>Copy</span>'

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeText)
          copyBtn.innerHTML = '<span style="color:#4ade80;">Copied! ✓</span>'
          setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy</span>'
          }, 2000)
        } catch {
          copyBtn.innerHTML = '<span>Failed</span>'
        }
      })

      toolbar.appendChild(copyBtn)
      pre.appendChild(toolbar)
    })

    // 2. Enhance Images with Zoom Lightbox & Cursor
    const images = container.querySelectorAll('img')
    images.forEach((img) => {
      if (img.dataset.zoomEnhanced === 'true') return
      img.dataset.zoomEnhanced = 'true'
      img.classList.add('cursor-zoom-in', 'transition-transform', 'hover:scale-[1.01]')

      img.addEventListener('click', () => {
        const figure = img.closest('figure')
        const captionElem = figure ? figure.querySelector('figcaption') : null
        const caption = captionElem ? captionElem.textContent || '' : img.alt || ''

        lightbox.value = {
          isOpen: true,
          src: img.src,
          alt: img.alt || 'Zoomed media view',
          caption,
        }
      })
    })
  }

  function closeLightbox(): void {
    lightbox.value.isOpen = false
  }

  function scheduleEnhance(): void {
    nextTick(() => {
      enhanceRichContent()
    })
  }

  return {
    lightbox,
    closeLightbox,
    enhanceRichContent,
    scheduleEnhance,
  }
}
