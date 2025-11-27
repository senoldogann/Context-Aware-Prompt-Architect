import { useEffect } from 'react';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { TypewriterEffect } from './ui/TypewriterEffect';
import { useAppStore } from '../stores/useAppStore';
import { useTranslation } from '../hooks/useTranslation';

export const PromptInput = () => {
  const {
    rawPrompt,
    refinedPrompt,
    isGenerating,
    generationError,
    setRawPrompt,
    generateRefinedPrompt,
    stopGeneration,
    promptMode,
    estimatedTime,
    promptHistory,
    clearPromptHistory,
  } = useAppStore();
  const { t } = useTranslation();

  // Geliştirilmiş prompt geldiğinde input'a yaz (stream modunda real-time güncelleniyor)
  useEffect(() => {
    if (refinedPrompt) {
      setRawPrompt(refinedPrompt);
    }
  }, [refinedPrompt, setRawPrompt]);

  const handleCopy = () => {
    if (rawPrompt) {
      navigator.clipboard.writeText(rawPrompt);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.justNow');
    if (diffMins < 60) return t('time.minutesAgo', { minutes: diffMins });
    if (diffHours < 24) return t('time.hoursAgo', { hours: diffHours });
    if (diffDays < 7) return t('time.daysAgo', { days: diffDays });
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleLoadPrompt = (prompt: string) => {
    setRawPrompt(prompt);
  };

  // Tüm prompt geçmişini göster (scroll ile)
  const recentHistory = promptHistory;

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 shadow-2xl backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
            Prompt
          </h3>
          {rawPrompt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title={t('prompt.copy')}
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </Button>
          )}
        </div>
        <div className="relative">
          <Textarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder={t('prompt.placeholder')}
            rows={12}
            disabled={isGenerating}
            className="font-mono text-sm leading-relaxed whitespace-pre-wrap bg-white/50 dark:bg-slate-900/50 border-indigo-200/50 dark:border-indigo-800/30 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300"
          />
          {isGenerating && (
            <>
              <div className="wave-overlay" />
              <TypewriterEffect isActive={isGenerating} />
              {/* Stop butonu textarea'nın üstünde, sağ üst köşede - yüksek z-index ile */}
              <div className="absolute top-4 right-4 z-50">
                <Button
                  variant="danger"
                  size="md"
                  onClick={stopGeneration}
                  className="shadow-xl shadow-red-500/50 dark:shadow-red-500/30 hover:shadow-red-500/70 dark:hover:shadow-red-500/50 animate-pulse backdrop-blur-none bg-gradient-to-r from-red-500 to-rose-600"
                >
                  <span className="flex items-center gap-2 font-bold relative z-10">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    {t('prompt.stop')}
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isGenerating && estimatedTime && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold">
                {t('prompt.estimatedTime', { time: estimatedTime })}
              </span>
            )}
            {!isGenerating && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 font-medium">
                {promptMode === 'fast' ? t('prompt.fastMode') : t('prompt.planMode')}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            onClick={generateRefinedPrompt}
            disabled={isGenerating || !rawPrompt.trim()}
            className="shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/30"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('prompt.generating')}
              </span>
            ) : (
              t('prompt.refine')
            )}
          </Button>
        </div>
      </div>

      {generationError && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/40 dark:to-rose-950/40 border border-red-200/50 dark:border-red-800/30 shadow-lg">
          <p className="text-xs font-semibold mb-2 text-red-600 dark:text-red-400">{t('prompt.error')}</p>
          <p className="text-xs text-red-500 dark:text-red-500/80 mb-2">{generationError}</p>
          <p className="text-xs text-red-500/80 dark:text-red-500/60">
            {t('prompt.errorMessage')}
          </p>
        </div>
      )}

      {/* Prompt History - Önceki Prompt'lar */}
      {recentHistory.length > 0 && (
        <div className="glass rounded-2xl p-6 shadow-2xl backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
              {t('prompt.previousPrompts')}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('prompt.records', { count: promptHistory.length })}
              </span>
              {promptHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPromptHistory}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title={t('prompt.clearHistory')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {recentHistory.map((entry) => (
              <div
                key={entry.timestamp}
                onClick={() => handleLoadPrompt(entry.raw)}
                className="group p-4 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 line-clamp-2">
                      {truncateText(entry.raw)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
                      → {truncateText(entry.refined, 60)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      entry.mode === 'fast' 
                        ? 'bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}>
                      {entry.mode === 'fast' ? '⚡' : '🧠'}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {t('prompt.loadPrompt')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

