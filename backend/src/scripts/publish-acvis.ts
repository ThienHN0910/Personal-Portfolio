/**
 * Idempotently publish the ACVIS Graduation Capstone Case Study and Article.
 * Run from backend/ with: npx tsx src/scripts/publish-acvis.ts
 * Credentials come from backend/.env; only public content is versioned.
 */
import dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import mongoose from 'mongoose'

import BlogPost from '../models/BlogPost'
import Project from '../models/Project'

dotenv.config()

const caseSlug = 'acvis-automated-code-vulnerability-identification-system'
const articleSlug = 'inside-acvis-capstone-ai-sast-dast-vector-search-exploit-verification'
const contentDir = join(__dirname, '../../content')
const caseContext = readFileSync(join(contentDir, 'acvis-case-study.html'), 'utf8').trim()
const articleContent = readFileSync(join(contentDir, 'acvis-article.html'), 'utf8').trim()
const heroImage = 'https://res.cloudinary.com/dnoj9q5ha/image/upload/v1791821505/portfolio/projects/acvis/acvis_finding_overview.png'

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')
  await mongoose.connect(process.env.MONGODB_URI)
  try {
    const project = await Project.findOneAndUpdate(
      { slug: caseSlug },
      { $set: {
        slug: caseSlug,
        title: 'ACVIS — Automated Code Vulnerability Identification System (.NET 8 & Vue 3)',
        description: 'An enterprise-grade DevSecOps platform combining deep in-process AST static analysis (Tree-sitter SAST) with automated, safe dynamic exploit verification (FastAPI DAST / Non-Destructive Testing NDT) for PHP and JavaScript/TypeScript applications.',
        context: caseContext,
        duration: '2026 · graduation capstone',
        priority: 10,
        categories: ['DevSecOps', 'Web App', 'AI', 'Architecture'],
        technologies: [
          '.NET 8',
          'Vue 3',
          'TypeScript',
          'PostgreSQL',
          'MongoDB',
          'Python',
          'FastAPI',
          'Gemini AI',
          'Tree-Sitter',
          'Docker',
          'Tailwind CSS',
        ],
        imageUrl: heroImage,
        githubUrl: 'https://github.com/ThienHN0910/ACVIS',
        liveUrl: 'https://acvis-beryl.vercel.app',
        featured: true,
      } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )

    const article = await BlogPost.findOneAndUpdate(
      { slug: articleSlug },
      { $set: {
        slug: articleSlug,
        title: 'Architecting ACVIS: Semantic Vector Search on Vulnerability Datasets and RAG-Driven AI Remediation',
        excerpt: 'A deep dive into the engineering of ACVIS: combining Tree-sitter AST data-flow analysis, 768-dimensional Gemini vector embeddings in MongoDB Atlas, and non-destructive dynamic exploit verification.',
        content: articleContent,
        coverImage: heroImage,
        categories: ['Architecture', 'DevSecOps', '.NET'],
        tags: [
          '.NET 8',
          'Tree-Sitter',
          'FastAPI',
          'SAST',
          'DAST',
          'MongoDB Atlas',
          'Gemini AI',
          'Clean Architecture',
          'DevSecOps',
          'Vue 3',
        ],
        published: true,
      } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )

    console.log(JSON.stringify({ project: project.slug, article: article.slug, published: article.published }, null, 2))
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Failed to publish ACVIS content')
  process.exitCode = 1
})
