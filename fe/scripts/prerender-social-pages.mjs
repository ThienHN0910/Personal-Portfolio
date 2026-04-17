import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const projectRoot = resolve(process.cwd())
const distDir = resolve(projectRoot, 'dist')

const SITE_NAME = 'ThienHN Portfolio'
const DEFAULT_TITLE = SITE_NAME
const DEFAULT_DESCRIPTION = 'Personal portfolio showcasing projects, technical skills, and blog posts.'
const DEFAULT_IMAGE = '/logo0004Croped.png'

function parseEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8')
    const result = {}
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return

      const equalIndex = trimmed.indexOf('=')
      if (equalIndex <= 0) return

      const key = trimmed.slice(0, equalIndex).trim()
      const value = trimmed.slice(equalIndex + 1).trim().replace(/^['\"]|['\"]$/g, '')
      result[key] = value
    })
    return result
  } catch {
    return {}
  }
}

function readEnv() {
  return {
    ...parseEnvFile(resolve(projectRoot, '.env')),
    ...parseEnvFile(resolve(projectRoot, '.env.local')),
    ...parseEnvFile(resolve(projectRoot, '.env.production')),
    ...parseEnvFile(resolve(projectRoot, '.env.production.local')),
    ...process.env,
  }
}

function resolveSiteUrl(env) {
  const candidate = env.VITE_SITE_URL || 'http://localhost:5173'
  try {
    return new URL(candidate).origin
  } catch {
    return 'http://localhost:5173'
  }
}

function resolveApiBaseUrl(env, siteUrl) {
  const configured = env.SEO_DATA_API_BASE_URL || env.VITE_API_BASE_URL || '/api'
  try {
    return new URL(configured).toString().replace(/\/$/, '')
  } catch {
    const withSlash = configured.startsWith('/') ? configured : `/${configured}`
    return new URL(withSlash, siteUrl).toString().replace(/\/$/, '')
  }
}

