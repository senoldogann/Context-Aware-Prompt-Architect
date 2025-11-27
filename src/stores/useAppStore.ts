import { create } from 'zustand';
import axios from 'axios';
import { ollamaService, type OllamaModel } from '../services/ollamaService';

interface ProjectContext {
  folderPath: string | null;
  fileStructure: unknown;
  configFiles: Record<string, unknown>;
  techStack: string[];
  detectedLanguages: Array<{
    name: string;
  }>;
}

interface AppState {
  // Ollama State
  ollamaConnected: boolean;
  ollamaBaseURL: string;
  models: OllamaModel[];
  selectedModel: string | null;
  isLoadingModels: boolean;
  connectionError: string | null;
  showOpenSourceOnly: boolean; // Açık kaynak modelleri göster

  // Project Context
  projectContext: ProjectContext | null;
  isLoadingProject: boolean;
  hasSelectedInitialFolder: boolean; // İlk klasör seçimi yapıldı mı?

  // Prompt State
  rawPrompt: string;
  refinedPrompt: string;
  isGenerating: boolean;
  generationError: string | null;
  promptMode: 'fast' | 'plan'; // Fast: Hızlı, Plan: Derinlemesine analiz
  estimatedTime: number | null; // Tahmini süre (saniye)
  promptHistory: Array<{ raw: string; refined: string; timestamp: number; mode: 'fast' | 'plan' }>; // Prompt geçmişi
  abortController: AbortController | null; // Stream'i durdurmak için

  // Theme State
  theme: 'dark' | 'light';

  // Language State
  language: 'en' | 'tr' | 'de' | 'fi';

