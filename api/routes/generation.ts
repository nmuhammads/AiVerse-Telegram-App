import { Router } from 'express'
import { handleGenerateImage, handleCheckPendingGenerations, getGenerationById, deleteGeneration, deleteEditVariant, getPendingCount } from '../controllers/generationController'

const router = Router()

// Эндпоинт для генерации изображений
router.post('/generate', handleGenerateImage)
router.post('/check-status', handleCheckPendingGenerations)
router.get('/pending-count', getPendingCount)
router.get('/:id', getGenerationById)
router.delete('/:id', deleteGeneration)
router.delete('/:id/variant/:index', deleteEditVariant)

export default router