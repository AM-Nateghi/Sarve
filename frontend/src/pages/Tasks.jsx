import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import FloatingActionButton from '../components/FloatingActionButton';
import Modal from '../components/Modal';
import DatePicker from '../components/DatePicker';
import CustomDropdown from '../components/CustomDropdown';
import LabelPicker from '../components/LabelPicker';
import AITaskExtractor from '../components/AITaskExtractor';
import SmartReport from '../components/SmartReport';
import TaskSkeleton from '../components/TaskSkeleton';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTask,
} from '../hooks/useTasks';
import { useLabels } from '../hooks/useLabels';

const PRIORITIES = [
  { value: 1, label: 'کم' },
  { value: 2, label: 'متوسط' },
  { value: 3, label: 'زیاد' },
  { value: 4, label: 'فوری' },
];

const FILTERS = [
  { value: 'all', label: 'همه', icon: FunnelIcon },
  { value: 'active', label: 'فعال', icon: ClockIcon },
  { value: 'completed', label: 'تکمیل شده', icon: CheckCircleIcon },
];

const Tasks = () => {
  // React Query hooks
  const { data: tasks = [], isLoading } = useTasks();
  const { data: labels = [] } = useLabels();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTask();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAIExtractor, setShowAIExtractor] = useState(false);
  const [showSmartReport, setShowSmartReport] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    dueDate: null,
    labelIds: [],
  });

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterBy === 'all'
        ? true
        : filterBy === 'active'
        ? !task.isCompleted
        : task.isCompleted;

    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.isCompleted).length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  // Open modal for new task
  const openNewTaskModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 2,
      dueDate: null,
      labelIds: [],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.deadline ? new Date(task.deadline) : null,
      labelIds: task.labelIds || [],
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 2,
      dueDate: null,
      labelIds: [],
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('عنوان وظیفه الزامی است');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      deadline: formData.dueDate ? formData.dueDate.toISOString() : null,
      labelIds: formData.labelIds,
    };

    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({ id: editingTask.id, ...taskData });
      } else {
        await createTaskMutation.mutateAsync(taskData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Toggle task completion
  const handleToggle = async (taskId) => {
    try {
      await toggleTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (window.confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Handle AI extracted tasks
  const handleTasksExtracted = async (extractedTasks) => {
    for (const task of extractedTasks) {
      try {
        await createTaskMutation.mutateAsync(task);
      } catch (error) {
        console.error('Error creating extracted task:', error);
      }
    }
    setShowAIExtractor(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                وظایف من
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                مدیریت و پیگیری وظایف
              </p>
            </div>

            {/* Desktop AI Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setShowSmartReport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span className="hidden md:inline">گزارش</span>
              </button>
              <button
                onClick={() => setShowAIExtractor(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="hidden md:inline">AI</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                کل
              </div>
              <div className="text-xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300">
                {stats.total}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">
                فعال
              </div>
              <div className="text-xl sm:text-3xl font-bold text-orange-700 dark:text-orange-300">
                {stats.active}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                تکمیل
              </div>
              <div className="text-xl sm:text-3xl font-bold text-green-700 dark:text-green-300">
                {stats.completed}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در وظایف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {FILTERS.map((filter) => {
                const Icon = filter.icon;
                const isActive = filterBy === filter.value;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setFilterBy(filter.value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
                      ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز وظیفه‌ای ندارید'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'جستجوی دیگری امتحان کنید'
                : 'برای شروع، یک وظیفه جدید اضافه کنید'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  labels={labels}
                  onClick={() => openEditModal(task)}
                  onToggle={() => handleToggle(task.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB - Add Task */}
      <FloatingActionButton onClick={openNewTaskModal} label="وظیفه جدید" />

      {/* Mobile AI Buttons */}
      <div className="sm:hidden fixed bottom-20 right-6 flex flex-col gap-3 z-40">
        <motion.button
          onClick={() => setShowSmartReport(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center"
        >
          <ChartBarIcon className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button
          onClick={() => setShowAIExtractor(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center"
        >
          <SparklesIcon className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'ویرایش وظیفه' : 'وظیفه جدید'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              عنوان *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="عنوان وظیفه..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="توضیحات اضافی..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoComplete="off"
            />
          </div>

          {/* Labels */}
          <LabelPicker
            selectedLabels={formData.labelIds}
            onChange={(labelIds) => setFormData({ ...formData, labelIds })}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <CustomDropdown
              label="اولویت"
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
              options={PRIORITIES}
              placeholder="اولویت"
            />

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                تاریخ سررسید
              </label>
              <DatePicker
                selected={formData.dueDate}
                onChange={(date) => setFormData({ ...formData, dueDate: date })}
                placeholder="انتخاب تاریخ"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {editingTask && (
              <button
                type="button"
                onClick={() => {
                  handleDelete(editingTask.id);
                  closeModal();
                }}
                className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                حذف
              </button>
            )}
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingTask ? 'به‌روزرسانی' : 'افزودن'}
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Task Extractor */}
      <AnimatePresence>
        {showAIExtractor && (
          <AITaskExtractor
            onClose={() => setShowAIExtractor(false)}
            onTasksExtracted={handleTasksExtracted}
          />
        )}
      </AnimatePresence>

      {/* Smart Report */}
      <AnimatePresence>
        {showSmartReport && (
          <SmartReport
            tasks={tasks}
            onClose={() => setShowSmartReport(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
