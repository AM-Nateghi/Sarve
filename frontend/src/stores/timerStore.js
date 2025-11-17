import { create } from 'zustand';

const useTimerStore = create((set, get) => ({
  // زمان سپری شده (به ثانیه)
  elapsedTime: 0,

  // وضعیت کرونومتر (running, paused, stopped)
  status: 'stopped',

  // وظیفه فعال که زمان برای آن ثبت می‌شود
  activeTask: null,

  // تایمر interval
  intervalId: null,

  // وضعیت نمایش کرونومتر (expanded یا minimized)
  displayMode: 'expanded',

  // شروع کرونومتر
  start: (taskId = null) => {
    const { status, intervalId } = get();

    // اگر قبلاً در حال اجرا است، چیزی نکن
    if (status === 'running') return;

    // پاک کردن interval قبلی (اگر وجود دارد)
    if (intervalId) {
      clearInterval(intervalId);
    }

    // شروع شمارش
    const id = setInterval(() => {
      set((state) => ({ elapsedTime: state.elapsedTime + 1 }));
    }, 1000);

    set({ status: 'running', intervalId: id, activeTask: taskId });
  },

  // توقف موقت کرونومتر
  pause: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ status: 'paused', intervalId: null });
  },

  // ادامه کرونومتر
  resume: () => {
    const { status } = get();
    if (status !== 'paused') return;

    const id = setInterval(() => {
      set((state) => ({ elapsedTime: state.elapsedTime + 1 }));
    }, 1000);

    set({ status: 'running', intervalId: id });
  },

  // توقف کامل و ریست کرونومتر
  stop: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({
      elapsedTime: 0,
      status: 'stopped',
      intervalId: null,
      activeTask: null,
    });
  },

  // ریست کرونومتر (بدون تغییر وضعیت)
  reset: () => {
    set({ elapsedTime: 0 });
  },

  // ذخیره زمان برای وظیفه و ریست
  saveAndReset: () => {
    const { elapsedTime, activeTask } = get();
    get().stop();
    return { elapsedTime, taskId: activeTask };
  },

  // تنظیم وظیفه فعال
  setActiveTask: (taskId) => {
    set({ activeTask: taskId });
  },

  // تغییر حالت نمایش
  setDisplayMode: (mode) => {
    set({ displayMode: mode });
  },

  // کوچک کردن کرونومتر
  minimize: () => {
    set({ displayMode: 'minimized' });
  },

  // بزرگ کردن کرونومتر
  expand: () => {
    set({ displayMode: 'expanded' });
  },

  // بررسی اینکه آیا در حال اجرا است
  isRunning: () => get().status === 'running',

  // دریافت زمان فعلی
  getElapsedTime: () => get().elapsedTime,

  // دریافت وضعیت
  getStatus: () => get().status,
}));

export default useTimerStore;
