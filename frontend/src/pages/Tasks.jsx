import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useTaskStore from '../stores/taskStore';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import DatePicker from '../components/DatePicker';
import CustomDropdown from '../components/CustomDropdown';
import SortableTaskItem from '../components/SortableTaskItem';
import LabelPicker from '../components/LabelPicker';
import TaskSkeleton from '../components/TaskSkeleton';

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

const SORT_OPTIONS = [
  { value: 'date', label: 'تاریخ' },
  { value: 'priority', label: 'اولویت' },
  { value: 'title', label: 'عنوان' },
];

const Tasks = () => {
  const { getTasks, toggleTaskComplete, addTask, deleteTask, updateTask, reorderTasks, isLoading } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // تنظیمات Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // حداقل فاصله برای شروع drag (جلوگیری از drag تصادفی)
      },
    })
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 1,
    dueDate: null,
    labelIds: [],
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
      updateTask(editingTask.id, {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
      });
      toast.success('وظیفه به‌روزرسانی شد');
      setEditingTask(null);
    } else {
      addTask({
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        sectionId: 'default',
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
      dueDate: null,
      labelIds: [],
    });
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      labelIds: task.labelIds || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (taskId, taskTitle) => {
    if (window.confirm(`آیا از حذف وظیفه "${taskTitle}" اطمینان دارید؟`)) {
      deleteTask(taskId);
      toast.success('وظیفه حذف شد');
    }
  };

  // مدیریت Drag & Drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTasks.findIndex((task) => task.id === active.id);
      const newIndex = sortedTasks.findIndex((task) => task.id === over.id);

      const newOrder = arrayMove(sortedTasks, oldIndex, newIndex);
      reorderTasks(newOrder.map(task => task.id));

      toast.success('ترتیب وظایف تغییر کرد');
    }
  };

  // Task Form Component
  const TaskForm = () => (
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

      {/* Labels */}
      <LabelPicker
        selectedLabels={formData.labelIds}
        onChange={(labelIds) => setFormData({ ...formData, labelIds })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Priority */}
        <CustomDropdown
          label="اولویت"
          value={formData.priority}
          onChange={(value) => setFormData({ ...formData, priority: value })}
          options={PRIORITIES}
          placeholder="انتخاب اولویت"
        />

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
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

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4">
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
  );

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
            onClick={() => setIsModalOpen(true)}
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
          <div className="sm:w-40">
            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              placeholder="مرتب‌سازی"
            />
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Task (Desktop) */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingTask ? 'ویرایش وظیفه' : 'افزودن وظیفه جدید'}
        size="lg"
      >
        <TaskForm />
      </Modal>

      {/* Tasks List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          {isLoading ? (
            <TaskSkeleton count={5} />
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-dark-bg-secondary rounded-xl border border-light-border dark:border-dark-border">
              <ClockIcon className="w-16 h-16 text-light-text-tertiary dark:text-dark-text-tertiary mx-auto mb-4 opacity-50" />
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg mb-2">
                {searchQuery || filterBy !== 'all' ? 'وظیفه‌ای یافت نشد' : 'هنوز وظیفه‌ای اضافه نکرده‌اید'}
              </p>
              {!searchQuery && filterBy === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-primary-500 hover:text-primary-600 font-medium hover:underline"
                >
                  اولین وظیفه خود را اضافه کنید
                </button>
              )}
            </div>
          ) : (
            <SortableContext
              items={sortedTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {sortedTasks.map((task) => {
                  const priority = PRIORITIES.find(p => p.value === task.priority);
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

                  return (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      priority={priority}
                      isOverdue={isOverdue}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </AnimatePresence>
            </SortableContext>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default Tasks;
