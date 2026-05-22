import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import Project from '../models/Project'

const router = Router()

function parsePositiveInteger(value: unknown): number | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return null

  const parsed = Number.parseInt(raw, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

router.get('/', async (req, res) => {
  await connectToDatabase()

  try {
    const page = parsePositiveInteger(req.query.page)
    const limit = parsePositiveInteger(req.query.limit)

    if (page !== null || limit !== null) {
      const currentPage = page ?? 1
      const pageSize = limit ?? 9
      const [projects, total] = await Promise.all([
        Project.find().sort({ priority: -1, featured: -1, createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize),
        Project.countDocuments(),
      ])

      return res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          page: currentPage,
          limit: pageSize,
          total,
          hasMore: currentPage * pageSize < total,
        },
      })
    }

    const projects = await Project.find().sort({ priority: -1, featured: -1, createdAt: -1 })
    return res.status(200).json({ success: true, data: projects })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch projects' })
  }
})

router.post('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const project = await Project.create(req.body)
    return res.status(201).json({ success: true, data: project })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to create project' })
  }
})

router.get('/:id', async (req, res) => {
  await connectToDatabase()

  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, data: project })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch project' })
  }
})

router.put('/:id', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!project) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, data: project })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update project' })
  }
})

router.delete('/:id', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, message: 'Deleted successfully' })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to delete project' })
  }
})

export default router
