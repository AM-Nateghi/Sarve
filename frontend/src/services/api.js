import axios from 'axios';
import useAuthStore from '../stores/authStore';

// ایجاد instance از Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای افزودن توکن به هدرها
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت خطاها
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // اگر 401 (Unauthorized) دریافت شد، کاربر را لاگ‌اوت کن
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    // اگر خطای شبکه است
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
      });
    }

    // خطاهای دیگر
    const errorMessage = error.response?.data?.message || error.message || 'خطای نامشخص';
    return Promise.reject({
      ...error.response?.data,
      message: errorMessage,
    });
  }
);

// Helper برای آپلود فایل
export const uploadFile = async (url, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

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

  return api.post(url, formData, config);
};

export default api;
