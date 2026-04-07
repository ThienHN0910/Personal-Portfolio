import mongoose, { Schema, type Document } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  relatedBlogId?: string
  featured: boolean
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    imageUrl: { type: String },
    githubUrl: { type: String },
    liveUrl: { type: String },
    relatedBlogId: { type: Schema.Types.ObjectId, ref: 'BlogPost' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
