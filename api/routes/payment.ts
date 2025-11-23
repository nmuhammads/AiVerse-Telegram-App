import express from 'express'
import { createStarsInvoice } from '../controllers/paymentController.js'

const router = express.Router()

router.post('/create-stars-invoice', createStarsInvoice)

export default router
