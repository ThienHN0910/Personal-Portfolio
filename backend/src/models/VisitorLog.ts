import mongoose, { Schema, type Document } from 'mongoose'

export interface IVisitorLog extends Document {
  ip: string
  path: string
  userAgent?: string
  referrer?: string
  fromCompany?: string
  ipInfo?: {
    city?: string
    region?: string
    country?: string
    countryCode?: string
    org?: string
    loc?: string
    timezone?: string
  }
  createdAt: Date
  updatedAt: Date
}

const VisitorLogSchema = new Schema<IVisitorLog>(
  {
    ip: { type: String, required: true, trim: true, index: true },
    path: { type: String, required: true, trim: true, index: true },
    userAgent: { type: String, default: '', trim: true },
    referrer: { type: String, default: '', trim: true },
    fromCompany: { type: String, default: '', trim: true, index: true },
    ipInfo: {
      city: { type: String, default: '' },
      region: { type: String, default: '' },
      country: { type: String, default: '' },
      countryCode: { type: String, default: '' },
      org: { type: String, default: '' },
      loc: { type: String, default: '' },
      timezone: { type: String, default: '' },
    },
  },
  { timestamps: true },
)

VisitorLogSchema.index({ createdAt: -1 })
VisitorLogSchema.index({ fromCompany: 1, createdAt: -1 })

export default mongoose.models.VisitorLog || mongoose.model<IVisitorLog>('VisitorLog', VisitorLogSchema)

