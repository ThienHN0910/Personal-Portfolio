<template>
  <div class="min-h-[100dvh] bg-canvas">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <!-- Breadcrumb Link -->
      <RouterLink to="/about" class="inline-flex items-center gap-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-mono group active:scale-95">
        <span class="group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>Back to Biography</span>
      </RouterLink>

      <!-- Page Header -->
      <div class="editorial-card">
        <div class="editorial-card__inner p-8 sm:p-12 flex flex-col justify-between gap-6">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow-tag">
              <span class="status-dot"></span>
              Official Document
            </span>
            <span class="hidden sm:block font-mono text-[10px] text-ink-tertiary uppercase tracking-widest">
              Resume &amp; CV
            </span>
          </div>

          <div class="space-y-3 max-w-2xl">
            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05] text-ink">
              Curriculum Vitae
              <span class="block italic text-ink-secondary mt-1">&amp; career record</span>
            </h1>
            <p class="text-base text-ink-secondary leading-relaxed font-sans font-light">
              Interactive document preview of credentials, career timeline, and engineering achievements by Hồ Ngọc Thiện.
            </p>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="!resumeUrl" class="editorial-card">
        <div class="editorial-card__inner p-12 text-center text-ink-tertiary space-y-3">
          <p class="text-base text-ink font-serif font-normal">Curriculum Vitae is currently unavailable.</p>
          <p class="text-xs text-ink-tertiary font-mono">Please check back soon or send a direct inquiry via the contact page.</p>
        </div>
      </div>

      <div v-else class="space-y-6">
        <!-- PDF Actions Header Bar -->
        <div class="editorial-card">
          <div class="editorial-card__inner p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-xs font-mono text-ink-secondary">
              <span class="w-1.5 h-1.5 rounded-full bg-pastel-green-text"></span>
              <span class="tabular-nums">Document Pages: {{ totalPages }}</span>
            </div>

            <div class="flex items-center gap-2.5">
              <a
                :href="resumeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3.5 py-2 rounded-md bg-bone border border-stroke text-ink-secondary text-xs font-mono hover:border-ink/20 hover:text-ink active:scale-[0.98] transition-all"
              >
                Open in Tab ↗
              </a>
              <a
                :href="resumeUrl"
                download
                class="group px-4 py-2 rounded-md bg-ink text-surface text-xs font-sans font-medium active:scale-[0.98] transition-all inline-flex items-center gap-1.5"
              >
                <span>Download PDF</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>

        <div v-if="renderError" class="p-4 rounded-md bg-pastel-red border border-pastel-red-text/20 text-pastel-red-text text-xs font-mono">
          {{ renderError }}
        </div>

        <div ref="pagesContainer" class="space-y-6" />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAboutStore } from '@/stores/about'
import { useHomeStore } from '@/stores/home'
import { applySeo } from '@/utils/seo'
import { getCvSeoMeta } from '@/utils/seoPriority'

type PdfJsModule = typeof import('pdfjs-dist')

let pdfjsModulePromise: Promise<PdfJsModule> | null = null

function getPdfJs(): Promise<PdfJsModule> {
  if (!pdfjsModulePromise) {
    pdfjsModulePromise = import('pdfjs-dist').then((module) => {
      module.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString()
      return module
    })
  }

  return pdfjsModulePromise
}

const aboutStore = useAboutStore()
const homeStore = useHomeStore()
const loading = ref(true)
const resumeUrl = ref('')
const totalPages = ref(0)
const renderError = ref('')
const pagesContainer = ref<HTMLDivElement | null>(null)
const renderedPages = new Set<number>()
const renderingPages = new Set<number>()
let pageObserver: IntersectionObserver | null = null
let activePdf: any = null

function resetPageState(): void {
  renderedPages.clear()
  renderingPages.clear()
  pageObserver?.disconnect()
  pageObserver = null
  activePdf = null
}

async function renderPage(pageNumber: number, wrapper: HTMLDivElement): Promise<void> {
  if (!activePdf || renderedPages.has(pageNumber) || renderingPages.has(pageNumber)) return

  renderingPages.add(pageNumber)

  try {
    const page = await activePdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1.25 })
    const contextCanvas = document.createElement('canvas')
    contextCanvas.width = viewport.width
    contextCanvas.height = viewport.height
    contextCanvas.style.maxWidth = '100%'
    contextCanvas.style.height = 'auto'
    contextCanvas.style.display = 'block'
    contextCanvas.style.margin = '0 auto'
    contextCanvas.style.borderRadius = '0.75rem'

    const context = contextCanvas.getContext('2d')
    if (!context) return

    await page.render({
      canvasContext: context,
      viewport,
    }).promise

    wrapper.innerHTML = ''
    const title = document.createElement('p')
    title.className = 'text-xs font-mono text-slate-400 mb-3'
    title.textContent = `Page ${pageNumber} of ${totalPages.value}`
    wrapper.appendChild(title)
    wrapper.appendChild(contextCanvas)

    renderedPages.add(pageNumber)
  } finally {
    renderingPages.delete(pageNumber)
  }
}

async function renderPdf(url: string): Promise<void> {
  renderError.value = ''

  if (!pagesContainer.value) return
  pagesContainer.value.innerHTML = ''
  resetPageState()

  try {
    const pdfjsLib = await getPdfJs()
    const loadingTask = pdfjsLib.getDocument({
      url,
      withCredentials: false,
    })

    activePdf = await loadingTask.promise
    totalPages.value = activePdf.numPages

    if ('IntersectionObserver' in window) {
      pageObserver = new IntersectionObserver((entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => {
            const target = entry.target as HTMLDivElement
            const pageNumber = Number(target.dataset.page)
            if (!Number.isNaN(pageNumber)) {
              void renderPage(pageNumber, target)
            }
            pageObserver?.unobserve(target)
          })
      }, { rootMargin: '400px 0px' })
    }

    for (let pageNumber = 1; pageNumber <= activePdf.numPages; pageNumber += 1) {
      const wrapper = document.createElement('div')
      wrapper.className = 'glass-panel p-4 overflow-x-auto border border-cyber-border/30'
      wrapper.dataset.page = String(pageNumber)

      const title = document.createElement('p')
      title.className = 'text-xs font-mono text-slate-400 mb-3'
      title.textContent = `Page ${pageNumber} (Loading...)`

      const skeleton = document.createElement('div')
      skeleton.className = 'h-96 rounded-xl bg-slate-900 animate-pulse'

      wrapper.appendChild(title)
      wrapper.appendChild(skeleton)
      pagesContainer.value.appendChild(wrapper)

      if (pageObserver) {
        pageObserver.observe(wrapper)
      } else {
        await renderPage(pageNumber, wrapper)
      }
    }
  } catch {
    renderError.value = 'Unable to render PDF directly. Please click "Open in New Tab" above.'
  }
}

onMounted(async () => {
  await Promise.all([
    aboutStore.fetchAboutData(),
    homeStore.homeData ? Promise.resolve() : homeStore.fetchHomeData(),
  ])

  applySeo({
    ...getCvSeoMeta({
      about: aboutStore.aboutData,
      home: homeStore.homeData,
    }),
    url: '/cv',
  })

  resumeUrl.value = aboutStore.aboutData?.resumeUrl || ''
  loading.value = false

  if (resumeUrl.value) {
    await nextTick()
    await renderPdf(resumeUrl.value)
  }
})

onBeforeUnmount(() => {
  resetPageState()
})
</script>
