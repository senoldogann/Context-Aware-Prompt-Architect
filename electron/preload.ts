import { contextBridge, ipcRenderer } from 'electron';

// Electron API'lerini güvenli bir şekilde renderer process'e expose et
try {
  contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    readProjectStructure: (folderPath: string) =>
      ipcRenderer.invoke('read-project-structure', folderPath),
    readConfigFiles: (folderPath: string) =>
      ipcRenderer.invoke('read-config-files', folderPath),
  });
  
  console.log('Preload script loaded successfully');
} catch (error) {
  console.error('Error in preload script:', error);
}

// TypeScript type definitions için
export type ElectronAPI = {
  selectFolder: () => Promise<string | null>;
  readProjectStructure: (folderPath: string) => Promise<{
    success: boolean;
    structure?: unknown;
    error?: string;
  }>;
  readConfigFiles: (folderPath: string) => Promise<Record<string, unknown>>;
};

