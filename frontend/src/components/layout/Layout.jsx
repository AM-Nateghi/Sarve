import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import BottomNav from '../BottomNav';
import Stopwatch from '../Stopwatch';
import useTimerStore from '../../stores/timerStore';

const Layout = () => {
  const [showStopwatch, setShowStopwatch] = useState(false);
  const { status } = useTimerStore();

  // اگر تایمر در حال اجراست، کرونومتر را نمایش بده
  const isStopwatchVisible = showStopwatch || status !== 'stopped';

  const toggleStopwatch = () => {
    setShowStopwatch(!showStopwatch);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Desktop Navbar */}
      <div className="hidden sm:block">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="pb-16 sm:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Timer Button */}
      {!isStopwatchVisible && (
        <motion.button
          onClick={toggleStopwatch}
          className="fixed bottom-20 sm:bottom-6 left-6 z-40 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {/* Shadow ring */}
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

          {/* Button */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center transition-all">
            <ClockIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
          </div>

          {/* Label tooltip (desktop only) */}
          <div className="hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
              کرونومتر
            </div>
          </div>
        </motion.button>
      )}

      {/* Stopwatch Component */}
      <AnimatePresence>
        {isStopwatchVisible && (
          <Stopwatch onClose={() => setShowStopwatch(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
