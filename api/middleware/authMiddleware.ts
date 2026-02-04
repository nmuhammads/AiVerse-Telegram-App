/**
 * Auth Middleware for AiVerse API
 * Supports multiple authentication methods:
 * - Telegram Mini App (initData validation)
 * - JWT Bearer token (for future Web/Mobile apps)
 */

import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

// Extended Request type with authenticated user
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number
        username?: string
        first_name?: string
        last_name?: string
        language_code?: string
        is_premium?: boolean
        auth_method: 'telegram' | 'jwt'
    }
}

/**
 * Validate Telegram Web App initData
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(initData: string): AuthenticatedRequest['user'] | null {
    if (!initData || !BOT_TOKEN) {
        return null
    }

    try {
        // Parse the initData string into key-value pairs
        const params = new URLSearchParams(initData)
        const hash = params.get('hash')

        if (!hash) {
            console.warn('[Auth] Missing hash in initData')
            return null
        }

        // Remove hash from params for verification
        params.delete('hash')

        // Sort params alphabetically and create data-check-string
        const dataCheckArr: string[] = []
        const sortedKeys = Array.from(params.keys()).sort()
        for (const key of sortedKeys) {
            dataCheckArr.push(`${key}=${params.get(key)}`)
        }
        const dataCheckString = dataCheckArr.join('\n')

        // Create secret key: HMAC-SHA256 of bot token with "WebAppData" as key
        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()

        // Calculate hash
        const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

        // Compare hashes
        if (calculatedHash !== hash) {
            console.warn('[Auth] Invalid hash in initData')
            return null
        }

        // Check auth_date (prevent replay attacks - allow up to 24 hours)
        const authDate = params.get('auth_date')
        if (authDate) {
            const authTimestamp = parseInt(authDate, 10) * 1000
            const now = Date.now()
            const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

            if (now - authTimestamp > maxAge) {
                console.warn('[Auth] initData expired (auth_date too old)')
                return null
            }
        }

        // Extract user data
        const userJson = params.get('user')
        if (!userJson) {
            console.warn('[Auth] Missing user in initData')
            return null
        }

        const user = JSON.parse(userJson)

        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            language_code: user.language_code,
            is_premium: user.is_premium,
            auth_method: 'telegram'
        }
    } catch (error) {
        console.error('[Auth] Error validating initData:', error)
        return null
    }
}

/**
 * Middleware that requires authentication
 * Checks for Telegram initData or JWT Bearer token
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    // Check for Telegram initData header
    const telegramInitData = req.header('X-Telegram-Init-Data')

    if (telegramInitData) {
        const user = validateTelegramInitData(telegramInitData)
        if (user) {
            req.user = user
            return next()
        }
    }

    // Check for JWT Bearer token (placeholder for future Web/Mobile apps)
    const authHeader = req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)
        // TODO: Implement JWT validation when Web/Mobile apps are ready
        // const user = validateJWT(token)
        // if (user) { req.user = user; return next() }
        console.info('[Auth] JWT auth attempted but not yet implemented:', token.slice(0, 10) + '...')
    }

    // No valid authentication found
    res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid authentication required'
    })
}

/**
 * Optional auth middleware - sets req.user if authenticated, but doesn't block
 * Useful for public endpoints that behave differently for authenticated users
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const telegramInitData = req.header('X-Telegram-Init-Data')

    if (telegramInitData) {
        const user = validateTelegramInitData(telegramInitData)
        if (user) {
            req.user = user
        }
    }

    // JWT check for future
    const authHeader = req.header('Authorization')
    if (!req.user && authHeader?.startsWith('Bearer ')) {
        // TODO: JWT validation
    }

    next()
}
