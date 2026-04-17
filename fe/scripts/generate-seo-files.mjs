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

function buildSitemap(siteUrl) {
  const now = new Date().toISOString().slice(0, 10)
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/projects', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/cv', priority: '0.6', changefreq: 'monthly' },
  ]

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

function main() {
  const siteUrl = resolveSiteUrl()
  const sitemap = buildSitemap(siteUrl)
  const robots = buildRobots(siteUrl)

  mkdirSync(publicDir, { recursive: true })
  writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8')
  writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8')

  console.log(`[seo] Generated robots.txt and sitemap.xml for ${siteUrl}`)
}

main()
