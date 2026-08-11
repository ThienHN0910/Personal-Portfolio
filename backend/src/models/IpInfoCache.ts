import mongoose, { Schema, type Document } from 'mongoose'

export interface IIpInfoCache extends Document {
  ip: string
  city?: string
  region?: string
  country?: string
  countryCode?: string
  org?: string
  loc?: string
  timezone?: string
  isBogon?: boolean
  createdAt: Date
  updatedAt: Date
}

const IpInfoCacheSchema = new Schema<IIpInfoCache>(
  {
    ip: { type: String, required: true, unique: true, index: true },
    city: { type: String, default: '' },
    region: { type: String, default: '' },
    country: { type: String, default: '' },
    countryCode: { type: String, default: '' },
    org: { type: String, default: '' },
    loc: { type: String, default: '' },
    timezone: { type: String, default: '' },
    isBogon: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.IpInfoCache || mongoose.model<IIpInfoCache>('IpInfoCache', IpInfoCacheSchema)
