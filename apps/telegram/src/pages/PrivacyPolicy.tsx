/**
 * Privacy Policy Page
 * Required for Google OAuth verification
 */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe } from 'lucide-react'

export default function PrivacyPolicy() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ru' ? 'en' : 'ru'
        i18n.changeLanguage(newLang)
    }

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header with back and language buttons */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('common.back')}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                    >
                        <Globe className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'EN' : 'RU'}
                    </button>
                </div>

                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    {t('privacy.title')}
                </h1>

                <div className="space-y-6 text-white/70 leading-relaxed">
                    <p className="text-white/50 text-sm">
                        {t('privacy.lastUpdated')}: February 9, 2026
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.intro.title')}</h2>
                        <p>{t('privacy.sections.intro.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.dataCollection.title')}</h2>
                        <p>{t('privacy.sections.dataCollection.content')}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>{t('privacy.sections.dataCollection.items.email')}</li>
                            <li>{t('privacy.sections.dataCollection.items.name')}</li>
                            <li>{t('privacy.sections.dataCollection.items.avatar')}</li>
                            <li>{t('privacy.sections.dataCollection.items.generations')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.dataStorage.title')}</h2>
                        <p>{t('privacy.sections.dataStorage.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.dataUse.title')}</h2>
                        <p>{t('privacy.sections.dataUse.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.dataSharing.title')}</h2>
                        <p>{t('privacy.sections.dataSharing.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.security.title')}</h2>
                        <p>{t('privacy.sections.security.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('privacy.sections.contact.title')}</h2>
                        <p>{t('privacy.sections.contact.content')}</p>
                        <p className="mt-2">
                            <a href="mailto:nmsg1999@gmail.com" className="text-violet-400 hover:text-violet-300">
                                nmsg1999@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
