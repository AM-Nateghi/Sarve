import api from './api';

const authService = {
  // ورود با پسورد
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // ثبت‌نام
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // ورود با Google OAuth
  loginWithGoogle: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
  },

  // خروج
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // دریافت اطلاعات کاربر فعلی
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // بروزرسانی پروفایل
  updateProfile: async (updates) => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  },

  // تغییر رمز عبور
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // بررسی توکن
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default authService;
