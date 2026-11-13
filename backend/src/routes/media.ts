import { Router } from 'express'
import { requireAdmin } from '../lib/auth'
import { getCloudinary } from '../lib/cloudinary'

const router = Router()

/**
 * GET /api/media/folders
 * Returns all top-level and portfolio subfolders
 */
router.get('/folders', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const cloudinary = getCloudinary()
    const result = await cloudinary.api.sub_folders('portfolio')
    const mainFolders = result.folders.map((f: { path: string }) => f.path)

    let projectSubFolders: string[] = []
    try {
      const projRes = await cloudinary.api.sub_folders('portfolio/projects')
      projectSubFolders = projRes.folders.map((f: { path: string }) => f.path)
    } catch {
      // Ignore if no project subfolders
    }

    const folders = ['all', 'portfolio', ...mainFolders, ...projectSubFolders]
    return res.status(200).json({ success: true, data: Array.from(new Set(folders)) })
  } catch (error) {
    console.error('Error fetching folders:', error)
    return res.status(200).json({
      success: true,
      data: ['all', 'portfolio', 'portfolio/projects', 'portfolio/blog', 'portfolio/about', 'portfolio/home', 'portfolio/cv'],
    })
  }
})

/**
 * GET /api/media
 * Search and browse Cloudinary assets with pagination and folder filtering
 */
router.get('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const {
      folder = 'all',
      search = '',
      next_cursor,
      max_results = '24',
    } = req.query as {
      folder?: string
      search?: string
      next_cursor?: string
      max_results?: string
    }

    const cloudinary = getCloudinary()
    let expression = 'resource_type:image'

    if (folder && folder !== 'all') {
      expression += ` AND folder:"${folder}"`
    } else {
      expression += ' AND folder:portfolio*'
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim().replace(/[*"']/g, '')
      expression += ` AND filename:*${cleanSearch}*`
    }

    let searchBuilder = cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(Math.min(Math.max(Number(max_results) || 24, 1), 100))

    if (next_cursor) {
      searchBuilder = searchBuilder.next_cursor(next_cursor)
    }

    const result = await searchBuilder.execute()

    const resources = (result.resources || []).map((r: any) => ({
      publicId: r.public_id,
      url: r.secure_url,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      folder: r.folder,
      createdAt: r.created_at,
    }))

    return res.status(200).json({
      success: true,
      data: {
        resources,
        totalCount: result.total_count,
        nextCursor: result.next_cursor || null,
      },
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return res.status(500).json({ success: false, error: 'Failed to fetch media assets' })
  }
})

/**
 * POST /api/media/upload
 * Upload image to Cloudinary in a specific folder
 */
router.post('/upload', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const {
      data,
      folder = 'portfolio',
      fileName,
    } = req.body as {
      data?: string
      folder?: string
      fileName?: string
    }

    if (!data) {
      return res.status(400).json({ success: false, error: 'No file data provided' })
    }

    const cloudinary = getCloudinary()
    const targetFolder = folder || 'portfolio'
    const uploadOptions: {
      folder: string
      asset_folder: string
      resource_type: 'image'
      transformation: Array<{ quality: string; fetch_format: string }>
      public_id?: string
    } = {
      folder: targetFolder,
      asset_folder: targetFolder,
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }

    if (fileName) {
      uploadOptions.public_id = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
    }

    const result = await cloudinary.uploader.upload(data, uploadOptions)

    return res.status(200).json({
      success: true,
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        folder: result.folder,
        createdAt: result.created_at,
      },
    })
  } catch (error) {
    console.error('Error uploading media:', error)
    return res.status(500).json({ success: false, error: 'Failed to upload media asset' })
  }
})

/**
 * DELETE /api/media
 * Destroy asset on Cloudinary
 */
router.delete('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const publicId = (req.body.publicId || req.query.publicId) as string
    if (!publicId) {
      return res.status(400).json({ success: false, error: 'Missing publicId' })
    }

    const cloudinary = getCloudinary()
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'not found') {
      return res.status(404).json({ success: false, error: 'Asset not found on Cloudinary' })
    }

    return res.status(200).json({
      success: true,
      message: 'Asset deleted successfully',
      result: result.result,
    })
  } catch (error) {
    console.error('Error deleting media:', error)
    return res.status(500).json({ success: false, error: 'Failed to delete media asset' })
  }
})

export default router
