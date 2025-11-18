import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import labelsApi from '../services/labelsApi';
import toast from 'react-hot-toast';

export const useLabels = () => {
  return useQuery({
    queryKey: ['labels'],
    queryFn: labelsApi.getAll,
  });
};

export const useCreateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: labelsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('برچسب با موفقیت ایجاد شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ایجاد برچسب');
    },
  });
};

export const useUpdateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => labelsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('برچسب با موفقیت بروزرسانی شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در بروزرسانی برچسب');
    },
  });
};

export const useDeleteLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: labelsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('برچسب با موفقیت حذف شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در حذف برچسب');
    },
  });
};
