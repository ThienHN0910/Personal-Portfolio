import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from './lib/mongodb'
import BlogPost from './models/BlogPost'
import { requireAdmin } from './lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const query = req.query.all === 'true' ? {} : { published: true }
      const posts = await BlogPost.find(query).sort({ createdAt: -1 })
      return res.status(200).json({ success: true, data: posts })
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to fetch posts' })
    }
  }

  if (req.method === 'POST') {
    const user = requireAdmin(req, res)
    if (!user) return

    try {
      const post = await BlogPost.create(req.body)
      return res.status(201).json({ success: true, data: post })
    } catch {
      return res.status(400).json({ success: false, error: 'Failed to create post' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
