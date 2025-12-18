import { Router } from 'express'
import { getAppNews } from '../controllers/notificationController.js'

const router = Router()

router.get('/', getAppNews)

export default router
