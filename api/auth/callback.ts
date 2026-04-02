import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateToken } from '../lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'
const REDIRECT_URI = `${BASE_URL}/api/auth/callback`

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
  const { code } = req.query

  if (!code || typeof code !== 'string') {
    return res.redirect(`${BASE_URL}/?error=auth_failed`)
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
      return res.redirect(`${BASE_URL}/?error=token_exchange_failed`)
    }

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = await userInfoResponse.json() as GoogleUserInfo

    const role = userInfo.email === ADMIN_EMAIL ? 'admin' : 'user'
    const token = generateToken({
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      role,
    })

    return res.redirect(`${BASE_URL}/auth/callback?token=${token}`)
  } catch {
    return res.redirect(`${BASE_URL}/?error=auth_failed`)
  }
}
