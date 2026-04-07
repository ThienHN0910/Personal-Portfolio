import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from './lib/mongodb'
import About from './models/About'
import { requireAdmin } from './lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      let about = await About.findOne()
      if (!about) {
        about = await About.create({
          name: 'Your Name',
          title: 'Full Stack Developer',
          bio: 'A passionate developer.',
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
  }

  if (req.method === 'PUT') {
    const user = requireAdmin(req, res)
    if (!user) return

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
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
