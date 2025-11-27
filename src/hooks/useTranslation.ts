import { useAppStore } from '../stores/useAppStore';
import { translations, getTranslation, replacePlaceholders } from '../i18n';

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const currentTranslations = translations[language];

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getTranslation(currentTranslations, key);
    if (params) {
      return replacePlaceholders(translation, params);
    }
    return translation;
  };

  return { t, language };
}

