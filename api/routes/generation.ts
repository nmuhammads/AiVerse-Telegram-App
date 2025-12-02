import { Router } from 'express'
import { handleGenerateImage, handleManualGeneration } from '../controllers/generationController'

const router = Router()

// Эндпоинт для генерации изображений
router.post('/generate', handleGenerateImage)
router.post('/manual', handleManualGeneration)

export default router