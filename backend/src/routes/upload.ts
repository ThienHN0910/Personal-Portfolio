import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { getCloudinary } from '../lib/cloudinary'

const router = Router()

router.post('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const {
      data,
      folder = 'portfolio',
      resourceType = 'image',
      fileName,
    } = req.body as {
      data?: string
      folder?: string
      resourceType?: 'image' | 'raw' | 'video' | 'auto'
      fileName?: string
    }

    if (!data) {
      return res.status(400).json({ success: false, error: 'No file data provided' })
    }

    const cloudinary = getCloudinary()
    const uploadOptions: {
      folder: string
      resource_type?: 'image' | 'raw' | 'video' | 'auto'
      transformation?: Array<{ quality: string; fetch_format: string }>
      public_id?: string
    } = {
      folder,
    }

    if (resourceType) {
      uploadOptions.resource_type = resourceType
    }

    if (resourceType === 'image') {
      uploadOptions.transformation = [{ quality: 'auto', fetch_format: 'auto' }]
    }

    if (fileName) {
      uploadOptions.public_id = fileName.replace(/\.[^/.]+$/, '')
    }

    const result = await cloudinary.uploader.upload(data, uploadOptions)

    return res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to upload file' })
  }
})

export default router
