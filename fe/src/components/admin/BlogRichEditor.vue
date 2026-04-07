<template>
  <Ckeditor
    :key="editorKey"
    :editor="editor"
    :model-value="modelValue"
    :config="editorConfig"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import CKEditor from '@ckeditor/ckeditor5-vue'
import { Bold, ClassicEditor, Essentials, Heading, Image, ImageUpload, Italic, Link, List, Paragraph } from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

import { createCloudinaryUploadAdapterPlugin } from '@/utils/ckeditorUploadAdapter'

defineProps<{
  modelValue: string
  editorKey: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const Ckeditor = CKEditor.component
const editor = ClassicEditor as unknown as {
  create(...args: any[]): Promise<any>
}

const editorConfig = {
  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Link,
    List,
    Image,
    ImageUpload,
  ],
  placeholder: 'Write your post content here...',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'uploadImage',
      '|',
      'undo',
      'redo',
    ],
  },
  link: {
    addTargetToExternalLinks: true,
  },
  extraPlugins: [createCloudinaryUploadAdapterPlugin('portfolio/blog/content')],
}

function onUpdate(value: string): void {
  emit('update:modelValue', value)
}
</script>
<style scoped lang="scss">
:deep(.ck.ck-editor) {
  border-radius: 0.75rem;
  overflow: hidden;
}

:deep(.ck.ck-editor__main > .ck-editor__editable) {
  min-height: 280px;
  max-height: 520px;
  color: #111827;
}
</style>
