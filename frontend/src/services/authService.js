import apiClient from './apiClient';

const authService = {
  // ورود با پسورد
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  // ثبت‌نام
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },

  // ورود با Google OAuth
  loginWithGoogle: async (credential) => {
    const response = await apiClient.post('/api/auth/google', { credential });
    return response.data;
  },

  // خروج
  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // دریافت اطلاعات کاربر فعلی
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  // بروزرسانی پروفایل
  updateProfile: async (updates) => {
    const response = await apiClient.put('/api/auth/profile', updates);
    return response.data;
  },

  // تغییر رمز عبور
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put('/api/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // بررسی توکن
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/api/auth/verify');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default authService;
