import { GoogleGenAI } from '@google/genai';
import apiClient from './apiClient';

// دریافت API Key از backend
let apiKey = null;
let ai = null;

const initializeGemini = async () => {
  if (!apiKey) {
    try {
      const response = await apiClient.get('/api/config/gemini-key');
      apiKey = response.data.apiKey;
      ai = new GoogleGenAI({ apiKey });
    } catch (error) {
      console.error('Failed to get Gemini API key:', error);
      throw new Error('خطا در دریافت تنظیمات AI');
    }
  }
  return ai;
};

// Rate limiting tracker
const rateLimitTracker = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;

const checkRateLimit = () => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // پاک کردن درخواست‌های قدیمی
  const recentRequests = Array.from(rateLimitTracker.values()).filter(
    (timestamp) => timestamp > oneMinuteAgo
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('محدودیت تعداد درخواست. لطفاً یک دقیقه صبر کنید.');
  }

  // اضافه کردن درخواست جدید
  const requestId = `${now}-${Math.random()}`;
  rateLimitTracker.set(requestId, now);

  // پاک کردن ورودی‌های قدیمی از Map
  for (const [id, timestamp] of rateLimitTracker.entries()) {
    if (timestamp <= oneMinuteAgo) {
      rateLimitTracker.delete(id);
    }
  }
};

const aiApi = {
  // استخراج وظایف از متن
  extractTasks: async (input, retryCount = 0) => {
    checkRateLimit();

    try {
      const geminiAI = await initializeGemini();

      const prompt = `شما یک دستیار هوشمند برای مدیریت وظایف هستید. از متن زیر، وظایف را استخراج کنید و به صورت JSON بازگردانید.

متن: ${input}

خروجی باید به این فرمت باشد:
{
    "tasks": [
        {
            "title": "عنوان وظیفه",
            "description": "توضیحات اختیاری",
            "priority": 2,
            "deadline": "2025-01-20T00:00:00Z"
        }
    ]
}

نکات:
- priority: 1 (کم), 2 (متوسط), 3 (زیاد), 4 (فوری)
- deadline فقط اگر در متن ذکر شده باشد
- اگر وظیفه‌ای نبود، آرایه خالی برگردان
- فقط JSON بازگردان، بدون توضیح اضافی`;

      const response = await geminiAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });
      let jsonResponse = response.text.trim();

      // پاک کردن markdown code blocks
      if (jsonResponse.startsWith('```json')) {
        jsonResponse = jsonResponse.substring(7);
      }
      if (jsonResponse.startsWith('```')) {
        jsonResponse = jsonResponse.substring(3);
      }
      if (jsonResponse.endsWith('```')) {
        jsonResponse = jsonResponse.substring(0, jsonResponse.length - 3);
      }
      jsonResponse = jsonResponse.trim();

      const parsed = JSON.parse(jsonResponse);
      return {
        success: true,
        tasks: parsed.tasks || [],
        count: (parsed.tasks || []).length,
      };
    } catch (error) {
      console.error('Error extracting tasks:', error);

      // Retry logic - حداکثر 2 بار
      if (retryCount < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        return aiApi.extractTasks(input, retryCount + 1);
      }

      throw error;
    }
  },

  // تولید گزارش هوشمند
  generateReport: async (tasks, startDate, endDate, retryCount = 0) => {
    checkRateLimit();

    try {
      const geminiAI = await initializeGemini();

      const tasksJson = JSON.stringify(tasks, null, 2);

      const prompt = `شما یک دستیار تحلیلگر برای مدیریت وظایف هستید. بر اساس داده‌های زیر، یک گزارش هوشمند و تحلیلی تولید کنید.

وظایف:
${tasksJson}

بازه زمانی: ${new Date(startDate).toLocaleDateString('fa-IR')} تا ${new Date(endDate).toLocaleDateString('fa-IR')}

گزارش باید شامل:
1. خلاصه کلی (summary): یک پاراگراف کوتاه درباره عملکرد
2. آمار کلی (statistics): تعداد کل، تکمیل شده، در انتظار، میانگین زمان
3. نکات قوت (strengths): 3-5 مورد از نکات مثبت
4. پیشنهادات بهبود (improvements): 3-5 پیشنهاد عملی
5. وظایف پرتکرار (patterns): الگوهای تکراری در وظایف

خروجی را به صورت JSON با این فرمت برگردان:
{
    "summary": "خلاصه...",
    "statistics": {
        "total": 0,
        "completed": 0,
        "pending": 0,
        "averageCompletionTime": "2.5 روز"
    },
    "strengths": ["..."],
    "improvements": ["..."],
    "patterns": ["..."]
}`;

      const response = await geminiAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });
      let jsonResponse = response.text.trim();

      // پاک کردن markdown code blocks
      if (jsonResponse.startsWith('```json')) {
        jsonResponse = jsonResponse.substring(7);
      }
      if (jsonResponse.startsWith('```')) {
        jsonResponse = jsonResponse.substring(3);
      }
      if (jsonResponse.endsWith('```')) {
        jsonResponse = jsonResponse.substring(0, jsonResponse.length - 3);
      }
      jsonResponse = jsonResponse.trim();

      const report = JSON.parse(jsonResponse);

      return {
        success: true,
        report: report,
      };
    } catch (error) {
      console.error('Error generating report:', error);

      // Retry logic
      if (retryCount < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        return aiApi.generateReport(tasks, startDate, endDate, retryCount + 1);
      }

      throw error;
    }
  },
};

export default aiApi;
