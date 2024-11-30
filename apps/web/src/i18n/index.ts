import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: {
			translation: typeof enTranslations
		}
	}
}

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enTranslations,
		},
		es: {
			translation: esTranslations,
		},
	},
	lng: localStorage.getItem('language') || 'en',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
