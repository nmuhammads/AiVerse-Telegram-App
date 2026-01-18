import { useState, useRef } from 'react'
import { X, Upload, Loader2, ImageIcon, Sparkles, Clipboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHaptics } from '@/hooks/useHaptics'
import { toast } from 'sonner'
import { compressImage } from '@/utils/imageCompression'

interface DescribeImageModalProps {
    isOpen: boolean
    onClose: () => void
    onPromptGenerated: (prompt: string) => void
}

export function DescribeImageModal({ isOpen, onClose, onPromptGenerated }: DescribeImageModalProps) {
    const { t } = useTranslation()
    const { impact, notify } = useHaptics()
    const [image, setImage] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!isOpen) return null

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            impact('light')
            const compressed = await compressImage(file)
            setImage(compressed)
        } catch (error) {
            console.error('Compression failed:', error)
            // Fallback to raw base64
            const reader = new FileReader()
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImage(ev.target.result as string)
                }
            }
            reader.readAsDataURL(file)
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handlePaste = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.read) {
                const items = await navigator.clipboard.read()
                for (const item of items) {
                    const imageType = item.types.find(type => type.startsWith('image/'))
                    if (imageType) {
                        const blob = await item.getType(imageType)
                        const compressed = await compressImage(new File([blob], 'pasted.png', { type: imageType }))
                        setImage(compressed)
                        impact('light')
                        return
                    }
                }
            }
            toast.error(t('studio.promptHelper.noImageInClipboard'))
        } catch (error) {
            console.error('Paste failed:', error)
            toast.error(t('studio.promptHelper.pasteError'))
        }
    }

    const handleGeneratePrompt = async () => {
        if (!image) return

        setIsGenerating(true)
        impact('medium')

        try {
            const response = await fetch('/api/prompt/describe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate prompt')
            }

            if (data.prompt) {
                onPromptGenerated(data.prompt)
                toast.success(t('studio.promptHelper.describeSuccess'))
                notify('success')
                onClose()
                setImage(null)
            } else {
                throw new Error('No prompt returned')
            }
        } catch (error) {
            console.error('Describe error:', error)
            notify('error')
            toast.error(error instanceof Error ? error.message : t('studio.promptHelper.error'))
        } finally {
            setIsGenerating(false)
        }
    }

    const handleClose = () => {
        setImage(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-5 pb-3 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <ImageIcon size={20} className="text-violet-400" />
                            {t('studio.promptHelper.describeTitle')}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">{t('studio.promptHelper.describeSubtitle')}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 pb-5">
                    {/* Image Preview or Upload Zone */}
                    {image ? (
                        <div className="relative rounded-xl overflow-hidden mb-4">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full max-h-64 object-contain bg-zinc-800"
                            />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-zinc-700 hover:border-violet-500/50 rounded-xl p-8 mb-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center">
                                <Upload size={24} className="text-violet-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-zinc-300 font-medium">{t('studio.promptHelper.uploadImage')}</p>
                                <p className="text-xs text-zinc-500 mt-1">{t('studio.promptHelper.uploadHint')}</p>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Actions */}
                    <div className="space-y-2">
                        {!image && (
                            <button
                                onClick={handlePaste}
                                className="w-full h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                            >
                                <Clipboard size={16} />
                                {t('studio.promptHelper.pasteImage')}
                            </button>
                        )}

                        <button
                            onClick={handleGeneratePrompt}
                            disabled={!image || isGenerating}
                            className={`w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${image && !isGenerating
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-900/30'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    {t('studio.promptHelper.describing')}
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    {t('studio.promptHelper.generatePrompt')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
