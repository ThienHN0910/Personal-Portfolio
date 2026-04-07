<template>
  <div class="space-y-3">
    <div
      class="border border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer"
      :class="isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/20 bg-white/5 hover:border-blue-400/70'"
      role="button"
      tabindex="0"
      @click="triggerFilePicker"
      @keydown.enter.prevent="triggerFilePicker"
      @keydown.space.prevent="triggerFilePicker"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      />

      <div class="text-sm text-gray-300">
        <p class="font-medium">Kéo thả ảnh vào đây hoặc bấm để chọn ảnh</p>
        <p class="text-xs text-gray-500 mt-1">PNG/JPG/WebP, tối đa khuyến nghị 5MB</p>
      </div>

      <p v-if="uploading" class="text-blue-300 text-sm mt-3">Đang upload...</p>
      <p v-if="errorMessage" class="text-red-400 text-sm mt-3">{{ errorMessage }}</p>
    </div>

    <div v-if="modelValue" class="space-y-2">
      <img :src="modelValue" alt="Uploaded preview" class="w-full max-h-60 object-cover rounded-lg border border-white/10" />
      <div class="flex items-center gap-2">
        <input :value="modelValue" type="text" readonly class="flex-1 text-xs bg-slate-800 border border-white/10 rounded px-3 py-2 text-gray-300" />
        <button type="button" class="btn btn--secondary btn--sm" @click="clearImage">Xóa</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import api from '@/utils/api'

interface UploadResponse {
  success: boolean
  data?: {
    url: string
    publicId: string
  }
  error?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  folder?: string
}>(), {
  modelValue: '',
  folder: 'portfolio',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const errorMessage = ref('')

function triggerFilePicker() {
  if (uploading.value) return
  fileInput.value?.click()
}

function onDragOver() {
  if (uploading.value) return
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

async function onDrop(event: DragEvent) {
  isDragging.value = false
  if (uploading.value) return

  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await uploadImage(file)
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  await uploadImage(file)
  target.value = ''
}

function clearImage() {
  emit('update:modelValue', '')
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

async function uploadImage(file: File) {
  errorMessage.value = ''

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Vui long chon dung file anh.'
    return
  }

  try {
    uploading.value = true
    const dataUrl = await fileToDataUrl(file)

    const response = await api.post<UploadResponse>('/upload', {
      data: dataUrl,
      folder: props.folder,
    })

    if (response.data.success && response.data.data?.url) {
      emit('update:modelValue', response.data.data.url)
      return
    }

    errorMessage.value = response.data.error || 'Upload that bai.'
  } catch {
    errorMessage.value = 'Upload that bai. Vui long thu lai.'
  } finally {
    uploading.value = false
  }
}
</script>
