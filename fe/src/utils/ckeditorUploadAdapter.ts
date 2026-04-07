import api from '@/utils/api'

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
  private loader: any
  private folder: string
  private abortController = new AbortController()

  constructor(loader: any, folder: string) {
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
    if (file.size > 5 * 1024 * 1024) {
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
  return function CloudinaryUploadAdapterPlugin(editor: any): void {
    const fileRepository = editor.plugins.get('FileRepository')
    fileRepository.createUploadAdapter = (loader: any) => new CloudinaryUploadAdapter(loader, folder)
  }
}
