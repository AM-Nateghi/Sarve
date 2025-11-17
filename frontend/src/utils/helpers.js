import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// تنظیمات dayjs
dayjs.locale('fa');
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// فرمت کردن تاریخ به شمسی
export const formatDate = (date, format = 'YYYY/MM/DD') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

// تبدیل تاریخ به نسبی (مثل "2 ساعت پیش")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

// فرمت کردن زمان (ثانیه به HH:MM:SS)
export const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map(val => val.toString().padStart(2, '0'))
    .join(':');
};

// تبدیل ثانیه به فرمت خوانا (مثل "2 ساعت و 30 دقیقه")
export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || seconds === 0) return 'بدون زمان';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = '';
  if (hours > 0) result += `${hours} ساعت`;
  if (minutes > 0) {
    if (result) result += ' و ';
    result += `${minutes} دقیقه`;
  }

  return result || 'کمتر از یک دقیقه';
};

// تبدیل بایت به واحد خوانا (KB, MB)
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ایجاد ID یکتا
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// تأخیر (برای استفاده در async/await)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// دریافت پیام تصادفی از آرایه
export const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

// گروه‌بندی آرایه بر اساس یک کلید
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// مرتب‌سازی وظایف بر اساس اولویت و تاریخ
export const sortTasks = (tasks, sortBy = 'priority') => {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return (b.priority || 0) - (a.priority || 0);
    } else if (sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
};

// بررسی اینکه آیا وظیفه امروز است
export const isToday = (date) => {
  if (!date) return false;
  const today = dayjs();
  const taskDate = dayjs(date);
  return taskDate.isSame(today, 'day');
};

// بررسی اینکه آیا سررسید گذشته است
export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return dayjs(deadline).isBefore(dayjs(), 'day');
};

// کپی متن به کلیپبورد
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
