import apiClient from './apiClient';

const sectionsApi = {
  // دریافت همه سکشن‌ها
  getAll: async () => {
    const response = await apiClient.get('/api/sections');
    return response.data;
  },

  // دریافت یک سکشن
  getById: async (id) => {
    const response = await apiClient.get(`/api/sections/${id}`);
    return response.data;
  },

  // ایجاد سکشن جدید
  create: async (sectionData) => {
    const response = await apiClient.post('/api/sections', sectionData);
    return response.data;
  },

  // بروزرسانی سکشن
  update: async (id, sectionData) => {
    const response = await apiClient.put(`/api/sections/${id}`, sectionData);
    return response.data;
  },

  // حذف سکشن
  delete: async (id) => {
    const response = await apiClient.delete(`/api/sections/${id}`);
    return response.data;
  },
};

export default sectionsApi;
