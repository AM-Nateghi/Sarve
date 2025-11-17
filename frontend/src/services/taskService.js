import api from './api';

const taskService = {
  // --- وظایف ---

  // دریافت همه وظایف
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // دریافت یک وظیفه
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // ایجاد وظیفه
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // بروزرسانی وظیفه
  updateTask: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // حذف وظیفه
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // تغییر وضعیت تکمیل
  toggleComplete: async (taskId) => {
    const response = await api.patch(`/tasks/${taskId}/toggle`);
    return response.data;
  },

  // ذخیره زمان برای وظیفه
  saveTime: async (taskId, seconds) => {
    const response = await api.post(`/tasks/${taskId}/time`, { seconds });
    return response.data;
  },

  // --- سکشن‌ها ---

  getSections: async () => {
    const response = await api.get('/sections');
    return response.data;
  },

  createSection: async (sectionData) => {
    const response = await api.post('/sections', sectionData);
    return response.data;
  },

  updateSection: async (sectionId, updates) => {
    const response = await api.put(`/sections/${sectionId}`, updates);
    return response.data;
  },

  deleteSection: async (sectionId) => {
    const response = await api.delete(`/sections/${sectionId}`);
    return response.data;
  },

  // --- لیبل‌ها ---

  getLabels: async () => {
    const response = await api.get('/labels');
    return response.data;
  },

  createLabel: async (labelData) => {
    const response = await api.post('/labels', labelData);
    return response.data;
  },

  updateLabel: async (labelId, updates) => {
    const response = await api.put(`/labels/${labelId}`, updates);
    return response.data;
  },

  deleteLabel: async (labelId) => {
    const response = await api.delete(`/labels/${labelId}`);
    return response.data;
  },

  // --- اهداف ---

  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  updateGoal: async (goalId, updates) => {
    const response = await api.put(`/goals/${goalId}`, updates);
    return response.data;
  },

  deleteGoal: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  },

  // --- گزارش‌دهی ---

  // گزارش روزانه (سیستمی)
  getDailyReport: async (date) => {
    const response = await api.get('/reports/daily', {
      params: { date },
    });
    return response.data;
  },

  // گزارش هوشمند (با AI)
  getAIReport: async (date) => {
    const response = await api.post('/reports/ai', { date });
    return response.data;
  },
};

export default taskService;
