import { useState } from 'react';
import {
  SparklesIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import DatePicker from './DatePicker';
import { useGenerateReport } from '../hooks/useAI';
import { useTasks } from '../hooks/useTasks';
import toast from 'react-hot-toast';

const SmartReport = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 روز قبل
  const [endDate, setEndDate] = useState(new Date());
  const [report, setReport] = useState(null);

  const { data: tasks = [] } = useTasks();
  const generateReportMutation = useGenerateReport();

  const handleGenerateReport = async () => {
    // فیلتر وظایف بر اساس تاریخ
    const filteredTasks = tasks.filter((task) => {
      const createdAt = new Date(task.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });

    if (filteredTasks.length === 0) {
      toast.error('در این بازه زمانی هیچ وظیفه‌ای وجود ندارد');
      return;
    }

    // تبدیل به فرمت مورد نیاز
    const taskSummaries = filteredTasks.map((task) => ({
      title: task.title,
      isCompleted: task.isCompleted,
      createdAt: task.createdAt,
      completedAt: task.completedAt || null,
      priority: task.priority,
      timeSpentSeconds: task.timeSpent || 0,
    }));

    try {
      const result = await generateReportMutation.mutateAsync({
        tasks: taskSummaries,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result.success) {
        setReport(result.report);
        toast.success('گزارش با موفقیت تولید شد');
      }
    } catch (error) {
      // خطا در hook handle می‌شود
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <DocumentChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                گزارش هوشمند
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                تحلیل عملکرد با هوش مصنوعی
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-light-text dark:text-dark-text" />
          </button>
        </div>

        {/* انتخاب بازه زمانی */}
        {!report && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  از تاریخ
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  maxDate={endDate}
                  placeholder="انتخاب تاریخ شروع"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  تا تاریخ
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  placeholder="انتخاب تاریخ پایان"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>
                {generateReportMutation.isPending ? 'در حال تولید گزارش...' : 'تولید گزارش هوشمند'}
              </span>
            </button>
          </div>
        )}

        {/* نمایش گزارش */}
        {report && (
          <div className="space-y-6">
            {/* خلاصه */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <DocumentChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-light-text dark:text-dark-text">خلاصه کلی</h3>
              </div>
              <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* آمار */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-light-text dark:text-dark-text">آمار کلی</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {report.statistics.total}
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    کل وظایف
                  </div>
                </div>
                <div className="p-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {report.statistics.completed}
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    تکمیل شده
                  </div>
                </div>
                <div className="p-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {report.statistics.pending}
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    در انتظار
                  </div>
                </div>
                <div className="p-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {report.statistics.averageCompletionTime}
                  </div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    میانگین زمان
                  </div>
                </div>
              </div>
            </div>

            {/* نکات قوت */}
            {report.strengths && report.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-light-text dark:text-dark-text">نکات قوت</h3>
                </div>
                <ul className="space-y-2">
                  {report.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-light-text dark:text-dark-text"
                    >
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* پیشنهادات بهبود */}
            {report.improvements && report.improvements.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LightBulbIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-bold text-light-text dark:text-dark-text">
                    پیشنهادات بهبود
                  </h3>
                </div>
                <ul className="space-y-2">
                  {report.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-light-text dark:text-dark-text"
                    >
                      <span className="text-yellow-500 mt-1">💡</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* الگوهای تکراری */}
            {report.patterns && report.patterns.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ClockIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-bold text-light-text dark:text-dark-text">الگوهای تکراری</h3>
                </div>
                <ul className="space-y-2">
                  {report.patterns.map((pattern, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-light-text dark:text-dark-text"
                    >
                      <span className="text-purple-500 mt-1">🔄</span>
                      <span>{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setReport(null)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-light-text dark:text-dark-text font-bold rounded-xl transition-colors"
              >
                گزارش جدید
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SmartReport;
