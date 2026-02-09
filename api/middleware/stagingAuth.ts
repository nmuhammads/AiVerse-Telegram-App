/**
 * Staging Basic Auth Middleware
 * Protects staging environment with HTTP Basic Authentication
 * Only active when STAGING_PASSWORD env variable is set
 */

import { Request, Response, NextFunction } from 'express'

const STAGING_USERNAME = process.env.STAGING_USERNAME || 'admin'
const STAGING_PASSWORD = process.env.STAGING_PASSWORD

export function stagingAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Skip if no staging password configured (production)
    if (!STAGING_PASSWORD) {
        next()
        return
    }

    // Skip health check endpoint
    if (req.path === '/api/health') {
        next()
        return
    }

    // Skip webhook endpoints (they have their own auth)
    if (req.path.includes('/webhook')) {
        next()
        return
    }

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Staging Environment"')
        res.status(401).send('Authentication required for staging environment')
        return
    }

    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8')
    const [username, password] = credentials.split(':')

    if (username === STAGING_USERNAME && password === STAGING_PASSWORD) {
        next()
        return
    }

    res.set('WWW-Authenticate', 'Basic realm="Staging Environment"')
    res.status(401).send('Invalid credentials')
}
