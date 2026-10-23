# TOBA STUDIO — Digital Services Platform

A full-stack web platform for selling digital services — **AI premium accounts, virtual cards, and graphic-design services** — built for customers in Afghanistan, with local payment through the **HesabPay API**.

> این پروژه یک وب‌سایت خدمات دیجیتال است برای ارائهٔ خدمات هوش مصنوعی، کارت‌های مجازی و خدمات گرافیکی — با ثبت سفارش، پیگیری سفارش، پنل مدیریت و پرداخت از طریق HesabPay.

## Features

- **Service catalog** — services with pricing, managed from the admin panel
- **Accounts** — registration with **email verification**, login, and **password reset** using single-use, expiring tokens
- **Cart & checkout** — order placement with **HesabPay payment sessions**
- **Order tracking** — customers can follow their order status
- **Admin panel** — manage services, orders, site content, and settings (separate admin login, JWT-protected routes)
- **Multilingual UI** — Dari, Pashto, and English, with light/dark themes
- **AI consultation widget** — optional assistant powered by the Gemini API (key via environment variable)

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router |
| Backend  | Node.js, Express, TypeScript (tsx) |
| Database | SQLite (better-sqlite3) |
| Auth     | JWT (jsonwebtoken), bcrypt password hashing |
| Email    | Nodemailer (verification & password-reset mail) |
| Payments | HesabPay API (payment sessions) |
| Security | Helmet, express-rate-limit, CORS |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & run

```bash
git clone https://github.com/haidarzada987-tech/Toba-Studio.git
cd Toba-Studio
npm install
cp .env.example .env   # then fill in your own values
npm run dev            # starts the server (default http://localhost:3000)
```

Other scripts:

```bash
npm run build   # production build of the frontend (Vite)
npm run lint    # TypeScript type-check (tsc --noEmit)
```

### Environment variables

Copy `.env.example` to `.env` and set your own values. **Never commit a real `.env` file.**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `3000`) |
| `JWT_SECRET` | Secret used to sign JWT session tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seed admin account for the admin panel |
| `HESABPAY_API_KEY` | Your HesabPay API key |
| `HESABPAY_CREATE_SESSION_URL` | HesabPay create-session endpoint (sandbox URL included in the example) |
| `HESABPAY_SUCCESS_URL` / `HESABPAY_FAILURE_URL` | Redirect URLs after payment |
| `GMAIL_USER` / `GMAIL_PASS` | Mail account for verification & reset emails (use a Gmail App Password) |
| `GEMINI_API_KEY` | *(optional)* enables the AI consultation widget |

## API Overview

- **Auth** — `POST /api/register`, `POST /api/login`, `POST /api/verify-email`, `POST /api/resend-verification`, `POST /api/forgot-password`, `POST /api/reset-password`
- **Catalog** — public service listing and site content
- **Orders** — create order, create HesabPay payment session, order tracking
- **Admin** — admin login; manage services, orders, site content, and settings (JWT required)

See [`EMAIL_AUTH_SYSTEM.md`](EMAIL_AUTH_SYSTEM.md) for the full design of the email verification and password-reset flow.

## Security Practices

- Passwords hashed with **bcrypt**; no plaintext credentials in the codebase
- Verification and reset tokens are **hashed, single-use, and expiring**
- Generic responses on forgot-password / resend-verification to prevent **account enumeration**
- **Rate limiting** and **Helmet** headers on the API
- All secrets live in `.env` (git-ignored); the repository ships only `.env.example` with placeholders
- The SQLite database is local-only and is **not** part of this repository

## Project Structure

```
src/            React frontend (pages, components, contexts)
server.ts       Express server + REST API
public/         Static assets (logo)
database.sqlite Local SQLite database (created at runtime, not in repo)
```

Key frontend files: `src/pages/Home.tsx` (home), `src/pages/CheckoutPage.tsx` (checkout), `src/pages/OrderTrackingPage.tsx` (order tracking), `src/pages/AdminPanel.tsx` (admin), `src/context/CartContext.tsx` (cart state), `src/context/LanguageProvider.tsx` (i18n), `src/context/ThemeProvider.tsx` (light/dark theme).

## Author

**Noorullah Haidari** — Computer Science student at Kateb University, Kabul

- GitHub: [github.com/haidarzada987-tech](https://github.com/haidarzada987-tech)
- Portfolio: [haidarzada987-tech.github.io/noorcode](https://haidarzada987-tech.github.io/noorcode/)
