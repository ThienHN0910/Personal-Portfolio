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
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Image, ImageUpload } from '@ckeditor/ckeditor5-image'
import { Link } from '@ckeditor/ckeditor5-link'
import { List } from '@ckeditor/ckeditor5-list'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import '@ckeditor/ckeditor5-theme-lark/dist/index-editor.css'
import '@ckeditor/ckeditor5-editor-classic/dist/index.css'
import '@ckeditor/ckeditor5-basic-styles/dist/index.css'
import '@ckeditor/ckeditor5-heading/dist/index.css'
import '@ckeditor/ckeditor5-image/dist/index.css'
import '@ckeditor/ckeditor5-link/dist/index.css'
import '@ckeditor/ckeditor5-list/dist/index.css'

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
