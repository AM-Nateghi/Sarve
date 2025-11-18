import { useState } from 'react';
import { SparklesIcon, MicrophoneIcon, PlusIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceRecorder from './VoiceRecorder';
import { useExtractTasks } from '../hooks/useAI';
import { useCreateTask } from '../hooks/useTasks';
import toast from 'react-hot-toast';

const AITaskExtractor = ({ isOpen, onClose }) => {
  const [textInput, setTextInput] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState([]);

  const extractTasksMutation = useExtractTasks();
  const createTaskMutation = useCreateTask();

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      toast.error('لطفاً متنی وارد کنید');
      return;
    }

    try {
      const result = await extractTasksMutation.mutateAsync(textInput);
      if (result.success && result.tasks.length > 0) {
        setExtractedTasks(result.tasks);
        toast.success(`${result.tasks.length} وظیفه استخراج شد`);
        setTextInput('');
      } else {
        toast.error('هیچ وظیفه‌ای یافت نشد');
      }
    } catch (error) {
      // خطا در hook handle می‌شود
    }
  };

  const handleVoiceTasksExtracted = (tasks) => {
    setShowVoiceRecorder(false);
    if (tasks && tasks.length > 0) {
      setExtractedTasks(tasks);
      toast.success(`${tasks.length} وظیفه از صوت استخراج شد`);
    } else {
      toast.error('هیچ وظیفه‌ای از صوت استخراج نشد');
    }
  };

  const handleAddTask = async (task) => {
    try {
      await createTaskMutation.mutateAsync({
        title: task.title,
        description: task.description || null,
        priority: task.priority,
        deadline: task.deadline,
        sectionId: 'default',
        labelIds: [],
      });

      // حذف وظیفه از لیست استخراج شده
      setExtractedTasks((prev) => prev.filter((t) => t !== task));
    } catch (error) {
      // خطا در hook handle می‌شود
    }
  };

  const handleAddAllTasks = async () => {
    try {
      for (const task of extractedTasks) {
        await createTaskMutation.mutateAsync({
          title: task.title,
          description: task.description || null,
          priority: task.priority,
          deadline: task.deadline,
          sectionId: 'default',
          labelIds: [],
        });
      }

      toast.success('تمام وظایف اضافه شدند');
      setExtractedTasks([]);
      onClose();
    } catch (error) {
      // خطا در hook handle می‌شود
    }
  };

  const getPriorityLabel = (priority) => {
    const labels = { 1: 'کم', 2: 'متوسط', 3: 'زیاد', 4: 'فوری' };
    return labels[priority] || 'متوسط';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      3: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      4: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[priority] || colors[2];
  };

  if (!isOpen) return null;

  return (
    <>
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
          className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* هدر */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                استخراج هوشمند وظایف
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                با قدرت Gemini 2.0 Flash
              </p>
            </div>
          </div>

          {/* ورودی متن */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              وظایف خود را بنویسید یا بگویید
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="مثلاً: فردا باید گزارش رو بدم، بعد از ظهر جلسه دارم، برای پروژه کد بنویسم..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* دکمه‌های اکشن */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleTextSubmit}
              disabled={extractTasksMutation.isPending || !textInput.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>
                {extractTasksMutation.isPending ? 'در حال استخراج...' : 'استخراج وظایف'}
              </span>
            </button>
            <button
              onClick={() => setShowVoiceRecorder(true)}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              <MicrophoneIcon className="w-5 h-5" />
              <span className="hidden sm:inline">ضبط صوتی</span>
            </button>
          </div>

          {/* لیست وظایف استخراج شده */}
          {extractedTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                  وظایف استخراج شده ({extractedTasks.length})
                </h3>
                <button
                  onClick={handleAddAllTasks}
                  disabled={createTaskMutation.isPending}
                  className="text-sm bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  افزودن همه
                </button>
              </div>

              {extractedTasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-light-text dark:text-dark-text mb-1">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                        {task.deadline && (
                          <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            {new Date(task.deadline).toLocaleDateString('fa-IR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddTask(task)}
                      disabled={createTaskMutation.isPending}
                      className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      title="افزودن وظیفه"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* راهنما */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>نکته:</strong> می‌توانید چند وظیفه را با هم بنویسید. هوش مصنوعی
              آن‌ها را شناسایی و جدا می‌کند.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Voice Recorder Modal */}
      <AnimatePresence>
        {showVoiceRecorder && (
          <VoiceRecorder
            onTasksExtracted={handleVoiceTasksExtracted}
            onClose={() => setShowVoiceRecorder(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AITaskExtractor;
