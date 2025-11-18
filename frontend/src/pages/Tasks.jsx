import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import useTaskStore from '../stores/taskStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PRIORITIES = [
  { value: 1, label: 'کم', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  { value: 2, label: 'متوسط', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 3, label: 'زیاد', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 4, label: 'فوری', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
];

const FILTERS = [
  { value: 'all', label: 'همه', icon: FunnelIcon },
  { value: 'active', label: 'فعال', icon: ClockIcon },
  { value: 'completed', label: 'انجام شده', icon: CheckCircleIcon },
];

const Tasks = () => {
  const { getTasks, toggleTaskComplete, addTask, deleteTask, updateTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, priority, title
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 1,
    dueDate: '',
  });

  const allTasks = getTasks();

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterBy === 'all' ? true :
      filterBy === 'active' ? !task.completed :
      filterBy === 'completed' ? task.completed :
      true;

    return matchesSearch && matchesFilter;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority - a.priority;
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title, 'fa');
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Calculate stats
  const stats = {
    total: allTasks.length,
    completed: allTasks.filter(t => t.completed).length,
    active: allTasks.filter(t => !t.completed).length,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('عنوان وظیفه الزامی است');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, formData);
      toast.success('وظیفه به‌روزرسانی شد');
      setEditingTask(null);
    } else {
      addTask({
        ...formData,
        sectionId: 'default',
        labelIds: [],
      });
      toast.success('وظیفه جدید اضافه شد');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 1,
      dueDate: '',
    });
    setIsAddingTask(false);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
    setIsAddingTask(true);
  };

  const handleDelete = (taskId, taskTitle) => {
    if (window.confirm(`آیا از حذف وظیفه "${taskTitle}" اطمینان دارید؟`)) {
      deleteTask(taskId);
      toast.success('وظیفه حذف شد');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
              وظایف من
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              مدیریت و پیگیری وظایف روزانه
            </p>
          </div>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center space-x-2 space-x-reverse bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5" />
            <span>وظیفه جدید</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">کل وظایف</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
              </div>
              <FunnelIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">انجام شده</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.completed}</p>
              </div>
              <CheckCircleSolid className="w-10 h-10 text-green-500 dark:text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">در حال انجام</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.active}</p>
              </div>
              <ClockIcon className="w-10 h-10 text-orange-500 dark:text-orange-400 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-4 mb-6 border border-light-border dark:border-dark-border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در وظایف..."
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setFilterBy(filter.value)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all ${
                    filterBy === filter.value
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="date">تاریخ</option>
            <option value="priority">اولویت</option>
            <option value="title">عنوان</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 mb-6 border-2 border-primary-500 shadow-lg"
          >
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
              {editingTask ? 'ویرایش وظیفه' : 'افزودن وظیفه جدید'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  عنوان *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان وظیفه را وارد کنید..."
                  className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  توضیحات
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیحات اضافی..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    اولویت
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    تاریخ سررسید
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-light-text dark:text-dark-text font-medium transition-colors"
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors"
                >
                  {editingTask ? 'به‌روزرسانی' : 'افزودن'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-bg-secondary rounded-xl border border-light-border dark:border-dark-border">
            <ClockIcon className="w-16 h-16 text-light-text-tertiary dark:text-dark-text-tertiary mx-auto mb-4 opacity-50" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg mb-2">
              {searchQuery || filterBy !== 'all' ? 'وظیفه‌ای یافت نشد' : 'هنوز وظیفه‌ای اضافه نکرده‌اید'}
            </p>
            {!searchQuery && filterBy === 'all' && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="mt-4 text-primary-500 hover:text-primary-600 font-medium hover:underline"
              >
                اولین وظیفه خود را اضافه کنید
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {sortedTasks.map((task) => {
              const priority = PRIORITIES.find(p => p.value === task.priority);
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`group relative bg-white dark:bg-dark-bg-secondary rounded-xl p-5 border transition-all hover:shadow-lg ${
                    task.completed
                      ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                      : isOverdue
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircleSolid className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-light-border dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-colors" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          task.completed
                            ? 'line-through text-light-text-secondary dark:text-dark-text-secondary'
                            : 'text-light-text dark:text-dark-text'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Priority Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                          {priority.label}
                        </span>

                        {/* Due Date */}
                        {task.dueDate && (
                          <span className={`flex items-center space-x-1 space-x-reverse px-3 py-1 rounded-full text-xs font-medium ${
                            isOverdue
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            <CalendarIcon className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString('fa-IR')}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                        title="ویرایش"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id, task.title)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title="حذف"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Tasks;
