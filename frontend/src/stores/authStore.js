import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // اطلاعات کاربر
      user: null,

      // توکن احراز هویت
      token: null,

      // وضعیت بارگذاری
      isLoading: false,

      // خطا
      error: null,

      // ذخیره اطلاعات کاربر و توکن
      setAuth: (user, token) => {
        set({ user, token, error: null });
      },

      // بروزرسانی اطلاعات کاربر
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // خروج از سیستم
      logout: () => {
        set({ user: null, token: null, error: null });
      },

      // تنظیم خطا
      setError: (error) => {
        set({ error });
      },

      // پاک کردن خطا
      clearError: () => {
        set({ error: null });
      },

      // تنظیم وضعیت بارگذاری
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // بررسی اینکه آیا کاربر وارد شده است
      isAuthenticated: () => !!get().token && !!get().user,

      // دریافت توکن
      getToken: () => get().token,

      // دریافت کاربر فعلی
      getUser: () => get().user,
    }),
    {
      name: 'sarve-auth',
    }
  )
);

export default useAuthStore;
