import { X, Heart, Repeat, Download, Share2, Sparkles } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { useTelegram } from '@/hooks/useTelegram'
import { useState, useEffect } from 'react'

interface FeedItem {
    id: number
    image_url: string
    prompt: string
    created_at: string
    author: {
        id: number
        username: string
        first_name?: string
        avatar_url: string
    }
    likes_count: number
    remix_count: number
    input_images?: string[]
    is_liked: boolean
    model?: string | null
}

interface Props {
    item: FeedItem
    onClose: () => void
    onRemix: (item: FeedItem) => void
    onLike: (item: FeedItem) => void
}

function getModelDisplayName(model: string | null): string {
    if (!model) return ''
    switch (model) {
        case 'nanobanana': return 'NanoBanana'
        case 'nanobanana-pro': return 'NanoBanana Pro'
        case 'seedream4': return 'Seedream 4'
        case 'qwen-edit': return 'Qwen Edit'
        case 'flux': return 'Flux'
        default: return model
    }
}

export function FeedDetailModal({ item, onClose, onRemix, onLike }: Props) {
    const { impact } = useHaptics()
    const { user, platform } = useTelegram()
    const [isLikeAnimating, setIsLikeAnimating] = useState(false)

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    const handleLikeClick = () => {
        impact('light')
        setIsLikeAnimating(true)
        onLike(item)
        setTimeout(() => setIsLikeAnimating(false), 300)
    }

    const modelName = getModelDisplayName(item.model || null)
    const date = new Date(item.created_at).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    // Platform specific padding for top bar
    const paddingTop = platform === 'ios' ? 'calc(env(safe-area-inset-top) + 10px)' : 'calc(env(safe-area-inset-top) + 20px)'

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4"
                style={{ paddingTop }}
            >
                <div className="flex items-center gap-2">
                    {modelName && (
                        <div className="bg-black/50 backdrop-blur-md text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-violet-400" />
                            {modelName}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => { impact('light'); onClose() }}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative" onClick={onClose}>
                <img
                    src={item.image_url}
                    alt={item.prompt}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                />
            </div>

            {/* Footer / Info */}
            <div className="bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-8 px-4 safe-bottom-fixed">
                <div className="max-w-3xl mx-auto space-y-4">

                    {/* User & Date */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                                {item.author.avatar_url ? (
                                    <img src={item.author.avatar_url} alt={item.author.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                                        {item.author.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">@{item.author.username}</div>
                                <div className="text-zinc-500 text-xs">{date}</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLikeClick}
                            className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${item.is_liked
                                    ? 'bg-pink-500/20 text-pink-500 border border-pink-500/20'
                                    : 'bg-zinc-900 text-white border border-white/10 hover:bg-zinc-800'
                                }`}
                        >
                            <Heart
                                size={20}
                                className={`transition-transform duration-300 ${isLikeAnimating ? 'scale-150' : 'scale-100'} ${item.is_liked ? 'fill-current' : ''}`}
                            />
                            <span>{item.likes_count}</span>
                        </button>

                        <button
                            onClick={() => { impact('medium'); onRemix(item) }}
                            className="flex-1 h-12 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-violet-700"
                        >
                            <Repeat size={20} />
                            <span>Повторить</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
