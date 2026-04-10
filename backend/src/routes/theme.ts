import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import Theme from '../models/Theme'

const router = Router()

type ThemePayload = {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundFrom: string
  backgroundTo: string
  surfaceFrom: string
  surfaceTo: string
  headingGradientFrom: string
  headingGradientTo: string
  textPrimary: string
  textMuted: string
  useAnimatedGlow: boolean
}

const DEFAULT_THEME: ThemePayload = {
  name: 'Ocean Aurora',
  primaryColor: '#3b82f6',
  secondaryColor: '#06b6d4',
  accentColor: '#f59e0b',
  backgroundFrom: '#0f172a',
  backgroundTo: '#1e293b',
  surfaceFrom: '#111827',
  surfaceTo: '#0b1220',
  headingGradientFrom: '#38bdf8',
  headingGradientTo: '#f97316',
  textPrimary: '#e2e8f0',
  textMuted: '#94a3b8',
  useAnimatedGlow: true,
}

function isHexColor(value: string): boolean {
  return /^#(?:[\da-fA-F]{3}|[\da-fA-F]{6})$/.test(value)
}

function normalizeColor(input: unknown, fallback: string): string {
  if (typeof input !== 'string') return fallback
  const value = input.trim().toLowerCase()
  return isHexColor(value) ? value : fallback
}

function normalizeThemeInput(input: unknown): ThemePayload {
  const payload = input && typeof input === 'object' ? input as Record<string, unknown> : {}

  return {
    name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : DEFAULT_THEME.name,
    primaryColor: normalizeColor(payload.primaryColor, DEFAULT_THEME.primaryColor),
    secondaryColor: normalizeColor(payload.secondaryColor, DEFAULT_THEME.secondaryColor),
    accentColor: normalizeColor(payload.accentColor, DEFAULT_THEME.accentColor),
    backgroundFrom: normalizeColor(payload.backgroundFrom, DEFAULT_THEME.backgroundFrom),
    backgroundTo: normalizeColor(payload.backgroundTo, DEFAULT_THEME.backgroundTo),
    surfaceFrom: normalizeColor(payload.surfaceFrom, DEFAULT_THEME.surfaceFrom),
    surfaceTo: normalizeColor(payload.surfaceTo, DEFAULT_THEME.surfaceTo),
    headingGradientFrom: normalizeColor(payload.headingGradientFrom, DEFAULT_THEME.headingGradientFrom),
    headingGradientTo: normalizeColor(payload.headingGradientTo, DEFAULT_THEME.headingGradientTo),
    textPrimary: normalizeColor(payload.textPrimary, DEFAULT_THEME.textPrimary),
    textMuted: normalizeColor(payload.textMuted, DEFAULT_THEME.textMuted),
    useAnimatedGlow: typeof payload.useAnimatedGlow === 'boolean' ? payload.useAnimatedGlow : DEFAULT_THEME.useAnimatedGlow,
  }
}

router.get('/', async (_req, res) => {
  await connectToDatabase()

  try {
    let theme = await Theme.findOne()
    if (!theme) {
      theme = await Theme.create(DEFAULT_THEME)
    }

    const normalized = normalizeThemeInput(theme)
    const current = normalizeThemeInput(theme.toObject())
    if (JSON.stringify(normalized) !== JSON.stringify(current)) {
      Object.assign(theme, normalized)
      await theme.save()
    }

    return res.status(200).json({ success: true, data: theme })
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch theme settings' })
  }
})

router.put('/', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const payload = normalizeThemeInput(req.body)

    const theme = await Theme.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
    })

    return res.status(200).json({ success: true, data: theme })
  } catch {
    return res.status(400).json({ success: false, error: 'Failed to update theme settings' })
  }
})

export default router