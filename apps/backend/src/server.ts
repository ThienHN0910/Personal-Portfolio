import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import cors from 'cors'

import aboutHandler from '../api/about'
import blogHandler from '../api/blog'
import blogByIdHandler from '../api/blog/[id]'
import contactHandler from '../api/contact'
import contactByIdHandler from '../api/contact/[id]'
import homeHandler from '../api/home'
import projectsHandler from '../api/projects'
import projectsByIdHandler from '../api/projects/[id]'
import uploadHandler from '../api/upload'
import authGoogleHandler from '../api/auth/google'
import authCallbackHandler from '../api/auth/callback'

const app = express()
const port = Number(process.env.PORT || 3000)

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
app.use(
  cors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }),
)
app.use(express.json({ limit: '10mb' }))

function adapt(handler: (req: any, res: any) => any, withId = false) {
  return async (req: Request, res: Response) => {
    if (withId && req.params.id) {
      ;(req as any).query = { ...(req.query || {}), id: req.params.id }
    }
    return handler(req as any, res as any)
  }
}

app.get('/health', (_req, res) => res.json({ ok: true }))

app.all('/api/about', adapt(aboutHandler))
app.all('/api/blog', adapt(blogHandler))
app.all('/api/blog/:id', adapt(blogByIdHandler, true))
app.all('/api/contact', adapt(contactHandler))
app.all('/api/contact/:id', adapt(contactByIdHandler, true))
app.all('/api/home', adapt(homeHandler))
app.all('/api/projects', adapt(projectsHandler))
app.all('/api/projects/:id', adapt(projectsByIdHandler, true))
app.all('/api/upload', adapt(uploadHandler))
app.all('/api/auth/google', adapt(authGoogleHandler))
app.all('/api/auth/callback', adapt(authCallbackHandler))

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`)
})
