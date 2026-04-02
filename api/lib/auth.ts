import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, JWT_SECRET) as AuthUser
}

export function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
): AuthUser | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized' })
    return null
  }

  const token = authHeader.slice(7)
  try {
    return verifyToken(token)
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
    return null
  }
}

export function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
): AuthUser | null {
  const user = requireAuth(req, res)
  if (!user) return null
  if (user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden' })
    return null
  }
  return user
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}
