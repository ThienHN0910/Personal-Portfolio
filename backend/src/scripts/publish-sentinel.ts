/**
 * Idempotently publish the Sentinel Case Study and Article.
 * Run from backend/ with: npx tsx src/scripts/publish-sentinel.ts
 * Credentials come from backend/.env; only public content is versioned.
 */
import dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import mongoose from 'mongoose'

import BlogPost from '../models/BlogPost'
import Project from '../models/Project'

dotenv.config()

const caseSlug = 'sentinel-bot-discord-community-analytics'
const articleSlug = 'engineering-sentinel-discord-web-state-machines'
const contentDir = join(__dirname, '../../content')
const caseContext = readFileSync(join(contentDir, 'sentinel-case-study.html'), 'utf8').trim()
const articleContent = readFileSync(join(contentDir, 'sentinel-article.html'), 'utf8').trim()
const homeImage = 'https://res.cloudinary.com/dnoj9q5ha/image/upload/f_auto,q_auto,w_1200/v1790687139/portfolio/sentinel-bot/sentinel-home.png'
const dashboardImage = 'https://res.cloudinary.com/dnoj9q5ha/image/upload/f_auto,q_auto,w_1200/v1790687135/portfolio/sentinel-bot/sentinel-dashboard.png'

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')
  await mongoose.connect(process.env.MONGODB_URI)
  try {
    const project = await Project.findOneAndUpdate(
      { slug: caseSlug },
      { $set: {
        slug: caseSlug,
        title: 'Sentinel Bot — Live Discord Community Analytics & Shared Games',
        description: 'A Discord bot and live Vue dashboard for community activity, voice participation, server management, reminders, and two-player games shared between Discord and the web.',
        context: caseContext,
        duration: '2026 · ongoing',
        priority: 5,
        categories: ['Web App', 'Multiplatform'],
        technologies: ['TypeScript', 'Discord.js', 'Fastify', 'Vue 3', 'MongoDB', 'PM2', 'Vercel'],
        imageUrl: homeImage,
        githubUrl: 'https://github.com/ThienHN0910/sentinel-bot',
        liveUrl: 'https://sentinel-dashboard.thienhn.io.vn',
        featured: true,
      } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )

    const article = await BlogPost.findOneAndUpdate(
      { slug: articleSlug },
      { $set: {
        slug: articleSlug,
        title: 'Engineering Sentinel: Shared Discord–Web Games, Live Analytics, and Secure Guild Control',
        excerpt: 'How Sentinel coordinates Discord and Vue through MongoDB version checks, short-lived OAuth sessions, paged analytics, and bounded reminder delivery.',
        content: articleContent,
        coverImage: dashboardImage,
        categories: ['Backend', 'Full Stack'],
        tags: ['Discord.js', 'TypeScript', 'Fastify', 'Vue 3', 'MongoDB', 'OAuth2', 'Optimistic Concurrency'],
        published: true,
      } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )

    console.log(JSON.stringify({ project: project.slug, article: article.slug, published: article.published }))
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Failed to publish Sentinel content')
  process.exitCode = 1
})
