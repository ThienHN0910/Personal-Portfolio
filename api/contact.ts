import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from './lib/mongodb'
import Contact from './models/Contact'
import { requireAdmin } from './lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    const user = requireAdmin(req, res)
    if (!user) return

    try {
      const messages = await Contact.find().sort({ createdAt: -1 })
      return res.status(200).json({ success: true, data: messages })
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to fetch messages' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body as {
        name?: string
        email?: string
        subject?: string
        message?: string
      }

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' })
      }

      await Contact.create({ name, email, subject, message })
      return res.status(201).json({ success: true, message: 'Message sent successfully' })
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to send message' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
