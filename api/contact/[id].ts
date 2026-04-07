import type { VercelRequest, VercelResponse } from '@vercel/node'
import { connectToDatabase } from '../lib/mongodb'
import Contact from '../models/Contact'
import { requireAdmin } from '../lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query
  await connectToDatabase()

  if (req.method === 'DELETE') {
    const user = requireAdmin(req, res)
    if (!user) return

    try {
      const message = await Contact.findByIdAndDelete(id)
      if (!message) return res.status(404).json({ success: false, error: 'Not found' })
      return res.status(200).json({ success: true, message: 'Deleted successfully' })
    } catch {
      return res.status(500).json({ success: false, error: 'Failed to delete message' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
