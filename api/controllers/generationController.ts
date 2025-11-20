import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

// Типы для запросов к Kie.ai
interface KieAIRequest {
  model: string
  prompt: string
  aspect_ratio?: string
  image?: string
}

interface KieAIResponse {
  images?: string[]
  error?: string
}

// Конфигурация моделей
const MODEL_CONFIGS = {
  flux: { kind: 'flux-kontext' as const, model: 'flux-kontext-pro' },
  seedream4: { kind: 'jobs' as const, model: 'bytedance/seedream-v4-text-to-image' },
  nanobanana: { kind: 'jobs' as const, model: 'google/nano-banana-edit' },
  'qwen-edit': { kind: 'jobs' as const, model: 'qwen/text-or-image' },
}

function mapSeedreamImageSize(ratio?: string): string | undefined {
  switch (ratio) {
    case '1:1': return 'square_hd'
    case '16:9': return 'landscape_16_9'
    case '21:9': return 'landscape_21_9'
    case '4:3': return 'landscape_4_3'
    case '3:4': return 'portrait_3_4'
    case '9:16': return 'portrait_16_9'
    case '16:21': return 'portrait_16_9'
    default: return undefined
  }
}

function mapNanoBananaImageSize(ratio?: string): string | undefined {
  switch (ratio) {
    case '1:1':
    case '16:9':
    case '9:16':
    case '4:3':
    case '3:4':
    case '21:9':
      return ratio
    case '16:21':
      return '9:16'
    default:
      return '1:1'
  }
}

function getPublicBaseUrl(): string | null {
  const url = process.env.WEBAPP_URL || process.env.VERCEL_URL || process.env.RAILWAY_PUBLIC_DOMAIN || null
  return url ? (url.startsWith('http') ? url : `https://${url}`) : null
}

function ensureUploadsDir(): string {
  const root = process.cwd()
  const dir = path.join(root, 'uploads')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

function saveBase64Image(imageBase64: string): { localPath: string; publicUrl: string } {
  const baseUrl = getPublicBaseUrl()
  const dir = ensureUploadsDir()
  const fileName = `gen-${Date.now()}.png`
  const localPath = path.join(dir, fileName)
  const commaIdx = imageBase64.indexOf(',')
  const data = commaIdx >= 0 ? imageBase64.slice(commaIdx + 1) : imageBase64
  const buf = Buffer.from(data, 'base64')
  fs.writeFileSync(localPath, buf)
  const publicUrl = baseUrl ? `${baseUrl}/uploads/${fileName}` : `http://localhost:${process.env.PORT || '3001'}/uploads/${fileName}`
  return { localPath, publicUrl }
}

async function createFluxTask(apiKey: string, prompt: string, aspectRatio?: string, inputImageUrl?: string) {
  const body: Record<string, unknown> = {
    prompt,
    aspectRatio: aspectRatio || '1:1',
    model: 'flux-kontext-pro',
  }
  if (inputImageUrl) body.inputImage = inputImageUrl
  const resp = await fetch('https://api.kie.ai/api/v1/flux/kontext/generate', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const json = await resp.json()
  if (!resp.ok || json?.code !== 200) throw new Error(json?.msg || 'Flux task create failed')
  return String(json.data?.taskId || '')
}

async function pollFluxTask(apiKey: string, taskId: string, timeoutMs = 60000): Promise<string> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const url = `https://api.kie.ai/api/v1/flux/kontext/record-info?taskId=${encodeURIComponent(taskId)}`
    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}` } })
    const json = await resp.json().catch(() => null)
    if (json && json.code === 200 && json.data) {
      const s = json.data.successFlag
      if (s === 1 && json.data.response?.resultImageUrl) {
        return String(json.data.response.resultImageUrl)
      }
      if (s === 2 || s === 3) {
        throw new Error(json.data.errorMessage || 'Flux task failed')
      }
    }
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error('Flux task timeout')
}

async function createJobsTask(apiKey: string, modelId: string, input: Record<string, unknown>) {
  const resp = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelId, input })
  })
  const json = await resp.json()
  if (!resp.ok || json?.code !== 200) throw new Error(json?.msg || 'Jobs task create failed')
  return String(json.data?.taskId || '')
}

async function pollJobsTask(apiKey: string, taskId: string, timeoutMs = 60000): Promise<string> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const url = `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`
    const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}` } })
    const json = await resp.json().catch(() => null)
    if (json && json.code === 200 && json.data) {
      const state = json.data.state
      if (state === 'success' && typeof json.data.resultJson === 'string') {
        try {
          const r = JSON.parse(json.data.resultJson)
          const first = (r.resultUrls && r.resultUrls[0]) || (Array.isArray(r.result_urls) && r.result_urls[0])
          if (first) return String(first)
        } catch { /* ignore */ }
      }
      if (state === 'fail') {
        throw new Error(json.data.failMsg || 'Jobs task failed')
      }
    }
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error('Jobs task timeout')
}

