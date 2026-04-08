export interface Project {
  _id?: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  relatedBlogId?: string
  featured: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BlogPost {
  _id?: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  tags: string[]
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ContactMessage {
  _id?: string
  name: string
  email: string
  subject: string
  message: string
  createdAt?: string
}

export interface AboutData {
  _id?: string
  name: string
  title: string
  bio: string
  contactInfo: ContactInfo
  skills: string[]
  experience: Experience[]
  education: Education[]
  avatarUrl?: string
  resumeUrl?: string
  socialLinks: SocialLinks
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate?: string
  // Rich text HTML from CKEditor.
  description: string
}

export interface ContactInfo {
  email?: string
  phone?: string
  location?: string
  website?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  email?: string
}

export interface HomeData {
  _id?: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  ctaText: string
  ctaLink: string
  profileImage?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
