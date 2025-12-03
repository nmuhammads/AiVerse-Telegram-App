/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ ok: true })
})

import bcrypt from 'bcrypt'
import { supaSelect } from '../services/supabaseService.js'

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password } = req.body

    if (!userId || !password) {
      res.status(400).json({ error: 'Missing credentials' })
      return
    }

    // Fetch user from Supabase
    const { data: users, ok } = await supaSelect('users', `?user_id=eq.${userId}&select=*`)

    if (!ok || !users || users.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const user = users[0]

    if (!user.password_hash) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ ok: true })
})

export default router
