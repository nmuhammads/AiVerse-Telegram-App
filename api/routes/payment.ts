import { Router } from 'express'
import { createStarsInvoice } from '../controllers/paymentController.js'

const router = Router()

router.post('/create-stars-invoice', createStarsInvoice)

export default router
