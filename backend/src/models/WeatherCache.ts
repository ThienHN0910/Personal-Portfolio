import mongoose, { Schema, type Document } from 'mongoose'

export interface IWeatherCache extends Document {
  cacheKey: string
  city: string
  country: string
  latitude: number
  longitude: number
  temperature: number
  weatherCode: number
  condition: string
  isDay: boolean
  createdAt: Date
  updatedAt: Date
}

const WeatherCacheSchema = new Schema<IWeatherCache>(
  {
    cacheKey: { type: String, required: true, unique: true, index: true },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    temperature: { type: Number, default: 25 },
    weatherCode: { type: Number, default: 0 },
    condition: { type: String, default: 'clear' },
    isDay: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }, // 1-hour TTL
  },
  { timestamps: true },
)

export default mongoose.models.WeatherCache || mongoose.model<IWeatherCache>('WeatherCache', WeatherCacheSchema)
