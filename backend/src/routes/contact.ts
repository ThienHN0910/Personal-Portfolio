import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import Contact from '../models/Contact'

const router = Router()

router.get('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: messages })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch messages' })
  }
})

router.post('/', async (req, res) => {
  await connectToDatabase()

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
})

router.delete('/:id', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const message = await Contact.findByIdAndDelete(req.params.id)
    if (!message) return res.status(404).json({ success: false, error: 'Not found' })

    return res.status(200).json({ success: true, message: 'Deleted successfully' })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to delete message' })
  }
})

export default router
