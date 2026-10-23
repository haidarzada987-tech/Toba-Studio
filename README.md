# TOBA STUDIO

این پروژه یک سایت برای خدمات دیجیتال است که برای ارائه خدمات هوش مصنوعی، کارت‌های مجازی، خدمات گرافیکی، ثبت سفارش، پیگیری سفارش و مدیریت سفارش‌ها ساخته شده است.

## تکنولوژی‌های اصلی
- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: SQLite
- ابزارهای کمکی: JWT, bcrypt, multer, nodemailer, Lucide React

## ساختار کلی پروژه
- `src/` → بخش فرانت‌اند
- `server.ts` → سرور و APIهای اصلی
- `database.sqlite` → دیتابیس پروژه

## فایل‌های مهم
- `src/main.tsx` → نقطه شروع React
- `src/App.tsx` → مدیریت routeهای اصلی
- `src/pages/Home.tsx` → صفحه اصلی
- `src/pages/CheckoutPage.tsx` → صفحه تسویه‌حساب
- `src/pages/OrderTrackingPage.tsx` → پیگیری سفارش
- `src/pages/AdminPanel.tsx` → پنل مدیریت
- `src/components/Navbar.tsx` → منوی بالای سایت
- `src/components/ConsultationModal.tsx` → پنجره مشاوره
- `src/components/ProtectedRoute.tsx` → محافظت از مسیرهای ادمین

## Contextها
- `src/context/CartContext.tsx` → مدیریت سبد خرید
- `src/context/LanguageProvider.tsx` → مدیریت زبان
- `src/context/ThemeProvider.tsx` → مدیریت تم روشن/تاریک

## استایل و زبان
- `src/index.css` → رنگ‌ها، متغیرهای تم و استایل‌های اصلی
- زبان‌های پروژه: `fa`, `dr`, `ps`, `en`

## امکانات اصلی
- صفحه اصلی خدمات
- سبد خرید و Checkout
- ثبت و پیگیری سفارش
- پنل مدیریت و مدیریت سفارش‌ها
- تم روشن/تاریک
- چندزبانه بودن سایت

## اجرای پروژه
- فرانت‌اند: `npm install` سپس `npm run dev`
- بک‌اند: بسته به تنظیم پروژه، اجرای `server.ts` یا اسکریپت سرور