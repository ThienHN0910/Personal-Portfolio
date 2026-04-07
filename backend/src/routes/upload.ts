import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { getCloudinary } from '../lib/cloudinary'

const router = Router()

router.post('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const { data, folder = 'portfolio' } = req.body as { data?: string; folder?: string }

    if (!data) {
      return res.status(400).json({ success: false, error: 'No image data provided' })
    }

    const cloudinary = getCloudinary()
    const result = await cloudinary.uploader.upload(data, {
      folder,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })

    return res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to upload image' })
  }
})

export default router
