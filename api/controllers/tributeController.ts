/**
 * Tribute Shop API Controller
 * Handles order creation and status checking for web payments
 */

import { Request, Response } from 'express'
import { createOrder, getOrderStatus, type TributeCurrency } from '../services/tributeService.js'
import { findPackage, getPackageTitle, getPackageDescription } from '../config/tokenPackages.js'
import { supaPost, supaSelect } from '../services/supabaseService.js'
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'

const APP_URL = process.env.APP_URL || 'https://aiverse.app'

interface CreateOrderBody {
    packageId: string
    currency: TributeCurrency
    email?: string
}

/**
 * POST /api/tribute/create-order
 * Create a new Tribute order and return payment URL
 */
export async function createTributeOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { packageId, currency, email } = req.body as CreateOrderBody
        const userId = req.user?.id

        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' })
            return
        }

        if (!packageId || !currency) {
            res.status(400).json({ success: false, error: 'Missing packageId or currency' })
            return
        }

        if (currency !== 'eur' && currency !== 'rub') {
            res.status(400).json({ success: false, error: 'Invalid currency. Must be "eur" or "rub"' })
            return
        }

        // Find package
        const pkg = findPackage(packageId, currency)
        if (!pkg) {
            res.status(400).json({ success: false, error: 'Package not found' })
            return
        }

        // Create Tribute order (uuid not known yet, will update successUrl after)
        const tributeOrder = await createOrder({
            amount: pkg.amount,
            currency: currency,
            title: getPackageTitle(pkg),
            description: getPackageDescription(pkg),
            successUrl: `${APP_URL}/payment/success`,
            failUrl: `${APP_URL}/payment/fail`,
            email: email,
            customerId: String(userId),
        })

        // Save order to database
        const orderData = {
            uuid: tributeOrder.uuid,
            user_id: userId,
            amount: pkg.amount,
            currency: currency,
            tokens: pkg.tokens,
            status: 'pending',
            payment_url: tributeOrder.paymentUrl,
        }

        const saveResult = await supaPost('tribute_orders', orderData)
        if (!saveResult.ok) {
            console.error('[TributeController] Failed to save order:', saveResult.data)
            // Still return payment URL even if save failed - webhook will handle the payment
        }

        console.log(`[TributeController] Order created: ${tributeOrder.uuid} for user ${userId} (${pkg.tokens} tokens, ${pkg.amount} ${currency})`)

        res.json({
            success: true,
            paymentUrl: tributeOrder.paymentUrl,
            orderUuid: tributeOrder.uuid,
        })
    } catch (error: any) {
        console.error('[TributeController] Error creating order:', error)
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create order'
        })
    }
}

/**
 * GET /api/tribute/order/:uuid/status
 * Check order status
 */
export async function checkOrderStatus(req: Request, res: Response): Promise<void> {
    try {
        const { uuid } = req.params

        if (!uuid) {
            res.status(400).json({ success: false, error: 'Missing order UUID' })
            return
        }

        // First check our database
        const localResult = await supaSelect('tribute_orders', `?uuid=eq.${uuid}&select=status,tokens,paid_at`)
        if (localResult.ok && Array.isArray(localResult.data) && localResult.data.length > 0) {
            const order = localResult.data[0]
            res.json({
                success: true,
                status: order.status,
                tokens: order.tokens,
                paidAt: order.paid_at,
            })
            return
        }

        // Fallback to Tribute API
        const tributeStatus = await getOrderStatus(uuid)
        res.json({
            success: true,
            status: tributeStatus.status,
        })
    } catch (error: any) {
        console.error('[TributeController] Error checking order status:', error)
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to check order status'
        })
    }
}

/**
 * GET /api/tribute/packages
 * Get available packages for currency
 */
export async function getPackagesList(req: Request, res: Response): Promise<void> {
    try {
        const currency = (req.query.currency as TributeCurrency) || 'eur'

        if (currency !== 'eur' && currency !== 'rub') {
            res.status(400).json({ success: false, error: 'Invalid currency' })
            return
        }

        const { getPackages } = await import('../config/tokenPackages.js')
        const packages = getPackages(currency)

        res.json({
            success: true,
            currency,
            packages,
        })
    } catch (error: any) {
        console.error('[TributeController] Error getting packages:', error)
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get packages'
        })
    }
}
