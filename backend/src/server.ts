import cors from 'cors'
import dotenv from 'dotenv'
import express, { type NextFunction, type Request, type Response } from 'express'
import fs from 'node:fs'
import path from 'node:path'

import aboutRouter from './routes/about'
import authRouter from './routes/auth'
import blogRouter from './routes/blog'
import contactRouter from './routes/contact'
import homeRouter from './routes/home'
import projectsRouter from './routes/projects'
import categoriesRouter from './routes/categories'
import themeRouter from './routes/theme'
import uploadRouter from './routes/upload'
import aiRouter from './routes/ai'
import analyticsRouter from './routes/analytics'
import weatherRouter from './routes/weather'

const backendEnvPath = path.resolve(process.cwd(), '.env')
const rootEnvPath = path.resolve(process.cwd(), '..', '.env')

if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath })
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath })
} else {
  dotenv.config()
}

const app = express()
const port = Number(process.env.PORT || 3000)

// Disable ETag generation to prevent 304 Not Modified without CORS headers on Vercel Edge
app.disable('etag')
app.set('etag', false)

// Always force no-cache on API responses so stale 304s are never returned
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
})

const allowedOrigins = [
  'https://thienhn.io.vn',
  'https://thienhn0910.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach((o) => {
    const trimmed = o.trim().replace(/\/$/, '')
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed)
    }
  })
}

if (process.env.FRONTEND_URL) {
  const trimmed = process.env.FRONTEND_URL.trim().replace(/\/$/, '')
  if (trimmed && !allowedOrigins.includes(trimmed)) {
    allowedOrigins.push(trimmed)
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const cleanOrigin = origin.trim().replace(/\/$/, '')
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.endsWith('thienhn.io.vn')
      ) {
        return callback(null, cleanOrigin)
      }
      return callback(null, cleanOrigin)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, status: 'ok' })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, status: 'ok' })
})

app.use('/api/about', aboutRouter)
app.use('/api/auth', authRouter)
app.use('/api/blog', blogRouter)
app.use('/api/contact', contactRouter)
app.use('/api/home', homeRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/theme', themeRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/ai', aiRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/weather', weatherRouter)

app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`)
})
