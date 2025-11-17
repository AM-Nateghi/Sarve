// پیام‌های انگیزشی برای داشبورد (15 جمله)
export const MOTIVATIONAL_MESSAGES = [
  'امروز روز خوبی برای شروع کارهای بزرگ است!',
  'هر قدم کوچک، یک پیروزی بزرگ است.',
  'تمرکز کن، تلاش کن، موفق شو!',
  'امروز را با انرژی مثبت شروع کن.',
  'کارهای امروز، موفقیت‌های فردا هستند.',
  'هیچ کاری غیرممکن نیست، فقط شروع کن!',
  'با برنامه‌ریزی دقیق، همه چیز آسان‌تر می‌شود.',
  'موفقیت نتیجه تلاش‌های مداوم است.',
  'امروز بهترین روز برای پیشرفت است!',
  'با اعتماد به نفس، هر هدفی قابل دستیابی است.',
  'زمان محدود است، از آن به خوبی استفاده کن!',
  'کیفیت مهم‌تر از کمیت است.',
  'هر روز فرصتی جدید برای بهتر شدن است.',
  'با انگیزه کار کن، با لذت پیشرفت کن!',
  'امروز را با بهترین نسخه خودت آغاز کن!'
];

// رنگ‌های پیش‌فرض برای Labels
export const DEFAULT_LABEL_COLORS = {
  red: { name: 'قرمز', hex: '#EF4444' },
  orange: { name: 'نارنجی', hex: '#F97316' },
  yellow: { name: 'زرد', hex: '#EAB308' },
  green: { name: 'سبز', hex: '#22C55E' },
  blue: { name: 'آبی', hex: '#3B82F6' },
  purple: { name: 'بنفش', hex: '#A855F7' },
  pink: { name: 'صورتی', hex: '#EC4899' },
  gray: { name: 'خاکستری', hex: '#6B7280' },
};

// اولویت‌های وظیفه
export const TASK_PRIORITIES = {
  LOW: { value: 1, label: 'کم', color: 'text-gray-500' },
  MEDIUM: { value: 2, label: 'متوسط', color: 'text-yellow-500' },
  HIGH: { value: 3, label: 'زیاد', color: 'text-orange-500' },
  URGENT: { value: 4, label: 'فوری', color: 'text-red-500' },
};

// نام سکشن پیش‌فرض (غیرقابل حذف)
export const DEFAULT_SECTION_NAME = 'عمومی';

// فرمت‌های فایل صوتی مجاز
export const ALLOWED_AUDIO_FORMATS = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];

// حداکثر حجم فایل صوتی (15MB)
export const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB in bytes

// محدودیت تعداد درخواست به AI (تعداد در دقیقه)
export const AI_RATE_LIMIT = 10;

// تعداد تلاش مجدد برای درخواست‌های ناموفق AI
export const AI_MAX_RETRIES = 2;

// Regex برای اعتبارسنجی شماره تلفن ایران
export const IRAN_PHONE_REGEX = /^(09\d{9}|(\+98|0098)9\d{9})$/;

// مدت زمان نمایش Toast (میلی‌ثانیه)
export const TOAST_DURATION = 4000;

// مدت زمان انیمیشن صفحات (میلی‌ثانیه)
export const PAGE_TRANSITION_DURATION = 300;
