# Specification 0006: Editorial Triage & Project Technical Deep-Dive Articles

## Overview
This specification records the decisions from the `/grill-with-docs` session to curate and elevate the portfolio's publication catalog. The catalog is streamlined from 10 to 8 high-impact technical articles: 5 foundational articles are retained and polished, 5 low-signal/introductory articles are pruned, and 3 comprehensive technical deep-dive articles are introduced to dissect real-world engineering challenges across G-Ops Hub, Dev Assistant Bot, and Facebook Messenger vs. Telegram bot architectures.

---

## 1. Editorial Triage Matrix

### Retained & Polished Articles (5)
1. **`architecting-custom-agent-skills-mcp-workflows`**  
   *Title:* Architecting Custom Agent Skills: Extending LLM Capabilities with Structured Tooling & MCP  
   *Focus:* AI Engineering, Model Context Protocol (MCP), Antigravity Agent Skill authoring.
2. **`optimizing-ai-coding-workflow-matt-pocock-and-taste-skills`**  
   *Title:* Pair Programming with Autonomous AI Agents: Combining Matt Pocock’s Engineering Skills & Taste-Skill UI  
   *Focus:* AI Coding Workflows, agentic reasoning loops, design taste evaluation.
3. **`one-line-dev-environment-setup-powershell-winget`**  
   *Title:* One-Line Dev Setup: Automating Developer Workspace Provisioning with PowerShell and Winget  
   *Focus:* Systems Automation, idempotency, PowerShell scripting.
4. **`mastering-jwt-and-session-security-in-dotnet-and-vue`**  
   *Title:* Stateless Authentication in Practice: Hardening JWT Tokens and Refresh Rotations in .NET 8 & Vue 3  
   *Focus:* Cloud Security, token rotation, OWASP defense.
5. **`owasp-top-10-web-security-fundamentals`** (formerly `...for-juniors`)  
   *Title:* Defending the Perimeter: Pragmatic Hardening Strategies for Modern Web Applications  
   *Focus:* Stripped "for Juniors" branding; elevated to Senior defense-in-depth architectural strategies.

### Pruned / Removed Articles (5)
- `shift-left-security-github-actions-docker`
- `zero-cost-reactivity-vue3-60fps-performance`
- `lessons-learned-vue3-dotnet-state-and-api-integration`
- `optimizing-mongodb-and-redis-caching-in-node`
- `git-branching-conventional-commits-ci-pipeline`

---

## 2. New Project Technical Deep-Dive Articles (3)

### Article 1: G-Ops Hub Architecture Deep-Dive
- **Slug:** `architecting-g-ops-hub-dotnet-cqrs-hangfire`
- **Title:** Architecting G-Ops Hub: Native CQRS in .NET 8, Hangfire Background Engine, and Zero-Cost Free-Tier Resilience
- **Categories:** `['Architecture', 'Backend', '.NET']`
- **Tags:** `['.NET 8', 'Clean Architecture', 'CQRS', 'Hangfire', 'MongoDB', 'Cloudflare', 'AES-256']`
- **Featured:** `true`
- **Key Technical Sections:**
  - Deconstructing MediatR vs. Native Generic CQRS Dispatcher (sub-millisecond latency, zero reflection overhead).
  - Hangfire recurring job state machines and dynamic cron rescheduling without service redeployment.
  - Mitigating IIS 20-minute idle sleep on MonsterASP free tier via GitHub Actions cron heartbeat and `X-KeepAlive-Key`.
  - Cryptographic token storage: Authenticated AES-256-GCM encryption for Google OAuth credentials in MongoDB.

### Article 2: Dev Assistant Bot Systems Deep-Dive
- **Slug:** `zero-overhead-vps-orchestration-telegram-bot-pm2-nginx`
- **Title:** Zero-Overhead VPS Orchestration: OOM-Safe PM2 Log Streaming and 1-Touch Nginx Sandbox Deployment via Telegram
- **Categories:** `['DevOps', 'Systems', 'Backend']`
- **Tags:** `['Node.js', 'Telegraf', 'PM2', 'Nginx', 'Linux', 'GCP', 'DevOps']`
- **Featured:** `true`
- **Key Technical Sections:**
  - Zero-heap streaming: Tailing PM2 error logs via `child_process` OS pipes (`tail -n 20`) without memory buffering on 1GB VPS.
  - Automated web sandbox pipeline: ZIP artifact discovery, automatic SPA vs. Node.js backend classification, dynamic port reservation, and atomic Nginx virtual host authoring.
  - Low-overhead telemetry: Native `curl -w` network breakdown (DNS, TCP, TTFB) and PageSpeed Insights API delegation.
  - Security architecture: Single Telegram ID authorization middleware and constrained shell alias runner.

### Article 3: Bot Architecture Showdown (Facebook Messenger vs. Telegram)
- **Slug:** `bot-engineering-showdown-facebook-webhooks-vs-telegram-api`
- **Title:** Bot Engineering Showdown: Facebook Messenger Webhooks vs. Telegram Bot API — Transport Protocols, State Machines, and AI Integration
- **Categories:** `['Architecture', 'AI Engineering', 'Systems']`
- **Tags:** `['Telegram Bot API', 'Meta Graph API', 'Webhooks', 'Gemini AI', 'State Machines', 'Node.js', 'TypeScript']`
- **Featured:** `true`
- **Key Technical Sections:**
  - Transport Layer: Meta Webhooks (`x-hub-signature-256`, 200 OK challenge verification) vs. Telegram Long Polling (`getUpdates`) and Webhooks.
  - Interactive UI & Callback State: Messenger Quick Replies / Generic Templates vs. Telegram Inline Keyboards & callback query routing.
  - Platform Constraints: Meta's 24-Hour Messaging Window & App Review barriers vs. Telegram's open BotFather ecosystem.
  - Gemini AI Orchestration: Managing stream latency, conversation state persistence, and token quotas across both messaging channels.

---

## 3. Database Execution Plan
1. Delete 5 pruned articles from `blogposts` collection in MongoDB Atlas.
2. Update article 9 title and slug to remove "for Juniors".
3. Insert 3 comprehensive, production-grade English technical deep-dive articles with rich HTML formatting (`.article-h2`, `.article-h3`, `.article-callout`, `.article-codeblock`, `.article-list`, `.article-badge`).
4. Re-run frontend build and static SEO prerender suite.
