import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

const navItems = [
  {
    path: '/dashboard',
    label: 'خانه',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    path: '/tasks',
    label: 'وظایف',
    icon: CheckCircleIcon,
    activeIcon: CheckCircleIconSolid,
  },
  {
    path: '/reports',
    label: 'گزارش',
    icon: ChartBarIcon,
    activeIcon: ChartBarIconSolid,
  },
  {
    path: '/settings',
    label: 'تنظیمات',
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid,
  },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg-secondary border-t border-gray-100 dark:border-gray-800 pb-safe">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-gray-500 dark:text-gray-400 group-active:text-gray-700 dark:group-active:text-gray-300'
                  }`}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