function toAbsoluteUrl(value, siteUrl) {
  if (!value) return new URL(DEFAULT_IMAGE, siteUrl).toString()
  try {
    return new URL(value).toString()
  } catch {
    const normalizedPath = value.startsWith('/') ? value : `/${value}`
    return new URL(normalizedPath, siteUrl).toString()
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function compactDescription(text) {
  const stripped = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!stripped) return DEFAULT_DESCRIPTION
  if (stripped.length <= 170) return stripped
  return `${stripped.slice(0, 167).trimEnd()}...`
}

function compactText(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickFirst(...values) {
  for (const value of values) {
    const normalized = compactText(value)
    if (normalized) return normalized
  }
  return ''
}

function pickFirstImage(...values) {
  for (const value of values) {
    const normalized = String(value || '').trim()
    if (normalized) return normalized
  }
  return ''
}

function sortByDateDesc(items = []) {
  return [...items].sort((a, b) => {
    const aTime = a?.createdAt ? Date.parse(a.createdAt) : 0
    const bTime = b?.createdAt ? Date.parse(b.createdAt) : 0
    return bTime - aTime
  })
}

function getPublishedPosts(posts = []) {
  return sortByDateDesc(toArray(posts).filter((post) => post?.published))
}

function getFeaturedProject(projects = []) {
  return [...toArray(projects)].sort((a, b) => {
    const featuredDiff = Number(Boolean(b?.featured)) - Number(Boolean(a?.featured))
    if (featuredDiff !== 0) return featuredDiff

    const priorityDiff = (b?.priority || 0) - (a?.priority || 0)
    if (priorityDiff !== 0) return priorityDiff

    const aTime = a?.createdAt ? Date.parse(a.createdAt) : 0
    const bTime = b?.createdAt ? Date.parse(b.createdAt) : 0
    return bTime - aTime
  })[0]
}

function summarizeKeywords(values, limit) {
  const unique = Array.from(
    new Set(
      toArray(values)
        .map((value) => compactText(value).toLowerCase())
        .filter(Boolean),
    ),
  )
  return unique.slice(0, limit).join(', ')
}

function buildPageTitle(title) {
  if (!title) return DEFAULT_TITLE
  if (title.includes(SITE_NAME)) return title
  return `${title} | ${SITE_NAME}`
}

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function buildPublicPageMetas({ siteUrl, homeData, aboutData, projects, posts }) {
  const publishedPosts = getPublishedPosts(posts)
  const latestPost = publishedPosts[0]
  const featuredProject = getFeaturedProject(projects)
  const firstProjectWithImage = toArray(projects).find((project) => project?.imageUrl)

  const projectsCount = toArray(projects).length
  const topTechnologies = summarizeKeywords(
    toArray(projects).flatMap((project) => toArray(project?.technologies)),
    4,
  )
  const topTags = summarizeKeywords(
    publishedPosts.flatMap((post) => toArray(post?.tags)),
    4,
  )

  const homeDescription =
    pickFirst(
      homeData?.heroDescription,
      aboutData?.bio,
      latestPost?.excerpt,
      latestPost?.content,
      featuredProject?.description,
    ) || DEFAULT_DESCRIPTION

  const aboutDescription =
    pickFirst(
      aboutData?.bio,
      aboutData?.experience?.[0]?.description,
      homeData?.heroDescription,
      latestPost?.excerpt,
    ) || 'Learn more about ThienHN, work experience, skills, education, and certifications.'

  const projectsDescription =
    pickFirst(
      featuredProject?.description,
      projectsCount ? `Explore ${projectsCount} projects${topTechnologies ? ` built with ${topTechnologies}` : ''}.` : '',
      homeData?.heroDescription,
    ) || 'Explore portfolio projects including live demos, source code, and technical details.'

  const blogDescription =
    pickFirst(
      latestPost?.excerpt,
      latestPost?.content,
      publishedPosts.length ? `Browse ${publishedPosts.length} blog posts${topTags ? ` about ${topTags}` : ''}.` : '',
      featuredProject?.description,
    ) || 'Read blog posts about web development, software engineering, and implementation notes.'

  const homeImage =
    pickFirstImage(
      homeData?.profileImage,
      aboutData?.avatarUrl,
      latestPost?.coverImage,
      featuredProject?.imageUrl,
      firstProjectWithImage?.imageUrl,
    ) || DEFAULT_IMAGE

  const aboutImage =
    pickFirstImage(
      aboutData?.avatarUrl,
      homeData?.profileImage,
      featuredProject?.imageUrl,
      latestPost?.coverImage,
    ) || DEFAULT_IMAGE

  const projectsImage =
    pickFirstImage(
      featuredProject?.imageUrl,
      firstProjectWithImage?.imageUrl,
      latestPost?.coverImage,
      aboutData?.avatarUrl,
      homeData?.profileImage,
    ) || DEFAULT_IMAGE

  const blogImage =
    pickFirstImage(
      latestPost?.coverImage,
      publishedPosts.find((post) => post?.coverImage)?.coverImage,
      featuredProject?.imageUrl,
      homeData?.profileImage,
      aboutData?.avatarUrl,
    ) || DEFAULT_IMAGE

  const contactImage = pickFirstImage(aboutData?.avatarUrl, homeData?.profileImage, featuredProject?.imageUrl) || DEFAULT_IMAGE
  const cvImage = pickFirstImage(aboutData?.avatarUrl, homeData?.profileImage, featuredProject?.imageUrl) || DEFAULT_IMAGE

  const contactDescription =
    pickFirst(
      aboutData?.bio,
      homeData?.heroDescription,
      [aboutData?.contactInfo?.email, aboutData?.contactInfo?.phone, aboutData?.contactInfo?.location]
        .filter(Boolean)
        .join(' | '),
    ) || 'Send a message for collaboration, freelance work, or technical discussion.'

  const cvDescription =
    pickFirst(
      aboutData?.title ? `${aboutData.title} - Curriculum Vitae.` : '',
      aboutData?.bio,
      homeData?.heroDescription,
    ) || 'View and download the latest CV of ThienHN.'

  return [
    {
      path: '/',
      title: 'Home',
      description: homeDescription,
      type: 'website',
      image: homeImage,
      siteUrl,
    },
    {
      path: '/about',
      title: 'About',
      description: aboutDescription,
      type: 'website',
      image: aboutImage,
      siteUrl,
    },
    {
      path: '/projects',
      title: 'Projects',
      description: projectsDescription,
      type: 'website',
      image: projectsImage,
      siteUrl,
    },
    {
      path: '/blog',
      title: 'Blog',
      description: blogDescription,
      type: 'website',
      image: blogImage,
      siteUrl,
    },
    {
      path: '/contact',
      title: 'Contact',
      description: contactDescription,
      type: 'website',
      image: contactImage,
      siteUrl,
    },
    {
      path: '/cv',
      title: aboutData?.name ? `${aboutData.name} CV` : 'CV',
      description: cvDescription,
      type: 'website',
      image: cvImage,
      siteUrl,
    },
  ]
}

function setTag(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement)
  }
  return html.replace('</head>', `  ${replacement}\n  </head>`)
}

