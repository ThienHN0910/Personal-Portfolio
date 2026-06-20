import mongoose, { Schema, type Document } from 'mongoose'
import { generateSlug } from '../lib/slugify'

export interface IProject extends Document {
  title: string
  description: string
  duration?: string
  priority: number
  categories: string[]
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  relatedBlogId?: string
  featured: boolean
  slug?: string
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: String, trim: true },
    priority: { type: Number, default: 0 },
    categories: { type: [{ type: String }], default: [] },
    technologies: [{ type: String }],
    imageUrl: { type: String },
    githubUrl: { type: String },
    liveUrl: { type: String },
    relatedBlogId: { type: Schema.Types.ObjectId, ref: 'BlogPost' },
    featured: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
)

ProjectSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = generateSlug(this.title)
    if (!baseSlug) baseSlug = 'project'
    let currentSlug = baseSlug
    let counter = 1
    
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await mongoose.models.Project.findOne({ slug: currentSlug, _id: { $ne: this._id } })
      if (!existing) {
        this.slug = currentSlug
        break
      }
      currentSlug = `${baseSlug}-${counter}`
      counter++
    }
  }
  next()
})

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
