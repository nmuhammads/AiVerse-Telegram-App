/**
 * Tribute Shop API Routes
 * Web payment endpoints
 */

import { Router } from 'express'
import { createTributeOrder, checkOrderStatus, getPackagesList } from '../controllers/tributeController.js'
import { handleTributeWebhook } from '../controllers/tributeWebhookController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Protected routes (require authentication)
router.post('/create-order', requireAuth as any, createTributeOrder)
router.get('/order/:uuid/status', checkOrderStatus)

// Public route - get available packages
router.get('/packages', getPackagesList)

// Webhook route (needs raw body for signature verification)
// Note: raw body middleware is applied in app.ts before this route
router.post('/webhook', handleTributeWebhook)

export default router
