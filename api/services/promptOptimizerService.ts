/**
 * Prompt Optimizer Service
 * Использует модель wavespeed-ai/molmo2/prompt-optimizer для:
 * 1. Улучшения текстовых промптов
 * 2. Генерации промптов по изображениям
 */

const WAVESPEED_API_KEY = process.env.WAVESPEED_API_KEY || ''
const MOLMO2_API_URL = 'https://api.wavespeed.ai/api/v3/wavespeed-ai/molmo2/prompt-optimizer'

export type PromptStyle = 'default' | 'artistic' | 'photographic' | 'technical' | 'anime' | 'realistic'
export type PromptMode = 'image' | 'video'

interface PromptOptimizerResponse {
    id: string
    status: string
    outputs?: string[]
    model?: string
    created_at?: string
}

/**
 * Улучшить текстовый промпт
 */
export async function optimizeTextPrompt(
    text: string,
    style: PromptStyle = 'realistic',
    mode: PromptMode = 'image'
): Promise<string> {
    if (!text?.trim()) {
        throw new Error('Text is required for prompt optimization')
    }

    console.log('[PromptOptimizer] Optimizing text prompt:', { text: text.slice(0, 50), style, mode })

    const resp = await fetch(MOLMO2_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WAVESPEED_API_KEY}`
        },
        body: JSON.stringify({
            text,
            style,
            mode,
            enable_sync_mode: true  // Синхронный режим - результат сразу
        })
    })

    const json = await resp.json()
    console.log('[PromptOptimizer] Response:', json)

    if (!resp.ok) {
        throw new Error(json.error || json.data?.error || 'Prompt optimization failed')
    }

    // Ответ в sync mode: { data: { outputs: ['...'] } }
    const data = json.data || json
    const outputs = data.outputs || []

    if (outputs.length === 0) {
        throw new Error('No optimized prompt returned')
    }

    return outputs[0]
}

/**
 * Сгенерировать промпт по изображению
 */
export async function describeImage(
    imageUrl: string,
    style: PromptStyle = 'realistic',
    mode: PromptMode = 'image'
): Promise<string> {
    if (!imageUrl?.trim()) {
        throw new Error('Image URL is required')
    }

    console.log('[PromptOptimizer] Describing image:', { imageUrl: imageUrl.slice(0, 50), style, mode })

    const resp = await fetch(MOLMO2_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WAVESPEED_API_KEY}`
        },
        body: JSON.stringify({
            image: imageUrl,
            style,
            mode,
            enable_sync_mode: true
        })
    })

    const json = await resp.json()
    console.log('[PromptOptimizer] Response:', json)

    if (!resp.ok) {
        throw new Error(json.error || json.data?.error || 'Image description failed')
    }

    const data = json.data || json
    const outputs = data.outputs || []

    if (outputs.length === 0) {
        throw new Error('No prompt generated from image')
    }

    return outputs[0]
}
