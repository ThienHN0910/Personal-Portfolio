<template>
  <div class="section min-h-screen pt-24">
    <div class="container max-w-5xl">
      <RouterLink to="/about" class="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to About
      </RouterLink>

      <h1 class="section-title mb-3">My <span class="highlight">CV</span></h1>
      <p class="section-subtitle mb-8">Xem CV PDF ngay tren trang nay.</p>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="!resumeUrl" class="card p-6 text-gray-400">
        CV chưa được cập nhật.
      </div>

      <div v-else class="space-y-4">
        <div class="card p-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-gray-400">{{ totalPages }} page(s)</p>
          <a :href="resumeUrl" download class="btn btn--secondary btn--sm">Download CV</a>
        </div>

        <div v-if="renderError" class="card p-6 text-red-300">
          {{ renderError }}
        </div>

        <div ref="pagesContainer" class="space-y-5" />
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

    const context = contextCanvas.getContext('2d')
    if (!context) return

    await page.render({
      canvasContext: context,
      viewport,
    }).promise

    wrapper.innerHTML = ''
    const title = document.createElement('p')
    title.className = 'text-xs text-gray-500 mb-3'
    title.textContent = `Page ${pageNumber}`
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
      wrapper.className = 'card p-3 overflow-x-auto'
      wrapper.dataset.page = String(pageNumber)

      const title = document.createElement('p')
      title.className = 'text-xs text-gray-500 mb-3'
      title.textContent = `Page ${pageNumber} (loading...)`

      const skeleton = document.createElement('div')
      skeleton.className = 'h-52 rounded-lg bg-slate-800/70 animate-pulse'

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
    renderError.value = 'Khong the hien thi file PDF. Vui long thu mo bang tab moi.'
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
