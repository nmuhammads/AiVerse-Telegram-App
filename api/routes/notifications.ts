import { Router } from 'express'
import {
    getNotifications,
    getAppNews,
    getUnreadCount,
    markAllRead,
    updateNotificationSettings
} from '../controllers/notificationController.js'

const router = Router()

router.get('/', getNotifications)
router.get('/count', getUnreadCount)
router.post('/read-all', markAllRead)

export default router
