import { useEffect, useState } from 'react';
import { FolderSelector } from './components/FolderSelector';
import { ModelSelector } from './components/ModelSelector';
import { PromptInput } from './components/PromptInput';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSelector } from './components/LanguageSelector';
import { useAppStore } from './stores/useAppStore';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const { projectContext, hasSelectedInitialFolder, theme } = useAppStore();
  const { t } = useTranslation();
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);

  // Theme değişikliğini DOM'a uygula - Tailwind için html element'ine dark class'ı eklenmeli
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Önce tüm class'ları temizle
    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Yeni theme class'ını ekle (Tailwind darkMode: 'class' için html element'ine dark class'ı gerekli)
    html.classList.add(theme);
    body.classList.add(theme);
    
    // data-theme attribute'u da ekle (fallback için)
    html.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // İlk açılışta klasör seçilmemişse veya clear yapıldıysa prompt göster
    if (!hasSelectedInitialFolder || !projectContext) {
      setShowFolderPrompt(true);
    } else {
      setShowFolderPrompt(false);
    }
  }, [hasSelectedInitialFolder, projectContext]);

  // İlk açılışta klasör seçilmediyse sadece prompt göster
  if (showFolderPrompt && !projectContext) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="glass rounded-2xl p-10 max-w-md text-center shadow-2xl backdrop-blur-xl border border-white/10 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400">
              {t('app.welcome')}
            </h2>
            <ThemeToggle />
          </div>
          <p className="text-sm mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('app.welcomeMessage')}
          </p>
          <div className="space-y-3">
            <FolderSelector />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header - Modern Design */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400">
                {t('app.title')}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {t('app.subtitle')}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1 space-y-6">
            <LanguageSelector />
            <FolderSelector />
            <ModelSelector />
          </div>

          {/* Right Column - Prompt Area */}
          <div className="lg:col-span-2">
            <PromptInput />
          </div>
        </div>

        {/* Footer - Modern Design */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="font-medium">
              {t('app.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

