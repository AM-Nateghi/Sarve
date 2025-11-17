import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // حالت تم (light یا dark)
      theme: 'light',

      // تغییر به Dark Mode
      setDarkMode: () => {
        set({ theme: 'dark' });
        document.documentElement.classList.add('dark');
      },

      // تغییر به Light Mode
      setLightMode: () => {
        set({ theme: 'light' });
        document.documentElement.classList.remove('dark');
      },

      // تغییر (Toggle) بین Light و Dark
      toggleTheme: () => {
        const currentTheme = get().theme;
        if (currentTheme === 'light') {
          get().setDarkMode();
        } else {
          get().setLightMode();
        }
      },

      // تنظیم تم بر اساس مقدار دلخواه
      setTheme: (theme) => {
        if (theme === 'dark') {
          get().setDarkMode();
        } else {
          get().setLightMode();
        }
      },

      // بررسی اینکه آیا Dark Mode فعال است
      isDark: () => get().theme === 'dark',
    }),
    {
      name: 'sarve-theme',
      // بارگذاری تم از localStorage هنگام شروع
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);

export default useThemeStore;
