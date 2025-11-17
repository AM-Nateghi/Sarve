import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'داشبورد', icon: HomeIcon },
    { path: '/tasks', label: 'وظایف', icon: ClipboardDocumentListIcon },
    { path: '/settings', label: 'تنظیمات', icon: Cog6ToothIcon },
  ];

  return (
    <nav className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-600 dark:text-primary-500">
              سَروِ
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
              aria-label="تغییر تم"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {/* User Name */}
            <span className="text-sm text-light-text dark:text-dark-text">
              {user?.firstName} {user?.lastName}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="خروج"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
