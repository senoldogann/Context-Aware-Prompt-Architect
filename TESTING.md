# Build Test Rehberi

Bu rehber, farklı platformlar için build'lerin çalışıp çalışmadığını nasıl test edeceğinizi açıklar.

## 🧪 Test Yöntemleri

### 1. GitHub Actions (Otomatik Test)

Her push'ta otomatik olarak test edilir:

- **Lint Test**: Kod kalitesi kontrolü
- **Build Test**: React uygulaması build kontrolü
- **Windows Build**: Windows installer ve portable oluşturma
- **macOS Build**: macOS DMG ve ZIP oluşturma

**Kontrol Etmek İçin:**
1. GitHub repository'nize gidin
2. **Actions** sekmesine tıklayın
3. Son commit'in build durumunu kontrol edin
4. ✅ Yeşil işaret = Başarılı
5. ❌ Kırmızı işaret = Hata var

### 2. Lokal Test (Manuel)

#### macOS'ta Windows Build Testi

macOS'ta Windows build'i doğrudan test edemezsiniz, ama konfigürasyonu kontrol edebilirsiniz:

```bash
# Konfigürasyonu kontrol et
npm run electron:build:win --dry-run

# Veya sadece konfigürasyonu doğrula
npx electron-builder --win --config
```

#### Windows'ta Test

Windows makinede:

```bash
# Bağımlılıkları yükle
npm install

# Windows icon oluştur
npm run generate:icon:win

# Build yap
npm run electron:build:win

# Çıktıları kontrol et
dir release\*.exe
dir release\*.zip
```

**Beklenen Çıktılar:**
- `Prompt Architect Setup 1.0.0.exe` (NSIS installer)
- `Prompt Architect-1.0.0-win.zip` (Portable)

### 3. Konfigürasyon Doğrulama

Build konfigürasyonunu kontrol etmek için:

```bash
# package.json'daki build konfigürasyonunu kontrol et
cat package.json | grep -A 20 '"build"'

# Electron Builder'ın konfigürasyonu doğru mu?
npx electron-builder --help
```

### 4. Build Log Analizi

Build sırasında şu mesajları arayın:

**Başarılı Build İşaretleri:**
```
✓ built in XXXms
• packaging platform=win32
• building target=nsis
• building target=portable
```

**Hata İşaretleri:**
```
⨯ Command failed
❌ Error
✖ Failed
```

## 🔍 Windows Build Kontrol Listesi

### Build Öncesi Kontroller

- [ ] `package.json`'da `build.win` konfigürasyonu var mı?
- [ ] `build/icon.ico` dosyası mevcut mu?
- [ ] `scripts/generate-windows-icon.sh` çalışıyor mu?
- [ ] Tüm bağımlılıklar yüklü mü? (`npm install`)

### Build Sırasında Kontroller

- [ ] Vite build başarılı mı?
- [ ] Electron dosyaları kopyalandı mı?
- [ ] Electron Builder çalıştı mı?
- [ ] Hata mesajı var mı?

### Build Sonrası Kontroller

- [ ] `release/` klasöründe `.exe` dosyası var mı?
- [ ] `release/` klasöründe `.zip` dosyası var mı?
- [ ] Dosya boyutları makul mu? (50-150 MB arası)
- [ ] Installer çalışıyor mu? (Windows'ta test)

## 🐛 Sorun Giderme

### Windows Build Çalışmıyor

1. **Node.js versiyonu kontrol et:**
   ```bash
   node --version  # 18+ olmalı
   ```

2. **Bağımlılıkları temizle:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Electron Builder versiyonu kontrol et:**
   ```bash
   npm list electron-builder
   ```

4. **Build loglarını detaylı incele:**
   ```bash
   DEBUG=electron-builder npm run electron:build:win
   ```

### Icon Dosyası Eksik

```bash
# Windows icon oluştur
npm run generate:icon:win

# Kontrol et
ls -lh build/icon.ico
```

### GitHub Actions'ta Build Başarısız

1. **Actions** sekmesine gidin
2. Başarısız workflow'u açın
3. Hata mesajını okuyun
4. Genellikle şu sorunlar olur:
   - Icon dosyası eksik
   - Bağımlılık hatası
   - Konfigürasyon hatası

## 📊 Build Durumu Kontrolü

### GitHub'da Kontrol

```bash
# GitHub CLI ile (eğer yüklüyse)
gh workflow view
gh run list
gh run view --log
```

### Lokal Kontrol

```bash
# Son build çıktılarını listele
ls -lh release/

# Build dosyalarının boyutlarını kontrol et
du -sh release/*
```

## ✅ Başarı Kriterleri

Windows build başarılı sayılır eğer:

1. ✅ Build hatasız tamamlanır
2. ✅ `release/` klasöründe `.exe` dosyası oluşur
3. ✅ `release/` klasöründe `.zip` dosyası oluşur
4. ✅ Dosya boyutları makul (50-150 MB)
5. ✅ GitHub Actions'ta yeşil işaret görünür

## 🚀 Hızlı Test Komutu

Tüm kontrolleri tek seferde yapmak için:

```bash
# macOS'ta
npm run lint && npm run build && echo "✅ Build configuration OK"

# Windows'ta (gerçek build)
npm run electron:build:win && echo "✅ Windows build successful"
```

