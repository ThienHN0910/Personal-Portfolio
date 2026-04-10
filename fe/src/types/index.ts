export interface Project {
  _id?: string
  title: string
  description: string
  duration?: string
  priority?: number
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
  licensesCertifications: LicenseCertification[]
  avatarUrl?: string
  resumeUrl?: string
  socialLinks: SocialLink[]
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
  gpa?: string
  startDate: string
  endDate?: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface LicenseCertification {
  name: string
  issuer: string
  issueDate: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
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

export interface ThemeSettings {
  _id?: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundFrom: string
  backgroundTo: string
  surfaceFrom: string
  surfaceTo: string
  headingGradientFrom: string
  headingGradientTo: string
  textPrimary: string
  textMuted: string
  useAnimatedGlow: boolean
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
