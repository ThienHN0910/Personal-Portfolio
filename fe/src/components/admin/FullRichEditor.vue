<template>
  <div class="full-rich-editor" :style="{ '--editor-sticky-top': `${stickyTop}px` }">
    <Ckeditor
      :key="editorKey"
      :editor="editor"
      :model-value="modelValue"
      :config="editorConfig"
      @update:model-value="onUpdate"
    />
  </div>
</template>

<script setup lang="ts">
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
