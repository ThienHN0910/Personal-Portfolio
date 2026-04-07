import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import Project from '../models/Project'

const router = Router()

router.get('/', async (_req, res) => {
  await connectToDatabase()

  try {
    const projects = await Project.find().sort({ createdAt: -1 })
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
