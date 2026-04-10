import mongoose, { Schema, type Document } from 'mongoose'

export interface ITheme extends Document {
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

const ThemeSchema = new Schema<ITheme>(
  {
    name: { type: String, default: 'Ocean Aurora', trim: true },
    primaryColor: { type: String, default: '#3b82f6' },
    secondaryColor: { type: String, default: '#06b6d4' },
    accentColor: { type: String, default: '#f59e0b' },
    backgroundFrom: { type: String, default: '#0f172a' },
    backgroundTo: { type: String, default: '#1e293b' },
    surfaceFrom: { type: String, default: '#111827' },
    surfaceTo: { type: String, default: '#0b1220' },
    headingGradientFrom: { type: String, default: '#38bdf8' },
    headingGradientTo: { type: String, default: '#f97316' },
    textPrimary: { type: String, default: '#e2e8f0' },
    textMuted: { type: String, default: '#94a3b8' },
    useAnimatedGlow: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Theme || mongoose.model<ITheme>('Theme', ThemeSchema)