import { create } from 'zustand';

// این store فقط برای مدیریت UI state استفاده می‌شود
// داده‌های اصلی (tasks, sections, labels) توسط React Query مدیریت می‌شوند
const useTaskStore = create((set) => ({
  // وظیفه در حال ویرایش
  editingTask: null,

  // فیلتر و مرتب‌سازی
  filter: 'all', // all, today, upcoming, completed
  sortBy: 'priority', // priority, deadline, created

  // نمای صفحه وظایف (list یا grid)
  viewMode: 'grid',

  // تنظیم وظیفه در حال ویرایش
  setEditingTask: (task) => {
    set({ editingTask: task });
  },

  // فیلتر و مرتب‌سازی
  setFilter: (filter) => {
    set({ filter });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },
}));

export default useTaskStore;
