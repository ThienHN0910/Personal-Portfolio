import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://hntvnvn_db_user:ktiwf5f2TCPWugaM@cluster0.0bfcapn.mongodb.net/?appName=Cluster0'

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
  console.log('Connected to MongoDB Atlas...')

  const db = client.db()
  const projectsCol = db.collection('projects')
  const blogsCol = db.collection('blogposts')

  const projects = await projectsCol.find({}).toArray()
  console.log(`Found ${projects.length} projects to upgrade...`)

  for (const proj of projects) {
    const updatedContent = upgradeHtmlContent(proj.content)
    const updatedDossier = upgradeHtmlContent(proj.architectureDossierContext)

    await projectsCol.updateOne(
      { _id: proj._id },
      {
        $set: {
          content: updatedContent,
          architectureDossierContext: updatedDossier,
          updatedAt: new Date()
        }
      }
    )
    console.log(`  ✓ Upgraded project: ${proj.title}`)
  }

  const posts = await blogsCol.find({}).toArray()
  console.log(`Found ${posts.length} blog posts to upgrade...`)

  for (const post of posts) {
    const updatedContent = upgradeHtmlContent(post.content)

    await blogsCol.updateOne(
      { _id: post._id },
      {
        $set: {
          content: updatedContent,
          updatedAt: new Date()
        }
      }
    )
    console.log(`  ✓ Upgraded blog post: ${post.title}`)
  }

  await client.close()
  console.log('🎉 All database records upgraded with AOS & Interactive Motion attributes!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
