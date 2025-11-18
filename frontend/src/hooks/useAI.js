import { useMutation } from '@tanstack/react-query';
import aiApi from '../services/aiApi';
import toast from 'react-hot-toast';

export const useExtractTasks = () => {
  return useMutation({
    mutationFn: aiApi.extractTasks,
    onError: (error) => {
      if (error.response?.status === 429) {
        toast.error('محدودیت تعداد درخواست. لطفاً یک دقیقه صبر کنید.');
      } else {
        toast.error(error.response?.data?.message || 'خطا در استخراج وظایف');
      }
    },
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: ({ tasks, startDate, endDate }) =>
      aiApi.generateReport(tasks, startDate, endDate),
    onError: (error) => {
      if (error.response?.status === 429) {
        toast.error('محدودیت تعداد درخواست. لطفاً یک دقیقه صبر کنید.');
      } else {
        toast.error(error.response?.data?.message || 'خطا در تولید گزارش');
      }
    },
  });
};
