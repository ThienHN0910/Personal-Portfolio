import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import CategorySettings from '../models/CategorySettings'

const router = Router()

const DEFAULT_CATEGORIES = {
  projectCategories: ['AI', 'E-commerce', 'Management System', 'Multiplatform', 'Web App', 'Mobile App'],
  blogCategories: ['Dev Log', 'Overview', 'Interview Test', 'Case Study', 'Tutorial', 'Release Notes'],
}

function normalizeCategories(input: unknown): string[] {
  if (!Array.isArray(input)) return []

  return Array.from(
    new Set(
      input
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean),
    ),
  )
}

async function getOrCreateCategorySettings() {
  let settings = await CategorySettings.findOne()
  if (!settings) {
    settings = await CategorySettings.create(DEFAULT_CATEGORIES)
  }

  const normalizedProjectCategories = normalizeCategories((settings as unknown as { projectCategories?: unknown }).projectCategories)
  const normalizedBlogCategories = normalizeCategories((settings as unknown as { blogCategories?: unknown }).blogCategories)

  if (
    JSON.stringify(normalizedProjectCategories) !== JSON.stringify(settings.projectCategories || []) ||
    JSON.stringify(normalizedBlogCategories) !== JSON.stringify(settings.blogCategories || [])
  ) {
    settings.projectCategories = normalizedProjectCategories
    settings.blogCategories = normalizedBlogCategories
    await settings.save()
  }

  return settings
}

router.get('/', async (_req, res) => {
  await connectToDatabase()

  try {
    const settings = await getOrCreateCategorySettings()
    return res.status(200).json({ success: true, data: settings })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch category settings' })
  }
})

router.put('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const payload = {
      projectCategories: normalizeCategories((req.body as { projectCategories?: unknown }).projectCategories),
      blogCategories: normalizeCategories((req.body as { blogCategories?: unknown }).blogCategories),
    }

    const settings = await CategorySettings.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
    })

    return res.status(200).json({ success: true, data: settings })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update category settings' })
  }
})

export default router
