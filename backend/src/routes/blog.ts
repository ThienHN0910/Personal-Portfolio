import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import BlogPost from '../models/BlogPost'

const router = Router()

router.get('/', async (req, res) => {
  await connectToDatabase()

  try {
    const query = req.query.all === 'true' ? {} : { published: true }
    const posts = await BlogPost.find(query).sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: posts })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch posts' })
  }
})

router.post('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const post = await BlogPost.create(req.body)
    return res.status(201).json({ success: true, data: post })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to create post' })
  }
})

router.get('/:id', async (req, res) => {
  await connectToDatabase()

  try {
    const post = await BlogPost.findById(req.params.id)
    if (!post) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, data: post })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch post' })
  }
})

router.put('/:id', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!post) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, data: post })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update post' })
  }
})

router.delete('/:id', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, message: 'Deleted successfully' })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to delete post' })
  }
})

export default router
