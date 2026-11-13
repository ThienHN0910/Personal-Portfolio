<template>
  <div class="section admin-shell min-h-screen py-8">
    <div class="container">
      <AdminSectionHeader kicker="Asset Pipeline" title-before="Cloudinary " title-highlight="Media Library">
        <template #actions>
          <div class="flex items-center gap-2">
            <button class="btn btn--secondary inline-flex items-center gap-2" :disabled="loading" @click="fetchMedia()">
              <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button class="btn btn--primary inline-flex items-center gap-2" @click="openUploadModal">
              <IconGlyph name="add" :size="14" />
              Upload Image
            </button>
          </div>
        </template>
      </AdminSectionHeader>

      <!-- Filter & Controls Toolbar -->
      <div class="admin-panel mb-8 p-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Folder Pills -->
          <div class="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              v-for="f in folders"
              :key="f"
              class="px-3 py-1.5 rounded-full text-xs font-mono transition-all border"
              :class="activeFolder === f ? 'bg-[var(--ink)] text-[var(--canvas)] border-transparent font-semibold shadow-sm' : 'bg-[var(--surface)] text-[var(--ink-secondary)] border-[var(--stroke)] hover:text-[var(--ink)] hover:border-[var(--ink-tertiary)]'"
              @click="selectFolder(f)"
            >
              {{ f === 'all' ? '📁 All Folders' : `📁 ${f.replace('portfolio/', '')}` }}
            </button>
          </div>

          <!-- Search & Count -->
          <div class="flex items-center gap-3">
            <div class="relative w-full sm:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by filename..."
                class="form-control text-xs py-1.5 pl-8 pr-3"
                @keyup.enter="handleSearch"
              />
              <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span class="text-xs font-mono text-[var(--ink-secondary)] whitespace-nowrap">
              {{ totalCount }} items
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading && resources.length === 0" />

      <!-- Empty State -->
      <div v-else-if="resources.length === 0" class="admin-panel text-center py-16 px-4">
        <p class="text-[var(--ink-secondary)] mb-4">No Cloudinary assets found matching the criteria.</p>
        <button class="btn btn--secondary btn--sm" @click="resetFilters">Reset Filters</button>
      </div>

      <!-- Media Gallery Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="item in resources"
          :key="item.publicId"
          class="admin-panel group relative flex flex-col justify-between overflow-hidden border border-[var(--stroke)] hover:border-[var(--stroke-soft)] transition-all bg-[var(--bone)]"
        >
          <!-- Thumbnail Container -->
          <div
            class="relative aspect-video w-full bg-[var(--surface)] overflow-hidden cursor-pointer flex items-center justify-center"
            @click="openLightbox(item)"
          >
            <img
              :src="getThumbnailUrl(item.url)"
              :alt="item.publicId"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span class="text-xs font-medium text-white px-2 py-1 bg-black/60 rounded backdrop-blur">
                Click to inspect
              </span>
            </div>
            <!-- Format & Dimension Badges -->
            <div class="absolute top-2 left-2 flex gap-1">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/70 text-white backdrop-blur">
                {{ item.format }}
              </span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-[var(--ink-secondary)] backdrop-blur">
                {{ item.width }}x{{ item.height }}
              </span>
            </div>
            <!-- File Size Badge -->
            <div class="absolute top-2 right-2">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-[var(--ink-secondary)] backdrop-blur">
                {{ formatBytes(item.bytes) }}
              </span>
            </div>
          </div>

          <!-- Metadata & Actions -->
          <div class="p-3 flex flex-col justify-between flex-1">
            <div class="mb-3">
              <p
                class="text-xs font-mono text-[var(--ink)] truncate"
                :title="item.publicId"
              >
                {{ getFilename(item.publicId) }}
              </p>
              <p class="text-[10px] font-mono text-[var(--ink-tertiary)] truncate mt-0.5">
                {{ item.folder || 'portfolio' }} · {{ formatDate(item.createdAt) }}
              </p>
            </div>

            <div class="flex items-center justify-between gap-2 pt-2 border-t border-[var(--stroke)]">
              <button
                type="button"
                class="btn btn--secondary btn--sm text-[11px] py-1 px-2.5 flex-1 inline-flex items-center justify-center gap-1.5"
                @click="copyUrl(item.url, item.publicId)"
              >
                <svg v-if="copiedId === item.publicId" class="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {{ copiedId === item.publicId ? 'Copied!' : 'Copy URL' }}
              </button>

              <button
                type="button"
                class="btn btn--secondary btn--sm text-[11px] py-1 px-2 text-red-400 hover:text-red-300"
                title="Delete asset"
                @click="confirmDelete(item.publicId)"
              >
                <IconGlyph name="trash" :size="12" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination / Load More -->
      <div v-if="nextCursor" class="mt-8 flex justify-center">
        <button
          class="btn btn--secondary inline-flex items-center gap-2 px-6"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span v-if="loadingMore" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          {{ loadingMore ? 'Loading...' : 'Load More Assets' }}
        </button>
      </div>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="admin-panel max-w-lg w-full p-6 relative border border-[var(--stroke)] shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-[var(--ink)]">Upload Asset to Cloudinary</h3>
            <button class="text-[var(--ink-tertiary)] hover:text-[var(--ink)]" @click="closeUploadModal">✕</button>
          </div>

          <form @submit.prevent="handleUpload">
            <!-- Target Folder Selection -->
            <div class="mb-4">
              <label class="block text-xs font-mono text-[var(--ink-secondary)] mb-1">Target Folder</label>
              <select v-model="uploadTargetFolder" class="form-control text-xs">
                <option value="portfolio">portfolio (Root)</option>
                <option value="portfolio/projects">portfolio/projects</option>
                <option value="portfolio/projects/acvis">portfolio/projects/acvis</option>
                <option value="portfolio/projects/sentinel-bot">portfolio/projects/sentinel-bot</option>
                <option value="portfolio/projects/telebot">portfolio/projects/telebot</option>
                <option value="portfolio/blog">portfolio/blog</option>
                <option value="portfolio/about">portfolio/about</option>
                <option value="portfolio/home">portfolio/home</option>
              </select>
            </div>

            <!-- Custom Filename -->
            <div class="mb-4">
              <label class="block text-xs font-mono text-[var(--ink-secondary)] mb-1">Custom File Name (Optional)</label>
              <input v-model="uploadFileName" type="text" placeholder="e.g. system_architecture_diagram" class="form-control text-xs" />
            </div>

            <!-- Drop / Pick Zone -->
            <div
              class="border-2 border-dashed border-[var(--stroke)] hover:border-[var(--ink-tertiary)] rounded-lg p-6 text-center cursor-pointer mb-4 transition-colors bg-[var(--surface)]"
              @dragover.prevent
              @drop.prevent="onFileDrop"
              @click="triggerFileInput"
            >
              <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
              <div v-if="uploadPreview" class="flex flex-col items-center gap-2">
                <img :src="uploadPreview" alt="Upload Preview" class="max-h-40 rounded object-contain border border-[var(--stroke)]" />
                <span class="text-xs text-[var(--ink-secondary)]">Click or drop to replace image</span>
              </div>
              <div v-else class="flex flex-col items-center gap-2 text-[var(--ink-secondary)]">
                <IconGlyph name="media" :size="32" class="opacity-50" />
                <p class="text-xs">Drag and drop an image here, or <span class="text-[var(--ink)] underline">browse file</span></p>
                <p class="text-[10px] text-[var(--ink-tertiary)]">PNG, JPG, WEBP, AVIF up to 10MB</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
              <button type="button" class="btn btn--secondary btn--sm" :disabled="uploading" @click="closeUploadModal">
                Cancel
              </button>
              <button type="submit" class="btn btn--primary btn--sm inline-flex items-center gap-2" :disabled="!uploadData || uploading">
                <span v-if="uploading" class="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                {{ uploading ? 'Uploading...' : 'Confirm Upload' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lightbox Inspector Modal -->
      <div v-if="activeLightboxItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" @click="activeLightboxItem = null">
        <div class="max-w-4xl w-full admin-panel p-6 overflow-hidden relative shadow-2xl" @click.stop>
          <div class="flex items-center justify-between pb-3 border-b border-[var(--stroke)] mb-4">
            <div>
              <p class="text-sm font-semibold text-[var(--ink)] font-mono">{{ activeLightboxItem.publicId }}</p>
              <p class="text-xs text-[var(--ink-tertiary)]">{{ activeLightboxItem.width }} × {{ activeLightboxItem.height }} px · {{ formatBytes(activeLightboxItem.bytes) }} · {{ activeLightboxItem.format.toUpperCase() }}</p>
            </div>
            <button class="text-[var(--ink-secondary)] hover:text-[var(--ink)] text-lg" @click="activeLightboxItem = null">✕</button>
          </div>

          <div class="max-h-[60vh] flex items-center justify-center overflow-hidden bg-black/50 rounded border border-[var(--stroke)] mb-4">
            <img :src="activeLightboxItem.url" :alt="activeLightboxItem.publicId" class="max-h-[60vh] max-w-full object-contain" />
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <input type="text" readonly :value="activeLightboxItem.url" class="form-control text-xs font-mono flex-1 bg-[var(--surface)]" />
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button class="btn btn--primary btn--sm flex-1 sm:flex-none" @click="copyUrl(activeLightboxItem.url, activeLightboxItem.publicId)">
                {{ copiedId === activeLightboxItem.publicId ? 'Copied CDN Link!' : 'Copy Direct Link' }}
              </button>
              <a :href="activeLightboxItem.url" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">
                Open in Tab
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Dialog -->
      <ConfirmDialog
        :open="confirmDialog.isOpen.value"
        title="Delete Cloudinary Asset"
        :message="`Are you sure you want to permanently remove '${pendingDeleteId}' from Cloudinary? This action cannot be undone.`"
        confirm-text="Delete Asset"
        cancel-text="Cancel"
        @confirm="handleConfirmDelete"
        @cancel="confirmDialog.cancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminSectionHeader from '@/components/admin/AdminSectionHeader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useToast } from '@/composables/useToast'
