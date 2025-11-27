/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    selectFolder: () => Promise<string | null>;
    readProjectStructure: (folderPath: string) => Promise<{
      success: boolean;
      structure?: unknown;
      error?: string;
    }>;
    readConfigFiles: (folderPath: string) => Promise<Record<string, unknown>>;
  };
}

