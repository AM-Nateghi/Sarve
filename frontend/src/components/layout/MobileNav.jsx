import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, ClipboardDocumentListIcon as ClipboardIconSolid, Cog6ToothIcon as CogIconSolid } from '@heroicons/react/24/solid';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'داشبورد', icon: HomeIcon, iconSolid: HomeIconSolid },
    { path: '/tasks', label: 'وظایف', icon: ClipboardDocumentListIcon, iconSolid: ClipboardIconSolid },
    { path: '/settings', label: 'تنظیمات', icon: Cog6ToothIcon, iconSolid: CogIconSolid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border z-50">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-500'
                  : 'text-light-text-tertiary dark:text-dark-text-tertiary'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
