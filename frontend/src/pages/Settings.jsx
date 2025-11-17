import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setDarkMode, setLightMode } = useThemeStore();
  const { user, logout } = useAuthStore();

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
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
          ظاهر
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-light-text dark:text-dark-text">حالت نمایش</span>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={setLightMode}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-primary-600 text-white'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
              }`}
            >
              <SunIcon className="w-5 h-5" />
              <span>روشن</span>
            </button>
            <button
              onClick={setDarkMode}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-primary-600 text-white'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
              }`}
            >
              <MoonIcon className="w-5 h-5" />
              <span>تاریک</span>
            </button>
          </div>
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
