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
import uploadRouter from './routes/upload'

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

app.use(cors({ origin: true, credentials: true }))
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
app.use('/api/upload', uploadRouter)

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
