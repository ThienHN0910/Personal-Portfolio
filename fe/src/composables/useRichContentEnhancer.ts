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

      // Copy button with tactile bounce & SVG icon
      const copyBtn = document.createElement('button')
      copyBtn.type = 'button'
      copyBtn.className =
        'text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/15 hover:border-white/30 active:scale-[0.92] hover:scale-[1.03] transition-all duration-100 flex items-center gap-1.5 cursor-pointer select-none shadow-xs'

      const copyIcon = `<svg class="w-3 h-3 text-white/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
      const checkIcon = `<svg class="w-3 h-3 text-[#4ade80] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`

      copyBtn.innerHTML = `${copyIcon}<span>Copy</span>`

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeText)
          copyBtn.classList.add('border-[#4ade80]/50', 'bg-[#4ade80]/15')
          copyBtn.innerHTML = `${checkIcon}<span class="text-[#4ade80] font-medium">Copied!</span>`
          setTimeout(() => {
            copyBtn.classList.remove('border-[#4ade80]/50', 'bg-[#4ade80]/15')
            copyBtn.innerHTML = `${copyIcon}<span>Copy</span>`
          }, 2000)
        } catch {
          copyBtn.innerHTML = '<span>Failed</span>'
          setTimeout(() => {
            copyBtn.innerHTML = `${copyIcon}<span>Copy</span>`
          }, 2000)
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
