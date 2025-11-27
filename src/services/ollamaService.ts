import axios, { AxiosInstance, AxiosError } from 'axios';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  // Cloud model detection
  remote_model?: string;
  remote_host?: string;
}

// Helper function to detect if model is cloud-based
export function isCloudModel(model: OllamaModel): boolean {
  return !!(model.remote_model || model.remote_host || model.name.includes(':cloud'));
}

// Helper function to detect if model is open source (local)
export function isOpenSourceModel(model: OllamaModel): boolean {
  return !isCloudModel(model);
}

export interface OllamaTagResponse {
  models: OllamaModel[];
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaService {
  private client: AxiosInstance;
  private baseURL: string;
  private isConnected: boolean = false;

  constructor(baseURL: string = 'http://localhost:11434') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 dakika (büyük modeller için)
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Ollama servisinin çalışıp çalışmadığını kontrol eder
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/tags');
      this.isConnected = response.status === 200;
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          throw new Error(
            'Ollama servisine bağlanılamıyor. Lütfen Ollama\'nın çalıştığından emin olun.\n' +
            'Ollama\'yı başlatmak için terminalde "ollama serve" komutunu çalıştırın.'
          );
        }
      }
      throw error;
    }
  }

  /**
   * Yüklü modellerin listesini getirir
   */
  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.client.get<OllamaTagResponse>('/api/tags');
      return response.data.models || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          throw new Error('Ollama servisine bağlanılamıyor. Lütfen Ollama\'nın çalıştığından emin olun.');
        }
      }
      throw error;
    }
  }

  /**
   * Prompt'u Ollama'ya gönderir ve yanıt alır
   */
  async generate(
    model: string,
    prompt: string,
    systemPrompt?: string,
    options?: OllamaGenerateRequest['options']
  ): Promise<string> {
    try {
      const request: OllamaGenerateRequest = {
        model,
        prompt,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.65, // Kalite-hız dengesi (0.6-0.7 optimal)
          top_p: 0.9, // Orijinal değer (kalite için önemli)
          num_predict: 1500, // Kalite için yeterli uzunluk
          ...options,
        },
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Ollama generate request:', { model, promptLength: prompt.length, systemPromptLength: systemPrompt?.length || 0 });
      }

      const response = await this.client.post<OllamaGenerateResponse>(
        '/api/generate',
        request,
        {
          timeout: 300000, // 5 dakika
        }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('Ollama response received:', { 
          responseLength: response.data.response?.length || 0,
          done: response.data.done,
          evalCount: response.data.eval_count 
        });
      }

      if (!response.data.response) {
        throw new Error('Ollama yanıt vermedi. Model yükleniyor olabilir, lütfen bekleyin.');
      }

      return response.data.response;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ollama generate error:', error);
      }
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          throw new Error('Ollama servisine bağlanılamıyor. Ollama\'nın çalıştığından emin olun.');
        }
        if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
          throw new Error('İstek zaman aşımına uğradı. Model çok büyük olabilir veya Ollama yavaş çalışıyor olabilir. Lütfen tekrar deneyin.');
        }
        if (axiosError.response?.status === 404) {
          throw new Error(`Model "${model}" bulunamadı. Lütfen modelin yüklü olduğundan emin olun.`);
        }
        if (axiosError.response?.status === 500) {
          throw new Error('Ollama sunucu hatası. Model yükleniyor olabilir, lütfen birkaç saniye bekleyip tekrar deneyin.');
        }
      }
      throw error;
    }
  }

  /**
   * Stream modunda prompt'u gönderir (real-time yanıt için)
   * Browser'da fetch API kullanarak gerçek stream desteği
   */
  async *generateStream(
    model: string,
    prompt: string,
    systemPrompt?: string,
    options?: OllamaGenerateRequest['options'],
    abortSignal?: AbortSignal
  ): AsyncGenerator<string, void, unknown> {
    try {
      const request: OllamaGenerateRequest = {
        model,
        prompt,
        system: systemPrompt,
        stream: true,
        options: {
          temperature: 0.65, // Kalite-hız dengesi
          top_p: 0.9, // Orijinal değer (kalite için)
          num_predict: 1500, // Yeterli uzunluk
          ...options,
        },
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Ollama stream request:', { model, promptLength: prompt.length });
      }

      // Browser'da fetch API kullan (gerçek stream desteği)
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          // Abort kontrolü
          if (abortSignal?.aborted) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Stream aborted by user');
            }
            reader.cancel();
            return;
          }

          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Chunk'u decode et ve buffer'a ekle
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Son satırı buffer'da tut (tam olmayabilir)
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            // Abort kontrolü
            if (abortSignal?.aborted) {
              reader.cancel();
              return;
            }

            try {
              const data = JSON.parse(line);
              if (data.response) {
                yield data.response;
              }
              if (data.done) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('Stream completed');
                }
                reader.cancel();
                return;
              }
            } catch (parseError) {
              // JSON parse hatası, devam et
              if (process.env.NODE_ENV === 'development') {
                console.warn('Failed to parse stream chunk:', line);
              }
            }
          }
        }

        // Kalan buffer'ı işle
        if (buffer.trim() && !abortSignal?.aborted) {
          try {
            const data = JSON.parse(buffer);
            if (data.response) {
              yield data.response;
            }
          } catch {
            // Ignore parse errors
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      // Abort hatası normal bir durum, sessizce handle et
      if (error instanceof Error && error.name === 'AbortError') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Stream canceled by user');
        }
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('Ollama stream error:', error);
      }
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Ollama servisine bağlanılamıyor.');
        }
        if (error.message.includes('timeout')) {
          throw new Error('Stream zaman aşımına uğradı.');
        }
      }
      throw error;
    }
  }

  /**
   * Base URL'i günceller
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Mevcut bağlantı durumunu döndürür
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Base URL'i döndürür
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Singleton instance
export const ollamaService = new OllamaService();

