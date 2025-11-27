import { useState } from 'react';
import { Button } from './ui/Button';
import { useAppStore } from '../stores/useAppStore';
import { detectLanguages } from '../utils/detectLanguages';
import { useTranslation } from '../hooks/useTranslation';

export const FolderSelector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { projectContext, setProjectContext, clearProjectContext, setHasSelectedInitialFolder } = useAppStore();
  const { t } = useTranslation();

  const handleSelectFolder = async () => {
    if (!window.electronAPI) {
      alert('Electron API mevcut değil. Lütfen Electron uygulaması içinde çalıştırın.');
      return;
    }

    setIsLoading(true);
    try {
      const folderPath = await window.electronAPI.selectFolder();
      
      if (!folderPath) {
        setIsLoading(false);
        return;
      }

      // Proje yapısını ve config dosyalarını oku
      const [structureResult, configFiles] = await Promise.all([
        window.electronAPI.readProjectStructure(folderPath),
        window.electronAPI.readConfigFiles(folderPath),
      ]);

      if (!structureResult.success) {
        throw new Error(structureResult.error || 'Proje yapısı okunamadı');
      }

      // Tech stack'i tespit et (geriye dönük uyumluluk için)
      const techStack: string[] = [];
      if (configFiles['package.json']) {
        techStack.push('Node.js');
        const pkg = configFiles['package.json'] as { dependencies?: Record<string, string> };
        if (pkg.dependencies) {
          if (pkg.dependencies.react) techStack.push('React');
          if (pkg.dependencies.vue) techStack.push('Vue');
          if (pkg.dependencies['@angular/core']) techStack.push('Angular');
          if (pkg.dependencies.next) techStack.push('Next.js');
        }
      }
      if (configFiles['Cargo.toml']) techStack.push('Rust');
      if (configFiles['go.mod']) techStack.push('Go');
      if (configFiles['requirements.txt'] || configFiles['pyproject.toml']) techStack.push('Python');
      if (configFiles['pom.xml'] || configFiles['build.gradle']) techStack.push('Java');

      // Dilleri tespit et (gelişmiş tespit)
      const detectedLanguages = detectLanguages(structureResult.structure, configFiles);

      setProjectContext({
        folderPath,
        fileStructure: structureResult.structure,
        configFiles,
        techStack,
        detectedLanguages,
      });
      
      // İlk klasör seçimi işaretlendi
      setHasSelectedInitialFolder(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Klasör seçilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearProjectContext();
    setHasSelectedInitialFolder(false); // Welcome ekranını tekrar göster
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-xl backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
          {t('folder.title')}
        </h3>
        {projectContext && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-slate-500 hover:text-red-500">
            {t('folder.clear')}
          </Button>
        )}
      </div>
      
      {projectContext ? (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/30">
            <p className="text-xs break-all font-mono text-slate-600 dark:text-slate-400 leading-relaxed">{projectContext.folderPath}</p>
          </div>
          {projectContext.detectedLanguages && projectContext.detectedLanguages.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">{t('folder.detectedLanguages') || 'Detected Languages'}</p>
              <div className="flex flex-wrap gap-2">
                {projectContext.detectedLanguages.map((lang) => (
                  <span
                    key={lang.name}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300/50 dark:border-indigo-600/50 transition-all hover:scale-105 hover:shadow-md hover:shadow-indigo-500/20"
                  >
                    {lang.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="primary"
          onClick={handleSelectFolder}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('folder.select')}...
            </span>
          ) : (
            `📁 ${t('folder.select')}`
          )}
        </Button>
      )}
    </div>
  );
};

