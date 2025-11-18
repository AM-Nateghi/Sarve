import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ChartBarIcon,
  FireIcon,
  TrophyIcon,
  PlusCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getRandomMessage } from '../utils/helpers';
import { MOTIVATIONAL_MESSAGES } from '../utils/constants';
import useAuthStore from '../stores/authStore';
import useTaskStore from '../stores/taskStore';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getTodayTasks, getTasks } = useTaskStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const motivationalMessage = useState(() => getRandomMessage(MOTIVATIONAL_MESSAGES))[0];

  const todayTasks = getTodayTasks();
  const allTasks = getTasks();
  const completedToday = todayTasks.filter(t => t.completed).length;
  const allCompleted = allTasks.filter(t => t.completed).length;
  const productivityRate = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  // Calculate streak (consecutive days with completed tasks)
  const streak = 3; // این رو بعداً با API واقعی جایگزین می‌کنیم

  // Typewriter Effect
  useEffect(() => {
    if (displayedText.length < motivationalMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(motivationalMessage.slice(0, displayedText.length + 1));
      }, 50);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [displayedText, motivationalMessage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          سلام، {user?.firstName}!
        </h1>

        {/* Typewriter Message */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 min-h-[60px] flex items-center">
          <p className="text-lg text-primary-900 dark:text-primary-100">
            {displayedText}
            {!isTypingComplete && <span className="animate-pulse">|</span>}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between mb-3">
            <ClipboardDocumentCheckIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-900/50 px-2 py-1 rounded-full">
              امروز
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
            {todayTasks.length}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {completedToday} انجام شده
          </p>
          {todayTasks.length > 0 && (
            <div className="mt-3 bg-blue-200 dark:bg-blue-900/40 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${productivityRate}%` }}
              />
            </div>
          )}
        </motion.div>

        {/* All Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-3">
            <ChartBarIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-200 dark:bg-purple-900/50 px-2 py-1 rounded-full">
              کل
            </span>
          </div>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
            {allTasks.length}
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            {allCompleted} تکمیل شده
          </p>
        </motion.div>

        {/* Productivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-3">
            <ArrowTrendingUpIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-900/50 px-2 py-1 rounded-full">
              بهره‌وری
            </span>
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
            {productivityRate}%
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            نرخ تکمیل امروز
          </p>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl p-5 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center justify-between mb-3">
            <FireIcon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-200 dark:bg-orange-900/50 px-2 py-1 rounded-full">
              پیاپی
            </span>
          </div>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
            {streak}
          </p>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            روز متوالی
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-8 border border-light-border dark:border-dark-border"
      >
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2 space-x-reverse">
          <TrophyIcon className="w-6 h-6 text-primary-500" />
          <span>دسترسی سریع</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/tasks"
            className="group relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ClipboardDocumentCheckIcon className="w-5 h-5 ml-2" />
            <span>مشاهده وظایف</span>
          </Link>
          <Link
            to="/tasks"
            className="group relative overflow-hidden flex items-center justify-center bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-light-border dark:hover:bg-dark-border text-light-text dark:text-dark-text font-medium py-4 px-6 rounded-xl transition-all transform hover:-translate-y-1"
          >
            <PlusCircleIcon className="w-5 h-5 ml-2" />
            <span>وظیفه جدید</span>
          </Link>
          <Link
            to="/settings"
            className="group relative overflow-hidden flex items-center justify-center bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-light-border dark:hover:bg-dark-border text-light-text dark:text-dark-text font-medium py-4 px-6 rounded-xl transition-all transform hover:-translate-y-1"
          >
            <ChartBarIcon className="w-5 h-5 ml-2" />
            <span>گزارش‌ها</span>
          </Link>
        </div>
      </motion.div>

      {/* Today's Tasks Preview */}
      {todayTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text flex items-center space-x-2 space-x-reverse">
              <CheckCircleIcon className="w-6 h-6 text-primary-500" />
              <span>کارهای امروز</span>
            </h2>
            <Link
              to="/tasks"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium hover:underline"
            >
              مشاهده همه
            </Link>
          </div>
          <div className="space-y-2">
            {todayTasks.slice(0, 5).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className={`flex items-center space-x-3 space-x-reverse p-4 rounded-lg border transition-all hover:shadow-md ${
                  task.completed
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                    : 'bg-light-bg-secondary dark:bg-dark-bg border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                {task.completed ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-light-border dark:border-dark-border flex-shrink-0" />
                )}
                <span
                  className={`flex-1 ${
                    task.completed
                      ? 'line-through text-light-text-secondary dark:text-dark-text-secondary'
                      : 'text-light-text dark:text-dark-text font-medium'
                  }`}
                >
                  {task.title}
                </span>
                {task.priority > 2 && !task.completed && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-medium">
                    فوری
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
