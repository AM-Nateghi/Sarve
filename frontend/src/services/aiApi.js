import apiClient from './apiClient';

const aiApi = {
  // استخراج وظایف از متن
  extractTasks: async (input) => {
    const response = await apiClient.post('/api/ai/extract-tasks', { input });
    return response.data;
  },

  // تولید گزارش هوشمند
  generateReport: async (tasks, startDate, endDate) => {
    const response = await apiClient.post('/api/ai/generate-report', {
      tasks,
      startDate,
      endDate,
    });
    return response.data;
  },

  // بررسی سلامت سرویس AI
  health: async () => {
    const response = await apiClient.get('/api/ai/health');
    return response.data;
  },
};

export default aiApi;
