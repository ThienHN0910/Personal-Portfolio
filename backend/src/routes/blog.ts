import { Router } from 'express'

import { isAdminRequest, requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import { buildCategoryFilter, buildSearchFilter, idOrSlugQuery, parsePositiveInteger } from '../lib/queryFilters'
import BlogPost from '../models/BlogPost'

const router = Router()

router.get('/', async (req, res) => {
  await connectToDatabase()

  try {
    const isAdminView = req.query.all === 'true'
    // Drafts are only listed for the owner.
    if (isAdminView && !requireAdmin(req, res)) return
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
    const post = await BlogPost.findOne(idOrSlugQuery(req.params.id))
    // Unpublished drafts are invisible to everyone except the owner.
    if (!post || (!post.published && !isAdminRequest(req))) return res.status(404).json({ success: false, error: 'Not found' })

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
    // Load + save (instead of findByIdAndUpdate) so the schema's pre('save') slug hook runs.
    const post = await BlogPost.findById(req.params.id)
    if (!post) return res.status(404).json({ success: false, error: 'Not found' })
    post.set(req.body)
    await post.save()

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
