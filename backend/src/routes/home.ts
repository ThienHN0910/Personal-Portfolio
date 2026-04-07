import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import Home from '../models/Home'

const router = Router()

router.get('/', async (_req, res) => {
  await connectToDatabase()

  try {
    let home = await Home.findOne()
    if (!home) {
      home = await Home.create({
        heroTitle: "Hi, I'm",
        heroSubtitle: 'A Full Stack Developer',
        heroDescription: 'I build modern, scalable web applications.',
        ctaText: 'View My Work',
        ctaLink: '/projects',
      })
    }

    return res.status(200).json({ success: true, data: home })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch home data' })
  }
})

router.put('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const home = await Home.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    })

    return res.status(200).json({ success: true, data: home })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update home data' })
  }
})

export default router
