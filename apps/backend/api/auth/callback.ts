import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateToken } from '../lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_EMAIL_NORMALIZED = ADMIN_EMAIL.trim().toLowerCase()
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const REDIRECT_URI = `${API_BASE_URL}/api/auth/callback`

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  error?: string
}

interface GoogleUserInfo {
  sub: string
  email: string
  name: string
  picture: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error } = req.query

  if (typeof error === 'string') {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(error)}`)
  }

  if (!code || typeof code !== 'string') {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=auth_code_missing`)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json() as GoogleTokenResponse
    if (tokens.error) {
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(tokens.error)}`)
    }

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = await userInfoResponse.json() as GoogleUserInfo

    const role = userInfo.email.toLowerCase() === ADMIN_EMAIL_NORMALIZED ? 'admin' : 'user'
    const token = generateToken({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      role,
    })

    return res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`)
  } catch {
    return res.redirect(`${FRONTEND_URL}/auth/callback?error=auth_failed`)
  }
}
