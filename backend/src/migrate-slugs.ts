import dotenv from 'dotenv'
import { connectToDatabase } from './lib/mongodb'
import Project from './models/Project'
import BlogPost from './models/BlogPost'
import { generateSlug } from './lib/slugify'

dotenv.config()

async function main() {
  await connectToDatabase()
  console.log('Connected to database')

  const projects = await Project.find({ slug: { $exists: false } })
  console.log(`Found ${projects.length} projects without slugs.`)
  for (const p of projects) {
    p.slug = generateSlug(p.title) || 'project'
    // pre-save hook handles conflicts
    await p.save()
    console.log(`Migrated project: ${p.title} -> ${p.slug}`)
  }

  const posts = await BlogPost.find({ slug: { $exists: false } })
  console.log(`Found ${posts.length} blog posts without slugs.`)
  for (const post of posts) {
    post.slug = generateSlug(post.title) || 'blog-post'
    // pre-save hook handles conflicts
    await post.save()
    console.log(`Migrated blog post: ${post.title} -> ${post.slug}`)
  }

  console.log('Migration complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
