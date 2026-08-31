import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { connectToDatabase } from '../lib/mongodb'
import Theme from '../models/Theme'

const router = Router()

type ThemePayload = {
  name: string
  activeThemeId: string
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
  name: 'Editorial Design System',
  activeThemeId: 'editorial-dark',
  primaryColor: '#3b82f6',
  secondaryColor: '#06b6d4',
  accentColor: '#f59e0b',
  backgroundFrom: '#090A0C',
  backgroundTo: '#12141A',
  surfaceFrom: '#181A22',
  surfaceTo: '#12141A',
  headingGradientFrom: '#F5F5F7',
  headingGradientTo: '#8E919A',
  textPrimary: '#F5F5F7',
  textMuted: '#8E919A',
  useAnimatedGlow: true,
}

const VALID_THEME_IDS = ['editorial-dark', 'editorial-light', 'monochrome-cyber', 'warm-sepia', 'system']

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

  const activeThemeId = typeof payload.activeThemeId === 'string' && VALID_THEME_IDS.includes(payload.activeThemeId)
    ? payload.activeThemeId
    : DEFAULT_THEME.activeThemeId

  return {
    name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : DEFAULT_THEME.name,
    activeThemeId,
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