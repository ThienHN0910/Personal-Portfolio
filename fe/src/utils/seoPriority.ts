import type { AboutData, BlogPost, HomeData, Project } from '@/types'
import type { SeoMetaInput } from '@/utils/seo'

const DEFAULT_HOME_DESCRIPTION =
  'Portfolio of ThienHN featuring selected projects, technical profile, and latest updates.'
const DEFAULT_ABOUT_DESCRIPTION =
  'Learn more about ThienHN, work experience, skills, education, and certifications.'
const DEFAULT_PROJECTS_DESCRIPTION =
  'Explore portfolio projects including live demos, source code, and technical details.'
const DEFAULT_BLOG_DESCRIPTION =
  'Read blog posts about web development, software engineering, and implementation notes.'
const DEFAULT_CONTACT_DESCRIPTION =
  'Send a message for collaboration, freelance work, or technical discussion.'
const DEFAULT_CV_DESCRIPTION = 'View and download the latest CV of ThienHN.'

type SeoContext = {
  home?: HomeData | null
  about?: AboutData | null
  projects?: Project[]
  posts?: BlogPost[]
}

function compactText(input?: string): string {
  if (!input) return ''
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickFirst(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    const normalized = compactText(value || '')
    if (normalized) return normalized
  }
  return ''
}

function pickFirstImage(...values: Array<string | undefined | null>): string | undefined {
  for (const value of values) {
    const normalized = (value || '').trim()
    if (normalized) return normalized
  }
  return undefined
}

function sortByDateDesc<T extends { createdAt?: string }>(items: T[] = []): T[] {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0
    return bTime - aTime
  })
}

function getPublishedPosts(posts: BlogPost[] = []): BlogPost[] {
  return sortByDateDesc(posts.filter((post) => post.published))
}

function getFeaturedProject(projects: Project[] = []): Project | undefined {
  return [...projects].sort((a, b) => {
    const featuredDiff = Number(b.featured) - Number(a.featured)
    if (featuredDiff !== 0) return featuredDiff

    const priorityDiff = (b.priority || 0) - (a.priority || 0)
    if (priorityDiff !== 0) return priorityDiff

    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0
    return bTime - aTime
  })[0]
}

function summarizeKeywords(values: string[], limit: number): string {
  const unique = Array.from(new Set(values.map((value) => compactText(value).toLowerCase()).filter(Boolean)))
  return unique.slice(0, limit).join(', ')
}

export function getHomeSeoMeta(context: SeoContext): SeoMetaInput {
  const projects = context.projects || []
  const posts = getPublishedPosts(context.posts || [])
  const featuredProject = getFeaturedProject(projects)
  const latestPost = posts[0]

  const description = pickFirst(
    context.home?.heroDescription,
    context.about?.bio,
    latestPost?.excerpt,
    latestPost?.content,
    featuredProject?.description,
  ) || DEFAULT_HOME_DESCRIPTION

  const image = pickFirstImage(
    context.home?.profileImage,
    context.about?.avatarUrl,
    latestPost?.coverImage,
    featuredProject?.imageUrl,
    projects.find((project) => project.imageUrl)?.imageUrl,
  )

  return {
    title: 'Home',
    description,
    image,
    type: 'website',
  }
}

export function getAboutSeoMeta(context: SeoContext): SeoMetaInput {
  const featuredProject = getFeaturedProject(context.projects || [])
  const latestPost = getPublishedPosts(context.posts || [])[0]

  const description = pickFirst(
    context.about?.bio,
    context.about?.experience?.[0]?.description,
    context.home?.heroDescription,
    latestPost?.excerpt,
    featuredProject?.description,
  ) || DEFAULT_ABOUT_DESCRIPTION

  const image = pickFirstImage(
    context.about?.avatarUrl,
    context.home?.profileImage,
    featuredProject?.imageUrl,
    latestPost?.coverImage,
  )

  const title = context.about?.name ? `${context.about.name} - About` : 'About'

  return {
    title,
    description,
    image,
    type: 'website',
  }
}