function injectMeta(template, meta) {
  const title = buildPageTitle(meta.title)
  const description = compactDescription(meta.description)
  const canonicalUrl = toAbsoluteUrl(meta.path, meta.siteUrl)
  const imageUrl = toAbsoluteUrl(meta.image || DEFAULT_IMAGE, meta.siteUrl)
  const ogType = meta.type || 'website'

  let html = template
  html = setTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = setTag(html, /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
  html = setTag(html, /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?\s*>/i, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`)

  html = setTag(html, /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta property="og:type" content="${escapeHtml(ogType)}" />`)
  html = setTag(html, /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
  html = setTag(html, /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
  html = setTag(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`)
  html = setTag(html, /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`)
  html = setTag(html, /<meta\s+property="og:image:alt"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta property="og:image:alt" content="${escapeHtml(title)}" />`)

  html = setTag(html, /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
  html = setTag(html, /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
  html = setTag(html, /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?\s*>/i, `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`)

  return html
}

async function fetchData(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed ${response.status}: ${url}`)
  }

  const payload = await response.json()
  return payload?.data
}

function writePage(routePath, html) {
  const normalized = routePath.startsWith('/') ? routePath : `/${routePath}`
  const outputFile = normalized === '/'
    ? resolve(distDir, 'index.html')
    : resolve(distDir, normalized.slice(1), 'index.html')

  mkdirSync(dirname(outputFile), { recursive: true })
  writeFileSync(outputFile, html, 'utf8')
}

async function main() {
  const env = readEnv()
  const siteUrl = resolveSiteUrl(env)
  const apiBaseUrl = resolveApiBaseUrl(env, siteUrl)
  const indexPath = resolve(distDir, 'index.html')

  let template
  try {
    template = readFileSync(indexPath, 'utf8')
  } catch {
    console.warn('[seo:prerender] dist/index.html not found. Run vite build first.')
    return
  }

  let homeData = null
  let aboutData = null
  let projects = []
  let posts = []

  let dynamicCount = 0

  try {
    const [fetchedHome, fetchedAbout, fetchedProjects, fetchedPosts] = await Promise.all([
      fetchData(`${apiBaseUrl}/home`),
      fetchData(`${apiBaseUrl}/about`),
      fetchData(`${apiBaseUrl}/projects`),
      fetchData(`${apiBaseUrl}/blog`),
    ])

    homeData = fetchedHome && typeof fetchedHome === 'object' ? fetchedHome : null
    aboutData = fetchedAbout && typeof fetchedAbout === 'object' ? fetchedAbout : null
    projects = toArray(fetchedProjects)
    posts = toArray(fetchedPosts)
    const postsById = Object.fromEntries(posts.filter((post) => post?._id).map((post) => [post._id, post]))

    const pageMetas = buildPublicPageMetas({
      siteUrl,
      homeData,
      aboutData,
      projects,
      posts,
    })

    projects.forEach((project) => {
      if (!project?._id) return
      const relatedPost = project.relatedBlogId ? postsById[project.relatedBlogId] : null
      pageMetas.push({
        path: `/projects/${project._id}`,
        title: project.title || 'Project Detail',
        description: pickFirst(project.description, relatedPost?.excerpt, relatedPost?.content, homeData?.heroDescription) || DEFAULT_DESCRIPTION,
        type: 'article',
        image: pickFirstImage(project.imageUrl, relatedPost?.coverImage, homeData?.profileImage, aboutData?.avatarUrl) || DEFAULT_IMAGE,
        siteUrl,
      })
      dynamicCount += 1
    })

    posts.forEach((post) => {
      if (!post?._id) return
      pageMetas.push({
        path: `/blog/${post._id}`,
        title: post.title || 'Blog Post',
        description: pickFirst(post.excerpt, post.content, homeData?.heroDescription) || DEFAULT_DESCRIPTION,
        type: 'article',
        image: pickFirstImage(post.coverImage, getFeaturedProject(projects)?.imageUrl, homeData?.profileImage) || DEFAULT_IMAGE,
        siteUrl,
      })
      dynamicCount += 1
    })

    pageMetas.forEach((meta) => {
      const html = injectMeta(template, meta)
      writePage(meta.path, html)
    })

    console.log(`[seo:prerender] Generated ${pageMetas.length} SEO pages (${dynamicCount} dynamic) from ${apiBaseUrl}`)
    return
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[seo:prerender] API metadata unavailable, generating static fallback pages only: ${message}`)
  }

  const fallbackMetas = buildPublicPageMetas({
    siteUrl,
    homeData,
    aboutData,
    projects,
    posts,
  })

  fallbackMetas.forEach((meta) => {
    const html = injectMeta(template, meta)
    writePage(meta.path, html)
  })

  console.log(`[seo:prerender] Generated ${fallbackMetas.length} SEO pages (0 dynamic) from fallback metadata`)
}

void main()
