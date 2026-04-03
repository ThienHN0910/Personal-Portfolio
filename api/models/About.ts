import mongoose, { Schema, type Document } from 'mongoose'

export interface IAbout extends Document {
  name: string
  title: string
  bio: string
  skills: string[]
  experience: {
    company: string
    position: string
    startDate: string
    endDate?: string
    description: string
  }[]
  education: {
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
  }[]
  avatarUrl?: string
  resumeUrl?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
}

const AboutSchema = new Schema<IAbout>(
  {
    name: { type: String, required: true, default: '' },
    title: { type: String, required: true, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
      },
    ],
    avatarUrl: { type: String },
    resumeUrl: { type: String },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      email: String,
    },
  },
  { timestamps: true },
)

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema)
