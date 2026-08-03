import mongoose, { Schema, type Document } from 'mongoose'

export interface IVisitorLog extends Document {
  ip: string
  path: string
  userAgent?: string
  referrer?: string
  createdAt: Date
  updatedAt: Date
}

const VisitorLogSchema = new Schema<IVisitorLog>(
  {
    ip: { type: String, required: true, trim: true, index: true },
    path: { type: String, required: true, trim: true, index: true },
    userAgent: { type: String, default: '', trim: true },
    referrer: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

VisitorLogSchema.index({ createdAt: -1 })

export default mongoose.models.VisitorLog || mongoose.model<IVisitorLog>('VisitorLog', VisitorLogSchema)
