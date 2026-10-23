import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Search,
  Sparkles,
  ShieldCheck,
  Palette,
  CreditCard,
  Bot,
} from "lucide-react";
import ContactSection from "../components/ContactSection";
import ConsultationModal from "../components/ConsultationModal";
import { useLanguage } from "../context/LanguageProvider";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

type ServiceCategory = {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function Home() {
  const { language } = useLanguage();
  const [consultationOpen, setConsultationOpen] = useState(false);

  const lang = String(language).toLowerCase();
  const isFa = lang === "fa" || lang === "dr" || lang === "ps";

  const openConsultation = () => {
    setConsultationOpen(true);
  };

  const content = useMemo(
    () => ({
      eyebrow: isFa ? "خدمات دیجیتال سریع و آسان" : "Fast and Simple Digital Services",
      titleMain: isFa ? "خدمات" : "Digital",
      titleAccent: isFa ? "هوشمند" : "Services",
      subtitle: isFa
        ? "ابزارهای هوش مصنوعی، پرداخت بین‌المللی و خدمات طراحی را سریع، ساده و مطمئن دریافت کنید."
        : "Get AI tools, international payments, and design services in a fast, simple, and reliable way.",
      start: isFa ? "شروع" : "Start",
      freeConsult: isFa ? "مشاوره رایگان" : "Free Consultation",
      smartContact: isFa ? "راه‌های ارتباط" : "Contact Options",
      smartContactDesc: isFa
        ? "برای مشاوره، ثبت سفارش و پیگیری سفارش از راه‌های زیر استفاده کنید."
        : "Use the options below for consultation, placing orders, and tracking orders.",
      whatsapp: isFa ? "واتساپ" : "WhatsApp",
      whatsappDesc: isFa
        ? "برای مشاوره و ثبت سفارش در واتساپ پیام بدهید."
        : "Send us a message on WhatsApp for consultation and orders.",
      track: isFa ? "پیگیری سفارش" : "Order Tracking",
      trackDesc: isFa
        ? "وضعیت سفارش خود را با کد پیگیری بررسی کنید."
        : "Check your order status with your tracking code.",
      aiConsult: isFa ? "مشاوره هوشمند" : "Smart Consultation",
      aiConsultDesc: isFa
        ? "برای راهنمایی سریع، گفت‌وگو با مشاور هوشمند را باز کنید."
        : "Open smart consultation for quick help.",
      categoriesTitle: isFa ? "خدمات ما" : "Our Services",
      categoriesDesc: isFa
        ? "خدمت مورد نظر خود را انتخاب کنید."
        : "Choose the service you need.",
      viewServices: isFa ? "دیدن خدمات" : "View Services",
      featuresTitle: isFa ? "مزیت‌های ما" : "Why Choose Us",
      featuresDesc: isFa
        ? "ما خدمات ساده، سریع و مطمئن ارائه می‌کنیم."
        : "We provide simple, fast, and reliable services.",
    }),
    [isFa]
  );

  const features: Feature[] = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: isFa ? "پرداخت مطمئن" : "Secure Payments",
        desc: isFa
          ? "پرداخت خدمات با فرایند ساده، امن و قابل اعتماد."
          : "Pay for services through a simple, secure, and reliable process.",
      },
      {
        icon: Bot,
        title: isFa ? "ابزارهای هوش مصنوعی" : "AI Tools",
        desc: isFa
          ? "دسترسی آسان به سرویس‌های کاربردی و محبوب هوش مصنوعی."
          : "Easy access to useful and popular AI services.",
      },
      {
        icon: Palette,
        title: isFa ? "خدمات طراحی" : "Design Services",
        desc: isFa
          ? "طراحی، ویرایش و تولید محتوای بصری با کیفیت حرفه‌ای."
          : "Design, editing, and visual content services with professional quality.",
      },
    ],
    [isFa]
  );

  const categories: ServiceCategory[] = useMemo(
    () => [
      {
        title: isFa ? "هوش مصنوعی" : "AI Services",
        desc: isFa ? "سفارش سرویس‌ها و ابزارهای هوش مصنوعی." : "Order AI services and tools.",
        href: "/ai",
        icon: Sparkles,
      },
      {
        title: isFa ? "کارت‌های مجازی" : "Virtual Cards",
        desc: isFa
          ? "درخواست کارت‌های مجازی و راه‌حل‌های پرداخت آنلاین."
          : "Request virtual cards and online payment solutions.",
        href: "/cards",
        icon: CreditCard,
      },
      {
        title: isFa ? "خدمات گرافیکی" : "Graphic Design",
        desc: isFa
          ? "سفارش طراحی، ویرایش و تولید محتوای گرافیکی."
          : "Order design, editing, and graphic content services.",
        href: "/graphics",
        icon: Palette,
      },
    ],
    [isFa]
  );

  const glassStyle = {
    backgroundColor: "var(--glass-bg)",
    borderColor: "var(--glass-border)",
  } as const;

  return (
    <div
      lang={isFa ? "fa" : "en"}
      dir={isFa ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 18%, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at 18% 20%, rgba(6,182,212,0.10), transparent 18%), radial-gradient(circle at 82% 16%, rgba(99,102,241,0.12), transparent 22%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 dark:opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(148,163,184,0.18) 0.8px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute left-1/2 top-[7rem] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute left-[12%] top-[18rem] h-[16rem] w-[16rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-[10%] top-[14rem] h-[18rem] w-[18rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-5xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm backdrop-blur-md"
            style={glassStyle}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary">{content.eyebrow}</span>
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <span>{content.titleMain}</span>{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 bg-clip-text text-transparent">
              {content.titleAccent}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-foreground/70 md:text-2xl">
            {content.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/ai"
              className="relative z-20 inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-base font-extrabold text-slate-950 shadow-[0_10px_35px_rgba(59,130,246,0.28)] transition duration-300 hover:scale-[1.02]"
            >
              {content.start}
            </Link>

            <button
              type="button"
              onClick={openConsultation}
              className="relative z-20 inline-flex min-w-[180px] cursor-pointer items-center justify-center rounded-2xl border px-8 py-4 text-base font-extrabold text-foreground shadow-sm transition hover:opacity-90"
              style={{ ...glassStyle, pointerEvents: "auto" }}
            >
              {content.freeConsult}
            </button>
          </div>
        </div>

        <div className="mt-24">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold md:text-5xl">{content.smartContact}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-foreground/70 md:text-xl">
              {content.smartContactDesc}
            </p>
          </div>

          <div className="relative z-[9999] grid gap-6 md:grid-cols-3">
            <a
              href="https://wa.me/93782449546"
              target="_blank"
              rel="noreferrer"
              className="group relative z-[9999] overflow-hidden rounded-[28px] border p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1"
              style={{ ...glassStyle, pointerEvents: "auto" }}
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-extrabold">{content.whatsapp}</h3>
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
                  <MessageCircle className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-foreground/70">
                {content.whatsappDesc}
              </p>
            </a>

            <Link
              to="/track-order"
              className="group relative z-[9999] overflow-hidden rounded-[28px] border p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1"
              style={{ ...glassStyle, pointerEvents: "auto" }}
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-extrabold">{content.track}</h3>
                <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-400">
                  <Search className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-foreground/70">
                {content.trackDesc}
              </p>
            </Link>

            <button
              type="button"
              onClick={openConsultation}
              className="group relative z-[9999] w-full cursor-pointer overflow-hidden rounded-[28px] border p-7 text-right backdrop-blur-xl transition duration-300 hover:-translate-y-1"
              style={{ ...glassStyle, pointerEvents: "auto" }}
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-extrabold">{content.aiConsult}</h3>
                <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-400">
                  <Bot className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-foreground/70">
                {content.aiConsultDesc}
              </p>
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">{content.categoriesTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">{content.categoriesDesc}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="group relative z-20 rounded-[28px] border border-border bg-card p-7 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:opacity-95"
              >
                <div className="inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">{item.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>{content.viewServices}</span>
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[32px] border border-border bg-card p-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] md:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl">{content.featuresTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/70">{content.featuresDesc}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-border bg-background/70 p-6"
                >
                  <div className="inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-foreground/70">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ContactSection />

      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
    </div>
  );
}