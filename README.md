# سَروِ | Sarve

> **برنامه مدیریت وظایف هوشمند**
> یک برنامه Full-Stack با React + ASP.NET Core برای مدیریت وظایف، پیگیری زمان و ادغام هوش مصنوعی

---

## 📋 فهرست مطالب

- [درباره پروژه](#-درباره-پروژه)
- [ویژگی‌ها](#-ویژگیها)
- [فناوری‌های استفاده شده](#-فناوریهای-استفاده-شده)
- [پیش‌نیازها](#-پیشنیازها)
- [نصب و راه‌اندازی](#-نصب-و-راهاندازی)
- [ساختار پروژه](#-ساختار-پروژه)
- [API Documentation](#-api-documentation)
- [تنظیمات محیطی](#-تنظیمات-محیطی)
- [مشارکت](#-مشارکت)

---

## 🎯 درباره پروژه

**سَروِ** یک برنامه مدیریت وظایف مدرن است که به شما کمک می‌کند:
- وظایف روزانه خود را مدیریت کنید
- زمان صرف شده روی هر کار را پیگیری کنید
- گزارش‌های روزانه دریافت کنید
- با استفاده از هوش مصنوعی، جلسات صوتی را به وظایف قابل اقدام تبدیل کنید

### نسخه فعلی: **MVP (v1.0.0)**

این نسخه شامل ویژگی‌های اصلی برای مدیریت وظایف، احراز هویت و داشبورد است.

---

## ✨ ویژگی‌ها

### ✅ پیاده‌سازی شده در MVP

- 🔐 **احراز هویت کامل**: ثبت‌نام، ورود با ایمیل/پسورد و JWT
- 📝 **مدیریت وظایف**: CRUD کامل، اولویت‌بندی، سررسید
- 📊 **داشبورد**: نمایش آمار و پیام‌های انگیزشی با Typewriter Effect
- 🎨 **Dark/Light Mode**: تم روشن و تاریک
- 📱 **Responsive Design**: طراحی کاملاً واکنش‌گرا برای موبایل و دسکتاپ
- 🗂️ **سکشن‌بندی**: دسته‌بندی وظایف در سکشن‌های مختلف
- ⏱️ **کرونومتر**: پیگیری زمان (در حال توسعه)

### 🚧 در حال توسعه (Roadmap)

- 🤖 **هوش مصنوعی**: پردازش جلسات صوتی با Google Gemini
- 🏷️ **لیبل‌ها**: تگ‌گذاری و رنگ‌بندی وظایف
- 🎯 **اهداف**: تعیین و پیگیری اهداف بلندمدت
- 📈 **گزارش‌دهی هوشمند**: گزارش‌های محاوره‌ای با AI
- 🔄 **Drag & Drop**: جابجایی وظایف با کشیدن
- 🔊 **ضبط صدا**: ضبط مستقیم در مرورگر

---

## 🛠️ فناوری‌های استفاده شده

### Frontend
- **React 18** + **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router** (Navigation)
- **Zustand** (State Management)
- **React Query** (Server State)
- **Axios** (HTTP Client)
- **React Hot Toast** (Notifications)
- **Heroicons** + **Lucide** (Icons)
- **Framer Motion** (Animations)
- **DnD Kit** (Drag & Drop)

### Backend
- **ASP.NET Core 8.0** (Web API)
- **LiteDB** (NoSQL Database)
- **JWT Bearer Authentication**
- **BCrypt.NET** (Password Hashing)
- **Swagger** (API Documentation)

### Fonts & Typography
- **Estedad Variable** (فونت فارسی)

---

## 📦 پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر نصب شده‌اند:

### برای Frontend:
- **Node.js** >= 18.x
- **npm** >= 9.x یا **yarn**

### برای Backend:
- **.NET SDK** >= 8.0
- (اختیاری) **Docker** برای Containerization

### ابزارهای توسعه (اختیاری):
- **Visual Studio Code** یا **Visual Studio 2022**
- **Postman** یا **Thunder Client** برای تست API

---

## 🚀 نصب و راه‌اندازی

### 1️⃣ کلون کردن پروژه

```bash
git clone https://github.com/yourusername/Sarve.git
cd Sarve
```

### 2️⃣ راه‌اندازی Backend

```bash
cd backend

# نصب .NET SDK (اگر قبلاً نصب نکرده‌اید)
# https://dotnet.microsoft.com/download

# کپی فایل تنظیمات محیطی
cp .env.example .env

# ویرایش فایل .env و تنظیم متغیرها
# nano .env یا با ویرایشگر دلخواه

# اجرای پروژه
dotnet run
```

Backend روی `http://localhost:5000` اجرا می‌شود.

**Swagger UI**: http://localhost:5000

### 3️⃣ راه‌اندازی Frontend

```bash
cd frontend

# نصب dependencies
npm install

# کپی فایل تنظیمات محیطی
cp .env.example .env

# ویرایش فایل .env و تنظیم URL بک‌اند
# VITE_API_URL=http://localhost:5000/api

# اجرای پروژه
npm run dev
```

Frontend روی `http://localhost:5173` اجرا می‌شود.

---

## 📁 ساختار پروژه

```
Sarve/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # کامپوننت‌های React
│   │   │   ├── common/       # کامپوننت‌های عمومی
│   │   │   ├── layout/       # Layout و Navigation
│   │   │   ├── tasks/        # کامپوننت‌های وظایف
│   │   │   └── timer/        # کامپوننت کرونومتر
│   │   ├── pages/            # صفحات اصلی
│   │   ├── services/         # API Services
│   │   ├── stores/           # Zustand Stores
│   │   ├── utils/            # توابع کمکی
│   │   ├── hooks/            # Custom Hooks
│   │   └── App.jsx           # کامپوننت اصلی
│   ├── public/               # فایل‌های استاتیک
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # ASP.NET Core Backend
│   ├── Controllers/          # API Controllers
│   ├── Models/               # Data Models
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Services/             # Business Logic
│   ├── Data/                 # Database Context
│   │   └── Repositories/     # Repository Pattern
│   ├── Middleware/           # Custom Middleware
│   ├── Program.cs            # Entry Point
│   ├── appsettings.json
│   └── Sarve.Backend.csproj
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📡 API Documentation

بعد از اجرای Backend، به آدرس زیر بروید:

```
http://localhost:5000
```

### مهم‌ترین Endpoints:

#### 🔐 Authentication
- `POST /api/auth/register` - ثبت‌نام
- `POST /api/auth/login` - ورود
- `GET /api/auth/me` - اطلاعات کاربر فعلی

#### 📝 Tasks
- `GET /api/tasks` - دریافت همه وظایف
- `POST /api/tasks` - ایجاد وظیفه جدید
- `PUT /api/tasks/{id}` - بروزرسانی وظیفه
- `DELETE /api/tasks/{id}` - حذف وظیفه
- `PATCH /api/tasks/{id}/toggle` - تغییر وضعیت تکمیل

#### 🗂️ Sections
- `GET /api/sections` - دریافت سکشن‌ها
- `POST /api/sections` - ایجاد سکشن جدید

---

## ⚙️ تنظیمات محیطی

### Backend (.env)

```bash
# JWT Settings
JWT_SECRET_KEY=your_very_long_secret_key_here_minimum_32_characters_required

# Google OAuth (اختیاری)
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here

# Google AI Studio (برای نسخه‌های آتی)
GOOGLE_AI_API_KEY=your_google_ai_studio_api_key_here

# Database
LITEDB_PATH=./Data/sarve.db

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5000
```

### Frontend (.env)

```bash
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth (اختیاری)
VITE_GOOGLE_CLIENT_ID=

# Development
VITE_DEV_MODE=true
```

---

## 🤝 مشارکت

مشارکت شما در این پروژه خوشایند است! لطفاً:

1. Fork کنید
2. یک branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

---

## 📝 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است. فایل [LICENSE](LICENSE) را مطالعه کنید.

---

## 🙏 تشکر ویژه

- [React](https://react.dev/)
- [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet)
- [Tailwind CSS](https://tailwindcss.com/)
- [LiteDB](https://www.litedb.org/)
- [فونت استعداد](https://github.com/aminabedi68/Estedad)

---

**ساخته شده با ❤️ برای مدیریت بهتر وظایف**
