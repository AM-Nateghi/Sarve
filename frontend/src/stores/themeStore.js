import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // حالت تم: 'light' | 'dark' | 'system'
      theme: 'system',

      // Apply theme to DOM
      applyTheme: (theme) => {
        const root = document.documentElement;

        if (theme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemPrefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        } else if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },

      // تنظیم تم
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        get().applyTheme(newTheme);
      },

      // تغییر (Toggle) بین Light و Dark
      toggleTheme: () => {
        const currentTheme = get().theme;
        let nextTheme;

        if (currentTheme === 'light') {
          nextTheme = 'dark';
        } else if (currentTheme === 'dark') {
          nextTheme = 'system';
        } else {
          nextTheme = 'light';
        }

        get().setTheme(nextTheme);
      },

      // بررسی اینکه آیا Dark Mode فعال است (واقعی نه تنظیمات)
      isDark: () => document.documentElement.classList.contains('dark'),
    }),
    {
      name: 'sarve-theme',
      // بارگذاری تم از localStorage هنگام شروع
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.applyTheme(state.theme);

          // Listen for system theme changes when in system mode
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            if (state.theme === 'system') {
              state.applyTheme('system');
            }
          };

          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }
  )
);

export default useThemeStore;
