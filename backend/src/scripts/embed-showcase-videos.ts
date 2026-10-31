import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import Project from '../models/Project'
import BlogPost from '../models/BlogPost'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const VIDEO_MAPPINGS = [
  {
    name: 'ACVIS',
    projectSlug: 'acvis-automated-code-vulnerability-identification-system',
    articleSlug: 'inside-acvis-capstone-ai-sast-dast-vector-search-exploit-verification',
    videoUrl: 'https://youtu.be/QgDfrqyCWlg',
    contentFiles: [
      path.resolve(__dirname, '../../content/acvis-case-study.html'),
      path.resolve(__dirname, '../../content/acvis-article.html'),
    ],
  },
  {
    name: 'Assistant Bot',
    projectSlug: 'assisstantbot-telegram-overview',
    articleSlug: 'zero-overhead-vps-orchestration-telegram-bot-pm2-nginx',
    videoUrl: 'https://youtu.be/yx0prDfj2lA',
    contentFiles: [
      path.resolve(__dirname, './local/data/project_telebot.html'),
      path.resolve(__dirname, './local/data/article_telebot.html'),
    ],
  },
  {
    name: 'Google Workspace Personal Assistant',
    projectSlug: 'google-workspace-personal-assistant',
    articleSlug: 'architecting-g-ops-hub-dotnet-cqrs-hangfire',
    videoUrl: 'https://youtu.be/L8iDKvheFX8',
    contentFiles: [],
  },
  {
    name: 'Sentinel Bot',
    projectSlug: 'sentinel-bot-discord-community-analytics',
    articleSlug: 'engineering-sentinel-discord-web-state-machines',
    videoUrl: 'https://youtu.be/hIcierO9Kio',
    contentFiles: [
      path.resolve(__dirname, '../../content/sentinel-case-study.html'),
      path.resolve(__dirname, '../../content/sentinel-article.html'),
    ],
  },
  {
    name: 'Template-P',
    projectSlug: 'template-p-composable-cli-scaffolder-engine',
    articleSlug: 'building-template-p-scaffolding-monorepos-with-npx',
    videoUrl: 'https://youtu.be/lXkRgyZ_Lkk',
    contentFiles: [],
  },
]

function insertVideoEmbed(html: string, videoUrl: string, isProject: boolean): string {
  const videoId = videoUrl.split('/').pop() || ''
  if (html.includes(videoUrl) || (videoId && html.includes(videoId))) {
    return html
  }

  const embedTag = `\n<figure class="media" data-aos="fade-up">\n  <oembed url="${videoUrl}"></oembed>\n</figure>\n`

  if (isProject) {
    const leadMatch = html.match(/<p\s+class="project-lead"[^>]*>[\s\S]*?<\/p>/i)
    if (leadMatch && leadMatch.index !== undefined) {
      const insertIdx = leadMatch.index + leadMatch[0].length
      return html.slice(0, insertIdx) + embedTag + html.slice(insertIdx)
    }
  } else {
    const leadMatch = html.match(/<div\s+class="article-lead"[^>]*>[\s\S]*?<\/div>/i)
    if (leadMatch && leadMatch.index !== undefined) {
      const insertIdx = leadMatch.index + leadMatch[0].length
      return html.slice(0, insertIdx) + embedTag + html.slice(insertIdx)
    }
  }

  return embedTag + html
}

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('Missing MONGODB_URI')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB.\n')

  for (const item of VIDEO_MAPPINGS) {
    console.log(`Processing: ${item.name} (${item.videoUrl})`)

    // 1. Update Project Case Study in DB
    const project = await Project.findOne({ slug: item.projectSlug })
    if (project) {
      const initialContext = project.context || ''
      const updatedContext = insertVideoEmbed(initialContext, item.videoUrl, true)
      if (initialContext !== updatedContext) {
        project.context = updatedContext
        await project.save()
        console.log(`  ✓ Updated Project context in MongoDB: ${item.projectSlug}`)
      } else {
        console.log(`  - Project already contains video: ${item.projectSlug}`)
      }
    } else {
      console.warn(`  ! Project not found with slug: ${item.projectSlug}`)
    }

    // 2. Update BlogPost Article in DB
    const article = await BlogPost.findOne({ slug: item.articleSlug })
    if (article) {
      const initialContent = article.content || ''
      const updatedContent = insertVideoEmbed(initialContent, item.videoUrl, false)
      if (initialContent !== updatedContent) {
        article.content = updatedContent
        await article.save()
        console.log(`  ✓ Updated Article content in MongoDB: ${item.articleSlug}`)
      } else {
        console.log(`  - Article already contains video: ${item.articleSlug}`)
      }
    } else {
      console.warn(`  ! Article not found with slug: ${item.articleSlug}`)
    }

    // 3. Update static content files on disk if they exist
    for (const filePath of item.contentFiles) {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const isProj = filePath.includes('case-study') || filePath.includes('project_')
        const updatedFileContent = insertVideoEmbed(fileContent, item.videoUrl, isProj)
        if (fileContent !== updatedFileContent) {
          fs.writeFileSync(filePath, updatedFileContent, 'utf8')
          console.log(`  ✓ Updated local content file: ${path.basename(filePath)}`)
        }
      }
    }
  }

  console.log('\nAll showcase videos embedded successfully!')
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Error embedding videos:', err)
  process.exit(1)
})
