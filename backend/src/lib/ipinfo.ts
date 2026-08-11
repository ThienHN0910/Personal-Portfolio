import IpInfoCache from '../models/IpInfoCache'

export interface IpInfoData {
  city?: string
  region?: string
  country?: string
  countryCode?: string
  org?: string
  loc?: string
  timezone?: string
  isBogon?: boolean
}

// Convert 2-character ISO country code (e.g. "VN") to full country name or keep code
const countryNames: Record<string, string> = {
  VN: 'Vietnam',
  US: 'United States',
  JP: 'Japan',
  KR: 'South Korea',
  SG: 'Singapore',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  CA: 'Canada',
  AU: 'Australia',
  IN: 'India',
  CN: 'China',
  TW: 'Taiwan',
  TH: 'Thailand',
  MY: 'Malaysia',
  ID: 'Indonesia',
  PH: 'Philippines',
}

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === 'Unknown' || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
    return true
  }

  // IPv4 Private Range Checks
  if (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('127.') ||
    ip.startsWith('169.254.')
  ) {
    return true
  }

  // 172.16.0.0 - 172.31.255.255
  if (ip.startsWith('172.')) {
    const parts = ip.split('.')
    if (parts.length >= 2) {
      const secondOctet = parseInt(parts[1], 10)
      if (secondOctet >= 16 && secondOctet <= 31) {
        return true
      }
    }
  }

  return false
}

export async function lookupIpInfo(ip: string): Promise<IpInfoData | null> {
  if (!ip || ip === 'Unknown') {
    return null
  }

  // Handle local / private IPs
  if (isPrivateIp(ip)) {
    return {
      city: 'Localhost',
      region: 'Local Network',
      country: 'Internal',
      countryCode: 'LOCAL',
      org: 'Loopback / Private IP',
      isBogon: true,
    }
  }

  try {
    // 1. Check MongoDB cache first
    const cached = await IpInfoCache.findOne({ ip })
    if (cached) {
      return {
        city: cached.city,
        region: cached.region,
        country: cached.country,
        countryCode: cached.countryCode,
        org: cached.org,
        loc: cached.loc,
        timezone: cached.timezone,
        isBogon: cached.isBogon,
      }
    }

    // 2. Fetch from ipinfo.io API
    const token = process.env.IPINFO_TOKEN
    const url = token
      ? `https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${encodeURIComponent(token)}`
      : `https://ipinfo.io/${encodeURIComponent(ip)}/json`

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      console.warn(`IPInfo lookup returned status ${response.status} for IP ${ip}`)
      return null
    }

    const data = (await response.json()) as {
      ip?: string
      city?: string
      region?: string
      country?: string
      org?: string
      loc?: string
      timezone?: string
      bogon?: boolean
    }

    if (data.bogon) {
      const bogonData: IpInfoData = {
        city: 'Private IP',
        region: 'Internal',
        country: 'Reserved',
        countryCode: 'LOCAL',
        org: 'Private Network',
        isBogon: true,
      }

      await IpInfoCache.create({
        ip,
        ...bogonData,
      }).catch(() => {})

      return bogonData
    }

    const countryCode = (data.country || '').toUpperCase()
    const country = countryNames[countryCode] || countryCode || 'Unknown'

    const ipInfoResult: IpInfoData = {
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country,
      countryCode,
      org: data.org || 'Unknown Provider',
      loc: data.loc || '',
      timezone: data.timezone || '',
      isBogon: false,
    }

    // Save to cache asynchronously
    await IpInfoCache.create({
      ip,
      ...ipInfoResult,
    }).catch((err) => {
      // Ignore duplicate key error if concurrent requests inserted it
      if ((err as any)?.code !== 11000) {
        console.error('Failed to cache IPInfo:', err)
      }
    })

    return ipInfoResult
  } catch (err) {
    console.error(`Error looking up IPInfo for ${ip}:`, err)
    return null
  }
}
