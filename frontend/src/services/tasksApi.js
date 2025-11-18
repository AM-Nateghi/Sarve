import apiClient from './apiClient';

const tasksApi = {
  // دریافت همه وظایف
  getAll: async () => {
    const response = await apiClient.get('/api/tasks');
    return response.data;
  },

  // دریافت یک وظیفه
  getById: async (id) => {
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data;
  },

  // دریافت وظایف یک سکشن
  getBySection: async (sectionId) => {
    const response = await apiClient.get(`/api/tasks/section/${sectionId}`);
    return response.data;
  },

  // دریافت وظایف امروز
  getToday: async () => {
    const response = await apiClient.get('/api/tasks/today');
    return response.data;
  },

  // دریافت وظایف در حال انجام
  getPending: async () => {
    const response = await apiClient.get('/api/tasks/pending');
    return response.data;
  },

  // دریافت وظایف تکمیل شده
  getCompleted: async () => {
    const response = await apiClient.get('/api/tasks/completed');
    return response.data;
  },

  // ایجاد وظیفه جدید
  create: async (taskData) => {
    const response = await apiClient.post('/api/tasks', taskData);
    return response.data;
  },

  // بروزرسانی وظیفه
  update: async (id, taskData) => {
    const response = await apiClient.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  // حذف وظیفه
  delete: async (id) => {
    const response = await apiClient.delete(`/api/tasks/${id}`);
    return response.data;
  },

  // تغییر وضعیت تکمیل
  toggleComplete: async (id) => {
    const response = await apiClient.patch(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  // ذخیره زمان
  saveTime: async (id, seconds) => {
    const response = await apiClient.post(`/api/tasks/${id}/time`, { seconds });
    return response.data;
  },
};

export default tasksApi;
