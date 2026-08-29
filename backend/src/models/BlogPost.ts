import mongoose, { Schema, type Document } from 'mongoose'
import { resolveUniqueSlug } from '../lib/slugify'

export interface IBlogPost extends Document {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  categories: string[]
  tags: string[]
  published: boolean
  slug?: string
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String },
    categories: { type: [{ type: String }], default: [] },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
)

BlogPostSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = await resolveUniqueSlug(mongoose.models.BlogPost, this.title, this._id, 'article')
  }
  next()
})

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
