import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAdmin } from '../lib/auth'

const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const DESIGN_SYSTEM_RULES = `
CRITICAL DESIGN SYSTEM & STYLING RULES:
1. STRICT HTML TAG WHITELIST:
   - You MUST ONLY use standard, semantic HTML elements from this exact whitelist:
     <h1>, <h2>, <h3>, <h4>, <p>, <blockquote>, <pre>, <code>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <div>, <span>, <figure>, <figcaption>, <img>, <strong>, <em>, <a>, <hr>.
   - NEVER generate deprecated tags (e.g., <font>, <center>, <marquee>), inline <script>, <style> blocks, or unescaped angle brackets.

2. PREDEFINED CLASS CATALOG: You MUST attach the following predefined CSS classes to semantic HTML elements:
   - Headings: class="article-h2" or class="project-h2", class="article-h3" or class="project-h3", class="article-h4"
   - Lead Paragraphs: class="article-lead" or class="project-lead"
   - Body Paragraphs: class="article-p" or class="project-p"
   - Lists: class="article-list" (use on <ul>)
   - Status Badges: class="article-badge" (<span class="article-badge">...</span> or <span class="article-badge article-badge--green">...</span>) or class="project-hero-badge" (<span class="project-hero-badge"><span class="badge-dot"></span>Active</span>)
   - Pull Quotes: class="article-pullquote" (use inside <blockquote>)
   - Architecture Callouts / ADRs: class="project-architecture-callout" or class="article-callout" (use inside <div class="...">)
   - Asymmetric Grids: class="article-grid-12" with child columns class="article-col-7", class="article-col-5", class="article-col-6", class="article-col-4", class="article-col-8", class="article-col-12"
   - Performance & Scale Metrics: class="project-metric-grid" container with <div class="project-metric-card"><span class="metric-value">...</span><span class="metric-label">...</span></div>
   - Spec Tables: class="project-spec-table" or class="article-table" (use on <table>)
   - Code Blocks: class="project-codeblock" or class="article-codeblock" (use on <pre class="..."><code>...</code></pre>)
   - Figures & Diagrams: class="project-figure" or class="article-figure" (use on <figure><img ... /><figcaption>...</figcaption></figure>)

3. STRICT INLINE STYLE RULE:
   - You are ONLY allowed to use inline style attributes (style="...") for structural layouts if classes are insufficient:
     * CSS Grid layouts: style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem;"
     * Asymmetric column spans: style="grid-column: span 8;", style="grid-column: span 4;", style="grid-column: span 7;", style="grid-column: span 5;", style="grid-column: span 12;"
     * Flexbox layouts: style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;"
     * Spacing & Margins: style="margin-top: 3rem; margin-bottom: 2rem;"
   - NEVER output custom inline colors (color: ...), background colors (background: ...), font-family, font-size, or border-radius in style attributes. All visual identity must strictly adapt dynamically to the theme!

4. CREATIVE DIRECTION DIALS:
   - DESIGN_VARIANCE: 8 (High asymmetry, broken 12-column grid spans 8/4 or 7/5, staggered bento cards).
   - VISUAL_DENSITY: 3 (Spacious, airy negative space, maximum 65ch readable line lengths).
`

const UNIFIED_MASTER_SYNTHESIS_PROMPT = `
Act as a Principal Software Architect, Lead Technical Writer, and Creative Editorial Web Designer.
Your objective is to transform the provided raw notes, CONTEXT.md, AGENTS.md, GitHub README, dev logs, or drafts into an avant-garde, executive-ready technical publication or case study adhering strictly to the portfolio's design system.

${DESIGN_SYSTEM_RULES}

STRUCTURE & CONTENT GUIDELINES:
1. If the input represents a Project / Platform / System / Case Study:
   - Output an engaging executive summary paragraph with class="project-lead".
   - Include a 12-column asymmetric grid (<div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin: 2.5rem 0;">) containing:
     * A deep architectural thesis card (<div style="grid-column: span 7;" class="project-architecture-callout"><h3 class="project-h3">Architectural Thesis</h3><p class="project-p">...</p></div>)
     * Performance and scale metric cards (<div style="grid-column: span 5;" class="project-metric-grid"><div class="project-metric-card"><span class="metric-value">60 FPS</span><span class="metric-label">GPU Acceleration</span></div><div class="project-metric-card"><span class="metric-value">&lt;50ms</span><span class="metric-label">P99 Latency</span></div></div>)
   - Include technical stack tradeoffs table with class="project-spec-table".
   - Include engineering seams and code highlights with <pre class="project-codeblock"><code class="language-typescript">// Implementation seam</code></pre>.
   - Include key architectural takeaway in <blockquote class="article-pullquote">“Standout architectural insight...”</blockquote>.

2. If the input represents an Article / Technical Essay / Tutorial:
   - Output a prominent headline with class="article-hero-title" and an engaging lead paragraph with class="article-lead".
   - Break down mechanics into structured sections with class="article-h2", body paragraphs with class="article-p", and conceptual highlights with class="article-callout".
   - Include code snippets with <pre class="article-codeblock"><code class="language-typescript">// Technical implementation</code></pre>.
   - Conclude with benchmarks, tradeoffs, and key takeaways in <blockquote class="article-pullquote">“Key rule of thumb...”</blockquote>.

3. General Refinement & HTML Semantic Polishing:
   - Preserve all essential technical truths and code logic while upgrading the HTML markup into the design system classes and modern broken-grid layout.
`

router.post('/improve-content', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  try {
    const { content, customPrompt } = req.body

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'Gemini API Key is not configured' })
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    const model = genAI.getGenerativeModel({ model: modelName })

    let templateInstruction = UNIFIED_MASTER_SYNTHESIS_PROMPT

    if (customPrompt && typeof customPrompt === 'string' && customPrompt.trim()) {
      templateInstruction += `\n\nADDITIONAL USER INSTRUCTIONS (PRIORITIZE THESE):\n${customPrompt.trim()}`
    }

    const fullPrompt = `You are a professional software engineer, tech writer, and HTML content editor.
${templateInstruction}

CRITICAL REQUIREMENT: Return ONLY the raw HTML code without markdown code blocks (do NOT use \`\`\`html) and without any conversational intro/outro text.

Content to transform/refine:
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

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
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

