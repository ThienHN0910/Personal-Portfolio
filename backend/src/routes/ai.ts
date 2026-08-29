import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAdmin } from '../lib/auth'

const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const DESIGN_SYSTEM_RULES = `
CRITICAL DESIGN SYSTEM & STYLING RULES:
1. PREDEFINED CLASS CATALOG: You MUST attach the following predefined CSS classes to semantic HTML elements:
   - Headings: class="article-h2" or class="project-h2", class="article-h3" or class="project-h3"
   - Lead Paragraphs: class="article-lead" or class="project-lead"
   - Body Paragraphs: class="article-p" or class="project-p"
   - Pull Quotes: class="article-pullquote" (use inside <blockquote>)
   - Architecture Callouts / ADRs: class="project-architecture-callout" or class="article-callout" (use inside <div class="...">)
   - Performance & Scale Metrics: class="project-metric-grid" container with <div class="project-metric-card"><span class="metric-value">...</span><span class="metric-label">...</span></div>
   - Spec Tables: class="project-spec-table" or class="article-table" (use on <table>)
   - Code Blocks: class="project-codeblock" or class="article-codeblock" (use on <pre class="..."><code>...</code></pre>)
   - Figures & Diagrams: class="project-figure" or class="article-figure" (use on <figure><img ... /><figcaption>...</figcaption></figure>)

2. STRICT INLINE STYLE RULE:
   - You are ONLY allowed to use inline style attributes (style="...") for STRUCTURAL LAYOUT orchestration:
     * CSS Grid layouts: style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem;"
     * Asymmetric column spans: style="grid-column: span 8;", style="grid-column: span 4;", style="grid-column: span 7;", style="grid-column: span 5;", style="grid-column: span 12;"
     * Flexbox layouts: style="display: flex; justify-content: space-between; align-items: stretch; gap: 1.25rem;"
     * Spacing & Margins: style="margin-top: 3rem; margin-bottom: 2rem;"
   - NEVER output custom inline colors (color: ...), background colors (background: ...), font-family, font-size, or border-radius in style attributes. All visual identity must strictly come from the predefined classes!

3. CREATIVE DIRECTION DIALS:
   - DESIGN_VARIANCE: 8 (High asymmetry, broken 12-column grid spans 8/4 or 7/5, staggered bento cards).
   - VISUAL_DENSITY: 3 (Spacious, airy negative space, maximum 65ch readable line lengths).
`

const AI_TEMPLATES: Record<string, string> = {
  default: `Act as an expert technical editor and Web developer. Refine the following HTML content using the predefined design system classes and modern asymmetric layout. ${DESIGN_SYSTEM_RULES}`,
  project_blog: `Act as a senior software architect and technical writer. Refine the following HTML content into an avant-garde Case Study featuring:
1. Executive Summary (<p class="project-lead">)
2. Architecture & Tech Stack Selection (<h2 class="project-h2"> with <div class="project-architecture-callout">)
3. Key Engineering Challenges & Technical Solutions (<h2 class="project-h2"> with <pre class="project-codeblock">)
4. Measurable Scale & Impact (<div class="project-metric-grid"> with <div class="project-metric-card">)
${DESIGN_SYSTEM_RULES}`,
  dev_log: `Act as a lead software engineer writing an in-depth Technical Dev Log with avant-garde layout.
1. Context & Problem Statement (<p class="article-lead">)
2. Root Cause Analysis (<h2 class="article-h2">)
3. Implementation Details & Code Snippets (<pre class="article-codeblock"><code>)
4. Lessons Learned & Best Practices (<blockquote class="article-pullquote">)
${DESIGN_SYSTEM_RULES}`,
  project_overview: `Act as a technical product manager. Refine the content into a high-impact Project Overview containing:
- Project Brief & Deployment Status (<p class="project-lead">)
- Technical Architecture & Stack Breakdown (<div class="project-architecture-callout">)
- System Metrics (<div class="project-metric-grid">)
${DESIGN_SYSTEM_RULES}`,
  context_to_casestudy: `Act as a Principal Software Architect and Lead Technical Writer.
Transform the provided raw project context, CONTEXT.md, AGENTS.md, or repository README into an avant-garde, executive-ready Case Study with broken-grid bento rhythm.

Structure into:
<h2 class="project-h2">1. Architectural Overview & System Objectives</h2>
<p class="project-lead">Executive summary of the platform scope, business problem solved, and production goals.</p>

<div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin: 2.5rem 0;">
  <div style="grid-column: span 7;" class="project-architecture-callout">
    <h3 class="project-h3">Core Architectural Thesis</h3>
    <p class="project-p">Why standard monolithic or untyped approaches fail at scale, and the architectural principles applied.</p>
  </div>
  <div style="grid-column: span 5;" class="project-metric-grid">
    <div class="project-metric-card">
      <span class="metric-value">60 FPS</span>
      <span class="metric-label">GPU Smooth Motion</span>
    </div>
    <div class="project-metric-card">
      <span class="metric-value">&lt;50ms</span>
      <span class="metric-label">P99 Server Latency</span>
    </div>
  </div>
</div>

<h2 class="project-h2">2. Technical Stack & Architectural Tradeoffs (ADRs)</h2>
<p class="project-p">Detailed breakdown of frameworks, databases, and third-party services chosen, highlighting architectural tradeoffs.</p>

<table class="project-spec-table">
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
      <th>Architectural Rationale</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Frontend</td>
      <td>Vue 3 + TypeScript + Vite</td>
      <td>Fine-grained reactivity, strict compiler typing, &lt;100ms HMR</td>
    </tr>
  </tbody>
</table>

<h2 class="project-h2">3. Key Engineering Seams & Implementation</h2>
<p class="project-p">Deep-dive into critical algorithms, security pipelines, or data flows.</p>
<pre class="project-codeblock"><code class="language-typescript">// Critical architecture contract or state machine</code></pre>

<blockquote class="article-pullquote">
  “Standout architectural insight or system design takeaway from this project.”
</blockquote>

<h2 class="project-h2">4. Verification, Seams & Production Metrics</h2>
<p class="project-p">Testing methodology, verification suites, and measurable outcomes.</p>

${DESIGN_SYSTEM_RULES}`,
  context_to_article: `Act as a Staff Engineer and Tech Author.
Transform the provided notes, code snippets, or ideas into a publication-grade Technical Article with magazine-style editorial layout.

Structure into:
<h1 class="article-hero-title">Title of the Technical Deep-Dive</h1>
<p class="article-lead">Engaging, high-level theoretical summary of the problem and engineering breakthrough.</p>

<h2 class="article-h2">1. The Problem & Theoretical Background</h2>
<p class="article-p">Detailed analysis of why existing solutions hit performance or architectural limits.</p>

<div class="article-callout">
  <h3 class="article-h3">Key Mental Model</h3>
  <p class="article-p">A critical visual or conceptual model explaining the underlying mechanics.</p>
</div>

<h2 class="article-h2">2. Deep-Dive Mechanics & Architecture</h2>
<p class="article-p">Step-by-step breakdown with concrete code examples.</p>
<pre class="article-codeblock"><code class="language-typescript">// Example implementation or pattern</code></pre>

<blockquote class="article-pullquote">
  “Memorable rule of thumb or architectural insight.”
</blockquote>

<h2 class="article-h2">3. Benchmarks, Real-World Edge Cases & Conclusion</h2>
<p class="article-p">Practical takeaways, memory considerations, and recommendations.</p>

${DESIGN_SYSTEM_RULES}`,
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

