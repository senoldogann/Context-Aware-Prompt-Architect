# Windows için Build ve Kurulum Rehberi

Bu rehber, Prompt Architect uygulamasını Windows'ta build edip kurmak için adım adım talimatlar içerir.

## Gereksinimler

- Windows 10 veya üzeri
- Node.js 18+ ve npm
- Git (opsiyonel, sadece kaynak koddan build için)

## Build Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Production Build Yapın

```bash
npm run electron:build:win
```

Bu komut:
- React uygulamasını build eder
- Electron dosyalarını kopyalar
- Windows için `.exe` installer ve portable versiyonlar oluşturur

### 3. Build Çıktıları

Build tamamlandıktan sonra, `release/` klasöründe şu dosyalar oluşur:

- `Prompt Architect Setup 1.0.0.exe` - NSIS Installer (önerilen)
- `Prompt Architect-1.0.0-win.zip` - Portable versiyon (kurulum gerektirmez)

## Kurulum

### Yöntem 1: NSIS Installer ile Kurulum (Önerilen)

1. `release/` klasöründen `Prompt Architect Setup 1.0.0.exe` dosyasını çalıştırın
2. Kurulum sihirbazını takip edin
3. Varsayılan olarak `C:\Program Files\Prompt Architect` klasörüne kurulur
4. Kurulum tamamlandıktan sonra masaüstünde kısayol oluşturulur

### Yöntem 2: Portable Versiyon (Kurulum Gerektirmez)

1. `release/` klasöründen `Prompt Architect-1.0.0-win.zip` dosyasını indirin
2. ZIP dosyasını istediğiniz bir klasöre çıkarın (örn: `C:\Programs\Prompt Architect`)
3. `Prompt Architect.exe` dosyasını çift tıklayarak çalıştırın
4. Masaüstü kısayolu oluşturmak için sağ tıklayıp "Send to > Desktop (create shortcut)" seçin

### Yöntem 3: Manuel Kurulum

1. `release/win-unpacked/` klasöründeki tüm dosyaları kopyalayın
2. İstediğiniz bir klasöre yapıştırın (örn: `C:\Program Files\Prompt Architect`)
3. `Prompt Architect.exe` dosyasına sağ tıklayıp "Create shortcut" seçin
4. Kısayolu masaüstüne taşıyın

## İlk Açılışta Güvenlik Uyarısı

Windows, imzalanmamış uygulamalar için güvenlik uyarısı gösterebilir. Bu durumda:

1. **"More info"** linkine tıklayın
2. **"Run anyway"** butonuna tıklayın

Alternatif olarak, uygulamayı sağ tıklayıp **"Properties"** > **"Unblock"** seçeneğini işaretleyin.

## Uygulamayı Çalıştırma

1. **Başlat Menüsü**'nde "Prompt Architect" arayın
2. **Masaüstü kısayolu**ndan açın
3. **Görev Çubuğu**na sabitlemek için uygulamayı açıkken görev çubuğundaki ikona sağ tıklayıp "Pin to taskbar" seçin

## Notlar

- İlk açılışta Ollama'nın çalıştığından emin olun
- Uygulama, `http://localhost:11434` adresinde Ollama servisini arar
- Ollama'yı başlatmak için PowerShell veya CMD'de `ollama serve` komutunu çalıştırın
- Windows Defender veya diğer antivirüs yazılımları uygulamayı engelleyebilir, bu durumda uygulamayı istisna listesine ekleyin

## Sorun Giderme

### "Windows protected your PC" hatası

1. Dosyaya sağ tıklayın
2. **Properties** > **General** sekmesinde **"Unblock"** seçeneğini işaretleyin
3. **Apply** ve **OK** butonlarına tıklayın

### Uygulama açılmıyor

1. Event Viewer'da hata loglarını kontrol edin
2. Node.js ve Electron'un doğru yüklü olduğundan emin olun
3. Antivirüs yazılımının uygulamayı engellemediğini kontrol edin

### Build hatası alıyorsanız

```bash
# Node modules'ı temizleyip yeniden yükleyin
rmdir /s /q node_modules
del package-lock.json
npm install

# Build'i tekrar deneyin
npm run electron:build:win
```

## Geliştirici Notları

- Windows build için code signing gerekli değildir (açık kaynak projeler için)
- NSIS installer otomatik olarak başlat menüsü ve masaüstü kısayolu oluşturur
- Portable versiyon hiçbir sistem değişikliği yapmaz, sadece çalıştırılabilir

## Windows Store için Yayınlama (Gelecek)

Windows Store'a yayınlamak için:
- Microsoft Developer hesabı gereklidir
- Code signing sertifikası gereklidir
- Store politikalarına uyum gereklidir

