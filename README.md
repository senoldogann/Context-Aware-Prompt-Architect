# Context-Aware-Prompt-Architect

# Prompt Architect

<div align="center">

**Context-Aware Prompt Enhancer for Developers**

Powered by local Ollama models

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28.0-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

[English](#english) | [Türkçe](#türkçe) | [Deutsch](#deutsch) | [Suomi](#suomi)

</div>

---

## English

### ✨ Features

- 🎯 **Context-Aware Prompt Refinement**: Analyzes your project structure and tech stack to create optimized prompts
- 🤖 **Local AI Models**: Works entirely with local Ollama models - no data leaves your machine
- 📁 **Project Analysis**: Automatically detects tech stack, config files, and project structure
- 🌍 **Multi-Language UI Support**: Full UI support for English, Turkish, German, and Finnish
- 🎨 **Modern UI**: Clean, professional interface with dark/light theme support
- ⚡ **Fast & Efficient**: Built with Electron, React, and Vite for optimal performance
- 🔒 **Privacy First**: All processing happens locally - your code never leaves your computer
- 📚 **Prompt History**: View and reload previous prompts with full history management
- 🛑 **Generation Control**: Stop ongoing AI generation at any time
- 💻 **Cross-Platform**: Supports macOS (Intel & Apple Silicon) and Windows (x64 & ia32)
- 🎨 **Professional Logo**: Custom-designed logo with modern gradient aesthetics

### 🚀 Quick Start

#### Prerequisites

- Node.js 18+ and npm
- [Ollama](https://ollama.ai/) installed and running
- At least one Ollama model installed (e.g., `ollama pull llama3.2`)

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prompt-architect.git
cd prompt-architect
```

2. Install dependencies:
```bash
npm install
```

3. Start Ollama (if not already running):
```bash
ollama serve
```

4. Run the application:
```bash
npm run electron:dev
```

### 📦 Building for Production

#### Icon Oluşturma (macOS)

Uygulama için logo/icon oluşturmak için:

```bash
npm run generate:icon
```

Detaylı bilgi için [ICON_GUIDE.md](ICON_GUIDE.md) dosyasına bakın.

#### Development Build
```bash
npm run electron:dev
```

#### Production Build

#### macOS için Build
```bash
npm run electron:build:mac
```

veya sadece DMG dosyası için:
```bash
npm run electron:build:mac:dmg
```

#### Windows için Build
```bash
npm run electron:build:win
```

veya sadece NSIS installer için:
```bash
npm run electron:build:win:nsis
```

#### Tüm Platformlar için Build
```bash
npm run electron:build
```

The built application will be in the `release/` directory.

**Kurulum Rehberleri:**
- **macOS:** Detaylı kurulum talimatları için [BUILD_MACOS.md](BUILD_MACOS.md) dosyasına bakın.
- **Windows:** Detaylı kurulum talimatları için [BUILD_WINDOWS.md](BUILD_WINDOWS.md) dosyasına bakın.

**Build Test:**
- Build'lerin çalışıp çalışmadığını kontrol etmek için [TESTING.md](TESTING.md) dosyasına bakın.
- GitHub Actions otomatik olarak Windows ve macOS build'lerini test eder (tag/release oluşturulduğunda).

### 🎯 Usage

1. **Select a Project Folder**: Click "Select Folder" and choose your project directory
2. **Choose a Model**: Select an Ollama model from the dropdown
3. **Select Mode**: Choose between "Fast" (quick analysis) or "Plan" (deep analysis)
4. **Write Your Prompt**: Enter a raw prompt describing what you want to build
5. **Refine**: Click "Refine Prompt" to get a context-aware, detailed prompt
6. **Copy & Use**: Copy the refined prompt and use it with your AI coding assistant
7. **Review History**: View and reload previous prompts from the history section

### 🏗️ Project Structure

```
prompt-architect/
├── electron/              # Electron main process
│   ├── main.ts           # Main process (window management, IPC)
│   └── preload.ts        # Preload script (secure API exposure)
├── src/                   # React application
│   ├── components/       # UI components
│   ├── services/         # Services (Ollama integration)
│   ├── stores/           # Zustand state management
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization
│   └── utils/            # Utility functions
├── dist/                  # Build outputs
├── dist-electron/         # Electron build outputs
└── release/               # Production builds
```

### 🔧 Configuration

#### Ollama URL

By default, the app connects to `http://localhost:11434`. To change this, modify `src/stores/useAppStore.ts`:
```typescript
ollamaBaseURL: 'http://your-ollama-url:11434'
```

### 🛠️ Development

#### Tech Stack

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Styling
- **Zustand**: State management
- **Axios**: HTTP client for Ollama API
- **i18n**: Custom internationalization system

#### Supported Platforms

- ✅ **macOS**: 10.15+ (Intel x64 & Apple Silicon arm64)
- ✅ **Windows**: 10+ (x64 & ia32)
- ✅ **Linux**: AppImage (future support)

#### Scripts

- `npm run dev`: Start Vite dev server
- `npm run electron:dev`: Start Electron in development mode
- `npm run build`: Build React app
- `npm run electron:build`: Build Electron app for all platforms
- `npm run electron:build:mac`: Build for macOS only
- `npm run electron:build:win`: Build for Windows only
- `npm run generate:icon`: Generate macOS icon
- `npm run generate:icon:win`: Generate Windows icon
- `npm run lint`: Run ESLint

### 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for providing local LLM capabilities
- [Electron](https://www.electronjs.org/) for the desktop framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the amazing developer experience

### 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

## Türkçe

### ✨ Özellikler

- 🎯 **Bağlam Farkında Prompt İyileştirme**: Proje yapınızı ve teknoloji yığınınızı analiz ederek optimize edilmiş prompt'lar oluşturur
- 🤖 **Yerel AI Modelleri**: Tamamen yerel Ollama modelleriyle çalışır - verileriniz makinenizden çıkmaz
- 📁 **Proje Analizi**: Teknoloji yığını, config dosyaları ve proje yapısını otomatik olarak tespit eder
- 🌍 **Çoklu Dil Desteği**: İngilizce, Türkçe, Almanca ve Fince için tam UI desteği
- 🎨 **Modern Arayüz**: Karanlık/aydınlık tema desteği ile temiz, profesyonel arayüz
- ⚡ **Hızlı ve Verimli**: Optimal performans için Electron, React ve Vite ile geliştirilmiştir
- 🔒 **Gizlilik Öncelikli**: Tüm işlemler yerel olarak gerçekleşir - kodunuz bilgisayarınızdan çıkmaz
- 📚 **Prompt Geçmişi**: Önceki prompt'ları görüntüleyin ve yeniden yükleyin
- 🛑 **Üretim Kontrolü**: Devam eden AI üretimini istediğiniz zaman durdurun

### 🚀 Hızlı Başlangıç

#### Gereksinimler

- Node.js 18+ ve npm
- [Ollama](https://ollama.ai/) kurulu ve çalışıyor olmalı
- En az bir Ollama modeli kurulu olmalı (örn: `ollama pull llama3.2`)

#### Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/yourusername/prompt-architect.git
cd prompt-architect
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ollama'yı başlatın (zaten çalışmıyorsa):
```bash
ollama serve
```

4. Uygulamayı çalıştırın:
```bash
npm run electron:dev
```

### 📦 Üretim Derlemesi

#### Geliştirme Derlemesi
```bash
npm run electron:dev
```

#### Üretim Derlemesi
```bash
npm run electron:build
```

Derlenmiş uygulama `release/` dizininde olacaktır.

### 🎯 Kullanım

1. **Proje Klasörü Seçin**: "Klasör Seç" butonuna tıklayın ve proje dizininizi seçin
2. **Model Seçin**: Dropdown'dan bir Ollama modeli seçin
3. **Mod Seçin**: "Hızlı" (hızlı analiz) veya "Plan" (derinlemesine analiz) arasında seçim yapın
4. **Prompt Yazın**: Ne yapmak istediğinizi açıklayan bir prompt girin
5. **İyileştir**: "Prompt İyileştir" butonuna tıklayarak bağlam farkında, detaylı bir prompt alın
6. **Kopyala ve Kullan**: İyileştirilmiş prompt'u kopyalayın ve AI kodlama asistanınızla kullanın
7. **Geçmişi İncele**: Geçmiş bölümünden önceki prompt'ları görüntüleyin ve yeniden yükleyin

### 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## Deutsch

### ✨ Funktionen

- 🎯 **Kontextbewusste Prompt-Verfeinerung**: Analysiert Ihre Projektstruktur und Tech-Stack, um optimierte Prompts zu erstellen
- 🤖 **Lokale KI-Modelle**: Funktioniert vollständig mit lokalen Ollama-Modellen - keine Daten verlassen Ihren Computer
- 📁 **Projektanalyse**: Erkennt automatisch Tech-Stack, Konfigurationsdateien und Projektstruktur
- 🌍 **Mehrsprachige Unterstützung**: Vollständige UI-Unterstützung für Englisch, Türkisch, Deutsch und Finnisch
- 🎨 **Moderne Benutzeroberfläche**: Saubere, professionelle Oberfläche mit Dark/Light-Theme-Unterstützung
- ⚡ **Schnell und Effizient**: Entwickelt mit Electron, React und Vite für optimale Leistung
- 🔒 **Datenschutz zuerst**: Alle Verarbeitungen erfolgen lokal - Ihr Code verlässt nie Ihren Computer
- 📚 **Prompt-Verlauf**: Zeigen Sie vorherige Prompts an und laden Sie sie neu
- 🛑 **Generierungssteuerung**: Stoppen Sie laufende KI-Generierungen jederzeit

### 🚀 Schnellstart

#### Voraussetzungen

- Node.js 18+ und npm
- [Ollama](https://ollama.ai/) installiert und laufend
- Mindestens ein Ollama-Modell installiert (z.B. `ollama pull llama3.2`)

#### Installation

1. Repository klonen:
```bash
git clone https://github.com/yourusername/prompt-architect.git
cd prompt-architect
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Ollama starten (falls nicht bereits laufend):
```bash
ollama serve
```

4. Anwendung ausführen:
```bash
npm run electron:dev
```

### 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

---

## Suomi

### ✨ Ominaisuudet

- 🎯 **Kontekstitietoinen Prompt-parannus**: Analysoi projektirakenteesi ja teknologiapinon optimoitujen prompttien luomiseksi
- 🤖 **Paikalliset AI-mallit**: Toimii täysin paikallisten Ollama-mallien kanssa - tietosi eivät poistu tietokoneeltasi
- 📁 **Projektianalyysi**: Havaitsi automaattisesti teknologiapinon, konfiguraatiotiedostot ja projektirakenteen
- 🌍 **Monikielinen tuki**: Täydellinen UI-tuki englanniksi, turkiksi, saksaksi ja suomeksi
- 🎨 **Moderni käyttöliittymä**: Siisti, ammattimainen käyttöliittymä tumman/vaalean teeman tuella
- ⚡ **Nopea ja tehokas**: Rakennettu Electronilla, Reactilla ja Vitellä optimaalista suorituskykyä varten
- 🔒 **Yksityisyys ensin**: Kaikki käsittely tapahtuu paikallisesti - koodisi ei koskaan poistu tietokoneeltasi
- 📚 **Prompt-historia**: Tarkastele ja lataa uudelleen aiemmat promptit
- 🛑 **Generoinnin hallinta**: Pysäytä meneillään oleva AI-generointi milloin tahansa

### 🚀 Pikakäyttöönotto

#### Edellytykset

- Node.js 18+ ja npm
- [Ollama](https://ollama.ai/) asennettuna ja käynnissä
- Vähintään yksi Ollama-malli asennettuna (esim. `ollama pull llama3.2`)

#### Asennus

1. Kloonaa repository:
```bash
git clone https://github.com/yourusername/prompt-architect.git
cd prompt-architect
```

2. Asenna riippuvuudet:
```bash
npm install
```

3. Käynnistä Ollama (jos ei jo käynnissä):
```bash
ollama serve
```

4. Suorita sovellus:
```bash
npm run electron:dev
```

### 📝 Lisenssi

Tämä projekti on lisensoitu MIT-lisenssillä - katso [LICENSE](LICENSE) tiedosto yksityiskohtia varten.

---

Made with ❤️ for developers who want better AI prompts

## 👤 Author

**Senol Dogan**

- 🌐 Website: [www.senoldogan.dev](https://www.senoldogan.dev)
- 📧 Email: [contact@senoldogan.dev](mailto:contact@senoldogan.dev)
- 📱 Phone: +358451242459
- 💻 GitHub: [@senoldogann](https://github.com/senoldogann)
