<template>
  <div class="full-rich-editor-wrapper">
    <div class="flex justify-end mb-2">
      <button
        type="button"
        class="btn btn--sm btn--secondary flex items-center gap-1.5 text-xs py-1 px-2 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
        :disabled="isImproving || !modelValue"
        @click="improveContent"
        title="Sử dụng AI để sửa lỗi và định dạng lại nội dung"
      >
        <span v-if="isImproving" class="inline-block animate-spin">⏳</span>
        <span v-else>✨</span>
        {{ isImproving ? 'Đang cải thiện...' : 'Cải thiện nội dung' }}
      </button>
    </div>
    <div class="full-rich-editor" :style="{ '--editor-sticky-top': `${stickyTop}px` }">
      <Ckeditor
        :key="editorKey"
        :editor="editor"
        :model-value="modelValue"
        :config="editorConfig"
        @update:model-value="onUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  SourceEditing,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableToolbar,
  Underline,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

import { createCloudinaryUploadAdapterPlugin } from '@/utils/ckeditorUploadAdapter'
import api from '@/utils/api'

const props = withDefaults(
  defineProps<{
    modelValue: string
    editorKey?: string
    uploadFolder?: string
    placeholder?: string
    stickyTop?: number
  }>(),
  {
    uploadFolder: 'portfolio/about/experience',
    placeholder: 'Write content here...',
    stickyTop: 76,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const Ckeditor = CKEditor.component
const editor = ClassicEditor as unknown as {
  create(...args: any[]): Promise<any>
}

const editorConfig: Record<string, unknown> = {
  extraPlugins: [createCloudinaryUploadAdapterPlugin(props.uploadFolder)],
  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    SourceEditing,
    Subscript,
    Superscript,
    Alignment,
    Indent,
    IndentBlock,
    BlockQuote,
    Link,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    List,
    MediaEmbed,
    PasteFromOffice,
    Table,
    TableToolbar,
    Highlight,
    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,
    GeneralHtmlSupport,
    CodeBlock,
    PageBreak,
    FindAndReplace,
    HorizontalLine,
    SpecialCharacters,
  ],
  placeholder: props.placeholder,
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'alignment',
      'outdent',
      'indent',
      '|',
      'link',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'fontFamily',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'highlight',
      'uploadImage',
      'codeBlock',
      'pageBreak',
      'findAndReplace',
      'horizontalLine',
      'specialCharacters',
      'sourceEditing',
      '|',
      'undo',
      'redo',
    ],
  },
  image: {
    styles: ['full', 'side'],
    toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        styles: true,
        attributes: true,
        classes: true,
      },
    ],
  },
}

function onUpdate(value: string): void {
  emit('update:modelValue', value)
}

const isImproving = ref(false)

async function improveContent() {
  if (!props.modelValue) return

  isImproving.value = true
  try {
    const response = await api.post<{ success: boolean; data: string }>('/ai/improve-content', {
      content: props.modelValue,
    })
    
    if (response.data.success && response.data.data) {
      emit('update:modelValue', response.data.data)
    } else {
      alert('AI failed to improve the content. Please try again later.')
    }
  } catch (error) {
    console.error('Error improving content:', error)
    alert('An error occurred while calling AI service.')
  } finally {
    isImproving.value = false
  }
}
</script>

<style scoped lang="scss">
:deep(.full-rich-editor) {
  --editor-sticky-top: 76px;
}

:deep(.ck.ck-editor) {
  border-radius: 0.75rem;
  overflow: visible;
}

:deep(.ck.ck-editor__top) {
  position: sticky;
  top: var(--editor-sticky-top);
  z-index: 12;
}

:deep(.ck.ck-editor__top .ck-sticky-panel .ck-toolbar) {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

:deep(.ck.ck-editor__main > .ck-editor__editable) {
  min-height: 220px;
  max-height: 560px;
  overflow-y: auto;
  color: #111827;
}
</style>
