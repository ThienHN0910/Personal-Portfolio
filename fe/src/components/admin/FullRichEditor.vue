<template>
  <div class="full-rich-editor-wrapper relative">
    <div class="flex justify-end mb-2">
      <button
        type="button"
        class="btn btn--sm flex items-center gap-1.5 text-xs py-1.5 px-3 border border-cyber-cyan/40 rounded-lg bg-slate-900/80 hover:bg-cyber-cyan/20 text-cyber-cyan hover:shadow-cyan-glow transition-all"
        :disabled="isImproving || !modelValue"
        @click="showAiModal = true"
        title="Use AI Assistant to refine, format, or restructure content"
      >
        <span v-if="isImproving" class="inline-block animate-spin">⏳</span>
        <span v-else>✨</span>
        {{ isImproving ? 'Improving...' : 'AI Content Improvement' }}
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

    <!-- AI Prompt & Template Selection Modal -->
    <div
      v-if="showAiModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div class="glass-panel max-w-lg w-full p-6 border border-cyber-border/40 shadow-cyan-glow space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span>✨</span>
            <span>AI Content Assistant</span>
          </h3>
          <button
            type="button"
            class="text-slate-400 hover:text-white text-lg font-mono"
            @click="showAiModal = false"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3 text-xs font-mono">
          <!-- Template Selection -->
          <div class="space-y-1">
            <label class="block text-slate-300 uppercase">Select Formatting Template:</label>
            <select
              v-model="selectedTemplate"
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyber-cyan"
            >
              <option value="default">Standard Content Polish & Semantic HTML</option>
              <option value="project_blog">Project Case Study (Objectives, Architecture, Challenges, Results)</option>
              <option value="dev_log">Technical Dev Log (Context, Root Cause, Solution, Code)</option>
              <option value="project_overview">Project Overview (Executive Summary, Stack, Features)</option>
            </select>
          </div>

          <!-- Custom Prompt Input -->
          <div class="space-y-1">
            <label class="block text-slate-300 uppercase">Custom Prompt / Extra Instructions (Optional):</label>
            <textarea
              v-model="customPrompt"
              rows="3"
              placeholder="e.g., Make the tone more concise, emphasize Vue 3 Composition API & Docker performance gains..."
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
            @click="showAiModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyber-cyan to-indigo-500 text-slate-950 hover:shadow-cyan-glow transition-all"
            :disabled="isImproving"
            @click="handleRunAi"
          >
            {{ isImproving ? 'Processing...' : '✨ Run AI Assistant' }}
          </button>
        </div>
      </div>
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

const showAiModal = ref(false)
const selectedTemplate = ref('default')
const customPrompt = ref('')
const isImproving = ref(false)

async function handleRunAi() {
  if (!props.modelValue) return

  isImproving.value = true
  try {
    const response = await api.post<{ success: boolean; data: string }>('/ai/improve-content', {
      content: props.modelValue,
      templateType: selectedTemplate.value,
      customPrompt: customPrompt.value,
    })

    if (response.data.success && response.data.data) {
      emit('update:modelValue', response.data.data)
      showAiModal.value = false
    } else {
      alert('AI service failed to refine the content. Please try again.')
    }
  } catch (error) {
    console.error('Error improving content:', error)
    alert('An error occurred while connecting to the AI service.')
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
