import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAdmin } from '../lib/auth'

const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const AI_TEMPLATES: Record<string, string> = {
  default: `Act as an expert technical editor and Web developer. Refine the following HTML content to improve clarity, grammar, readability, and formatting. Ensure clean HTML semantics, elegant visual styling, and proper layout structure.`,
  project_blog: `Act as a senior software architect and technical writer. Refine the following HTML content into a comprehensive Project Case Study featuring:
1. Executive Summary & Project Objectives
2. Architecture & Tech Stack Selection
3. Key Engineering Challenges & Technical Solutions
4. Measurable Impact & Future Roadmap.
Use semantic HTML5 elements (h2, h3, blockquotes, lists, code blocks) with modern inline styling.`,
  dev_log: `Act as a lead software engineer writing an in-depth Technical Dev Log. Format the content into:
1. Context & Problem Statement
2. Root Cause Analysis
3. Implementation Details & Code Snippets
4. Lessons Learned & Best Practices.
Highlight key technical terms using styled inline code elements.`,
  project_overview: `Act as a technical product manager. Refine the content into a high-impact Project Overview containing:
- Project Brief & Deployment Status
- Core Feature Highlights
- Technical Architecture & Stack Breakdown
- Live Demo & Open Source Repository Links.`,
}

router.post('/improve-content', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const { content, customPrompt, templateType } = req.body

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Gemini API Key is not configured' })
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
    const model = genAI.getGenerativeModel({ model: modelName })

    let templateInstruction = AI_TEMPLATES[templateType as string] || AI_TEMPLATES.default

    if (customPrompt && typeof customPrompt === 'string' && customPrompt.trim()) {
      templateInstruction += `\nAdditional user instruction: ${customPrompt.trim()}`
    }

    const fullPrompt = `You are a professional software engineer, tech writer, and HTML content editor.
${templateInstruction}

CRITICAL REQUIREMENT: Return ONLY the raw HTML code without markdown code blocks (do NOT use \`\`\`html) and without any conversational intro/outro text.

Content to refine:
${content}`


    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    let text = response.text()

    // Clean up potential markdown formatting
    text = text.replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim()

    return res.status(200).json({ success: true, data: text })
  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    return res.status(500).json({ success: false, error: 'Failed to improve content: ' + (error.message || '') })
  }
})

export default router

