import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tasksApi from '../services/tasksApi';
import toast from 'react-hot-toast';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('وظیفه با موفقیت ایجاد شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ایجاد وظیفه');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('وظیفه با موفقیت بروزرسانی شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در بروزرسانی وظیفه');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('وظیفه با موفقیت حذف شد');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در حذف وظیفه');
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.toggleComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در تغییر وضعیت وظیفه');
    },
  });
};

export const useSaveTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, seconds }) => tasksApi.saveTime(id, seconds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'خطا در ذخیره زمان');
    },
  });
};