import api from '@/utils/api'

interface MediaResource {
  publicId: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  folder: string
  createdAt: string
}

const { showToast } = useToast()
const confirmDialog = useConfirmDialog()

const loading = ref(false)
const loadingMore = ref(false)
const resources = ref<MediaResource[]>([])
const totalCount = ref(0)
const nextCursor = ref<string | null>(null)
const activeFolder = ref('all')
const searchQuery = ref('')
const copiedId = ref<string | null>(null)
const pendingDeleteId = ref<string | null>(null)
const activeLightboxItem = ref<MediaResource | null>(null)

// Folders
const folders = ref<string[]>([
  'all',
  'portfolio',
  'portfolio/projects',
  'portfolio/projects/acvis',
  'portfolio/blog',
  'portfolio/about',
  'portfolio/home',
])

// Upload State
const showUploadModal = ref(false)
const uploadTargetFolder = ref('portfolio')
const uploadFileName = ref('')
const uploadData = ref<string | null>(null)
const uploadPreview = ref<string | null>(null)
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function fetchFolders(): Promise<void> {
  try {
    const res = await api.get('/media/folders')
    if (res.data?.success && Array.isArray(res.data?.data)) {
      folders.value = res.data.data
    }
  } catch {
    // Keep fallback list
  }
}

