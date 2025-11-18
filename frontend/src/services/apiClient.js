import axios from 'axios';

// Base URL از environment variable یا fallback به localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ساخت axios instance با تنظیمات پیش‌فرض
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن token به هر request
apiClient.interceptors.request.use(
  (config) => {
    const authStore = JSON.parse(localStorage.getItem('sarve-auth') || '{}');
    const token = authStore.state?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// مدیریت خطاهای response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token منقضی شده - به صفحه login هدایت کن
      localStorage.removeItem('sarve-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
