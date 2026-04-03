import type { VercelRequest, VercelResponse } from '@vercel/node'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const REDIRECT_URI = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/auth/callback`

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  return res.redirect(url)
}
