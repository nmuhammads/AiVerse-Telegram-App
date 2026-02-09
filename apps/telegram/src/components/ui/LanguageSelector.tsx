import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useTelegram, getAuthHeaders } from '@/hooks/useTelegram'
import { useHaptics } from '@/hooks/useHaptics'

const LANGUAGES = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
]

interface LanguageSelectorProps {
    className?: string
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
    const { i18n } = useTranslation()
    const { user } = useTelegram()
    const { impact } = useHaptics()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const currentLangCode = i18n.language.split('-')[0]
    const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[1]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageChange = async (langCode: string) => {
        impact('light')
        i18n.changeLanguage(langCode)
        setIsOpen(false)

        if (user?.id) {
            try {
                await fetch('/api/user/language', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    body: JSON.stringify({ user_id: user.id, language_code: langCode })
                })
            } catch (e) {
                console.error('Failed to update language in database', e)
            }
        }
    }

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                onClick={() => {
                    impact('light')
                    setIsOpen(!isOpen)
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-200"
            >
                <Globe size={16} className="text-white/70" />
                <span className="text-sm font-medium flex items-center gap-1.5">
                    <span>{currentLang.flag}</span>
                    <span className="uppercase">{currentLang.code}</span>
                </span>
                <ChevronDown size={14} className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 gap-0.5">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors ${currentLangCode === lang.code ? 'text-violet-400' : 'text-white/80'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{lang.flag}</span>
                                    <span className="text-sm font-medium">{lang.label}</span>
                                </div>
                                {currentLangCode === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
