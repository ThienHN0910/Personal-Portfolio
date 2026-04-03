import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from '../lib/mongodb'
import BlogPost from '../models/BlogPost'
import { requireAdmin } from '../lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const post = await BlogPost.findById(id)
      if (!post) return res.status(404).json({ success: false, error: 'Not found' })
      return res.status(200).json({ success: true, data: post })
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to fetch post' })
    }
  }

  if (req.method === 'PUT') {
    const user = requireAdmin(req, res)
    if (!user) return

    try {
      const post = await BlogPost.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      if (!post) return res.status(404).json({ success: false, error: 'Not found' })
      return res.status(200).json({ success: true, data: post })
    } catch {
      return res.status(400).json({ success: false, error: 'Failed to update post' })
    }
  }

  if (req.method === 'DELETE') {
    const user = requireAdmin(req, res)
    if (!user) return

    try {
      const post = await BlogPost.findByIdAndDelete(id)
      if (!post) return res.status(404).json({ success: false, error: 'Not found' })
      return res.status(200).json({ success: true, message: 'Deleted successfully' })
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to delete post' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
