import apiClient from './apiClient';

const labelsApi = {
  // دریافت همه لیبل‌ها
  getAll: async () => {
    const response = await apiClient.get('/api/labels');
    return response.data;
  },

  // دریافت یک لیبل
  getById: async (id) => {
    const response = await apiClient.get(`/api/labels/${id}`);
    return response.data;
  },

  // ایجاد لیبل جدید
  create: async (labelData) => {
    const response = await apiClient.post('/api/labels', labelData);
    return response.data;
  },

  // بروزرسانی لیبل
  update: async (id, labelData) => {
    const response = await apiClient.put(`/api/labels/${id}`, labelData);
    return response.data;
  },

  // حذف لیبل
  delete: async (id) => {
    const response = await apiClient.delete(`/api/labels/${id}`);
    return response.data;
  },
};

export default labelsApi;
