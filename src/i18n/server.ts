import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { cookies } from 'next/headers'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { FALLBACK_LOCALE, LANGUAGE_COOKIE, Locales, getOptions } from './settings'

async function initI18next(lang: Locales) {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((lang: string) => import(`./locales/${lang}.ts`)))
    .init(getOptions(lang))

  return i18nInstance
}

export async function createTranslation() {
  const lang = getLocale()
  const i18nextInstance = await initI18next(lang)

  return {
    t: i18nextInstance.getFixedT(lang),
  }
}

export function getLocale() {
  return (cookies().get(LANGUAGE_COOKIE)?.value ?? FALLBACK_LOCALE) as Locales
}
