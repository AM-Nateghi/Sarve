import api from './api';
import { AI_MAX_RETRIES } from '../utils/constants';
import { delay } from '../utils/helpers';

const aiService = {
  // پردازش جلسه صوتی
  processAudioSession: async (audioFile, onProgress) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      };
    }

    // تلاش برای ارسال با retry
    let lastError;
    for (let attempt = 0; attempt <= AI_MAX_RETRIES; attempt++) {
      try {
        const response = await api.post('/ai/process-session', formData, config);
        return response.data;
      } catch (error) {
        lastError = error;

        // اگر خطا از نوع rate limit است، صبر کن و دوباره امتحان کن
        if (error.message?.includes('rate limit') || error.status === 429) {
          if (attempt < AI_MAX_RETRIES) {
            console.warn(`Rate limit reached. Retrying (${attempt + 1}/${AI_MAX_RETRIES})...`);
            await delay(2000 * (attempt + 1)); // 2s, 4s, 6s
            continue;
          }
        }

        // برای خطاهای دیگر، مستقیماً throw کن
        if (attempt >= AI_MAX_RETRIES) {
          break;
        }

        // تلاش مجدد
        console.warn(`Attempt ${attempt + 1} failed. Retrying...`);
        await delay(1000 * (attempt + 1));
      }
    }

    // اگر همه تلاش‌ها شکست خورد
    throw {
      message: `پردازش ناموفق بود. لطفاً دوباره تلاش کنید. (${AI_MAX_RETRIES} تلاش انجام شد)`,
      originalError: lastError,
    };
  },

  // ضبط صدا مستقیم
  recordAudio: async (audioBlob, onProgress) => {
    return aiService.processAudioSession(audioBlob, onProgress);
  },

  // دریافت گزارش هوشمند
  getSmartReport: async (date) => {
    let lastError;
    for (let attempt = 0; attempt <= AI_MAX_RETRIES; attempt++) {
      try {
        const response = await api.post('/ai/smart-report', { date });
        return response.data;
      } catch (error) {
        lastError = error;

        if (error.message?.includes('rate limit') || error.status === 429) {
          if (attempt < AI_MAX_RETRIES) {
            console.warn(`Rate limit reached. Retrying (${attempt + 1}/${AI_MAX_RETRIES})...`);
            await delay(2000 * (attempt + 1));
            continue;
          }
        }

        if (attempt >= AI_MAX_RETRIES) {
          break;
        }

        await delay(1000 * (attempt + 1));
      }
    }

    throw {
      message: `ایجاد گزارش ناموفق بود. لطفاً دوباره تلاش کنید.`,
      originalError: lastError,
    };
  },

  // بررسی وضعیت سرویس AI
  checkAIStatus: async () => {
    try {
      const response = await api.get('/ai/status');
      return response.data;
    } catch (error) {
      return { available: false, error: error.message };
    }
  },
};

export default aiService;
