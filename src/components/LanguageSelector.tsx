import { useAppStore } from '../stores/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { Select } from './ui/Select';

const languages = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fi', label: 'Suomi', flag: '🇫🇮' },
] as const;

export const LanguageSelector = () => {
  const { language, setLanguage } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></span>
          {t('app.language') || 'Language'}
        </h3>
      </div>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'tr' | 'de' | 'fi')}
        className="w-full"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

