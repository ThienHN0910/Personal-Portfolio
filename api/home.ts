import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from './lib/mongodb'
import Home from './models/Home'
import { requireAdmin } from './lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
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
  }

  if (req.method === 'PUT') {
    const user = requireAdmin(req, res)
    if (!user) return

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
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
