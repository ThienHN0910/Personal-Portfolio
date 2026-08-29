import mongoose, { Schema, type Document } from 'mongoose'
import { resolveUniqueSlug } from '../lib/slugify'

export interface IProject extends Document {
  title: string
  description: string
  context?: string
  duration?: string
  priority?: number
  categories: string[]
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  slug?: string
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    context: { type: String },
    duration: { type: String },
    priority: { type: Number, default: 0 },
    categories: { type: [{ type: String }], default: [] },
    technologies: [{ type: String }],
    imageUrl: { type: String },
    githubUrl: { type: String },
    liveUrl: { type: String },
    featured: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
)

ProjectSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = await resolveUniqueSlug(mongoose.models.Project, this.title, this._id, 'project')
  }
  next()
})

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
