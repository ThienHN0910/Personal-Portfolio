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
          <a :href="resumeUrl" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">Open in new tab</a>
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
import { nextTick, onMounted, ref } from 'vue'

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAboutStore } from '@/stores/about'

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
const loading = ref(true)
const resumeUrl = ref('')
const totalPages = ref(0)
const renderError = ref('')
const pagesContainer = ref<HTMLDivElement | null>(null)

async function renderPdf(url: string): Promise<void> {
  renderError.value = ''

  if (!pagesContainer.value) return
  pagesContainer.value.innerHTML = ''

  try {
    const pdfjsLib = await getPdfJs()
    const loadingTask = pdfjsLib.getDocument({
      url,
      withCredentials: false,
    })

    const pdf = await loadingTask.promise
    totalPages.value = pdf.numPages

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 1.25 })

      const wrapper = document.createElement('div')
      wrapper.className = 'card p-3 overflow-x-auto'

      const title = document.createElement('p')
      title.className = 'text-xs text-gray-500 mb-3'
      title.textContent = `Page ${pageNumber}`

      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.maxWidth = '100%'
      canvas.style.height = 'auto'
      canvas.style.display = 'block'
      canvas.style.margin = '0 auto'

      wrapper.appendChild(title)
      wrapper.appendChild(canvas)
      pagesContainer.value.appendChild(wrapper)

      const context = canvas.getContext('2d')
      if (!context) continue

      await page.render({
        canvasContext: context,
        viewport,
      }).promise
    }
  } catch {
    renderError.value = 'Khong the hien thi file PDF. Vui long thu mo bang tab moi.'
  }
}

onMounted(async () => {
  await aboutStore.fetchAboutData()
  resumeUrl.value = aboutStore.aboutData?.resumeUrl || ''
  loading.value = false

  if (resumeUrl.value) {
    await nextTick()
    await renderPdf(resumeUrl.value)
  }
})
</script>
