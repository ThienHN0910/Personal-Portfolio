import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

// Load environment variables
const backendEnvPath = path.resolve(process.cwd(), '.env')
const rootEnvPath = path.resolve(process.cwd(), '..', '.env')

if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath })
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath })
} else {
  dotenv.config()
}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not defined')
  process.exit(1)
}

function upgradeHtmlContent(html) {
  if (!html || typeof html !== 'string') return html

  let upgraded = html

  // 1. Add data-aos="fade-up" to headings if not already present
  upgraded = upgraded.replace(/<(h[234])(?![^>]*data-aos)([^>]*)>/gi, '<$1 data-aos="fade-up"$2>')

  // 2. Add data-aos="fade-up" to grids, callouts, metric grids, tables, pullquotes
  upgraded = upgraded.replace(/<div(?![^>]*data-aos)([^>]*class="[^"]*(?:article-grid-12|article-callout|project-architecture-callout|project-metric-grid)[^"]*"[^>]*)>/gi, '<div data-aos="fade-up"$1>')
  upgraded = upgraded.replace(/<table(?![^>]*data-aos)([^>]*class="[^"]*(?:article-table|project-spec-table)[^"]*"[^>]*)>/gi, '<table data-aos="fade-up"$1>')
  upgraded = upgraded.replace(/<blockquote(?![^>]*data-aos)([^>]*class="[^"]*article-pullquote[^"]*"[^>]*)>/gi, '<blockquote data-aos="fade-up"$1>')

  // 3. Add data-cursor="view" to figures
  upgraded = upgraded.replace(/<figure(?![^>]*data-cursor)([^>]*)>/gi, '<figure data-cursor="view"$1>')

  // 4. Add data-cursor="code" to pre blocks
  upgraded = upgraded.replace(/<pre(?![^>]*data-cursor)([^>]*)>/gi, '<pre data-cursor="code"$1>')

  // 5. Add spotlight-card to callout boxes if not present
  upgraded = upgraded.replace(/class="([^"]*(?:article-callout|project-architecture-callout)(?![^"]*spotlight-card)[^"]*)"/gi, 'class="$1 spotlight-card"')

  return upgraded
}

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  console.log('Connected to MongoDB Atlas using MONGODB_URI from environment...')

  const db = client.db()
  const projectsCol = db.collection('projects')
  const blogsCol = db.collection('blogposts')

  const projects = await projectsCol.find({}).toArray()
  console.log(`Found ${projects.length} projects to inspect/upgrade...`)

  for (const proj of projects) {
    const updatedContent = upgradeHtmlContent(proj.content)
    const updatedDossier = upgradeHtmlContent(proj.architectureDossierContext)

    if (updatedContent !== proj.content || updatedDossier !== proj.architectureDossierContext) {
      await projectsCol.updateOne(
        { _id: proj._id },
        {
          $set: {
            content: updatedContent,
            architectureDossierContext: updatedDossier,
            updatedAt: new Date(),
          },
        },
      )
      console.log(`  ✓ Upgraded project: ${proj.title}`)
    }
  }

  const posts = await blogsCol.find({}).toArray()
  console.log(`Found ${posts.length} blog posts to inspect/upgrade...`)

  for (const post of posts) {
    const updatedContent = upgradeHtmlContent(post.content)

    if (updatedContent !== post.content) {
      await blogsCol.updateOne(
        { _id: post._id },
        {
          $set: {
            content: updatedContent,
            updatedAt: new Date(),
          },
        },
      )
      console.log(`  ✓ Upgraded blog post: ${post.title}`)
    }
  }

  await client.close()
  console.log('🎉 Database verification and upgrade complete!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
