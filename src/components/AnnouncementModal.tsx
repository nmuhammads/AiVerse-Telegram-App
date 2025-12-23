import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Zap } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { useNavigate } from 'react-router-dom'

// Configuration for the current announcement
// Configuration for the current announcement
const ANNOUNCEMENT = {
    enabled: true, // Set to true to enable the announcement
    id: 'announcement_v2_8_3', // Updated ID to force show again
    title: 'Обновление AiVerse 🚀',
    description: 'Встречайте: система уведомлений 🔔, подписки на пользователей 👥 и фильтрация генераций в профиле 🔍. Теперь вы не пропустите ничего важного!',
    image: '/announcements/v2_8_3.png', // Placeholder for the new image
    buttonText: 'Узнать больше',
    link: '/news', // Redirect to news page
    secondaryButtonText: 'Закрыть',
    secondaryLink: '' // Close modal
}

export function AnnouncementModal() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const { impact } = useHaptics()
    const navigate = useNavigate()

    useEffect(() => {
        // Skip if announcement is disabled
        if (!ANNOUNCEMENT.enabled) return

        // Check if this specific announcement has been seen
        const seen = localStorage.getItem(`seen_${ANNOUNCEMENT.id}`)
        if (!seen) {
            // Small delay for better UX
            const timer = setTimeout(() => {
                setIsOpen(true)
                impact('light')
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        impact('light')
        setIsOpen(false)
        // Mark as seen
        localStorage.setItem(`seen_${ANNOUNCEMENT.id}`, 'true')
    }

    const handleAction = () => {
        impact('medium')
        if (ANNOUNCEMENT.link) {
            if (ANNOUNCEMENT.link.startsWith('/')) {
                navigate(ANNOUNCEMENT.link)
            } else {
                window.open(ANNOUNCEMENT.link, '_blank')
            }
        }
        handleClose()
    }

    const handleSecondaryAction = () => {
        impact('medium')
        if (ANNOUNCEMENT.secondaryLink) {
            if (ANNOUNCEMENT.secondaryLink.startsWith('/')) {
                navigate(ANNOUNCEMENT.secondaryLink)
            } else {
                window.open(ANNOUNCEMENT.secondaryLink, '_blank')
            }
        }
        handleClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300 flex flex-col">

                {/* Image Header */}
                <div className="relative h-90 bg-zinc-600 overflow-hidden">
                    {/* Blurred Background */}
                    <div className="absolute inset-0">
                        <img
                            src={ANNOUNCEMENT.image}
                            className="w-full h-full object-cover blur-md opacity-60 scale-110"
                            alt=""
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 via-zinc-800/10 to-transparent z-10" />

                    {/* Main Image */}
                    <img
                        src={ANNOUNCEMENT.image}
                        alt="Announcement"
                        className="relative z-10 w-full h-full object-contain"
                    />

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 pt-2 flex flex-col items-center text-center relative z-20 -mt-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 mb-4 border border-white/10">
                        <Zap size={24} className="text-white" fill="currentColor" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">
                        {t('announcement.title')}
                    </h2>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                        {t('announcement.description')}
                    </p>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleAction}
                            className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5 active:scale-[0.98] transition-transform"
                        >
                            {t('announcement.button')}
                        </button>

                        {ANNOUNCEMENT.secondaryButtonText && (
                            <button
                                onClick={handleSecondaryAction}
                                className="w-full py-3.5 rounded-xl bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition-colors border border-white/5 active:scale-[0.98] transition-transform"
                            >
                                {t('announcement.close')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
