import mongoose, { Schema, type Document } from 'mongoose'

export interface ICategorySettings extends Document {
  projectCategories: string[]
  blogCategories: string[]
}

const CategorySettingsSchema = new Schema<ICategorySettings>(
  {
    projectCategories: [{ type: String, trim: true }],
    blogCategories: [{ type: String, trim: true }],
  },
  { timestamps: true },
)

export default mongoose.models.CategorySettings || mongoose.model<ICategorySettings>('CategorySettings', CategorySettingsSchema)
