import { Router } from 'express'
import { webhook, setupCommands, setupMenuButton } from '../controllers/telegramController.js'

const router = Router()

router.post('/webhook', webhook)
router.post('/setup', setupCommands)
router.post('/menu', setupMenuButton)

export default router

