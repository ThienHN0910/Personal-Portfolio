<template>
  <div class="min-h-screen pt-6 pb-16 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.08),transparent_40%)]" />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
      <!-- Breadcrumb Link -->
      <RouterLink to="/about" class="inline-flex items-center gap-2 text-slate-400 hover:text-cyber-cyan transition-colors text-sm font-mono">
        <span>← Quay lại Giới Thiệu</span>
      </RouterLink>

      <!-- Page Header -->
      <div class="glass-panel p-6 sm:p-10 border border-cyber-border/40 shadow-cyan-glow">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs mb-3">
          <span>HỒ SƠ NĂNG LỰC</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Curriculum Vitae <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-indigo-400">(CV)</span>
        </h1>
        <p class="mt-3 text-slate-300 text-base max-w-2xl leading-relaxed">
          Xem trực tiếp bản CV chính thức của Hồ Ngọc Thiện (ThienHN) hoặc tải về tệp PDF.
        </p>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="!resumeUrl" class="glass-panel p-8 text-center text-slate-400 font-mono">
        Bản CV chưa được cập nhật trong hệ thống.
      </div>

      <div v-else class="space-y-6">
        <!-- PDF Actions Header Bar -->
        <div class="glass-panel p-4 border border-cyber-border/30 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tổng số trang: {{ totalPages }} trang</span>
          </div>

          <div class="flex items-center gap-3">
            <a
              :href="resumeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-mono font-semibold hover:bg-white/10 transition-all"
            >
              Mở Tab Mới ↗
            </a>
            <a
              :href="resumeUrl"
              download
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-indigo-500 text-slate-950 text-xs font-mono font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
            >
              Tải CV (PDF) ↓
            </a>
          </div>
        </div>

        <div v-if="renderError" class="glass-panel p-6 border border-rose-500/40 bg-rose-950/20 text-rose-300 text-sm font-mono">
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
    title.textContent = `Trang ${pageNumber} / ${totalPages.value}`
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
      title.textContent = `Trang ${pageNumber} (Đang tải...)`

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
    renderError.value = 'Không thể hiển thị tệp PDF trực tiếp. Vui lòng mở bằng nút "Mở Tab Mới" ở trên.'
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