  // Actions
  checkOllamaConnection: () => Promise<void>;
  loadModels: () => Promise<void>;
  setSelectedModel: (model: string) => void;
  setOllamaBaseURL: (url: string) => void;
  setShowOpenSourceOnly: (show: boolean) => void;
  setProjectContext: (context: ProjectContext) => void;
  clearProjectContext: () => void;
  setRawPrompt: (prompt: string) => void;
  generateRefinedPrompt: () => Promise<void>;
  stopGeneration: () => void;
  setHasSelectedInitialFolder: (hasSelected: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setLanguage: (language: 'en' | 'tr' | 'de' | 'fi') => void;
  setPromptMode: (mode: 'fast' | 'plan') => void;
  addToPromptHistory: (raw: string, refined: string, mode: 'fast' | 'plan') => void;
  clearPromptHistory: () => void;
}

// Theme'i localStorage'dan yükle
const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('prompt-architect-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  // Sistem tercihini kontrol et
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

// Language'i localStorage'dan yükle veya browser diline göre belirle
const getInitialLanguage = (): 'en' | 'tr' | 'de' | 'fi' => {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('prompt-architect-language');
  if (saved === 'en' || saved === 'tr' || saved === 'de' || saved === 'fi') return saved;
  
  // Browser diline göre otomatik seçim
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('fi')) return 'fi';
  return 'en';
};

export const useAppStore = create<AppState>((set, get) => {
  const initialTheme = getInitialTheme();
  const initialLanguage = getInitialLanguage();

  return {
    // Initial State
    ollamaConnected: false,
    ollamaBaseURL: 'http://localhost:11434',
    models: [],
    selectedModel: null,
    isLoadingModels: false,
    connectionError: null,
    showOpenSourceOnly: false, // Varsayılan: tüm modeller
    projectContext: null,
    isLoadingProject: false,
    hasSelectedInitialFolder: false,
  rawPrompt: '',
  refinedPrompt: '',
  isGenerating: false,
  generationError: null,
  promptMode: 'fast' as const,
  estimatedTime: null,
  promptHistory: (() => {
    // LocalStorage'dan history'yi yükle
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('prompt-architect-history');
        if (saved) {
          const history = JSON.parse(saved);
          return history;
        }
      } catch (e) {
        console.warn('Failed to load prompt history:', e);
      }
    }
    return [];
  })(),
  abortController: null,
  theme: initialTheme,
  language: initialLanguage,

  // Actions
  checkOllamaConnection: async () => {
    try {
      const isConnected = await ollamaService.checkConnection();
      set({ ollamaConnected: isConnected, connectionError: null });
      if (isConnected) {
        get().loadModels();
      }
    } catch (error) {
      set({
        ollamaConnected: false,
        connectionError: error instanceof Error ? error.message : 'Bağlantı hatası',
      });
    }
  },

  loadModels: async () => {
    set({ isLoadingModels: true, connectionError: null });
    try {
      const models = await ollamaService.getModels();
      set({
        models,
        isLoadingModels: false,
        selectedModel: models.length > 0 ? models[0].name : null,
      });
    } catch (error) {
      set({
        isLoadingModels: false,
        connectionError: error instanceof Error ? error.message : 'Model yükleme hatası',
      });
    }
  },

  setSelectedModel: (model: string) => {
    set({ selectedModel: model });
  },

  setOllamaBaseURL: (url: string) => {
    ollamaService.setBaseURL(url);
    set({ ollamaBaseURL: url });
    get().checkOllamaConnection();
  },

  setShowOpenSourceOnly: (show: boolean) => {
    set({ showOpenSourceOnly: show });
  },

  setHasSelectedInitialFolder: (hasSelected: boolean) => {
    set({ hasSelectedInitialFolder: hasSelected });
  },

  setProjectContext: (context: ProjectContext) => {
    set({ projectContext: context });
  },

  clearProjectContext: () => {
    set({ projectContext: null });
  },

  setRawPrompt: (prompt: string) => {
    set({ rawPrompt: prompt });
  },

  generateRefinedPrompt: async () => {
    const { rawPrompt, selectedModel, projectContext, promptMode } = get();

    if (!selectedModel) {
      set({ generationError: 'Lütfen bir model seçin' });
      return;
    }

    if (!rawPrompt.trim()) {
      set({ generationError: 'Lütfen bir prompt girin' });
      return;
    }

    // Önceki işlemi durdur (varsa)
    const { abortController: prevController } = get();
    if (prevController) {
      prevController.abort();
    }

    // Yeni abort controller oluştur
    const abortController = new AbortController();

    // Mode'a göre tahmini süre hesapla
    const estimatedTime = promptMode === 'fast' ? 15 : 45; // Fast: 15s, Plan: 45s
    set({ 
      isGenerating: true, 
      generationError: null, 
      refinedPrompt: '', 
      estimatedTime,
      abortController 
    });

    try {
      // Kullanıcının dilini tespit et
      const isTurkish = /[çğıöşüÇĞIİÖŞÜ]/.test(rawPrompt) || 
                        /\b(ve|ile|için|bir|bu|şu|o|nasıl|ne|neden|hangi|yap|et|ol|var|yok)\b/i.test(rawPrompt);
      
      // Mode'a göre talimat
      const modeNote = promptMode === 'fast' 
        ? 'Hızlı analiz yap, öz prompt oluştur.'
        : 'Derinlemesine analiz yap, detaylı prompt oluştur.';
      
      // PROJECT_METADATA'yı hazırla
      let projectMetadata = '[]';
      if (projectContext && projectContext.techStack.length > 0) {
        projectMetadata = JSON.stringify(projectContext.techStack);
      }

      const systemPrompt = `### SYSTEM ROLE: CONTEXT-AWARE PROMPT ARCHITECT (NEXUS-10)

SEN, KULLANICININ TEKNOLOJİ YIĞININI (TECH STACK) ALGILAYIP, ONA ÖZEL "HARD-CODED" TALİMATLAR ÜRETEN BİR SİSTEMSİN.

**Output Language:** ${isTurkish ? 'Kullanıcı Türkçe yazıyor. Sen de Türkçe yanıt ver. Teknik terimler istisna (API, HTTP, JSON, TypeScript, React gibi).' : 'User is writing in English. Respond in English.'}

**MODE:** ${modeNote}

**GİRDİ VERİLERİ:**

1. **USER INPUT:** Kullanıcı isteği.

2. **PROJECT_METADATA:** Taranan diller. (Örn: Swift, Python, NextJS)

**Mevcut PROJECT_METADATA:** ${projectMetadata}

---

### 💀 KRİTİK KURAL: "NO-PLACEHOLDER POLICY"

Çıktı üretirken \`[BAĞIMLILIK_DOSYASI]\`, \`[FRAMEWORK]\`, \`[TEST_ARACI]\` gibi yer tutucuları kullanmak **KESİNLİKLE YASAKTIR.**

Bunun yerine, \`PROJECT_METADATA\` verisine bakarak gerçek dosya ve teknoloji adlarını yazmalısın.

**DÖNÜŞÜM TABLOSU (ZİHNİNDE UYGULA):**

* Metadata: **Swift/iOS** → \`[BAĞIMLILIK]\` yerine **Package.swift / Podfile** yaz. \`[FRAMEWORK]\` yerine **SwiftUI / UIKit** yaz. \`[TEST]\` yerine **XCTest** yaz. \`[ARCHIVE]\` yerine **Archive / App Store Connect** yaz.

* Metadata: **Python** → \`[BAĞIMLILIK]\` yerine **requirements.txt / pyproject.toml** yaz. \`[FRAMEWORK]\` yerine **Django / Flask / FastAPI** yaz. \`[TEST]\` yerine **pytest / unittest** yaz.

* Metadata: **Node/JS/NextJS** → \`[BAĞIMLILIK]\` yerine **package.json** yaz. \`[FRAMEWORK]\` yerine **Next.js / React / Express** yaz. \`[TEST]\` yerine **Jest / Vitest** yaz.

* Metadata: **Flutter** → \`[BAĞIMLILIK]\` yerine **pubspec.yaml** yaz. \`[FRAMEWORK]\` yerine **Flutter / Dart** yaz. \`[TEST]\` yerine **flutter test** yaz.

* Metadata: **Go (Golang)** → \`[BAĞIMLILIK]\` yerine **go.mod** yaz. \`[FRAMEWORK]\` yerine **Gin / Echo** yaz. \`[TEST]\` yerine **go test** yaz.

* Metadata: **PHP/Laravel** → \`[BAĞIMLILIK]\` yerine **composer.json** yaz. \`[FRAMEWORK]\` yerine **Laravel** yaz. \`[TEST]\` yerine **PHPUnit** yaz.

*Eğer Metadata BOŞ ise veya teknoloji bilinmiyorsa, ancak o zaman genel terimler kullan.*

---

### 🧠 DÜŞÜNME VE İNŞA SÜRECİ

**ADIM 1: OTONOM TEKNOLOJİ EŞLEŞTİRME (Autonomous Tech Mapping)**

\`PROJECT_METADATA\` içindeki dilleri analiz et ve kendi bilgi tabanından (Knowledge Base) en uygun dosyaları ve terimleri **otomatik olarak** bul. Asla \`[PLACEHOLDER]\` kullanma, gerçek terimleri kullan.

**Örnek Mantık Akışı:**

* **Eğer Swift ise:** \`[DEPENDENCY_FILE]\` yerine -> \`Package.swift\` veya \`Podfile\` kullan. \`[FRAMEWORK]\` yerine -> \`SwiftUI\` veya \`UIKit\` kullan. \`[TEST]\` yerine -> \`XCTest\` kullan.

* **Eğer Go (Golang) ise:** \`go.mod\`, \`goroutine\`, \`gin/echo\` terimlerini kullan.

* **Eğer PHP/Laravel ise:** \`composer.json\`, \`artisan\`, \`blade\` terimlerini kullan.

* **Eğer Bilinmeyen/Genel ise:** Ancak o zaman \`[GENERIC_TERMS]\` kullan.

**(YENİ KURAL) HİBRİT YIĞIN KONTROLÜ:**

Eğer Metadata içinde **HEM Backend** (Python, Java, Go, PHP, Ruby, C#, Node.js/Express) **HEM DE Frontend** (HTML, CSS, JavaScript, React, Vue, Angular, TypeScript) dilleri varsa:

1. Rolü **"Full Stack Developer"** veya **"Full Stack Engineer"** olarak ayarla.

2. Görev listesini **%60 Backend + %40 Frontend** entegrasyonu olacak şekilde harmanla.

   * **Örnek Backend Kontrolleri:** "Flask/Django template'lerinde (HTML) XSS açığı var mı?", "Static dosyalar (CSS/JS) doğru serve ediliyor mu?", "API endpoint'leri CORS ile frontend'e açık mı?", "Session yönetimi frontend ile senkronize mi?"

   * **Örnek Frontend Kontrolleri:** "API çağrıları error handling yapıyor mu?", "Form validasyonu backend ile uyumlu mu?", "CSRF token'ları doğru gönderiliyor mu?", "Static asset'ler (CSS/JS) cache ediliyor mu?"

3. **Entegrasyon Noktaları:** Backend-Frontend arasındaki kritik noktaları kontrol et (API contract, authentication flow, data validation).

### ⚖️ TEKNOLOJİ HİYERARŞİSİ VE ÇATIŞMA ÇÖZÜMÜ (HIERARCHY PROTOCOL)

Eğer \`PROJECT_METADATA\` içinde karışık sinyaller varsa (Hem Mobil hem Web dilleri), aşağıdaki "Rütbe Sırası"na göre karar ver. Üst rütbe, alt rütbeyi ezer.



**RÜTBE 1 (ZİRVE - MOBİL/NATIVE):**

* **Tetikleyiciler:** \`Dart\`, \`Flutter\`, \`Swift\`, \`Kotlin\`, \`Objective-C\`, \`React Native\`.

* **Davranış:** Eğer bunlardan biri varsa, yanındaki \`HTML\`, \`CSS\`, \`JavaScript\` etiketlerini **YOK SAY**. Bunlar sadece WebView veya Asset'tir.

* **Rol:** Mobile Developer (iOS/Android/Flutter).



**RÜTBE 2 (SYSTEM/BACKEND):**

* **Tetikleyiciler:** \`C\`, \`C++\`, \`Rust\`, \`Go\`, \`C#\`.

* **Davranış:** Yanındaki HTML'i raporlama aracı olarak gör, Web projesi sanma.

* **Rol:** Systems Engineer / Backend Developer.



**RÜTBE 3 (WEB - TABAN):**

* **Tetikleyiciler:** \`React\`, \`NextJS\`, \`Vue\`, \`Angular\`, \`HTML\`, \`CSS\`.

* **Davranış:** Sadece Rütbe 1 ve 2 yoksa burası aktiftir.



**⚠️ ÇATIŞMA ÖRNEĞİ:**

* Girdi: \`[Dart, HTML, C++]\`

* Analiz: Dart (Rütbe 1) var. HTML (Rütbe 3) var.

* Karar: **MOBİL (FLUTTER)**. HTML'i görmezden gel. React önerme.

**ADIM 2: NİYET GENİŞLETME (Intent Expansion)**

Kullanıcı ne istiyor? (Örn: "Sunuma hazır mı?")

**ADIM 3: JARGON EŞLEŞTİRME**

Metadata'daki dile göre jargon seç. (Swift ise → XCTest, CoreData, Archive).

**ADIM 4: İNŞA**

Aşağıdaki şablona göre promptu yaz ama tüm değişkenleri doldur.

---

### 🗣️ DİL VE ÜSLUP PROTOKOLÜ (LANGUAGE LOCK)

Kullanıcının **USER_INPUT** dilini tespit et ve ÇIKTIYI (Prompt'u) mutlaka o dilde üret.

**DİL EŞLEŞTİRME KURALLARI:**

1. **Girdi Türkçe ise:** Çıktı **TÜRKÇE** olmalıdır. (Teknik terimleri çevirme: "SSR", "Hydration", "API", "HTTP", "JSON", "TypeScript", "React" gibi terimler olduğu gibi kalmalı).

2. **Girdi İngilizce ise:** Çıktı **İNGİLİZCE** olmalıdır.

3. **Girdi Almanca ise:** Çıktı **ALMANCA** olmalıdır.

4. **Girdi başka bir dilde ise:** Çıktı o dilde olmalıdır.

**HATA ÖNLEME:**

* Asla teknik terimlerin yoğunluğuna kapılıp İngilizceye geçiş yapma.

* Kullanıcı Türkçe "Proje ne işe yarıyor?" dediyse, sen de Türkçe "Projenin amacını analiz et..." diye başla.

* Kullanıcı İngilizce "What does this project do?" dediyse, sen de İngilizce "Analyze the project's purpose..." diye başla.

* Teknik terimler (framework adları, teknoloji isimleri, kısaltmalar) her dilde aynı kalır, sadece cümle yapısı ve açıklamalar kullanıcının dilinde olmalıdır.

---

### 📤 ÇIKTI FORMATI

**⚠️ KRİTİK: ASLA KULLANICININ SORUSUNA CEVAP VERME! SADECE PROMPT OLUŞTUR!**

Çıktıyı SADECE aşağıdaki şablonda ver. Markdown kullan.

\`\`\`markdown

**🎯 UZMAN ROLÜ:**

(Metadata'ya uygun unvan. Örn: Senior iOS Engineer, Senior Next.js Architect, Senior Python Developer)

**📋 GÖREV DETAYLARI:**

(Burada ASLA köşeli parantez kalmamalı. Hepsi gerçek terimlere dönüşmeli.)

1. ...

2. ...

3. ...

**📦 BEKLENEN FORMAT:**

(JSON, Markdown Table, Kod bloğu vb.)

**🚨 KISITLAMALAR:**

* Açıklama yapma.

* (Metadata'ya uygun spesifik kısıtlama. Örn: "Storyboard kullanma, sadece Programmatic UI". Swift için: "Class component kullanma, sadece Functional Component kullan." Next.js için: "Server Component kullan, Client Component'leri gereksiz yere kullanma.")

\`\`\`

---

**ÖNEMLİ NOTLAR:**

* Eğer PROJECT_METADATA boşsa veya teknoloji belirtilmemişse, ancak o zaman genel terimler kullan: \`[FRAMEWORK]\`, \`[BAĞIMLILIK_YÖNETİM_DOSYASI]\`.

* ASLA popüler teknolojileri (Next.js, Node.js, package.json) varsayılan olarak kullanma.

* Eğer kullanıcı bir soru soruyorsa, o soruyu cevaplama. Soruyu bir PROMPT'a dönüştür.

---

**SEN ARTIK SADECE BİR DÜZENLEYİCİ DEĞİL, BİR "BAĞLAM SİHİRBAZISIN". ŞİMDİ GİRDİYİ BEKLE.**`;

      // Mode'a göre Ollama parametrelerini ayarla
      // Temperature: 0.3-0.5 arası "Sweet Spot" (0.4 ideal)
      const ollamaOptions = promptMode === 'fast' 
        ? {
            temperature: 0.4, // Sweet spot - yaratıcı ama tutarlı
            top_p: 0.9,
            num_predict: 1000, // Hızlı ama yeterli uzunluk
          }
        : {
            temperature: 0.4, // Sweet spot - yaratıcı ama tutarlı
            top_p: 0.95, // Daha iyi kelime seçimi
            num_predict: 2000, // Daha uzun prompt (detaylı)
          };

      // 🚨 SYSTEM DATA INJECTION: Metadata'yı user message'a enjekte et
      const combinedUserMessage = projectMetadata && projectMetadata !== '[]'
        ? `---
🚨 SYSTEM DATA INJECTION 🚨
PROJECT_METADATA: ${projectMetadata}
---
USER INPUT: ${rawPrompt}`
        : rawPrompt;

      // Ollama'ya stream modunda gönder
      let accumulatedResponse = '';
      
      set({ refinedPrompt: '' }); // Başlangıçta temizle
      
      try {
        for await (const chunk of ollamaService.generateStream(selectedModel, combinedUserMessage, systemPrompt, ollamaOptions, abortController.signal)) {
          // Abort kontrolü
          if (abortController.signal.aborted) {
            set({ 
              isGenerating: false, 
              refinedPrompt: accumulatedResponse,
              abortController: null 
            });
            return;
          }

          accumulatedResponse += chunk;
          // Real-time olarak güncelle (kullanıcı yazıyormuş gibi görsün)
          set({ refinedPrompt: accumulatedResponse });
        }

        // Output validation - kalite kontrolü
        if (accumulatedResponse.trim().length < 50) {
          throw new Error('Yanıt çok kısa. Lütfen daha detaylı bir prompt girin veya tekrar deneyin.');
        }

        // Çıktıyı parse et - sadece prompt kısmını al
        let finalPrompt = accumulatedResponse;
        
        // Yeni format: Markdown code block içindeki prompt'u al
        const markdownMatch = accumulatedResponse.match(/```markdown\s*\n(.+?)\n```/s);
        if (markdownMatch && markdownMatch[1]) {
          finalPrompt = markdownMatch[1].trim();
        } else {
          // Eğer markdown code block yoksa, direkt içeriği al
          // Eski format desteği
          const promptMatch = accumulatedResponse.match(/#\s*🚀\s*OPTİMİZE EDİLMİŞ PROMPT\s*\n\n(.+?)(?:\n\n#\s*🧩|$)/s);
          if (promptMatch && promptMatch[1]) {
            finalPrompt = promptMatch[1].trim();
          } else {
            // Başlıkları temizle
            finalPrompt = accumulatedResponse
              .replace(/```markdown\s*/gi, '')
              .replace(/```\s*/gi, '')
              .replace(/#\s*🚀\s*OPTİMİZE EDİLMİŞ PROMPT\s*\n\n/gi, '')
              .replace(/#\s*🧩\s*DEĞİŞKENLER.*$/s, '')
              .replace(/#\s*⚙️\s*MÜHENDİS NOTLARI.*$/s, '')
              .replace(/🎯\s*OPTİMİZE EDİLMİŞ PROMPT:?\s*/gi, '')
              .replace(/🔍\s*YAPILAN İYİLEŞTİRMELER:?\s*.*$/s, '')
              .trim();
          }
        }

        // Abort kontrolü - eğer durdurulduysa history'ye ekleme
        if (!abortController.signal.aborted) {
          // Başarılı oldu, history'ye ekle
          get().addToPromptHistory(rawPrompt, finalPrompt, promptMode);
          
          set({
            refinedPrompt: finalPrompt,
            isGenerating: false,
            generationError: null,
            estimatedTime: null,
            abortController: null,
          });
        } else {
          // Durduruldu, sadece state'i temizle
          set({
            isGenerating: false,
            estimatedTime: null,
            abortController: null,
          });
        }
      } catch (streamError) {
        // Abort hatası normal bir durum
        if (axios.isAxiosError(streamError) && streamError.code === 'ERR_CANCELED') {
          set({
            isGenerating: false,
            estimatedTime: null,
            abortController: null,
          });
          return;
        }
        // Stream hatası durumunda normal generate'i dene (abort değilse)
        if (!abortController.signal.aborted) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Stream failed, falling back to normal generate:', streamError);
          }
          const refined = await ollamaService.generate(selectedModel, combinedUserMessage, systemPrompt, ollamaOptions);

        // Output validation - kalite kontrolü
        if (refined.trim().length < 50) {
          throw new Error('Yanıt çok kısa. Lütfen daha detaylı bir prompt girin veya tekrar deneyin.');
        }

        // Çıktıyı parse et - sadece prompt kısmını al
        let finalPrompt = refined;
        
        // Yeni format: Markdown code block içindeki prompt'u al
        const markdownMatch = refined.match(/```markdown\s*\n(.+?)\n```/s);
        if (markdownMatch && markdownMatch[1]) {
          finalPrompt = markdownMatch[1].trim();
        } else {
          // Eğer markdown code block yoksa, direkt içeriği al
          // Eski format desteği
          const promptMatch = refined.match(/#\s*🚀\s*OPTİMİZE EDİLMİŞ PROMPT\s*\n\n(.+?)(?:\n\n#\s*🧩|$)/s);
          if (promptMatch && promptMatch[1]) {
            finalPrompt = promptMatch[1].trim();
          } else {
            // Başlıkları temizle
            finalPrompt = refined
              .replace(/```markdown\s*/gi, '')
              .replace(/```\s*/gi, '')
              .replace(/#\s*🚀\s*OPTİMİZE EDİLMİŞ PROMPT\s*\n\n/gi, '')
              .replace(/#\s*🧩\s*DEĞİŞKENLER.*$/s, '')
              .replace(/#\s*⚙️\s*MÜHENDİS NOTLARI.*$/s, '')
              .replace(/🎯\s*OPTİMİZE EDİLMİŞ PROMPT:?\s*/gi, '')
              .replace(/🔍\s*YAPILAN İYİLEŞTİRMELER:?\s*.*$/s, '')
              .trim();
          }
        }

          // Başarılı oldu, history'ye ekle
          get().addToPromptHistory(rawPrompt, finalPrompt, promptMode);
          
          set({
            refinedPrompt: finalPrompt,
            isGenerating: false,
            generationError: null,
            estimatedTime: null,
            abortController: null,
          });
        }
      }
    } catch (error) {
      // Abort hatası değilse error göster
      if (!(axios.isAxiosError(error) && error.code === 'ERR_CANCELED')) {
        set({
          isGenerating: false,
          generationError: error instanceof Error ? error.message : 'Prompt oluşturma hatası',
          estimatedTime: null,
          abortController: null,
        });
      } else {
        set({
          isGenerating: false,
          estimatedTime: null,
          abortController: null,
        });
      }
    }
  },

  stopGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ 
        isGenerating: false, 
        abortController: null,
        estimatedTime: null 
      });
    }
  },

  setPromptMode: (mode: 'fast' | 'plan') => {
    set({ promptMode: mode });
  },

  addToPromptHistory: (raw: string, refined: string, mode: 'fast' | 'plan') => {
    const { promptHistory } = get();
    const newEntry = {
      raw,
      refined,
      timestamp: Date.now(),
      mode,
    };
    // Son 50 kaydı tut
    const updatedHistory = [newEntry, ...promptHistory].slice(0, 50);
    set({ promptHistory: updatedHistory });
    
    // LocalStorage'a kaydet
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('prompt-architect-history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.warn('Failed to save prompt history:', e);
      }
    }
  },

  clearPromptHistory: () => {
    set({ promptHistory: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('prompt-architect-history');
    }
  },

  setTheme: (theme: 'dark' | 'light') => {
    set({ theme });
    // LocalStorage'a kaydet ve DOM'a uygula
    if (typeof window !== 'undefined') {
      localStorage.setItem('prompt-architect-theme', theme);
      
      // Önce tüm class'ları temizle
      document.documentElement.classList.remove('light', 'dark');
      document.body.classList.remove('light', 'dark');
      
      // Yeni theme class'ını ekle (Tailwind için html element'ine dark class'ı eklenmeli)
      document.documentElement.classList.add(theme);
      document.body.classList.add(theme);
      
      // Force re-render için bir event dispatch et
      window.dispatchEvent(new Event('themechange'));
    }
  },

  toggleTheme: () => {
    const { theme } = get();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    get().setTheme(newTheme);
  },

  setLanguage: (language: 'en' | 'tr' | 'de' | 'fi') => {
    set({ language });
    // LocalStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('prompt-architect-language', language);
    }
  },
  };
});

