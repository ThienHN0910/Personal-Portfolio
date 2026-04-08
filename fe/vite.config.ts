import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'vendor-pdfjs'
          }

          if (id.includes('node_modules/@ckeditor') || id.includes('node_modules/ckeditor5')) {
            return 'vendor-ckeditor'
          }

          if (id.includes('node_modules/dompurify')) {
            return 'vendor-dompurify'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
