export interface Project {
  _id?: string
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
  createdAt?: string
  updatedAt?: string
}

export interface BlogPost {
  _id?: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  categories: string[]
  tags: string[]
  published: boolean
  slug?: string
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

export interface CategorySettings {
  _id?: string
  projectCategories: string[]
  blogCategories: string[]
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
  pagination?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
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

export interface IpInfoData {
  city?: string
  region?: string
  country?: string
  countryCode?: string
  org?: string
  loc?: string
  timezone?: string
  isBogon?: boolean
}

export interface VisitorLogItem {
  _id: string
  ip: string
  path: string
  userAgent?: string
  referrer?: string
  fromCompany?: string
  ipInfo?: IpInfoData
  createdAt: string
}

export interface GroupedIpItem {
  ip: string
  totalViews: number
  firstSeen: string
  lastSeen: string
  companies: string[]
  ipInfo?: IpInfoData
  latestUserAgent?: string
  history: Array<{
    _id: string
    path: string
    referrer?: string
    userAgent?: string
    fromCompany?: string
    createdAt: string
  }>
}

export interface AnalyticsStats {
  totalViews: number
  uniqueVisitors: number
  viewsPast24h: number
  companyViews: number
  topPages: Array<{ path: string; count: number }>
  topCompanies: Array<{ company: string; count: number; lastVisit?: string }>
}


