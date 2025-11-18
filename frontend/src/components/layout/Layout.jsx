import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Stopwatch from '../Stopwatch';
import useTimerStore from '../../stores/timerStore';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(false);
  const { status } = useTimerStore();

  // اگر تایمر در حال اجراست، کرونومتر را نمایش بده
  const isStopwatchVisible = showStopwatch || status !== 'stopped';

  const toggleStopwatch = () => {
    setShowStopwatch(!showStopwatch);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Floating Action Button - Timer */}
      {!isStopwatchVisible && (
        <button
          onClick={toggleStopwatch}
          className="fixed bottom-24 left-4 md:bottom-4 z-40 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
          title="باز کردن کرونومتر"
        >
          <ClockIcon className="w-6 h-6" />
        </button>
      )}

      {/* Stopwatch Component */}
      <AnimatePresence>
        {isStopwatchVisible && (
          <Stopwatch
            onClose={() => {
              setShowStopwatch(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
