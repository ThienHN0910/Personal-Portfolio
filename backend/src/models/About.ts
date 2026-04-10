import mongoose, { Schema, type Document } from 'mongoose'

export interface IAbout extends Document {
  name: string
  title: string
  bio: string
  contactInfo: {
    email?: string
    phone?: string
    location?: string
    website?: string
  }
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
    gpa?: string
    startDate: string
    endDate?: string
  }[]
  licensesCertifications: {
    name: string
    issuer: string
    issueDate: string
    expirationDate?: string
    credentialId?: string
    credentialUrl?: string
  }[]
  avatarUrl?: string
  resumeUrl?: string
  socialLinks: {
    label: string
    url: string
  }[]
}

const AboutSchema = new Schema<IAbout>(
  {
    name: { type: String, required: true, default: '' },
    title: { type: String, required: true, default: '' },
    bio: { type: String, default: '' },
    contactInfo: {
      email: String,
      phone: String,
      location: String,
      website: String,
    },
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
        gpa: String,
        startDate: String,
        endDate: String,
      },
    ],
    licensesCertifications: [
      {
        name: String,
        issuer: String,
        issueDate: String,
        expirationDate: String,
        credentialId: String,
        credentialUrl: String,
      },
    ],
    avatarUrl: { type: String },
    resumeUrl: { type: String },
    socialLinks: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema)