// Функция для генерации изображения через Kie.ai
async function generateImageWithKieAI(
  apiKey: string,
  requestData: KieAIRequest
): Promise<KieAIResponse> {
  try {
    const { model, prompt, aspect_ratio, image } = requestData
    const cfg = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS]

    const hasImage = Boolean(image)
    let imageUrl: string | undefined
    if (hasImage && typeof image === 'string') {
      const saved = saveBase64Image(image)
      imageUrl = saved.publicUrl
    }

    if (cfg.kind === 'flux-kontext') {
      const taskId = await createFluxTask(apiKey, prompt, aspect_ratio, imageUrl)
      const url = await pollFluxTask(apiKey, taskId)
      return { images: [url] }
    }

    if (model === 'seedream4') {
      const image_size = mapSeedreamImageSize(aspect_ratio)
      const input: Record<string, unknown> = { prompt }
      if (image_size) input.image_size = image_size
      input.image_resolution = '2K'
      if (hasImage && imageUrl) {
        const taskId = await createJobsTask(apiKey, 'bytedance/seedream-v4-edit', { ...input, image_urls: [imageUrl] })
        const url = await pollJobsTask(apiKey, taskId)
        return { images: [url] }
      } else {
        const taskId = await createJobsTask(apiKey, 'bytedance/seedream-v4-text-to-image', input)
        const url = await pollJobsTask(apiKey, taskId)
        return { images: [url] }
      }
    }

    if (model === 'nanobanana') {
      const image_size = mapNanoBananaImageSize(aspect_ratio)
      if (imageUrl) {
        const input: Record<string, unknown> = {
          prompt,
          image_urls: [imageUrl],
          output_format: 'png',
          image_size
        }
        const taskId = await createJobsTask(apiKey, 'google/nano-banana-edit', input)
        const url = await pollJobsTask(apiKey, taskId)
        return { images: [url] }
      } else {
        const input: Record<string, unknown> = { prompt, output_format: 'png' }
        if (image_size) input.image_size = image_size
        const taskId = await createJobsTask(apiKey, 'google/nano-banana', input)
        const url = await pollJobsTask(apiKey, taskId)
        return { images: [url] }
      }
    }

    if (model === 'qwen-edit') {
      if (imageUrl) {
        const input: Record<string, unknown> = { prompt, image_url: imageUrl, strength: 0.8, output_format: 'png' }
        const taskId = await createJobsTask(apiKey, 'qwen/image-to-image', input)
        const url = await pollJobsTask(apiKey, taskId)
        return { images: [url] }
      } else {
        const input: Record<string, unknown> = { prompt }
        if (aspect_ratio) input.image_size = aspect_ratio
        const taskId = await createJobsTask(apiKey, 'qwen/text-to-image', input)
        const url = await pollJobsTask(apiKey, taskId)
        return { images: [url] }
      }
    }

    throw new Error('Unsupported model')
  } catch (error) {
    console.error('Kie.ai API error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to generate image' }
  }
}

// Основной контроллер для обработки запросов генерации
export async function handleGenerateImage(req: Request, res: Response) {
  try {
    const { prompt, model, aspect_ratio, image } = req.body

    // Валидация входных данных
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string' 
      })
    }

    if (!model || !MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS]) {
      return res.status(400).json({ 
        error: 'Valid model is required. Available models: flux, seedream4, nanobanana, qwen-edit' 
      })
    }

    // Проверка API ключа
    const apiKey = process.env.KIE_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'KIE_API_KEY is not configured' 
      })
    }

    

    // Вызов Kie.ai API
    const result = await generateImageWithKieAI(apiKey, {
      model,
      prompt,
      aspect_ratio,
      image
    })

    if (result.error) {
      return res.status(500).json({ error: result.error })
    }

    if (result.images && result.images.length > 0) {
      return res.json({ 
        image: result.images[0],
        prompt: prompt,
        model: model
      })
    } else {
      return res.status(500).json({ 
        error: 'No images generated' 
      })
    }

  } catch (error) {
    console.error('Generation error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    })
  }
}
