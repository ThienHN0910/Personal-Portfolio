import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import { buildCategoryFilter, buildSearchFilter, idOrSlugQuery, parsePositiveInteger } from '../lib/queryFilters'
import Project from '../models/Project'

const router = Router()

router.get('/', async (req, res) => {
  await connectToDatabase()

  try {
    const page = parsePositiveInteger(req.query.page)
    const limit = parsePositiveInteger(req.query.limit)
    const baseFilter = {
      ...buildSearchFilter(req.query.q, ['title', 'description', 'technologies', 'categories']),
      ...buildCategoryFilter(req.query.category),
    }

    if (page !== null || limit !== null) {
      const currentPage = page ?? 1
      const pageSize = limit ?? 9
      const [projects, total] = await Promise.all([
        Project.find(baseFilter).sort({ priority: -1, featured: -1, createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize),
        Project.countDocuments(baseFilter),
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

    const projects = await Project.find(baseFilter).sort({ priority: -1, featured: -1, createdAt: -1 })
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
    const project = await Project.findOne(idOrSlugQuery(req.params.id))
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
    // Load + save (instead of findByIdAndUpdate) so the schema's pre('save') slug hook runs.
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Not found' })
    project.set(req.body)
    await project.save()

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
