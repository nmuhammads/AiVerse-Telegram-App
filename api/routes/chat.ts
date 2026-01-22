/**
 * AI Chat Routes
 */

import { Router } from 'express'
import { handleChat, getAvailableModels } from '../controllers/chatController.js'

const router = Router()

// POST /api/chat - отправить сообщение AI
router.post('/', handleChat)

// GET /api/chat/models - получить список моделей
router.get('/models', getAvailableModels)

export default router
