import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const projectRoot = resolve(process.cwd())
const publicDir = resolve(projectRoot, 'public')

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

function resolveSiteUrl() {
  const envFileValues = {
    ...parseEnvFile(resolve(projectRoot, '.env')),
    ...parseEnvFile(resolve(projectRoot, '.env.local')),
    ...parseEnvFile(resolve(projectRoot, '.env.production')),
    ...parseEnvFile(resolve(projectRoot, '.env.production.local')),
  }

  const candidate = process.env.VITE_SITE_URL || envFileValues.VITE_SITE_URL || 'http://localhost:5173'

  try {
    const url = new URL(candidate)
    return url.origin
  } catch {
    return 'http://localhost:5173'
  }
}

function resolveApiBaseUrl(siteUrl) {
  const envFileValues = {
    ...parseEnvFile(resolve(projectRoot, '.env')),
    ...parseEnvFile(resolve(projectRoot, '.env.local')),
    ...parseEnvFile(resolve(projectRoot, '.env.production')),
    ...parseEnvFile(resolve(projectRoot, '.env.production.local')),
  }

  const configured =
    process.env.SEO_DATA_API_BASE_URL ||
    envFileValues.SEO_DATA_API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    envFileValues.VITE_API_BASE_URL ||
    '/api'

  try {
    return new URL(configured).toString().replace(/\/$/, '')
  } catch {
    const path = configured.startsWith('/') ? configured : `/${configured}`
    return new URL(path, siteUrl).toString().replace(/\/$/, '')
  }
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

function buildSitemap(siteUrl, dynamicRoutes = []) {
  const now = new Date().toISOString().slice(0, 10)
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/projects', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/cv', priority: '0.6', changefreq: 'monthly' },
  ]

  const normalizedDynamicRoutes = [...new Set(dynamicRoutes)]
    .filter((path) => typeof path === 'string' && path.startsWith('/'))
    .map((path) => ({ path, priority: '0.8', changefreq: 'weekly' }))

  const routes = [...staticRoutes, ...normalizedDynamicRoutes]

  const urlEntries = routes
    .map(({ path, priority, changefreq }) => {
      const loc = `${siteUrl}${path}`
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${now}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n')
}

function buildRobots(siteUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /auth/callback',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

async function main() {
  const siteUrl = resolveSiteUrl()
  const apiBaseUrl = resolveApiBaseUrl(siteUrl)
  let dynamicRoutes = []

  try {
    const [projectsData, postsData] = await Promise.all([
      fetchData(`${apiBaseUrl}/projects`),
      fetchData(`${apiBaseUrl}/blog`),
    ])

    const projects = Array.isArray(projectsData) ? projectsData : []
    const posts = Array.isArray(postsData) ? postsData : []

    dynamicRoutes = [
      ...projects.map((project) => ((project?.slug || project?._id) ? `/projects/${project.slug || project._id}` : '')).filter(Boolean),
      ...posts.map((post) => ((post?.slug || post?._id) ? `/blog/${post.slug || post._id}` : '')).filter(Boolean),
    ]
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[seo] Dynamic sitemap routes skipped: ${message}`)
  }

  const sitemap = buildSitemap(siteUrl, dynamicRoutes)
  const robots = buildRobots(siteUrl)

  mkdirSync(publicDir, { recursive: true })
  writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8')
  writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8')

  console.log(`[seo] Generated robots.txt and sitemap.xml for ${siteUrl} (${dynamicRoutes.length} dynamic routes)`)
}

void main()