async function fetchMedia(reset = true): Promise<void> {
  if (reset) {
    loading.value = true
    nextCursor.value = null
  } else {
    loadingMore.value = true
  }

  try {
    const params: Record<string, string> = {
      folder: activeFolder.value,
      max_results: '24',
    }

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    if (!reset && nextCursor.value) {
      params.next_cursor = nextCursor.value
    }

    const res = await api.get('/media', { params })
    if (res.data?.success) {
      const data = res.data.data
      if (reset) {
        resources.value = data.resources || []
      } else {
        resources.value = [...resources.value, ...(data.resources || [])]
      }
      totalCount.value = data.totalCount || 0
      nextCursor.value = data.nextCursor || null
    }
  } catch (error) {
    showToast('Failed to load media from Cloudinary', 'error')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function selectFolder(folder: string): void {
  if (activeFolder.value === folder) return
  activeFolder.value = folder
  fetchMedia(true)
}

function handleSearch(): void {
  fetchMedia(true)
}

function resetFilters(): void {
  activeFolder.value = 'all'
  searchQuery.value = ''
  fetchMedia(true)
}

function loadMore(): void {
  if (nextCursor.value && !loadingMore.value) {
    fetchMedia(false)
  }
}

function copyUrl(url: string, id: string): void {
  navigator.clipboard.writeText(url)
  copiedId.value = id
  showToast('Cloudinary CDN URL copied to clipboard!', 'success')
  setTimeout(() => {
    if (copiedId.value === id) {
      copiedId.value = null
    }
  }, 2500)
}

function openLightbox(item: MediaResource): void {
  activeLightboxItem.value = item
}

function confirmDelete(publicId: string): void {
  pendingDeleteId.value = publicId
  confirmDialog.request(publicId)
}

async function handleConfirmDelete(): Promise<void> {
  const publicId = confirmDialog.consume()
  if (!publicId) return

  try {
    const res = await api.delete('/media', { data: { publicId } })
    if (res.data?.success) {
      showToast('Asset deleted from Cloudinary', 'success')
      resources.value = resources.value.filter((r) => r.publicId !== publicId)
      totalCount.value = Math.max(0, totalCount.value - 1)
      if (activeLightboxItem.value?.publicId === publicId) {
        activeLightboxItem.value = null
      }
    }
  } catch (error) {
    showToast('Failed to delete asset from Cloudinary', 'error')
  }
}

// Upload Handling
function openUploadModal(): void {
  showUploadModal.value = true
  uploadData.value = null
  uploadPreview.value = null
  uploadFileName.value = ''
  uploadTargetFolder.value = activeFolder.value !== 'all' ? activeFolder.value : 'portfolio'
}

function closeUploadModal(): void {
  showUploadModal.value = false
  uploadData.value = null
  uploadPreview.value = null
  uploadFileName.value = ''
}

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

function onFileSelected(e: Event): void {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    processFile(files[0])
  }
}

function onFileDrop(e: DragEvent): void {
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    processFile(files[0])
  }
}

