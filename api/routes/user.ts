import { Router } from 'express'
import { getAvatar, uploadAvatar } from '../controllers/userController.js'

const router = Router()
router.get('/avatar/:userId', getAvatar)
router.post('/avatar/upload', uploadAvatar)
export default router
