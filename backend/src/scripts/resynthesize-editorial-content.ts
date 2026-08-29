import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Project from '../models/Project'
import BlogPost from '../models/BlogPost'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in backend/.env')
  process.exit(1)
}

function transformProjectDossier(rawHtml: string): string {
  if (!rawHtml || !rawHtml.trim()) return ''

  let html = rawHtml.trim()

  // 1. Upgrade headings
  html = html.replace(/<h2(?![^>]*class=)[^>]*>(.*?)<\/h2>/gi, '<h2 class="project-h2">$1</h2>')
  html = html.replace(/<h3(?![^>]*class=)[^>]*>(.*?)<\/h3>/gi, '<h3 class="project-h3">$1</h3>')

  // 2. Upgrade lead paragraph (first <p>)
  html = html.replace(/<p(?![^>]*class=)[^>]*>(.*?)<\/p>/i, '<p class="project-lead">$1</p>')

  // 3. Upgrade subsequent paragraphs
  html = html.replace(/<p(?![^>]*class=)[^>]*>(.*?)<\/p>/gi, '<p class="project-p">$1</p>')

  // 4. Upgrade blockquotes to pullquotes
  html = html.replace(/<blockquote(?![^>]*class=)[^>]*>(.*?)<\/blockquote>/gi, '<blockquote class="article-pullquote">$1</blockquote>')

  // 5. Upgrade lists
  html = html.replace(/<ul(?![^>]*class=)[^>]*>(.*?)<\/ul>/gi, '<ul class="article-list">$1</ul>')

  // 6. Upgrade tables
  html = html.replace(/<table(?![^>]*class=)[^>]*>(.*?)<\/table>/gi, '<table class="project-spec-table">$1</table>')

  // 7. Upgrade pre/code blocks
  html = html.replace(/<pre(?![^>]*class=)[^>]*>(.*?)<\/pre>/gi, '<pre class="project-codeblock">$1</pre>')

  // 8. Transform sections into architecture callouts if plain
  html = html.replace(/<section class="deep-dive">/gi, '<div class="project-architecture-callout">')
  html = html.replace(/<\/section>/gi, '</div>')

  return html
}

function transformArticleContent(rawHtml: string): string {
  if (!rawHtml || !rawHtml.trim()) return ''

  let html = rawHtml.trim()

  // 1. Upgrade headings
  html = html.replace(/<h1(?![^>]*class=)[^>]*>(.*?)<\/h1>/gi, '<h1 class="article-hero-title">$1</h1>')
  html = html.replace(/<h2(?![^>]*class=)[^>]*>(.*?)<\/h2>/gi, '<h2 class="article-h2">$1</h2>')
  html = html.replace(/<h3(?![^>]*class=)[^>]*>(.*?)<\/h3>/gi, '<h3 class="article-h3">$1</h3>')

  // 2. Upgrade lead paragraph
  html = html.replace(/<p(?![^>]*class=)[^>]*>(.*?)<\/p>/i, '<p class="article-lead">$1</p>')

  // 3. Upgrade standard paragraphs
  html = html.replace(/<p(?![^>]*class=)[^>]*>(.*?)<\/p>/gi, '<p class="article-p">$1</p>')

  // 4. Upgrade pullquotes
  html = html.replace(/<blockquote(?![^>]*class=)[^>]*>(.*?)<\/blockquote>/gi, '<blockquote class="article-pullquote">$1</blockquote>')

  // 5. Upgrade lists
  html = html.replace(/<ul(?![^>]*class=)[^>]*>(.*?)<\/ul>/gi, '<ul class="article-list">$1</ul>')

  // 6. Upgrade tables
  html = html.replace(/<table(?![^>]*class=)[^>]*>(.*?)<\/table>/gi, '<table class="article-table">$1</table>')

  // 7. Upgrade pre/code blocks
  html = html.replace(/<pre(?![^>]*class=)[^>]*>(.*?)<\/pre>/gi, '<pre class="article-codeblock">$1</pre>')

  return html
}

async function synthesizeWithAi(prompt: string, content: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(`${prompt}\n\nCONTENT:\n${content}`)
    const response = await result.response
    let text = response.text()
    return text.replace(/^```html\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()
  } catch {
    return null
  }
}

async function run(): Promise<void> {
  console.log('🚀 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✓ Connected to MongoDB.')

  try {
    // 1. Process Projects
    const projects = await Project.find()
    console.log(`\nFound ${projects.length} project(s) to process...`)

    let updatedProjects = 0
    for (const proj of projects) {
      const source = proj.context || proj.description || ''
      if (!source) continue

      // Attempt AI or programmatic transformation
      let enriched = await synthesizeWithAi('Transform to avant-garde design system HTML dossier', source)
      if (!enriched) {
        enriched = transformProjectDossier(source)
      }

      if (enriched && enriched !== proj.context) {
        proj.context = enriched
        await proj.save()
        updatedProjects++
        console.log(`  ✓ Updated context dossier for: "${proj.title}"`)
      }
    }
    console.log(`✓ Processed ${updatedProjects}/${projects.length} project(s).`)

    // 2. Process Blog Posts
    const articles = await BlogPost.find()
    console.log(`\nFound ${articles.length} article(s) to process...`)

    let updatedArticles = 0
    for (const art of articles) {
      const source = art.content || ''
      if (!source) continue

      let enriched = await synthesizeWithAi('Transform to avant-garde design system HTML article', source)
      if (!enriched) {
        enriched = transformArticleContent(source)
      }

      if (enriched && enriched !== art.content) {
        art.content = enriched
        await art.save()
        updatedArticles++
        console.log(`  ✓ Updated article content for: "${art.title}"`)
      }
    }
    console.log(`✓ Processed ${updatedArticles}/${articles.length} article(s).`)

    console.log('\n🎉 Re-synthesis & Design System Migration completed successfully!')
  } catch (error) {
    console.error('Fatal error during content migration:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB.')
  }
}

run().catch(console.error)
