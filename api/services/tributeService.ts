/**
 * Tribute Shop API Service
 * REST client for creating orders and checking status
 * Docs: https://wiki.tribute.tg/for-shops/api
 */

import * as dotenv from 'dotenv'
import * as crypto from 'crypto'

dotenv.config()

const TRIBUTE_API_URL = 'https://tribute.tg/api/v1'
const TRIBUTE_API_KEY = process.env.TRIBUTE_API_KEY || ''

// ============ Types ============

export type TributeCurrency = 'eur' | 'rub'
export type TributeOrderStatus = 'pending' | 'paid' | 'failed'

export interface CreateOrderParams {
    amount: number           // in cents (EUR) or kopecks (RUB)
    currency: TributeCurrency
    title: string            // max 100 UTF-16 chars
    description: string      // max 300 UTF-16 chars
    successUrl: string
    failUrl: string
    email?: string
    customerId: string       // our user_id as string
}

export interface TributeOrderResponse {
    uuid: string
    paymentUrl: string
}

export interface TributeOrderStatusResponse {
    status: TributeOrderStatus
}

export interface TributeShopInfo {
    userId: number
    name: string
    link: string
    callbackUrl: string
    recurrent: boolean
    onlyStars: boolean
    status: number
}

export interface TributeApiError {
    error: string
    message: string
}

// ============ API Client ============

function tributeHeaders(): Record<string, string> {
    return {
        'Api-Key': TRIBUTE_API_KEY,
        'Content-Type': 'application/json',
    }
}

/**
 * Create a new shop order
 * POST /shop/orders
 */
export async function createOrder(params: CreateOrderParams): Promise<TributeOrderResponse> {
    const response = await fetch(`${TRIBUTE_API_URL}/shop/orders`, {
        method: 'POST',
        headers: tributeHeaders(),
        body: JSON.stringify({
            amount: params.amount,
            currency: params.currency,
            title: params.title,
            description: params.description,
            successUrl: params.successUrl,
            failUrl: params.failUrl,
            email: params.email,
            customerId: params.customerId,
        }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'unknown', message: 'Unknown error' })) as TributeApiError
        console.error('[TributeService] Create order error:', error)
        throw new Error(error.message || `Tribute API error: ${response.status}`)
    }

    return response.json() as Promise<TributeOrderResponse>
}

/**
 * Get order status by UUID
 * GET /shop/orders/{orderUuid}/status
 */
export async function getOrderStatus(orderUuid: string): Promise<TributeOrderStatusResponse> {
    const response = await fetch(`${TRIBUTE_API_URL}/shop/orders/${orderUuid}/status`, {
        method: 'GET',
        headers: tributeHeaders(),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'unknown', message: 'Unknown error' })) as TributeApiError
        console.error('[TributeService] Get order status error:', error)
        throw new Error(error.message || `Tribute API error: ${response.status}`)
    }

    return response.json() as Promise<TributeOrderStatusResponse>
}

/**
 * Get shop information
 * GET /shop
 */
export async function getShopInfo(): Promise<TributeShopInfo> {
    const response = await fetch(`${TRIBUTE_API_URL}/shop`, {
        method: 'GET',
        headers: tributeHeaders(),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'unknown', message: 'Unknown error' })) as TributeApiError
        console.error('[TributeService] Get shop info error:', error)
        throw new Error(error.message || `Tribute API error: ${response.status}`)
    }

    return response.json() as Promise<TributeShopInfo>
}

/**
 * Verify webhook signature
 * HMAC-SHA256 of body signed with API key
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
    if (!signature || !TRIBUTE_API_KEY) {
        return false
    }

    const hmac = crypto.createHmac('sha256', TRIBUTE_API_KEY)
    hmac.update(body)
    const expectedSignature = hmac.digest('hex')

    return signature === expectedSignature
}
