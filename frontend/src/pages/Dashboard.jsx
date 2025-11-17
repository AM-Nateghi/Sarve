import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { getRandomMessage } from '../utils/helpers';
import { MOTIVATIONAL_MESSAGES } from '../utils/constants';
import useAuthStore from '../stores/authStore';
import useTaskStore from '../stores/taskStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getTodayTasks } = useTaskStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const motivationalMessage = useState(() => getRandomMessage(MOTIVATIONAL_MESSAGES))[0];

  const todayTasks = getTodayTasks();
  const completedToday = todayTasks.filter(t => t.completed).length;

  // Typewriter Effect
  useEffect(() => {
    if (displayedText.length < motivationalMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(motivationalMessage.slice(0, displayedText.length + 1));
      }, 50); // سرعت تایپ

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              وظایف امروز
            </h3>
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-3xl font-bold text-light-text dark:text-dark-text">
            {todayTasks.length}
          </p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
            {completedToday} مورد انجام شده
          </p>
        </div>

        {/* Time Spent Today */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              زمان امروز
            </h3>
            <ClockIcon className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-light-text dark:text-dark-text">
            0 ساعت
          </p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
            صرف شده برای کارها
          </p>
        </div>

        {/* Productivity */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
              بهره‌وری
            </h3>
            <ChartBarIcon className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-light-text dark:text-dark-text">
            {todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0}%
          </p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
            نرخ تکمیل امروز
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
          دسترسی سریع
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/tasks"
            className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
          >
            مشاهده وظایف
          </Link>
          <button
            className="flex items-center justify-center bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-light-border dark:hover:bg-dark-border text-light-text dark:text-dark-text font-medium py-4 px-6 rounded-lg transition-colors"
          >
            افزودن وظیفه جدید
          </button>
        </div>
      </div>

      {/* Today's Tasks Preview */}
      {todayTasks.length > 0 && (
        <div className="mt-8 bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
            کارهای امروز
          </h2>
          <div className="space-y-3">
            {todayTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg border ${
                  task.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span
                  className={`flex-1 ${
                    task.completed
                      ? 'line-through text-light-text-secondary dark:text-dark-text-secondary'
                      : 'text-light-text dark:text-dark-text'
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
          {todayTasks.length > 5 && (
            <Link
              to="/tasks"
              className="block mt-4 text-center text-primary-600 dark:text-primary-500 hover:underline"
            >
              مشاهده همه ({todayTasks.length} وظیفه)
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
