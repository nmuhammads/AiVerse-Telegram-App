import { Request, Response } from 'express'
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN || '')

export const createStarsInvoice = async (req: Request, res: Response) => {
    try {
        const { title, description, payload, currency, amount } = req.body

        if (!title || !description || !payload || !currency || !amount) {
            return res.status(400).json({ success: false, error: 'Missing required fields' })
        }

        const invoiceLink = await bot.telegram.createInvoiceLink({
            title,
            description,
            payload,
            provider_token: '', // Empty for Stars
            currency: 'XTR', // Currency for Stars
            prices: [{ label: title, amount: parseInt(amount) }],
        })

        res.json({ success: true, invoiceLink })
    } catch (error) {
        console.error('Error creating invoice:', error)
        res.status(500).json({ success: false, error: 'Failed to create invoice' })
    }
}
