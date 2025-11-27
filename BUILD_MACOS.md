# macOS için Build ve Kurulum Rehberi

Bu rehber, Prompt Architect uygulamasını macOS'ta build edip Applications klasörüne kurmak için adım adım talimatlar içerir.

## Gereksinimler

- macOS 10.15 (Catalina) veya üzeri
- Node.js 18+ ve npm
- Xcode Command Line Tools (otomatik olarak yüklenir)

## Build Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Production Build Yapın

```bash
npm run electron:build
```

Bu komut:
- React uygulamasını build eder
- Electron dosyalarını kopyalar
- macOS için `.dmg` ve `.zip` dosyaları oluşturur

### 3. Build Çıktıları

Build tamamlandıktan sonra, `release/` klasöründe şu dosyalar oluşur:

- `Prompt Architect-1.0.0-arm64.dmg` - Apple Silicon (M1/M2/M3) için
- `Prompt Architect-1.0.0-x64.dmg` - Intel Mac için
- `Prompt Architect-1.0.0-arm64-mac.zip` - Apple Silicon için zip
- `Prompt Architect-1.0.0-x64-mac.zip` - Intel Mac için zip

## Kurulum

### Yöntem 1: DMG Dosyası ile Kurulum (Önerilen)

1. `release/` klasöründen uygun `.dmg` dosyasını açın
2. Açılan pencerede `Prompt Architect.app` dosyasını `Applications` klasörüne sürükleyin
3. Kurulum tamamlandı!

### Yöntem 2: ZIP Dosyası ile Kurulum

1. `release/` klasöründen uygun `.zip` dosyasını indirin
2. ZIP dosyasını çıkarın
3. `Prompt Architect.app` dosyasını `Applications` klasörüne kopyalayın

### Yöntem 3: Doğrudan Build Çıktısından

Build sonrası `release/mac/` klasöründe `.app` dosyası oluşur:

```bash
cp -R release/mac/Prompt\ Architect.app /Applications/
```

## İlk Açılışta Güvenlik Uyarısı

macOS, imzalanmamış uygulamalar için güvenlik uyarısı gösterebilir. Bu durumda:

1. **System Preferences** > **Security & Privacy** > **General** bölümüne gidin
2. "Prompt Architect was blocked because it is from an unidentified developer" mesajını görürsünüz
3. **"Open Anyway"** butonuna tıklayın
4. Uygulamayı tekrar açmayı deneyin

Alternatif olarak, terminalden:

```bash
sudo xattr -rd com.apple.quarantine /Applications/Prompt\ Architect.app
```

## Uygulamayı Çalıştırma

1. **Applications** klasörünü açın
2. **Prompt Architect** uygulamasını bulun
3. Çift tıklayarak açın
4. Dock'a eklemek için uygulamayı Dock'a sürükleyin

## Notlar

- İlk açılışta Ollama'nın çalıştığından emin olun
- Uygulama, `http://localhost:11434` adresinde Ollama servisini arar
- Ollama'yı başlatmak için terminalde `ollama serve` komutunu çalıştırın

## Sorun Giderme

### "Uygulama açılamıyor" hatası

```bash
# Uygulamanın izinlerini kontrol edin
chmod +x /Applications/Prompt\ Architect.app/Contents/MacOS/Prompt\ Architect

# Quarantine flag'ini kaldırın
sudo xattr -rd com.apple.quarantine /Applications/Prompt\ Architect.app
```

### Build hatası alıyorsanız

```bash
# Node modules'ı temizleyip yeniden yükleyin
rm -rf node_modules package-lock.json
npm install

# Build'i tekrar deneyin
npm run electron:build
```

## Geliştirici Notları

- Build sırasında icon dosyası (`build/icon.icns`) bulunamazsa uyarı alabilirsiniz, bu normaldir
- Code signing için Apple Developer hesabı gereklidir (isteğe bağlı)
- Notarization için Apple Developer hesabı ve notarization credentials gereklidir (isteğe bağlı)

