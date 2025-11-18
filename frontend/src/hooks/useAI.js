import { useMutation } from '@tanstack/react-query';
import aiApi from '../services/aiApi';
import toast from 'react-hot-toast';

export const useExtractTasks = () => {
  return useMutation({
    mutationFn: aiApi.extractTasks,
    onError: (error) => {
      const errorMessage = error.message || 'خطا در استخراج وظایف';
      toast.error(errorMessage);
    },
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: ({ tasks, startDate, endDate }) =>
      aiApi.generateReport(tasks, startDate, endDate),
    onError: (error) => {
      const errorMessage = error.message || 'خطا در تولید گزارش';
      toast.error(errorMessage);
    },
  });
};
