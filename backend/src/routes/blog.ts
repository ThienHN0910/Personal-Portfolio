import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import BlogPost from '../models/BlogPost'

const router = Router()

function parsePositiveInteger(value: unknown): number | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return null

  const parsed = Number.parseInt(raw, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildSearchFilter(queryValue: unknown, fields: string[]): Record<string, unknown> {
  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const term = typeof raw === 'string' ? raw.trim() : ''
  if (!term) return {}

  const regex = new RegExp(escapeRegExp(term), 'i')
  return {
    $or: fields.map((field) => ({ [field]: regex })),
  }
}

function buildCategoryFilter(categoryValue: unknown): Record<string, unknown> {
  const raw = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue
  const category = typeof raw === 'string' ? raw.trim() : ''
  if (!category) return {}

  return { categories: { $in: [new RegExp(`^${escapeRegExp(category)}$`, 'i')] } }
}

router.get('/', async (req, res) => {
  await connectToDatabase()

  try {
    const isAdminView = req.query.all === 'true'
    const baseFilter = isAdminView
      ? {}
      : {
          published: true,
          ...buildSearchFilter(req.query.q, ['title', 'content', 'excerpt', 'tags', 'categories']),
          ...buildCategoryFilter(req.query.category),
        }
    const page = parsePositiveInteger(req.query.page)
    const limit = parsePositiveInteger(req.query.limit)

    if (!isAdminView && (page !== null || limit !== null)) {
      const currentPage = page ?? 1
      const pageSize = limit ?? 6
      const [posts, total] = await Promise.all([
        BlogPost.find(baseFilter)
          .sort({ createdAt: -1 })
          .skip((currentPage - 1) * pageSize)
          .limit(pageSize),
        BlogPost.countDocuments(baseFilter),
      ])

      return res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          page: currentPage,
          limit: pageSize,
          total,
          hasMore: currentPage * pageSize < total,
        },
      })
    }

    const posts = await BlogPost.find(baseFilter).sort({ createdAt: -1 })
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
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };
    const post = await BlogPost.findOne(query)
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
