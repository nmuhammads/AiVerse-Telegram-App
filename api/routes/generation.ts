import { Router } from 'express'
import { handleGenerateImage, handleCheckPendingGenerations, getGenerationById, deleteGeneration, deleteEditVariant, getPendingCount, togglePromptPrivacy, handleMultiGenerate } from '../controllers/generationController'
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Protected routes (require auth for generation)
router.post('/generate', requireAuth as any, handleGenerateImage)
router.post('/generate/multi', requireAuth as any, handleMultiGenerate)
router.post('/check-status', requireAuth as any, handleCheckPendingGenerations)
router.get('/pending-count', requireAuth as any, getPendingCount)
router.get('/:id', optionalAuth as any, getGenerationById)
router.patch('/:id/privacy', requireAuth as any, togglePromptPrivacy)
router.delete('/:id', requireAuth as any, deleteGeneration)
router.delete('/:id/variant/:index', requireAuth as any, deleteEditVariant)

export default router