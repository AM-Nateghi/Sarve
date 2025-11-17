import { IRAN_PHONE_REGEX, ALLOWED_AUDIO_FORMATS, MAX_AUDIO_SIZE } from './constants';

// اعتبارسنجی ایمیل
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// اعتبارسنجی شماره تلفن ایران
export const validateIranPhone = (phone) => {
  return IRAN_PHONE_REGEX.test(phone);
};

// نرمال‌سازی شماره تلفن به فرمت 09xxxxxxxxx
export const normalizeIranPhone = (phone) => {
  // حذف فاصله‌ها و کاراکترهای اضافی
  phone = phone.replace(/\s+/g, '').replace(/-/g, '');

  // تبدیل +98 یا 0098 به 0
  if (phone.startsWith('+98')) {
    phone = '0' + phone.substring(3);
  } else if (phone.startsWith('0098')) {
    phone = '0' + phone.substring(4);
  }

  return phone;
};

// اعتبارسنجی رمز عبور (حداقل 8 کاراکتر)
export const validatePassword = (password) => {
  return password && password.length >= 8;
};

// اعتبارسنجی نام (حداقل 2 کاراکتر)
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// اعتبارسنجی فایل صوتی
export const validateAudioFile = (file) => {
  if (!file) {
    return { valid: false, error: 'لطفاً یک فایل انتخاب کنید.' };
  }

  if (!ALLOWED_AUDIO_FORMATS.includes(file.type)) {
    return { valid: false, error: 'فرمت فایل باید MP3، WAV یا M4A باشد.' };
  }

  if (file.size > MAX_AUDIO_SIZE) {
    return { valid: false, error: 'حجم فایل نباید بیشتر از 15 مگابایت باشد.' };
  }

  return { valid: true };
};

// اعتبارسنجی عنوان وظیفه
export const validateTaskTitle = (title) => {
  return title && title.trim().length > 0 && title.trim().length <= 200;
};

// اعتبارسنجی تاریخ سررسید (نباید گذشته باشد)
export const validateDeadline = (deadline) => {
  if (!deadline) return true; // تاریخ اختیاری است
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadlineDate >= today;
};
