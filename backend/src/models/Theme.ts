import mongoose, { Schema, type Document } from 'mongoose'

export interface ITheme extends Document {
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

const ThemeSchema = new Schema<ITheme>(
  {
    name: { type: String, default: 'Editorial Design System', trim: true },
    activeThemeId: { type: String, default: 'editorial-dark', trim: true },
    primaryColor: { type: String, default: '#3b82f6' },
    secondaryColor: { type: String, default: '#06b6d4' },
    accentColor: { type: String, default: '#f59e0b' },
    backgroundFrom: { type: String, default: '#090A0C' },
    backgroundTo: { type: String, default: '#12141A' },
    surfaceFrom: { type: String, default: '#181A22' },
    surfaceTo: { type: String, default: '#12141A' },
    headingGradientFrom: { type: String, default: '#F5F5F7' },
    headingGradientTo: { type: String, default: '#8E919A' },
    textPrimary: { type: String, default: '#F5F5F7' },
    textMuted: { type: String, default: '#8E919A' },
    useAnimatedGlow: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Theme || mongoose.model<ITheme>('Theme', ThemeSchema)