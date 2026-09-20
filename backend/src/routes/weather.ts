import { Router, type Request, type Response } from 'express'
import { lookupIpInfo } from '../lib/ipinfo'
import { connectToDatabase } from '../lib/mongodb'
import WeatherCache from '../models/WeatherCache'

const router = Router()

// Default fallback coordinates: Ho Chi Minh City, Vietnam
const DEFAULT_LATITUDE = 10.8231
const DEFAULT_LONGITUDE = 106.6297
const DEFAULT_CITY = 'Ho Chi Minh City'
const DEFAULT_COUNTRY = 'Vietnam'

export function mapWmoCodeToCondition(code: number): 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' {
  if (code === 0) return 'clear'
  if (code >= 1 && code <= 3) return 'cloudy'
  if (code === 45 || code === 48) return 'cloudy' // Foggy
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow'
  if (code >= 95 && code <= 99) return 'thunderstorm'
  return 'clear'
}

function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  let ip = ''

  if (typeof forwarded === 'string') {
    ip = forwarded.split(',')[0].trim()
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ip = forwarded[0].trim()
  } else {
    ip = req.socket?.remoteAddress || req.ip || 'Unknown'
  }

  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }

  return ip || 'Unknown'
}

router.get('/', async (req: Request, res: Response) => {
  try {
    await connectToDatabase()

    const clientIp = extractClientIp(req)
    const ipInfo = await lookupIpInfo(clientIp).catch(() => null)

    let latitude = DEFAULT_LATITUDE
    let longitude = DEFAULT_LONGITUDE
    let city = ipInfo?.city || DEFAULT_CITY
    const country = ipInfo?.country || DEFAULT_COUNTRY

    // Parse coordinates from ipInfo.loc e.g. "10.8231,106.6297"
    if (ipInfo?.loc && typeof ipInfo.loc === 'string') {
      const parts = ipInfo.loc.split(',')
      if (parts.length === 2) {
        const parsedLat = parseFloat(parts[0])
        const parsedLon = parseFloat(parts[1])
        if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
          latitude = parsedLat
          longitude = parsedLon
        }
      }
    }

    if (city === 'Localhost' || city === 'Private IP' || !city) {
      city = DEFAULT_CITY
    }

    // Cache key combines approximate rounded coords (0.1 deg ~ 10km) or city
    const cacheKey = `${city.toLowerCase()}_${latitude.toFixed(1)}_${longitude.toFixed(1)}`

    // 1. Check MongoDB TTL Cache (1-hour expiration)
    const cached = await WeatherCache.findOne({ cacheKey }).catch(() => null)
    if (cached) {
      return res.status(200).json({
        success: true,
        data: {
          city: cached.city,
          country: cached.country,
          latitude: cached.latitude,
          longitude: cached.longitude,
          temperature: cached.temperature,
          weatherCode: cached.weatherCode,
          condition: cached.condition,
          isDay: cached.isDay,
          cached: true,
          cachedAt: cached.createdAt,
        },
      })
    }

    // 2. Fetch from Open-Meteo API
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&current_weather=true`
    const weatherRes = await fetch(openMeteoUrl, {
      headers: { Accept: 'application/json' },
    })

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo returned status ${weatherRes.status}`)
    }

    const weatherJson = (await weatherRes.json()) as {
      current_weather?: {
        temperature: number
        windspeed: number
        winddirection: number
        weathercode: number
        is_day: number
        time: string
      }
    }

    const currentWeather = weatherJson.current_weather
    const temperature = currentWeather?.temperature ?? 28
    const weatherCode = currentWeather?.weathercode ?? 0
    const isDay = currentWeather?.is_day === 1
    const condition = mapWmoCodeToCondition(weatherCode)

    // 3. Store into MongoDB TTL Cache
    await WeatherCache.findOneAndUpdate(
      { cacheKey },
      {
        cacheKey,
        city,
        country,
        latitude,
        longitude,
        temperature,
        weatherCode,
        condition,
        isDay,
        createdAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).catch((err: unknown) => {
      console.warn('Failed to cache weather data in MongoDB:', err)
    })

    return res.status(200).json({
      success: true,
      data: {
        city,
        country,
        latitude,
        longitude,
        temperature,
        weatherCode,
        condition,
        isDay,
        cached: false,
      },
    })
  } catch (error: any) {
    console.error('Weather route error:', error)
    // Graceful fallback to default Ho Chi Minh City sunny/clear weather
    return res.status(200).json({
      success: true,
      data: {
        city: DEFAULT_CITY,
        country: DEFAULT_COUNTRY,
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        temperature: 29,
        weatherCode: 0,
        condition: 'clear',
        isDay: true,
        fallback: true,
      },
    })
  }
})

export default router