export function getProjectsSeoMeta(context: SeoContext): SeoMetaInput {
  const projects = context.projects || []
  const featuredProject = getFeaturedProject(projects)
  const latestPost = getPublishedPosts(context.posts || [])[0]
  const technologies = summarizeKeywords(projects.flatMap((project) => project.technologies || []), 4)

  const dynamicSummary = projects.length
    ? `Explore ${projects.length} projects${technologies ? ` built with ${technologies}` : ''}.`
    : ''

  const description = pickFirst(
    featuredProject?.description,
    dynamicSummary,
    context.home?.heroDescription,
    context.about?.bio,
  ) || DEFAULT_PROJECTS_DESCRIPTION

  const image = pickFirstImage(
    featuredProject?.imageUrl,
    projects.find((project) => project.imageUrl)?.imageUrl,
    latestPost?.coverImage,
    context.home?.profileImage,
    context.about?.avatarUrl,
  )

  return {
    title: 'Projects',
    description,
    image,
    type: 'website',
  }
}

export function getProjectDetailSeoMeta(project: Project, relatedPost?: BlogPost | null): SeoMetaInput {
  const description = pickFirst(project.description, relatedPost?.excerpt, relatedPost?.content) || DEFAULT_PROJECTS_DESCRIPTION

  const image = pickFirstImage(project.imageUrl, relatedPost?.coverImage)

  return {
    title: project.title,
    description,
    image,
    type: 'article',
  }
}

export function getBlogSeoMeta(context: SeoContext): SeoMetaInput {
  const posts = getPublishedPosts(context.posts || [])
  const latestPost = posts[0]
  const featuredProject = getFeaturedProject(context.projects || [])
  const tags = summarizeKeywords(posts.flatMap((post) => post.tags || []), 4)
  const dynamicSummary = posts.length ? `Browse ${posts.length} blog posts${tags ? ` about ${tags}` : ''}.` : ''

  const description = pickFirst(
    latestPost?.excerpt,
    latestPost?.content,
    dynamicSummary,
    featuredProject?.description,
    context.home?.heroDescription,
  ) || DEFAULT_BLOG_DESCRIPTION

  const image = pickFirstImage(
    latestPost?.coverImage,
    posts.find((post) => post.coverImage)?.coverImage,
    featuredProject?.imageUrl,
    context.home?.profileImage,
    context.about?.avatarUrl,
  )

  return {
    title: 'Blog',
    description,
    image,
    type: 'website',
  }
}

export function getBlogDetailSeoMeta(post: BlogPost): SeoMetaInput {
  const description = pickFirst(post.excerpt, post.content) || DEFAULT_BLOG_DESCRIPTION
  const image = pickFirstImage(post.coverImage)

  return {
    title: post.title,
    description,
    image,
    type: 'article',
  }
}

export function getContactSeoMeta(context: SeoContext): SeoMetaInput {
  const contactInfo = context.about?.contactInfo
  const contactHints = [contactInfo?.email, contactInfo?.phone, contactInfo?.location].filter(Boolean).join(' | ')

  const description = pickFirst(
    context.about?.bio,
    context.home?.heroDescription,
    contactHints,
  ) || DEFAULT_CONTACT_DESCRIPTION

  const image = pickFirstImage(
    context.about?.avatarUrl,
    context.home?.profileImage,
    getFeaturedProject(context.projects || [])?.imageUrl,
    getPublishedPosts(context.posts || [])[0]?.coverImage,
  )

  return {
    title: 'Contact',
    description,
    image,
    type: 'website',
  }
}

export function getCvSeoMeta(context: SeoContext): SeoMetaInput {
  const personName = compactText(context.about?.name)
  const title = personName ? `${personName} CV` : 'CV'

  const description = pickFirst(
    context.about?.title ? `${context.about.title} - Curriculum Vitae.` : '',
    context.about?.bio,
    context.home?.heroDescription,
  ) || DEFAULT_CV_DESCRIPTION

  const image = pickFirstImage(
    context.about?.avatarUrl,
    context.home?.profileImage,
    getFeaturedProject(context.projects || [])?.imageUrl,
  )

  return {
    title,
    description,
    image,
    type: 'website',
  }
}
