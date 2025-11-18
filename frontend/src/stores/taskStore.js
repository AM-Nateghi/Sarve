import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTaskStore = create(
  persist(
    (set, get) => ({
  // لیست وظایف
  tasks: [],

  // لیست سکشن‌ها
  sections: [
    { id: 'default', name: 'عمومی', isDeletable: false, order: 0 }
  ],

  // لیست لیبل‌ها
  labels: [],

  // لیست اهداف
  goals: [],

  // وظیفه در حال ویرایش
  editingTask: null,

  // فیلتر و مرتب‌سازی
  filter: 'all', // all, today, upcoming, completed
  sortBy: 'priority', // priority, deadline, created

  // نمای صفحه وظایف (list یا grid)
  viewMode: 'grid',

  // وضعیت بارگذاری
  isLoading: false,

  // --- وظایف ---

  // افزودن وظیفه
  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: Date.now().toString(), createdAt: new Date() }]
    }));
  },

  // بروزرسانی وظیفه
  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  },

  // حذف وظیفه
  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },

  // تغییر وضعیت تکمیل وظیفه
  toggleTaskComplete: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null }
          : task
      ),
    }));
  },

  // تغییر ترتیب وظایف (برای Drag & Drop)
  reorderTasks: (taskIds) => {
    set((state) => {
      const tasksMap = new Map(state.tasks.map(task => [task.id, task]));
      const reorderedTasks = taskIds.map(id => tasksMap.get(id)).filter(Boolean);
      // اضافه کردن وظایفی که در لیست جدید نیستند (مثلاً فیلتر شده‌ها)
      const remainingTasks = state.tasks.filter(task => !taskIds.includes(task.id));
      return { tasks: [...reorderedTasks, ...remainingTasks] };
    });
  },

  // تنظیم وظیفه در حال ویرایش
  setEditingTask: (task) => {
    set({ editingTask: task });
  },

  // ذخیره زمان برای وظیفه
  saveTimeForTask: (taskId, seconds) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, timeSpent: (task.timeSpent || 0) + seconds }
          : task
      ),
    }));
  },

  // --- سکشن‌ها ---

  // افزودن سکشن
  addSection: (section) => {
    set((state) => ({
      sections: [...state.sections, { ...section, id: Date.now().toString(), isDeletable: true }]
    }));
  },

  // بروزرسانی سکشن
  updateSection: (sectionId, updates) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  },

  // حذف سکشن
  deleteSection: (sectionId) => {
    const section = get().sections.find((s) => s.id === sectionId);
    if (!section || !section.isDeletable) return;

    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
      // انتقال وظایف به سکشن پیش‌فرض
      tasks: state.tasks.map((task) =>
        task.sectionId === sectionId ? { ...task, sectionId: 'default' } : task
      ),
    }));
  },

  // --- لیبل‌ها ---

  // افزودن لیبل
  addLabel: (label) => {
    set((state) => ({
      labels: [...state.labels, { ...label, id: Date.now().toString() }]
    }));
  },

  // بروزرسانی لیبل
  updateLabel: (labelId, updates) => {
    set((state) => ({
      labels: state.labels.map((label) =>
        label.id === labelId ? { ...label, ...updates } : label
      ),
    }));
  },

  // حذف لیبل
  deleteLabel: (labelId) => {
    set((state) => ({
      labels: state.labels.filter((l) => l.id !== labelId),
      // حذف لیبل از وظایف
      tasks: state.tasks.map((task) => ({
        ...task,
        labels: task.labels?.filter((l) => l !== labelId) || [],
      })),
    }));
  },

  // --- اهداف ---

  // افزودن هدف
  addGoal: (goal) => {
    set((state) => ({
      goals: [...state.goals, { ...goal, id: Date.now().toString(), createdAt: new Date() }]
    }));
  },

  // بروزرسانی هدف
  updateGoal: (goalId, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      ),
    }));
  },

  // حذف هدف
  deleteGoal: (goalId) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    }));
  },

  // --- فیلتر و مرتب‌سازی ---

  setFilter: (filter) => {
    set({ filter });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  // --- بارگذاری داده‌ها ---

  setTasks: (tasks) => {
    set({ tasks });
  },

  setSections: (sections) => {
    set({ sections });
  },

  setLabels: (labels) => {
    set({ labels });
  },

  setGoals: (goals) => {
    set({ goals });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // --- دریافت داده‌ها ---

  getTasks: () => get().tasks,
  getSections: () => get().sections,
  getLabels: () => get().labels,
  getGoals: () => get().goals,

  // دریافت وظایف یک سکشن خاص
  getTasksBySection: (sectionId) => {
    return get().tasks.filter((task) => task.sectionId === sectionId);
  },

  // دریافت وظایف امروز
  getTodayTasks: () => {
    const today = new Date().toDateString();
    return get().tasks.filter((task) => {
      const taskDate = task.deadline ? new Date(task.deadline).toDateString() : null;
      return taskDate === today;
    });
  },

  // دریافت وظایف تکمیل شده
  getCompletedTasks: () => {
    return get().tasks.filter((task) => task.completed);
  },
    }),
    {
      name: 'sarve-task-storage', // نام key در localStorage
      partialPersist: true, // فقط state هایی که می‌خواهیم persist شوند
    }
  )
);

export default useTaskStore;
