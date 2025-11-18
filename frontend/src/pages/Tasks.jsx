import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
  PlusIcon,
  FolderPlusIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import SectionHeader from '../components/SectionHeader';
import FloatingActionButton from '../components/FloatingActionButton';
import Modal from '../components/Modal';
import DatePicker from '../components/DatePicker';
import CustomDropdown from '../components/CustomDropdown';
import LabelPicker from '../components/LabelPicker';
import AITaskExtractor from '../components/AITaskExtractor';
import TaskSkeleton from '../components/TaskSkeleton';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTask,
} from '../hooks/useTasks';
import { useLabels } from '../hooks/useLabels';
import { useSections, useCreateSection } from '../hooks/useSections';

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
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: sections = [], isLoading: sectionsLoading } = useSections();
  const { data: labels = [] } = useLabels();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTask();
  const createSectionMutation = useCreateSection();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [showAIExtractor, setShowAIExtractor] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [newSectionName, setNewSectionName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    dueDate: null,
    labelIds: [],
    sectionId: 'default',
  });

  // Group tasks by section
  const groupedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
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

    // Group by section
    const groups = {};
    sections.forEach((section) => {
      groups[section.id] = [];
    });

    filtered.forEach((task) => {
      const sectionId = task.sectionId || 'default';
      if (groups[sectionId]) {
        groups[sectionId].push(task);
      }
    });

    // Sort tasks by order within each section
    Object.keys(groups).forEach((sectionId) => {
      groups[sectionId].sort((a, b) => a.order - b.order);
    });

    return groups;
  }, [tasks, sections, searchQuery, filterBy]);

  // Stats
  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.isCompleted).length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  const isLoading = tasksLoading || sectionsLoading;

  // Section handlers
  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCreateSection = async () => {
    if (newSectionName.trim()) {
      await createSectionMutation.mutateAsync({
        name: newSectionName.trim(),
        order: sections.length,
      });
      setNewSectionName('');
      setIsSectionModalOpen(false);
    }
  };

  // Open modal for new task
  const openNewTaskModal = (sectionId = 'default') => {
    setEditingTask(null);
    setSelectedSectionId(sectionId);
    setFormData({
      title: '',
      description: '',
      priority: 2,
      dueDate: null,
      labelIds: [],
      sectionId,
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
      sectionId: task.sectionId || 'default',
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedSectionId(null);
    setFormData({
      title: '',
      description: '',
      priority: 2,
      dueDate: null,
      labelIds: [],
      sectionId: 'default',
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
      sectionId: formData.sectionId,
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

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsSectionModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                title="بخش جدید"
              >
                <FolderPlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">بخش جدید</span>
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

      {/* Tasks List - Grouped by Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              هنوز وظیفه‌ای ندارید
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              برای شروع، یک وظیفه جدید اضافه کنید
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => {
              const sectionTasks = groupedTasks[section.id] || [];
              const isCollapsed = collapsedSections[section.id];

              // Don't show section if search/filter results in no tasks
              if (searchQuery || filterBy !== 'all') {
                if (sectionTasks.length === 0) return null;
              }

              return (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <SectionHeader
                    section={section}
                    taskCount={sectionTasks.length}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => toggleSectionCollapse(section.id)}
                    onAddTask={() => openNewTaskModal(section.id)}
                  />

                  {!isCollapsed && (
                    <div className="p-3 space-y-2">
                      {sectionTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                          این بخش خالی است
                        </div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {sectionTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              labels={labels}
                              onClick={() => openEditModal(task)}
                              onToggle={() => handleToggle(task.id)}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Show message if search/filter returns no results */}
            {(searchQuery || filterBy !== 'all') &&
             sections.every((s) => (groupedTasks[s.id] || []).length === 0) && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  نتیجه‌ای یافت نشد
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  جستجوی دیگری امتحان کنید
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB - Add Task */}
      <FloatingActionButton onClick={openNewTaskModal} label="وظیفه جدید" />

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
      <AITaskExtractor
        isOpen={showAIExtractor}
        onClose={() => setShowAIExtractor(false)}
      />

      {/* Section Creation Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false);
          setNewSectionName('');
        }}
        title="بخش جدید"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              نام بخش *
            </label>
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newSectionName.trim()) {
                  handleCreateSection();
                }
              }}
              placeholder="مثلاً: کار، شخصی، مطالعه..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSectionModalOpen(false);
                setNewSectionName('');
              }}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              لغو
            </button>
            <button
              onClick={handleCreateSection}
              disabled={!newSectionName.trim() || createSectionMutation.isPending}
              className="flex-1 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSectionMutation.isPending ? 'در حال ایجاد...' : 'ایجاد'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
