import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

const FloatingActionButton = ({ onClick, icon: Icon = PlusIcon, label }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 sm:bottom-6 right-6 z-40 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      {/* Shadow rings */}
      <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

      {/* Main button */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-full shadow-2xl flex items-center justify-center transition-all">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
      </div>

      {/* Label tooltip (desktop only) */}
      {label && (
        <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {label}
          </div>
        </div>
      )}
    </motion.button>
  );
};

export default FloatingActionButton;
