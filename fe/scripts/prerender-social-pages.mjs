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

function buildPageTitle(title) {
  if (!title) return DEFAULT_TITLE
  if (title.includes(SITE_NAME)) return title
  return `${title} | ${SITE_NAME}`
}

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function pickFirstImage(items, key) {
  return toArray(items).find((item) => item && item[key])?.[key] || ''
}

function buildPublicPageMetas({ siteUrl, homeData, aboutData, projects, posts }) {
  const homeDescription = homeData?.heroDescription || DEFAULT_DESCRIPTION
  const aboutDescription = aboutData?.bio || 'Learn more about ThienHN, work experience, skills, education, and certifications.'
  const featuredProjectImage =
    toArray(projects).find((project) => project?.featured && project?.imageUrl)?.imageUrl ||
    pickFirstImage(projects, 'imageUrl')
  const latestPostImage = pickFirstImage(posts, 'coverImage')
  const homeImage = homeData?.profileImage || aboutData?.avatarUrl || featuredProjectImage || latestPostImage || DEFAULT_IMAGE
  const aboutImage = aboutData?.avatarUrl || homeData?.profileImage || featuredProjectImage || DEFAULT_IMAGE
  const projectsImage = featuredProjectImage || latestPostImage || homeImage || DEFAULT_IMAGE
  const blogImage = latestPostImage || featuredProjectImage || homeImage || DEFAULT_IMAGE
  const contactImage = aboutData?.avatarUrl || homeData?.profileImage || DEFAULT_IMAGE
  const cvImage = aboutData?.avatarUrl || homeData?.profileImage || DEFAULT_IMAGE

  const projectsCount = toArray(projects).length
  const projectsDescription = projectsCount
    ? `Explore ${projectsCount} portfolio projects including live demos, source code, and technical details.`
    : 'Explore portfolio projects including live demos, source code, and technical details.'

  const latestPost = toArray(posts)[0]
  const blogDescription = latestPost?.excerpt || 'Read blog posts about web development, software engineering, and implementation notes.'

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
      description: 'Send a message for collaboration, freelance work, or technical discussion.',
      type: 'website',
      image: contactImage,
      siteUrl,
    },
    {
      path: '/cv',
      title: 'CV',
      description: 'View and download the latest CV of ThienHN.',
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

    const pageMetas = buildPublicPageMetas({
      siteUrl,
      homeData,
      aboutData,
      projects,
      posts,
    })

    projects.forEach((project) => {
      if (!project?._id) return
      pageMetas.push({
        path: `/projects/${project._id}`,
        title: project.title || 'Project Detail',
        description: project.description || DEFAULT_DESCRIPTION,
        type: 'article',
        image: project.imageUrl || DEFAULT_IMAGE,
        siteUrl,
      })
      dynamicCount += 1
    })

    posts.forEach((post) => {
      if (!post?._id) return
      pageMetas.push({
        path: `/blog/${post._id}`,
        title: post.title || 'Blog Post',
        description: post.excerpt || post.content || DEFAULT_DESCRIPTION,
        type: 'article',
        image: post.coverImage || DEFAULT_IMAGE,
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
