# Logo ve Icon Oluşturma Rehberi

## 🎨 Logo Tasarımı

Uygulama için profesyonel bir logo tasarlandı:
- **Ana Sembol**: Stilize edilmiş "P" harfi (Prompt için)
- **Renkler**: Modern gradient (Indigo → Purple → Pink)
- **AI Elementleri**: Sparkle/star şekilleri (AI'ı temsil eder)
- **Stil**: Modern, lüks, profesyonel

## 📦 Icon Dosyaları

### SVG Logo
- **Konum**: `assets/icon.svg`
- **Format**: SVG (vektör, ölçeklenebilir)
- **Kullanım**: Web, print, ve icon oluşturma için kaynak dosya

### macOS Icon (.icns)
- **Konum**: `build/icon.icns`
- **Format**: ICNS (macOS native icon format)
- **Kullanım**: Electron Builder tarafından otomatik kullanılır

## 🛠️ Icon Oluşturma

### Otomatik Yöntem (Önerilen)

```bash
npm run generate:icon
```

Bu komut:
1. SVG'yi PNG formatlarına dönüştürür (tüm gerekli boyutlar)
2. macOS ICNS dosyası oluşturur
3. `build/icon.icns` dosyasını hazırlar

### Gereksinimler

- **macOS**: Script macOS'ta çalışır (iconutil gerektirir)
- **ImageMagick**: SVG'den PNG'ye dönüştürme için
  ```bash
  brew install imagemagick
  ```

### Manuel Yöntem

Eğer otomatik script çalışmazsa:

1. **Online Converter Kullanın:**
   - SVG'yi PNG'ye dönüştür: https://cloudconvert.com/svg-to-png
   - 1024x1024 boyutunda PNG oluşturun
   - PNG'yi ICNS'ye dönüştür: https://cloudconvert.com/png-to-icns

2. **Image2icon Kullanın:**
   - macOS App Store'dan "Image2icon" uygulamasını indirin
   - `assets/icon.svg` dosyasını açın
   - ICNS formatında export edin
   - `build/icon.icns` olarak kaydedin

3. **IconGenerator Kullanın:**
   - https://icon-generator.net/ adresine gidin
   - SVG'yi yükleyin
   - ICNS formatında indirin

## 📱 Icon Boyutları

macOS için gerekli icon boyutları:
- 16x16 (1x ve 2x)
- 32x32 (1x ve 2x)
- 64x64 (1x ve 2x)
- 128x128 (1x ve 2x)
- 256x256 (1x ve 2x)
- 512x512 (1x ve 2x)
- 1024x1024 (1x)

Script otomatik olarak tüm bu boyutları oluşturur.

## ✅ Doğrulama

Icon'un düzgün oluşturulduğunu kontrol etmek için:

```bash
# ICNS dosyasının varlığını kontrol et
ls -lh build/icon.icns

# Icon'u önizle (macOS)
open build/icon.icns
```

## 🎯 Build'de Kullanım

Icon dosyası hazır olduğunda, Electron Builder otomatik olarak kullanır:

```bash
npm run electron:build:mac
```

Build sırasında `package.json`'daki `build.mac.icon` ayarı kullanılır.

## 🔄 Logo Güncelleme

Logo'yu güncellemek için:

1. `assets/icon.svg` dosyasını düzenleyin
2. Icon'u yeniden oluşturun:
   ```bash
   npm run generate:icon
   ```
3. Build'i yeniden yapın:
   ```bash
   npm run electron:build:mac
   ```

## 📝 Notlar

- SVG dosyası vektör formatında olduğu için herhangi bir boyutta kaliteli görünür
- ICNS dosyası sadece macOS için gereklidir
- Windows ve Linux için ayrı icon formatları gerekebilir (gelecekte eklenebilir)

