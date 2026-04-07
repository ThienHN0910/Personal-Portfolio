import mongoose, { Schema, type Document } from 'mongoose'

export interface IHome extends Document {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  ctaText: string
  ctaLink: string
  profileImage?: string
}

const HomeSchema = new Schema<IHome>(
  {
    heroTitle: { type: String, default: "Hi, I'm" },
    heroSubtitle: { type: String, default: 'A Full Stack Developer' },
    heroDescription: { type: String, default: 'Building modern web experiences.' },
    ctaText: { type: String, default: 'View My Work' },
    ctaLink: { type: String, default: '/projects' },
    profileImage: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Home || mongoose.model<IHome>('Home', HomeSchema)
