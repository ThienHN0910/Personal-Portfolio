import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { connectToDatabase } from '../lib/mongodb'
import Project from '../models/Project'
import BlogPost from '../models/BlogPost'

const PROJECT_ID = '6a1e910218ee4e0cf45c34fd'
const POST_ID = '6a9d01cd99c68f7ab4a97dff'

async function updateDb() {
  await connectToDatabase()
  console.log('🚀 Connecting to MongoDB and updating records...')

  const projectHtmlPath = path.resolve(__dirname, 'data/project_telebot.html')
  const articleHtmlPath = path.resolve(__dirname, 'data/article_telebot.html')

  const projectContext = fs.readFileSync(projectHtmlPath, 'utf-8')
  const articleContent = fs.readFileSync(articleHtmlPath, 'utf-8')

  // 1. Update Project
  const project = await Project.findById(PROJECT_ID)
  if (!project) {
    throw new Error(`Project with ID ${PROJECT_ID} not found`)
  }

  project.title = 'Dev Assistant Bot — Telegram Server Automation, Cloudflare DNS & Multi-Target Deployment Suite'
  project.description =
    'A lightweight Telegram Dev Assistant & Web Sandbox Suite built with Node.js & Telegraf. Optimized for low-spec servers (1 vCPU / 1GB RAM) with OOM-safe PM2 monitoring, automated 1-touch Nginx/SPA/Node deployments, intelligent multi-target orchestration (VPS, Vercel, Render), dynamic Cloudflare DNS routing, and a Vue 3 administrative dashboard with Google OAuth 2.0.'
  project.technologies = [
    'Node.js',
    'Telegraf',
    'PM2',
    'Nginx',
    'Vue 3',
    'Tailwind CSS',
    'Cloudflare DNS',
    'Google OAuth',
    'Vercel',
    'Render',
    'Linux',
    'GCP',
  ]
  project.liveUrl = 'https://bot.thienhn.io.vn'
  project.githubUrl = 'https://github.com/ThienHN0910/assistant-bot'
  project.context = projectContext
  await Project.updateOne(
    { _id: PROJECT_ID },
    {
      $set: {
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        context: project.context,
        slug: 'assisstantbot-telegram-overview',
      },
    },
  )
  const updatedProject = await Project.findById(PROJECT_ID)
  console.log(`✓ Project "${updatedProject?.title}" (slug: ${updatedProject?.slug}) successfully updated!`)

  // 2. Update BlogPost
  const post = await BlogPost.findById(POST_ID)
  if (!post) {
    throw new Error(`BlogPost with ID ${POST_ID} not found`)
  }

  post.title =
    'Zero-Overhead VPS Orchestration: Telegram Dev Assistant, Multi-Target Cloud Deployments & Cloudflare DNS Automation'
  post.excerpt =
    'How to orchestrate cloud operations on a memory-constrained 1GB RAM VPS using Node.js, Telegraf, and Linux child-process streams: eliminating Node buffer memory pressure via tail -n 20, automating multi-target deployments (VPS, Vercel, Render), dynamically managing Cloudflare DNS subdomains, and operating a Vue 3 dashboard with Google OAuth 2.0.'
  post.tags = [
    'DevOps',
    'Node.js',
    'Telegram Bot',
    'Cloudflare DNS',
    'Nginx',
    'Vue 3',
    'Vercel',
    'Render',
    'PM2',
    'Performance',
  ]
  post.content = articleContent

  await BlogPost.updateOne(
    { _id: POST_ID },
    {
      $set: {
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags,
        content: post.content,
        slug: 'zero-overhead-vps-orchestration-telegram-bot-pm2-nginx',
      },
    },
  )
  const updatedPost = await BlogPost.findById(POST_ID)
  console.log(`✓ Article "${updatedPost?.title}" (slug: ${updatedPost?.slug}) successfully updated!`)

  await mongoose.disconnect()
  console.log('✓ Disconnected from MongoDB.')
}

updateDb().catch((err) => {
  console.error('❌ Failed to update database:', err)
  process.exit(1)
})
