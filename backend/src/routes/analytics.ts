import { Router } from 'express'

import { requireAdmin } from '../lib/auth'
import { lookupIpInfo } from '../lib/ipinfo'
import { connectToDatabase } from '../lib/mongodb'
import VisitorLog from '../models/VisitorLog'

const router = Router()

function extractClientIp(req: any): string {
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

router.post('/track', async (req, res) => {
  try {
    const { path, userAgent, referrer, fromCompany } = req.body as {
      path?: string
      userAgent?: string
      referrer?: string
      fromCompany?: string
    }

    if (!path || typeof path !== 'string') {
      return res.status(400).json({ success: false, error: 'Path is required' })
    }

    // Skip tracking for admin and system routes
    if (path.startsWith('/admin') || path.startsWith('/auth/callback') || path.startsWith('/api')) {
      return res.status(200).json({ success: true, skipped: true })
    }

    await connectToDatabase()

    const clientIp = extractClientIp(req)
    const clientUserAgent = (userAgent || req.headers['user-agent'] || '').slice(0, 500)
    const clientReferrer = (referrer || req.headers['referer'] || '').slice(0, 500)
    const cleanedCompany = (fromCompany || '').trim().slice(0, 100)

    // Retrieve IP geolocation info
    const ipInfo = await lookupIpInfo(clientIp).catch(() => null)

    await VisitorLog.create({
      ip: clientIp,
      path: path.slice(0, 250),
      userAgent: clientUserAgent,
      referrer: clientReferrer,
      fromCompany: cleanedCompany,
      ipInfo: ipInfo || undefined,
    })

    return res.status(201).json({ success: true })
  } catch (err) {
    console.error('Analytics tracking error:', err)
    return res.status(500).json({ success: false, error: 'Failed to record log' })
  }
})

router.get('/stats', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const totalViews = await VisitorLog.countDocuments()

    const distinctIps = await VisitorLog.distinct('ip')
    const uniqueVisitors = distinctIps.length

    const past24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const viewsPast24h = await VisitorLog.countDocuments({ createdAt: { $gte: past24h } })

    const companyViews = await VisitorLog.countDocuments({ fromCompany: { $ne: '' } })

    const topPagesAgg = await VisitorLog.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ])

    const topPages = topPagesAgg.map((item) => ({
      path: item._id,
      count: item.count,
    }))

    const topCompaniesAgg = await VisitorLog.aggregate([
      { $match: { fromCompany: { $ne: '' } } },
      { $group: { _id: '$fromCompany', count: { $sum: 1 }, lastVisit: { $max: '$createdAt' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    const topCompanies = topCompaniesAgg.map((item) => ({
      company: item._id,
      count: item.count,
      lastVisit: item.lastVisit,
    }))

    return res.status(200).json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors,
        viewsPast24h,
        companyViews,
        topPages,
        topCompanies,
      },
    })
  } catch (err) {
    console.error('Analytics stats error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch analytics stats' })
  }
})

router.get('/grouped-ips', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 15))
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''

    const matchFilter: any = {}
    if (search) {
      matchFilter.$or = [
        { ip: { $regex: search, $options: 'i' } },
        { path: { $regex: search, $options: 'i' } },
        { fromCompany: { $regex: search, $options: 'i' } },
        { userAgent: { $regex: search, $options: 'i' } },
        { 'ipInfo.city': { $regex: search, $options: 'i' } },
        { 'ipInfo.country': { $regex: search, $options: 'i' } },
        { 'ipInfo.org': { $regex: search, $options: 'i' } },
      ]
    }

    const pipeline: any[] = [
      { $match: matchFilter },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$ip',
          ip: { $first: '$ip' },
          totalViews: { $sum: 1 },
          firstSeen: { $min: '$createdAt' },
          lastSeen: { $max: '$createdAt' },
          companiesRaw: { $addToSet: '$fromCompany' },
          ipInfo: { $first: '$ipInfo' },
          latestUserAgent: { $first: '$userAgent' },
          history: {
            $push: {
              _id: '$_id',
              path: '$path',
              referrer: '$referrer',
              userAgent: '$userAgent',
              fromCompany: '$fromCompany',
              createdAt: '$createdAt',
            },
          },
        },
      },
      { $sort: { lastSeen: -1 } },
    ]

    const fullAgg = await VisitorLog.aggregate(pipeline)
    const totalDistinctIps = fullAgg.length

    const paginatedPipeline = [
      ...pipeline,
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]

    const results = await VisitorLog.aggregate(paginatedPipeline)

    const formattedData = results.map((item) => {
      const companies = (item.companiesRaw || []).filter((c: string) => c && c.trim() !== '')
      return {
        ip: item._id,
        totalViews: item.totalViews,
        firstSeen: item.firstSeen,
        lastSeen: item.lastSeen,
        companies,
        ipInfo: item.ipInfo || null,
        latestUserAgent: item.latestUserAgent || '',
        history: item.history,
      }
    })

    return res.status(200).json({
      success: true,
      data: formattedData,
      pagination: {
        total: totalDistinctIps,
        page,
        limit,
        totalPages: Math.ceil(totalDistinctIps / limit) || 1,
      },
    })
  } catch (err) {
    console.error('Grouped IP analytics error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch grouped visitor logs' })
  }
})

router.get('/logs', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(10, Number(req.query.limit) || 25))
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''

    const filter: any = {}
    if (search) {
      filter.$or = [
        { ip: { $regex: search, $options: 'i' } },
        { path: { $regex: search, $options: 'i' } },
        { userAgent: { $regex: search, $options: 'i' } },
        { fromCompany: { $regex: search, $options: 'i' } },
        { 'ipInfo.city': { $regex: search, $options: 'i' } },
        { 'ipInfo.country': { $regex: search, $options: 'i' } },
        { 'ipInfo.org': { $regex: search, $options: 'i' } },
      ]
    }

    const total = await VisitorLog.countDocuments(filter)
    const logs = await VisitorLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (err) {
    console.error('Analytics logs error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch visitor logs' })
  }
})

router.delete('/logs/ip/:ip', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const ipToPurge = req.params.ip
    const result = await VisitorLog.deleteMany({ ip: ipToPurge })

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted all ${result.deletedCount} log entries for IP ${ipToPurge}`,
    })
  } catch (err) {
    console.error('Delete IP logs error:', err)
    return res.status(500).json({ success: false, error: 'Failed to delete logs for IP' })
  }
})

router.delete('/logs/:id', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const log = await VisitorLog.findByIdAndDelete(req.params.id)
    if (!log) return res.status(404).json({ success: false, error: 'Log entry not found' })

    return res.status(200).json({ success: true, message: 'Deleted log successfully' })
  } catch (err) {
    console.error('Delete log error:', err)
    return res.status(500).json({ success: false, error: 'Failed to delete log entry' })
  }
})

router.delete('/logs', async (req, res) => {
  const user = requireAdmin(req, res)
  if (!user) return

  await connectToDatabase()

  try {
    const mode = req.query.mode as string
    const days = Number(req.query.days) || 30

    let result
    if (mode === 'all') {
      result = await VisitorLog.deleteMany({})
    } else if (mode === 'olderThanDays') {
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      result = await VisitorLog.deleteMany({ createdAt: { $lt: cutoffDate } })
    } else {
      return res.status(400).json({ success: false, error: 'Invalid delete mode' })
    }

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} log entries`,
    })
  } catch (err) {
    console.error('Bulk delete logs error:', err)
    return res.status(500).json({ success: false, error: 'Failed to perform bulk delete' })
  }
})

export default router
