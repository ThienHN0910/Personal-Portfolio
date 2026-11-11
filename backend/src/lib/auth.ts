import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  email: string
  name: string
  /** Only the ADMIN_EMAIL owner can sign in; older tokens may still carry 'user'. */
  role: 'admin'
}

function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }
  return jwtSecret
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, getJwtSecret()) as AuthUser
}

export function requireAuth(req: Request, res: Response): AuthUser | null {
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

/** Non-failing check used by public routes that reveal extra data to the owner. */
export function isAdminRequest(req: Request): boolean {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return false
  try {
    return verifyToken(authHeader.slice(7)).role === 'admin'
  } catch {
    return false
  }
}

export function requireAdmin(req: Request, res: Response): AuthUser | null {
  const user = requireAuth(req, res)
  if (!user) return null

  if (user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden' })
    return null
  }

  return user
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: '7d' })
}
