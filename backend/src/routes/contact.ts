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
    const { name, email, subject, message, cfTurnstileResponse } = req.body as {
      name?: string
      email?: string
      subject?: string
      message?: string
      cfTurnstileResponse?: string
    }

    if (!name || !email || !subject || !message || !cfTurnstileResponse) {
      return res.status(400).json({ success: false, error: 'All fields and CAPTCHA are required' })
    }

    if (message.length > 2000) {
      return res.status(400).json({ success: false, error: 'Message cannot exceed 2000 characters' })
    }

    // Verify Turnstile
    const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY
    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is not defined')
      return res.status(500).json({ success: false, error: 'Server configuration error' })
    }

    const formData = new URLSearchParams()
    formData.append('secret', TURNSTILE_SECRET_KEY)
    formData.append('response', cfTurnstileResponse)

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const turnstileData = await turnstileRes.json()
    if (!turnstileData.success) {
      return res.status(400).json({ success: false, error: 'CAPTCHA verification failed' })
    }

    // Check queue limit
    const unreadCount = await Contact.countDocuments({ isRead: false })
    if (unreadCount >= 20) {
      return res.status(400).json({ success: false, error: 'Hệ thống đang quá tải (hàng đợi đã đầy 20 tin). Vui lòng thử lại sau.' })
    }

    await Contact.create({ name, email, subject, message })
    return res.status(201).json({ success: true, message: 'Message sent successfully' })
  } catch (err) {
    console.error('Contact post error:', err)
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
