import { Request, Response } from 'express'
import { supaSelect, supaPost, supaPatch, supaHeaders, SUPABASE_URL, SUPABASE_KEY } from '../services/supabaseService.js'

// GET /api/notifications?user_id=X
export async function getNotifications(req: Request, res: Response) {
    const { user_id } = req.query
    if (!user_id) return res.status(400).json({ error: 'user_id required' })

    const q = await supaSelect('notifications', `?user_id=eq.${user_id}&order=created_at.desc&limit=20`)
    if (!q.ok) return res.status(500).json({ error: 'Failed to fetch' })

    return res.json({ items: q.data || [] })
}

// GET /api/app-news
export async function getAppNews(req: Request, res: Response) {
    const now = new Date().toISOString()
    const q = await supaSelect('app_news', `?starts_at=lte.${now}&or=(expires_at.is.null,expires_at.gte.${now})&order=created_at.desc&limit=10`)
    if (!q.ok) return res.status(500).json({ error: 'Failed to fetch' })

    return res.json({ items: q.data || [] })
}

// GET /api/notifications/count?user_id=X
export async function getUnreadCount(req: Request, res: Response) {
    const { user_id } = req.query
    if (!user_id) return res.status(400).json({ error: 'user_id required' })

    // Count personal unread
    const personal = await supaSelect('notifications', `?user_id=eq.${user_id}&read=eq.false&select=id`)
    const personalCount = Array.isArray(personal.data) ? personal.data.length : 0

    // Count active news (could track read separately, for now just count active)
    const now = new Date().toISOString()
    const news = await supaSelect('app_news', `?starts_at=lte.${now}&or=(expires_at.is.null,expires_at.gte.${now})&select=id`)
    const newsCount = Array.isArray(news.data) ? news.data.length : 0

    return res.json({ personal: personalCount, news: newsCount, total: personalCount + newsCount })
}

// POST /api/notifications/read-all
export async function markAllRead(req: Request, res: Response) {
    const { user_id } = req.body
    if (!user_id) return res.status(400).json({ error: 'user_id required' })

    await supaPatch('notifications', `?user_id=eq.${user_id}&read=eq.false`, { read: true })
    return res.json({ ok: true })
}

// PATCH /api/user/notification-settings
export async function updateNotificationSettings(req: Request, res: Response) {
    const { user_id, settings } = req.body
    if (!user_id || !settings) return res.status(400).json({ error: 'user_id and settings required' })

    await supaPatch('users', `?user_id=eq.${user_id}`, { notification_settings: settings })
    return res.json({ ok: true })
}

// Helper: Create notification for a user
export async function createNotification(
    userId: number,
    type: string,
    title: string,
    body: string,
    data?: Record<string, unknown>
) {
    // Delete oldest if over limit (20)
    const existing = await supaSelect('notifications', `?user_id=eq.${userId}&order=created_at.desc&select=id`)
    if (Array.isArray(existing.data) && existing.data.length >= 20) {
        const toDelete = existing.data.slice(19).map((n: { id: number }) => n.id)
        if (toDelete.length > 0) {
            // Delete old ones
            for (const id of toDelete) {
                await fetch(`${SUPABASE_URL}/rest/v1/notifications?id=eq.${id}`, {
                    method: 'DELETE',
                    headers: supaHeaders()
                })
            }
        }
    }

    await supaPost('notifications', {
        user_id: userId,
        type,
        title,
        body,
        data: data || {},
        read: false
    })
}
