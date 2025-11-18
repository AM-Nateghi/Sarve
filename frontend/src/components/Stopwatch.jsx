import { useState, useEffect, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import useTimerStore from '../stores/timerStore';
import { useTasks, useSaveTime } from '../hooks/useTasks';
import toast from 'react-hot-toast';

const Stopwatch = ({ onClose }) => {
  const {
    elapsedTime,
    status,
    activeTask,
    displayMode,
    start,
    pause,
    resume,
    stop,
    minimize,
    expand,
    setActiveTask,
  } = useTimerStore();

  const { data: tasks = [] } = useTasks();
  const saveTimeMutation = useSaveTime();
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const inactivityTimerRef = useRef(null);

  // فرمت کردن زمان به HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ریست تایمر عدم فعالیت
  const resetInactivityTimer = () => {
    setLastInteraction(Date.now());
    if (displayMode === 'minimized') {
      expand();
    }

    // پاک کردن تایمر قبلی
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // تنظیم تایمر جدید (1 دقیقه)
    if (status === 'running') {
      inactivityTimerRef.current = setTimeout(() => {
        minimize();
      }, 60000); // 60 seconds
    }
  };

  // مدیریت دکمه‌های کنترل
  const handleStart = () => {
    start(activeTask);
    resetInactivityTimer();
  };

  const handlePause = () => {
    pause();
    resetInactivityTimer();
  };

  const handleResume = () => {
    resume();
    resetInactivityTimer();
  };

  const handleStop = async () => {
    // ذخیره زمان در بک‌اند اگر وظیفه انتخاب شده باشد
    if (activeTask && elapsedTime > 0) {
      try {
        await saveTimeMutation.mutateAsync({
          id: activeTask,
          seconds: elapsedTime,
        });
        toast.success(`${formatTime(elapsedTime)} ثبت شد`);
      } catch (error) {
        toast.error('خطا در ذخیره زمان');
      }
    }

    stop();
    resetInactivityTimer();
  };

  const handleToggleMinimize = () => {
    if (displayMode === 'minimized') {
      expand();
    } else {
      minimize();
    }
    resetInactivityTimer();
  };

  // انتخاب وظیفه
  const handleSelectTask = (taskId) => {
    setActiveTask(taskId);
    setShowTaskSelector(false);
    resetInactivityTimer();
  };

  // پاک کردن تایمر هنگام unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // شروع تایمر عدم فعالیت وقتی کرونومتر در حال اجراست
  useEffect(() => {
    if (status === 'running') {
      resetInactivityTimer();
    }
  }, [status]);

  // فیلتر کردن وظایف فعال (غیر تکمیل شده)
  const activeTasks = tasks.filter((task) => !task.isCompleted);
  const selectedTask = tasks.find((task) => task.id === activeTask);

  // رنگ‌های مختلف برای وضعیت‌های مختلف
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'paused':
        return 'bg-yellow-500 dark:bg-yellow-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  // نمایش فرم کوچک (Minimized)
  if (displayMode === 'minimized') {
    return (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 z-50"
        onClick={handleToggleMinimize}
      >
        <div
          className={`${getStatusColor()} text-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center gap-2`}
        >
          <span className="font-mono text-sm font-bold">{formatTime(elapsedTime)}</span>
          <ChevronUpIcon className="w-4 h-4" />
        </div>
      </motion.div>
    );
  }

  // نمایش فرم کامل (Expanded)
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 z-50"
      onMouseEnter={resetInactivityTimer}
      onClick={resetInactivityTimer}
    >
      <div className="bg-white dark:bg-dark-bg-secondary border-2 border-blue-500 dark:border-blue-600 rounded-2xl shadow-2xl w-80 overflow-hidden">
        {/* هدر */}
        <div className={`${getStatusColor()} text-white px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-bold text-sm">کرونومتر</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleMinimize}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
            {status === 'stopped' && (
              <button
                onClick={onClose}
                className="hover:bg-white/20 rounded p-1 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* محتوا */}
        <div className="p-4">
          {/* نمایش زمان */}
          <div className="text-center mb-4">
            <div className="font-mono text-5xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
              {status === 'running' ? 'در حال اجرا' : status === 'paused' ? 'متوقف شده' : 'آماده'}
            </div>
          </div>

          {/* انتخاب وظیفه */}
          {status === 'stopped' && (
            <div className="mb-4">
              <button
                onClick={() => setShowTaskSelector(!showTaskSelector)}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text text-sm hover:border-blue-500 transition-colors text-right"
              >
                {selectedTask ? selectedTask.title : 'انتخاب وظیفه (اختیاری)'}
              </button>

              <AnimatePresence>
                {showTaskSelector && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 max-h-40 overflow-y-auto border border-light-border dark:border-dark-border rounded-lg"
                  >
                    <div
                      onClick={() => handleSelectTask(null)}
                      className="px-3 py-2 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary cursor-pointer text-sm text-light-text dark:text-dark-text"
                    >
                      بدون وظیفه
                    </div>
                    {activeTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleSelectTask(task.id)}
                        className="px-3 py-2 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary cursor-pointer text-sm text-light-text dark:text-dark-text border-t border-light-border dark:border-dark-border"
                      >
                        {task.title}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* دکمه‌های کنترل */}
          <div className="flex gap-2 justify-center">
            {status === 'stopped' && (
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold transition-colors"
              >
                <PlayIcon className="w-5 h-5" />
                <span>شروع</span>
              </button>
            )}

            {status === 'running' && (
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-bold transition-colors"
              >
                <PauseIcon className="w-5 h-5" />
                <span>توقف</span>
              </button>
            )}

            {status === 'paused' && (
              <button
                onClick={handleResume}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold transition-colors"
              >
                <PlayIcon className="w-5 h-5" />
                <span>ادامه</span>
              </button>
            )}

            {(status === 'running' || status === 'paused') && (
              <button
                onClick={handleStop}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold transition-colors"
              >
                <StopIcon className="w-5 h-5" />
                <span>پایان</span>
              </button>
            )}
          </div>

          {/* نمایش وظیفه فعال */}
          {status !== 'stopped' && selectedTask && (
            <div className="mt-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                وظیفه فعال:
              </div>
              <div className="text-sm text-light-text dark:text-dark-text mt-1">
                {selectedTask.title}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Stopwatch;
