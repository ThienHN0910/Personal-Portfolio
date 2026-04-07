import api from '@/utils/api'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

interface CkLoader {
  file: Promise<File | null>
}

interface CkFileRepository {
  createUploadAdapter: (loader: CkLoader) => CloudinaryUploadAdapter
}

interface CkEditorWithPlugins {
  plugins: {
    get: (name: 'FileRepository') => CkFileRepository
  }
}

interface UploadResponse {
  success: boolean
  data?: {
    url?: string
  }
  error?: string
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read selected image'))
    reader.readAsDataURL(file)
  })
}

class CloudinaryUploadAdapter {
  private readonly loader: CkLoader
  private readonly folder: string
  private readonly abortController = new AbortController()

  constructor(loader: CkLoader, folder: string) {
    this.loader = loader
    this.folder = folder
  }

  async upload(): Promise<{ default: string }> {
    const file = (await this.loader.file) as File | null
    if (!file) {
      throw new Error('No image file selected')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are supported')
    }

    // Keep payload safely under backend JSON body limit.
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('Image size must be <= 5MB')
    }

    const data = await fileToDataUrl(file)
    const response = await api.post<UploadResponse>(
      '/upload',
      { data, folder: this.folder },
      { signal: this.abortController.signal },
    )

    const url = response.data?.data?.url
    if (!url) {
      throw new Error(response.data?.error || 'Image upload failed')
    }

    return { default: url }
  }

  abort(): void {
    this.abortController.abort()
  }
}

export function createCloudinaryUploadAdapterPlugin(folder = 'portfolio/blog/content') {
  return function CloudinaryUploadAdapterPlugin(editor: CkEditorWithPlugins): void {
    const fileRepository = editor.plugins.get('FileRepository')
    fileRepository.createUploadAdapter = (loader: CkLoader) => new CloudinaryUploadAdapter(loader, folder)
  }
}
