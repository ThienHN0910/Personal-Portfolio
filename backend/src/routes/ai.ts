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
  context_to_casestudy: `Act as a Principal Software Architect and Lead Technical Writer.
Transform the provided raw project context, CONTEXT.md, AGENTS.md, or repository README into an avant-garde, executive-ready Case Study.
Structure the output into:
<h2>1. Architectural Overview & System Goals</h2>
<p>Concise executive summary of the system architecture, core problems solved, and engineering scope.</p>
<h2>2. Technical Stack & Design Tradeoffs</h2>
<p>Detailed explanation of frameworks, databases, and third-party services chosen, highlighting architectural tradeoffs (referencing ADRs if present).</p>
<h2>3. Key Engineering Seams & Implementation</h2>
<p>Deep-dive into critical algorithms, data flows, security pipelines, or 60fps performance optimizations.</p>
<pre><code>// Highlight critical architecture or type contracts here</code></pre>
<h2>4. Verification, Seams & Production Metrics</h2>
<p>Testing methodology, verification suites, and measurable outcomes (performance, throughput, reliability).</p>
<blockquote>A standout architectural insight or design philosophy quote from the project.</blockquote>
CRITICAL: Use ONLY standard semantic HTML elements (h2, h3, p, blockquote, pre, code, ul, ol, li, table, thead, tbody, tr, th, td). Do NOT include markdown fences, DO NOT use custom inline style attributes.`,
  context_to_article: `Act as a Staff Engineer and Tech Author.
Transform the provided notes, code snippets, or ideas into a publication-grade Technical Article.
Structure into:
<h2>1. The Problem & Theoretical Background</h2>
<p>Detailed formulation of why standard approaches fall short.</p>
<h2>2. Architecture & Deep-Dive Mechanics</h2>
<p>Step-by-step breakdown of the mechanics with code examples.</p>
<pre><code>// Example implementation or design pattern</code></pre>
<h2>3. Performance Benchmarks & Edge Cases</h2>
<p>Real-world considerations, memory footprint, and edge-case handling.</p>
<blockquote>Key takeaway or mental model summary for developers.</blockquote>
CRITICAL: Use ONLY standard semantic HTML elements (h2, h3, p, blockquote, pre, code, ul, ol, li).`,
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
    text = text.replace(/^```html\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()

    return res.status(200).json({ success: true, data: text })
  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    return res.status(500).json({ success: false, error: 'Failed to improve content: ' + (error.message || '') })
  }
})

router.post('/generate-metadata', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const { title, content } = req.body
    if (!content && !title) {
      return res.status(400).json({ success: false, error: 'Title or content is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Gemini API Key is not configured' })
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
    const model = genAI.getGenerativeModel({ model: modelName })

    const prompt = `You are an expert technical editor and SEO specialist.
Analyze the following title and content of a software engineering article or case study:
Title: ${title || 'Untitled'}
Content: ${content ? content.slice(0, 3000) : ''}

Generate a JSON object with:
1. "excerpt": A concise, engaging 1-2 sentence executive summary (under 160 characters) suitable for OpenGraph and preview cards.
2. "tags": An array of 3 to 6 technical tags (e.g. ["vue3", "typescript", "architecture", "performance"]).
3. "suggestedCategory": A primary category (e.g. "Frontend", "Backend", "Full Stack", "Architecture", "DevOps", "AI").

CRITICAL REQUIREMENT: Return ONLY the raw JSON string without any markdown fences (do NOT use \`\`\`json) and no explanation text. Example:
{"excerpt":"...","tags":["..."],"suggestedCategory":"..."}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let rawText = response.text().trim()

    // Clean up potential markdown formatting
    rawText = rawText.replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()

    let parsedData = {}
    try {
      parsedData = JSON.parse(rawText)
    } catch {
      parsedData = { excerpt: rawText.slice(0, 160), tags: [], suggestedCategory: 'Architecture' }
    }

    return res.status(200).json({ success: true, data: parsedData })
  } catch (error: any) {
    console.error('Error generating metadata:', error)
    return res.status(500).json({ success: false, error: 'Failed to generate metadata: ' + (error.message || '') })
  }
})

export default router