function processFile(file: File): void {
  if (!file.type.startsWith('image/')) {
    showToast('Only image files are allowed', 'warning')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('File size must be under 10MB', 'warning')
    return
  }

  if (!uploadFileName.value) {
    uploadFileName.value = file.name.replace(/\.[^/.]+$/, '')
  }

  const reader = new FileReader()
  reader.onload = () => {
    uploadData.value = reader.result as string
    uploadPreview.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

async function handleUpload(): Promise<void> {
  if (!uploadData.value) return
  uploading.value = true

  try {
    const res = await api.post('/media/upload', {
      data: uploadData.value,
      folder: uploadTargetFolder.value,
      fileName: uploadFileName.value,
    })

    if (res.data?.success) {
      showToast('Asset uploaded to Cloudinary successfully!', 'success')
      closeUploadModal()
      fetchMedia(true)
    }
  } catch (error) {
    showToast('Failed to upload image to Cloudinary', 'error')
  } finally {
    uploading.value = false
  }
}

// Formatters
function getFilename(publicId: string): string {
  return publicId.split('/').pop() || publicId
}

function getThumbnailUrl(url: string): string {
  // Use Cloudinary dynamic resize transformation for lightning-fast gallery thumbnails
  return url.replace('/image/upload/', '/image/upload/c_scale,w_400,q_auto,f_auto/')
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchFolders()
  fetchMedia(true)
})
</script>
