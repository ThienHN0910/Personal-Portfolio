import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from './lib/mongodb'
import Project from './models/Project'
import { requireAdmin } from './lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const projects = await Project.find().sort({ createdAt: -1 })
      return res.status(200).json({ success: true, data: projects })
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch projects' })
    }
  }

  if (req.method === 'POST') {
    const user = requireAdmin(req, res)
    if (!user) return

    try {
      const project = await Project.create(req.body)
      return res.status(201).json({ success: true, data: project })
    } catch (error) {
      return res.status(400).json({ success: false, error: 'Failed to create project' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
