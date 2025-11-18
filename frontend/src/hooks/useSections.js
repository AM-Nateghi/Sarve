import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sectionsApi from '../services/sectionsApi';
import toast from 'react-hot-toast';

export const useSections = () => {
  return useQuery({
    queryKey: ['sections'],
    queryFn: sectionsApi.getAll,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sectionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('بخش با موفقیت ایجاد شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ایجاد بخش');
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => sectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('بخش با موفقیت بروزرسانی شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در بروزرسانی بخش');
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sectionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('بخش با موفقیت حذف شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در حذف بخش');
    },
  });
};
