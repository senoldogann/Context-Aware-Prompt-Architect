import { useEffect, useMemo } from 'react';
import { Select } from './ui/Select';
import { StatusIndicator } from './ui/StatusIndicator';
import { Button } from './ui/Button';
import { useAppStore } from '../stores/useAppStore';
import { isCloudModel, isOpenSourceModel } from '../services/ollamaService';
import { useTranslation } from '../hooks/useTranslation';

export const ModelSelector = () => {
  const {
    ollamaConnected,
    models,
    selectedModel,
    isLoadingModels,
    connectionError,
    showOpenSourceOnly,
    checkOllamaConnection,
    setSelectedModel,
    setShowOpenSourceOnly,
    promptMode,
    setPromptMode,
    theme,
  } = useAppStore();

  // Filtrelenmiş modeller
  const filteredModels = useMemo(() => {
    if (showOpenSourceOnly) {
      return models.filter(isOpenSourceModel);
    }
    return models;
  }, [models, showOpenSourceOnly]);

  const cloudModelsCount = models.filter(isCloudModel).length;
  const openSourceModelsCount = models.filter(isOpenSourceModel).length;
  const { t } = useTranslation();

  useEffect(() => {
    checkOllamaConnection();
  }, [checkOllamaConnection]);

  const handleRefresh = () => {
    checkOllamaConnection();
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-xl backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
          {t('model.title')}
        </h3>
        <div className="flex items-center gap-2">
          <StatusIndicator
            status={
              isLoadingModels
                ? 'loading'
                : ollamaConnected
                ? 'connected'
                : 'disconnected'
            }
            label={
              isLoadingModels
                ? t('model.loading')
                : ollamaConnected
                ? t('model.connected') || 'Connected'
                : t('model.disconnected') || 'Disconnected'
            }
          />
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>

      {connectionError && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/40 dark:to-rose-950/40 border border-red-200/50 dark:border-red-800/30 shadow-lg">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">{connectionError}</p>
          <p className="text-xs text-red-500 dark:text-red-500/80">
            {t('model.startOllama') || 'Run "ollama serve" in terminal to start Ollama.'}
          </p>
        </div>
      )}

      {ollamaConnected && (
        <div className="space-y-4">
          {/* Model ve Mode yan yana */}
          <div className="grid grid-cols-2 gap-3">
            {/* Model Selector */}
            <div className="space-y-2">
              <label className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('model.title')}
              </label>
              <Select
                value={selectedModel || ''}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoadingModels || filteredModels.length === 0}
                className="text-xs"
              >
                {filteredModels.length === 0 ? (
                  <option value="">{t('model.noModels')}</option>
                ) : (
                  <>
                    <option value="">{t('model.selectModel')}</option>
                    {filteredModels.map((model) => {
                      const isCloud = isCloudModel(model);
                      const sizeText = isCloud 
                        ? '☁️ Cloud' 
                        : `💻 ${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB`;
                      return (
                        <option key={model.name} value={model.name}>
                          {model.name} ({sizeText})
                        </option>
                      );
                    })}
                  </>
                )}
              </Select>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2">
              <label className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('model.mode') || 'Mode'}
              </label>
              <Select
                value={promptMode}
                onChange={(e) => setPromptMode(e.target.value as 'fast' | 'plan')}
                className="text-xs"
              >
                <option value="fast">{t('prompt.fastMode')} (~15s)</option>
                <option value="plan">{t('prompt.planMode')} (~45s)</option>
              </Select>
            </div>
          </div>

          {/* Filter Toggle - Modern */}
          {models.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/30">
              <label className="text-xs flex items-center gap-2.5 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <input
                  type="checkbox"
                  checked={showOpenSourceOnly}
                  onChange={(e) => setShowOpenSourceOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-medium">{t('model.openSourceOnly')}</span>
              </label>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                {openSourceModelsCount}/{cloudModelsCount}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

