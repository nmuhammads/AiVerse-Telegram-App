import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import WebApp from '@twa-dev/sdk'

const telegramLanguageDetector = {
    name: 'telegram',
    lookup() {
        return WebApp.initDataUnsafe?.user?.language_code
    },
    cacheUserLanguage() { }
}

const languageDetector = new LanguageDetector()
languageDetector.addDetector(telegramLanguageDetector)

i18n
    .use(Backend)
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: {
            'uz': ['ru'],
            'tj': ['ru'],
            'kk': ['ru'],
            'kz': ['ru'],
            'hy': ['ru'],
            'az': ['ru'],
            'be': ['ru'],
            'tk': ['ru'],
            'default': ['en']
        },
        supportedLngs: ['ru', 'en', 'es', 'fr', 'de', 'ar'],
        debug: import.meta.env.DEV,
        load: 'languageOnly',

        interpolation: {
            escapeValue: false,
        },

        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
            requestOptions: {
                cache: 'no-cache'
            }
        },

        detection: {
            order: ['localStorage', 'telegram', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        },
        react: {
            useSuspense: false,
            bindI18n: 'languageChanged loaded',
            bindI18nStore: 'added removed',
        }
    })
    .catch((err) => {
        console.error('i18n initialization error:', err)
    })

export default i18n
