<template>
  <div class="full-rich-editor-wrapper relative">
    <div class="flex justify-end mb-2">
      <button
        type="button"
        class="btn btn--sm flex items-center gap-1.5 text-xs py-1.5 px-3 border border-cyber-cyan/40 rounded-lg bg-slate-900/80 hover:bg-cyber-cyan/20 text-cyber-cyan hover:shadow-cyan-glow transition-all"
        :disabled="isImproving"
        @click="openAiModal"
        title="Use AI Assistant to generate or refine content from raw context"
      >
        <span v-if="isImproving" class="inline-block animate-spin">⏳</span>
        <span v-else>✨</span>
        {{ isImproving ? 'Improving...' : 'AI Content Assistant' }}
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

    <!-- AI Prompt & Master Synthesis Modal -->
    <div
      v-if="showAiModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div class="glass-panel max-w-xl w-full p-6 border border-cyber-border/40 shadow-cyan-glow space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-2 border-b border-white/10">
          <div class="space-y-0.5">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>✨</span>
              <span>AI Design-System Content Assistant</span>
            </h3>
            <p class="text-[11px] text-slate-400 font-mono">
              Auto-formats raw markdown / CONTEXT.md into avant-garde HTML with 60fps design system classes.
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-white text-lg font-mono ml-3"
            @click="showAiModal = false"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3 text-xs font-mono">
          <!-- Raw Context Input -->
          <div class="space-y-1">
            <label class="block text-slate-300 uppercase">Source Content / Raw Notes (Optional if editor already has text):</label>
            <textarea
              v-model="rawSourceInput"
              rows="6"
              placeholder="Paste raw CONTEXT.md, AGENTS.md, GitHub README, dev logs, or project notes here..."
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono text-xs"
            />
          </div>

          <!-- Custom Prompt Input -->
          <div class="space-y-1">
            <label class="block text-slate-300 uppercase">Additional Custom Instructions (Optional):</label>
            <textarea
              v-model="customPrompt"
              rows="2"
              placeholder="e.g., Emphasize 60fps GPU performance, write in Vietnamese, or highlight database sharding..."
              class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan text-xs"
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
            {{ isImproving ? 'Synthesizing...' : '✨ Generate &amp; Format in CKEditor' }}
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
    editorKey?: string | number
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
const rawSourceInput = ref('')
const customPrompt = ref('')
const isImproving = ref(false)

function openAiModal(): void {
  if (props.modelValue && !rawSourceInput.value) {
    rawSourceInput.value = props.modelValue
  }
  showAiModal.value = true
}

async function handleRunAi() {
  const contentToProcess = rawSourceInput.value.trim() || props.modelValue || ''
  if (!contentToProcess) {
    alert('Please paste some text/context or write something in the editor first.')
    return
  }

  isImproving.value = true
  try {
    const response = await api.post<{ success: boolean; data: string }>('/ai/improve-content', {
      content: contentToProcess,
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
