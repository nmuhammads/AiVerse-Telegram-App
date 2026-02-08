// i18n локализации для AiVerse
// Используются в Telegram Mini App и Mobile приложении

export const supportedLanguages = ['ru', 'en'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const defaultLanguage: SupportedLanguage = 'ru';

// Для динамической загрузки в web (i18next-http-backend)
export const getLocalesPath = (basePath = '/locales') => ({
    loadPath: `${basePath}/{{lng}}/translation.json`,
});

// Для статической загрузки в mobile (встроенные JSON)
export { default as ruTranslation } from './locales/ru/translation.json';
export { default as enTranslation } from './locales/en/translation.json';
