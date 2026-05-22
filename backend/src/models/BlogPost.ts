import mongoose, { Schema, type Document } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  categories: string[]
  tags: string[]
  published: boolean
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
  },
  { timestamps: true },
)

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
