import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import About from '../models/About'

const router = Router()

router.get('/', async (_req, res) => {
  await connectToDatabase()

  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create({
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'A passionate developer.',
        contactInfo: {},
        skills: [],
        experience: [],
        education: [],
        socialLinks: {},
      })
    }

    return res.status(200).json({ success: true, data: about })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch about data' })
  }
})

router.put('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const about = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    })

    return res.status(200).json({ success: true, data: about })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update about data' })
  }
})

export default router
