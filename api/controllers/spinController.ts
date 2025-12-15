import { Request, Response } from 'express'
import { supaSelect, supaPatch, supaPost } from '../services/supabaseService.js'

// Segments configuration
// Indices mapping to UI Wheel segments: [500, 25, 50, 100, 50, CHANNEL, 50, 200, 75, 120]
const SEGMENTS = [
    { index: 0, value: 500, type: 'token', weight: 0.005 }, // 500
    { index: 1, value: 25, type: 'token', weight: 0.20 },   // 25
    { index: 2, value: 50, type: 'token', weight: 0.15 },   // 50
    { index: 3, value: 100, type: 'token', weight: 0.10 },  // 100
    { index: 4, value: 50, type: 'token', weight: 0.15 },   // 50
    { index: 5, value: 0, type: 'secret_channel', weight: 0.005 }, // CHANNEL
    { index: 6, value: 50, type: 'token', weight: 0.15 },   // 50
    { index: 7, value: 200, type: 'token', weight: 0.04 },  // 200
    { index: 8, value: 75, type: 'token', weight: 0.10 },   // 75
    { index: 9, value: 120, type: 'token', weight: 0.10 },  // 120
]

// Helper to select random segment based on weights
function getRandomSegment() {
    const random = Math.random()
    let accumulatedWeight = 0
    for (const segment of SEGMENTS) {
        accumulatedWeight += segment.weight
        if (random <= accumulatedWeight) {
            return segment
        }
    }
    return SEGMENTS[1] // Fallback to 25 tokens (High prob)
}

export async function handleSpin(req: Request, res: Response) {
    try {
        const { user_id } = req.body

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        // 1. Check User Spins and Balance
        const userRes = await supaSelect('users', `?user_id=eq.${user_id}&select=spins,balance`)

        if (!userRes.ok || !userRes.data || !Array.isArray(userRes.data) || userRes.data.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        const user = userRes.data[0]
        const currentSpins = user.spins || 0
        const currentBalance = user.balance || 0

        if (currentSpins < 1) {
            return res.status(403).json({ error: 'No spins remaining' })
        }

        // 2. Determine Result
        const prize = getRandomSegment()

        // 3. Update DB (Transaction-like logic)
        // Decrement Spin
        const newSpins = currentSpins - 1
        let newBalance = currentBalance

        if (prize.type === 'token') {
            newBalance += prize.value
        }

        // Update User
        const updateRes = await supaPatch('users', `?user_id=eq.${user_id}`, {
            spins: newSpins,
            balance: newBalance
        })

        if (!updateRes.ok) {
            console.error('Failed to update user spin/balance', updateRes)
            return res.status(500).json({ error: 'Transaction failed' })
        }

        // Log History (Fire and forget, or await)
        await supaPost('spin_history', {
            user_id: user_id,
            prize_type: prize.type,
            prize_amount: prize.value
        })

        // Return Result
        return res.json({
            success: true,
            prizeIndex: prize.index,
            prizeValue: prize.value,
            prizeType: prize.type,
            remainingSpins: newSpins,
            newBalance: newBalance
        })

    } catch (error) {
        console.error('Spin API Error:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
