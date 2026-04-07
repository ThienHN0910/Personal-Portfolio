import { Router, type Request } from 'express'

import { generateToken } from '../lib/auth'

const router = Router()

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  error?: string
}

interface GoogleUserInfo {
  sub?: string
  id?: string
  email: string
  name: string
  picture?: string
}

function normalizeUrl(input: string): string {
  return input.endsWith('/') ? input.slice(0, -1) : input
}

function getApiBaseUrl(req: Request): string {
  const configuredApiBaseUrl = process.env.API_BASE_URL
  if (configuredApiBaseUrl) {
    return normalizeUrl(configuredApiBaseUrl)
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    const fullVercelUrl = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`
    return normalizeUrl(fullVercelUrl)
  }

  return `${req.protocol}://${req.get('host')}`
}

function getFrontendBaseUrl(): string {
  const configuredFrontendUrl = process.env.FRONTEND_URL
  if (configuredFrontendUrl) {
    return normalizeUrl(configuredFrontendUrl)
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    const fullVercelUrl = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`
    return normalizeUrl(fullVercelUrl)
  }

  return 'http://localhost:5173'
}

router.get('/google', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID

  if (!googleClientId) {
    return res.status(500).json({ success: false, error: 'GOOGLE_CLIENT_ID is not configured' })
  }

  const apiBaseUrl = getApiBaseUrl(req)
  const redirectUri = `${apiBaseUrl}/api/auth/callback`

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})

router.get('/callback', async (req, res) => {
  const frontendBaseUrl = getFrontendBaseUrl()
  const code = req.query.code
  const error = req.query.error

  if (typeof error === 'string') {
    return res.redirect(`${frontendBaseUrl}/auth/callback?error=${encodeURIComponent(error)}`)
  }

  if (!code || typeof code !== 'string') {
    return res.redirect(`${frontendBaseUrl}/auth/callback?error=auth_code_missing`)
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!googleClientId || !googleClientSecret) {
    return res.redirect(`${frontendBaseUrl}/auth/callback?error=google_oauth_not_configured`)
  }

  const apiBaseUrl = getApiBaseUrl(req)
  const redirectUri = `${apiBaseUrl}/api/auth/callback`

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = (await tokenResponse.json()) as GoogleTokenResponse
    if (tokens.error || !tokens.access_token) {
      const oauthError = tokens.error || 'token_exchange_failed'
      return res.redirect(`${frontendBaseUrl}/auth/callback?error=${encodeURIComponent(oauthError)}`)
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = (await userInfoResponse.json()) as GoogleUserInfo
    const googleUserId = userInfo.sub || userInfo.id
    if (!googleUserId || !userInfo.email || !userInfo.name) {
      return res.redirect(`${frontendBaseUrl}/auth/callback?error=invalid_google_userinfo`)
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const role = userInfo.email.toLowerCase() === adminEmail ? 'admin' : 'user'

    const token = generateToken({
      id: googleUserId,
      email: userInfo.email,
      name: userInfo.name,
      role,
    })

    return res.redirect(`${frontendBaseUrl}/auth/callback?token=${encodeURIComponent(token)}`)
  } catch {
    return res.redirect(`${frontendBaseUrl}/auth/callback?error=auth_failed`)
  }
})

export default router
