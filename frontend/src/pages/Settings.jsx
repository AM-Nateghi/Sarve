import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';
import { ArrowRightOnRectangleIcon, UserCircleIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';
import { useState } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-8">
        تنظیمات
      </h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
          اطلاعات کاربری
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">نام و نام خانوادگی:</span>
            <span className="text-light-text dark:text-dark-text font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">ایمیل:</span>
            <span className="text-light-text dark:text-dark-text font-medium">
              {user?.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">شماره تلفن:</span>
            <span className="text-light-text dark:text-dark-text font-medium">
              {user?.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2 space-x-reverse">
          <SunIcon className="w-6 h-6 text-primary-500" />
          <span>ظاهر</span>
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-light-text dark:text-dark-text font-medium">حالت نمایش</span>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:space-x-2 sm:space-x-reverse">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-reverse px-4 py-3 sm:py-2 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                }`}
              >
                <SunIcon className="w-5 h-5" />
                <span className="text-sm">روشن</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-reverse px-4 py-3 sm:py-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                }`}
              >
                <MoonIcon className="w-5 h-5" />
                <span className="text-sm">تاریک</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-reverse px-4 py-3 sm:py-2 rounded-lg transition-all ${
                  theme === 'system'
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                }`}
              >
                <ComputerDesktopIcon className="w-5 h-5" />
                <span className="text-sm">سیستمی</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            {theme === 'system'
              ? 'تم به طور خودکار بر اساس تنظیمات سیستم شما تغییر می‌کند'
              : theme === 'dark'
              ? 'تم تاریک برای استفاده در شب مناسب است'
              : 'تم روشن برای استفاده در روز مناسب است'
            }
          </p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2 space-x-reverse">
          <BellIcon className="w-6 h-6 text-primary-500" />
          <span>اعلان‌ها</span>
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-light-text dark:text-dark-text">دریافت اعلان‌ها</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary-500' : 'bg-light-border dark:bg-dark-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-1' : 'translate-x-6'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            دریافت اعلان برای یادآوری وظایف و گزارش‌ها
          </p>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2 space-x-reverse">
          <ShieldCheckIcon className="w-6 h-6 text-primary-500" />
          <span>حریم خصوصی و امنیت</span>
        </h2>
        <div className="space-y-3">
          <button className="w-full text-right px-4 py-3 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-light-border dark:hover:bg-dark-border transition-colors text-light-text dark:text-dark-text">
            تغییر رمز عبور
          </button>
          <button className="w-full text-right px-4 py-3 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-light-border dark:hover:bg-dark-border transition-colors text-light-text dark:text-dark-text">
            مدیریت دسترسی‌ها
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
          درباره
        </h2>
        <div className="space-y-2">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            <span className="font-medium">نام برنامه:</span> سَروِ
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            <span className="font-medium">نسخه:</span> 1.0.0 (MVP)
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            <span className="font-medium">توضیحات:</span> برنامه مدیریت وظایف هوشمند
          </p>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>خروج از حساب کاربری</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
