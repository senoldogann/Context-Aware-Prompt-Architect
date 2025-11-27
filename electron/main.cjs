const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { readdir, stat, readFile } = require('fs').promises;
const { join, extname, dirname } = require('path');
const { existsSync } = require('fs');

let mainWindow = null;

const createWindow = () => {
  const preloadPath = join(__dirname, 'preload.cjs');
  console.log('Preload path:', preloadPath);
  console.log('__dirname:', __dirname);
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    frame: true,
  });
  
  // Preload script yüklendiğinde kontrol et
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded, checking electronAPI...');
    mainWindow?.webContents.executeJavaScript('window.electronAPI ? "API loaded" : "API NOT loaded"')
      .then((result) => console.log('electronAPI check:', result))
      .catch((err) => console.error('Error checking electronAPI:', err));
  });

  // Development: Load from Vite dev server
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    // Vite dev server'ın hazır olmasını bekle (port 5173 veya 5174)
    const loadURL = (port = 5173) => {
      const url = `http://localhost:${port}`;
      console.log(`Trying to load: ${url}`);
      mainWindow?.loadURL(url).catch((err) => {
        console.error(`Failed to load URL ${url}:`, err);
        // Port 5174'ü dene
        if (port === 5173) {
          setTimeout(() => loadURL(5174), 1000);
        } else {
          // Her iki port da başarısız, 2 saniye sonra tekrar dene
          setTimeout(() => loadURL(5173), 2000);
        }
      });
    };
    
    // İlk yükleme
    setTimeout(() => loadURL(5173), 1000);
    
    mainWindow.once('ready-to-show', () => {
      mainWindow?.show();
      mainWindow?.webContents.openDevTools();
    });
  } else {
    // Production: Load from built files
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
    mainWindow.once('ready-to-show', () => {
      mainWindow?.show();
    });
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Klasör seçme dialog'u
ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

// Dosya sistemini okuma
const ignoredDirs = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vscode',
  '.idea',
  'coverage',
  '.nyc_output',
]);

const configFiles = new Set([
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'Cargo.toml',
  'go.mod',
  'requirements.txt',
  'Pipfile',
  'pyproject.toml',
  'composer.json',
  'pom.xml',
  'build.gradle',
  'tsconfig.json',
  'vite.config.ts',
  'next.config.js',
  'webpack.config.js',
]);

function readDirectory(dirPath, relativePath = '') {
  const entries = [];

  return readdir(dirPath)
    .then((items) => {
      return Promise.all(
        items.map(async (item) => {
          const fullPath = join(dirPath, item);
          const relPath = join(relativePath, item);

          // Ignore hidden files (except config files)
          if (item.startsWith('.') && !configFiles.has(item)) {
            return null;
          }

          const stats = await stat(fullPath);

          if (stats.isDirectory()) {
            // Skip ignored directories
            if (ignoredDirs.has(item)) {
              return null;
            }

            const children = await readDirectory(fullPath, relPath);
            return {
              name: item,
              path: relPath,
              type: 'directory',
              children,
            };
          } else {
            return {
              name: item,
              path: relPath,
              type: 'file',
            };
          }
        })
      );
    })
    .then((results) => {
      return results.filter((item) => item !== null);
    })
    .catch((error) => {
      console.error(`Error reading directory ${dirPath}:`, error);
      return [];
    });
}

ipcMain.handle('read-project-structure', async (_event, folderPath) => {
  try {
    if (!existsSync(folderPath)) {
      throw new Error('Klasör bulunamadı');
    }

    const structure = await readDirectory(folderPath);
    return { success: true, structure };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
});

// Config dosyalarını okuma
ipcMain.handle('read-config-files', async (_event, folderPath) => {
  const configs = {};

  for (const configFile of configFiles) {
    const configPath = join(folderPath, configFile);
    if (existsSync(configPath)) {
      try {
        const content = await readFile(configPath, 'utf-8');
        const ext = extname(configFile);

        if (ext === '.json' || configFile.endsWith('.json')) {
          configs[configFile] = JSON.parse(content);
        } else {
          configs[configFile] = content;
        }
      } catch (error) {
        console.error(`Error reading ${configFile}:`, error);
      }
    }
  }

  return configs;
});

