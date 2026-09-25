import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import path from 'path'
import { getCloudinary } from '../lib/cloudinary'

const imagesToUpload = [
  {
    localPath: 'E:\\Hình ảnh\\Saved Pictures\\blog\\telebot\\Screenshot 2026-09-25 153220.png',
    fileName: 'telegram_deploy_weblist_vps',
    description: 'Telegram /deploy 1-touch ZIP deployment to VPS with automated Cloudflare subdomain and /web_list status',
  },
  {
    localPath: 'E:\\Hình ảnh\\Saved Pictures\\blog\\telebot\\Screenshot 2026-09-25 161224.png',
    fileName: 'dev_assistant_dashboard_github_modal',
    description: 'Dev Assistant Dashboard modal: Analyze GitHub repository, recommend platform (VPS/Vercel) and configure Cloudflare subdomain',
  },
  {
    localPath: 'E:\\Hình ảnh\\Saved Pictures\\blog\\telebot\\Screenshot 2026-09-25 161252.png',
    fileName: 'dev_assistant_dashboard_overview',
    description: 'Dev Assistant Dashboard overview: real-time CPU, RAM, Disk, Uptime metrics and deployed services management table',
  },
  {
    localPath: 'E:\\Hình ảnh\\Saved Pictures\\blog\\telebot\\Screenshot 2026-09-25 161321.png',
    fileName: 'test_subdomain_deployed_website',
    description: 'Live verified website running on custom subdomain test.thienhn.io.vn via Cloudflare DNS A Record',
  },
  {
    localPath: 'E:\\Hình ảnh\\Saved Pictures\\blog\\telebot\\Screenshot 2026-09-25 161352.png',
    fileName: 'telegram_update_menu_keyboard',
    description: 'Telegram /update autonomous upgrade, active service list and persistent quick-action keyboard',
  },
]

async function uploadImages() {
  const cloudinary = getCloudinary()
  console.log('🚀 Starting Cloudinary uploads for new telebot images...\n')

  const results: Record<string, string> = {}

  for (const item of imagesToUpload) {
    if (!fs.existsSync(item.localPath)) {
      console.error(`❌ Local file not found: ${item.localPath}`)
      continue
    }

    console.log(`Uploading ${item.fileName} (${path.basename(item.localPath)})...`)
    try {
      const uploadResult = await cloudinary.uploader.upload(item.localPath, {
        folder: 'portfolio/projects/telebot',
        public_id: item.fileName,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        overwrite: true,
      })

      results[item.fileName] = uploadResult.secure_url
      console.log(`  ✓ Uploaded: ${uploadResult.secure_url}`)
    } catch (err: any) {
      console.error(`  ❌ Failed to upload ${item.fileName}:`, err?.message || err)
    }
  }

  console.log('\n--- UPLOAD SUMMARY ---')
  console.log(JSON.stringify(results, null, 2))
}

uploadImages().catch(console.error)
