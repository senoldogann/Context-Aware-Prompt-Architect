const { contextBridge, ipcRenderer } = require('electron');

// Electron API'lerini güvenli bir şekilde renderer process'e expose et
try {
  contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    readProjectStructure: (folderPath) =>
      ipcRenderer.invoke('read-project-structure', folderPath),
    readConfigFiles: (folderPath) =>
      ipcRenderer.invoke('read-config-files', folderPath),
  });
  
  console.log('Preload script loaded successfully');
} catch (error) {
  console.error('Error in preload script:', error);
}

