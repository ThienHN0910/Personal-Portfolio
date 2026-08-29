import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { connectToDatabase } from '../lib/mongodb'
import Project from '../models/Project'

async function migrate() {
  console.log('🚀 Starting Data Migration: Extract Project Context Dossier from Description...')

  try {
    await connectToDatabase()
    console.log('✓ Connected to MongoDB.')

    const projects = await Project.find({})
    console.log(`Found ${projects.length} project(s) to inspect.`)

    let updatedCount = 0

    for (const project of projects) {
      const desc = project.description || ''
      const sectionMatch = desc.match(/<section[^>]*>([\s\S]*?)<\/section>/i)

      if (sectionMatch) {
        console.log(`- Project "${project.title}": Found embedded <section> block. Extracting into context...`)
        const fullSection = sectionMatch[0]
        const sectionContent = sectionMatch[1] ? sectionMatch[1].trim() : fullSection

        // Clean description by removing the section block
        const cleanDesc = desc.replace(fullSection, '').trim()

        project.context = sectionContent
        project.description = cleanDesc || project.title
        await project.save()
        updatedCount++
        console.log(`  ✓ Successfully extracted context for "${project.title}".`)
      }
    }

    console.log(`🎉 Migration completed! Updated ${updatedCount} project(s).`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB.')
  }
}

void migrate()
