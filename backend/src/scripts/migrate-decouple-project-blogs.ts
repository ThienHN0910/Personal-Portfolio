import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { connectToDatabase } from '../lib/mongodb'
import Project from '../models/Project'
import BlogPost from '../models/BlogPost'

async function migrate() {
  console.log('🚀 Starting Data Migration: Decouple Projects and Blog Posts...')

  try {
    await connectToDatabase()
    console.log('✓ Connected to MongoDB.')

    // Find all projects that have relatedBlogId
    const rawProjects = await Project.collection.find({ relatedBlogId: { $exists: true, $ne: null } }).toArray()
    console.log(`Found ${rawProjects.length} project(s) with relatedBlogId.`)

    for (const rawProj of rawProjects) {
      const blogId = rawProj.relatedBlogId
      if (!blogId) continue

      const post = await BlogPost.findById(blogId)
      if (post && post.content) {
        console.log(`- Migrating blog "${post.title}" into project "${rawProj.title}"...`)

        // Check if project description already includes the blog content
        let newDescription = rawProj.description || ''
        if (!newDescription.includes(post.content.trim())) {
          newDescription = `${newDescription}\n\n<section class="project-deep-dive-section mt-8">\n<h2 class="project-h2">${post.title}</h2>\n${post.content}\n</section>`
        }

        await Project.collection.updateOne(
          { _id: rawProj._id },
          {
            $set: { description: newDescription },
            $unset: { relatedBlogId: '' },
          },
        )
        console.log(`  ✓ Successfully updated project "${rawProj.title}".`)
      } else {
        // Just unset relatedBlogId if post doesn't exist
        await Project.collection.updateOne({ _id: rawProj._id }, { $unset: { relatedBlogId: '' } })
        console.log(`  ✓ Unset non-existent relatedBlogId for project "${rawProj.title}".`)
      }
    }

    console.log('🎉 Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB.')
  }
}

void migrate()
