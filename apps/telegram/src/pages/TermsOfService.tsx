/**
 * Terms of Service Page
 * Required for Google OAuth verification
 */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe } from 'lucide-react'

export default function TermsOfService() {
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
                    {t('terms.title')}
                </h1>

                <div className="space-y-6 text-white/70 leading-relaxed">
                    <p className="text-white/50 text-sm">
                        {t('terms.lastUpdated')}: February 9, 2026
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.acceptance.title')}</h2>
                        <p>{t('terms.sections.acceptance.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.service.title')}</h2>
                        <p>{t('terms.sections.service.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.account.title')}</h2>
                        <p>{t('terms.sections.account.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.content.title')}</h2>
                        <p>{t('terms.sections.content.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.prohibited.title')}</h2>
                        <p>{t('terms.sections.prohibited.content')}</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>{t('terms.sections.prohibited.items.illegal')}</li>
                            <li>{t('terms.sections.prohibited.items.harmful')}</li>
                            <li>{t('terms.sections.prohibited.items.abuse')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.liability.title')}</h2>
                        <p>{t('terms.sections.liability.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.changes.title')}</h2>
                        <p>{t('terms.sections.changes.content')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">{t('terms.sections.contact.title')}</h2>
                        <p>{t('terms.sections.contact.content')}</p>
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
