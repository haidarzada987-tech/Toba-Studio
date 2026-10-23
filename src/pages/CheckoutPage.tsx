import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Search, Smartphone, ShieldCheck, Wallet, CheckCircle2, BadgeDollarSign, Clock3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageProvider';
import { fetchJson } from '../lib/api';

type PaymentMethod = 'afghan_mobile';
type MobileProvider = 'hesab_pay';
type PaymentCreateResponse = { payment_url: string; tracking_code?: string };

const CHECKOUT_DRAFT_KEY = 'checkout_contact_draft';
const PENDING_PAYMENT_KEY = 'pending_payment';
const LATEST_TRACKING_KEY = 'latest_tracking_code';

type CheckoutDraft = {
  customerName: string;
  email: string;
  phoneNumber: string;
  whatsApp: string;
};

function readCheckoutDraft(): CheckoutDraft {
  try {
    const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return { customerName: '', email: '', phoneNumber: '', whatsApp: '' };
    const parsed = JSON.parse(raw) as Partial<CheckoutDraft>;
    return {
      customerName: typeof parsed.customerName === 'string' ? parsed.customerName : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
      phoneNumber: typeof parsed.phoneNumber === 'string' ? parsed.phoneNumber : '',
      whatsApp: typeof parsed.whatsApp === 'string' ? parsed.whatsApp : '',
    };
  } catch {
    return { customerName: '', email: '', phoneNumber: '', whatsApp: '' };
  }
}

function normalizePhone(value: string) {
  const cleaned = value.replace(/\s+/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+93')) return `0${cleaned.slice(3)}`;
  if (cleaned.startsWith('93')) return `0${cleaned.slice(2)}`;
  return cleaned;
}

function clearCheckoutDraftData() {
  localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  localStorage.removeItem(PENDING_PAYMENT_KEY);
  localStorage.removeItem(LATEST_TRACKING_KEY);
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart, rawTotals } = useCart();
  const { t, isRTL, language } = useLanguage();
  const [method] = useState<PaymentMethod>('afghan_mobile');
  const [provider] = useState<MobileProvider>('hesab_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const draft = useMemo(() => readCheckoutDraft(), []);
  const [customerName, setCustomerName] = useState(draft.customerName);
  const [email, setEmail] = useState(draft.email);
  const [phoneNumber, setPhoneNumber] = useState(draft.phoneNumber);
  const [whatsApp, setWhatsApp] = useState(draft.whatsApp);
  const [latestTrackingCode, setLatestTrackingCode] = useState(localStorage.getItem(LATEST_TRACKING_KEY) || '');
  const [paymentError, setPaymentError] = useState('');
  const location = useLocation();
  const paymentStartedRef = useRef(false);

  const USD_TO_AFN_RATE = 70;
  const totalInAfn = useMemo(
    () => Math.round(rawTotals.usd * USD_TO_AFN_RATE + rawTotals.afn),
    [rawTotals.usd, rawTotals.afn]
  );

  const handleClearCheckout = () => {
    const confirmed = window.confirm(
      language === 'en' ? 'Do you want to clear your cart?' : 'آیا می‌خواهید سبد خرید خالی شود؟'
    );

    if (!confirmed) return;

    clearCart();
    setCustomerName('');
    setEmail('');
    setPhoneNumber('');
    setWhatsApp('');
    setLatestTrackingCode('');
    setPaymentError('');
    clearCheckoutDraftData();

    toast.success(language === 'en' ? 'Cart cleared.' : 'سبد خرید خالی شد.');
  };

  useEffect(() => {
    localStorage.setItem(
      CHECKOUT_DRAFT_KEY,
      JSON.stringify({
        customerName,
        email,
        phoneNumber,
        whatsApp,
      })
    );
  }, [customerName, email, phoneNumber, whatsApp]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const tracking = params.get('tracking') || localStorage.getItem(LATEST_TRACKING_KEY) || '';
    if (!status) return;

    if (tracking) {
      setLatestTrackingCode(tracking);
      localStorage.setItem(LATEST_TRACKING_KEY, tracking);
    }

    const pendingRaw = localStorage.getItem(PENDING_PAYMENT_KEY);
    let pendingTracking = '';
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw) as { trackingCode?: string };
        pendingTracking = typeof pending.trackingCode === 'string' ? pending.trackingCode : '';
      } catch {
        pendingTracking = '';
      }
    }

    const handledKey = `payment_status_handled:${status}:${tracking || 'unknown'}`;
    const shouldHandle = !sessionStorage.getItem(handledKey);

    if (shouldHandle) {
      if (status === 'success') {
        if (!pendingTracking || pendingTracking === tracking) {
          clearCart();
          localStorage.removeItem('cart');
          localStorage.removeItem(PENDING_PAYMENT_KEY);
        }
        toast.success(language === 'en' ? 'Payment successful.' : 'پرداخت موفق بود.');
      } else if (status === 'failure') {
        toast.error(language === 'en' ? 'Payment failed or was cancelled.' : 'پرداخت ناموفق بود یا لغو شد.');
      }
      sessionStorage.setItem(handledKey, '1');
    }

    const nextParams = new URLSearchParams(location.search);
    nextParams.delete('status');
    const nextUrl = `${location.pathname}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [location.pathname, location.search, clearCart, language]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen px-6 pb-32 pt-40">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,198,39,0.14),transparent_58%),rgba(255,255,255,0.03)] px-8 py-16 text-center shadow-2xl shadow-black/20">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-600">
            <Wallet className="h-12 w-12" />
          </div>
          <h1 className="mb-4 text-4xl font-black">{latestTrackingCode ? (language === 'en' ? 'Order created' : 'سفارش ثبت شد') : t('cart_empty')}</h1>
          <p className="mb-6 max-w-md text-gray-400">{latestTrackingCode ? (language === 'en' ? 'Use the tracking code below to follow the progress of your order.' : 'از کد پیگیری زیر برای دنبال کردن سفارش خود استفاده کنید.') : t('cart_empty_desc')}</p>
          {latestTrackingCode && <div className="mb-8 rounded-2xl border border-primary/15 bg-primary/10 px-6 py-4 text-2xl font-black text-primary">{latestTrackingCode}</div>}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="rounded-2xl bg-primary px-10 py-4 font-black text-dark transition-transform hover:scale-105">
              {t('back_to_shop')}
            </Link>
            <Link to="/track-order" className="rounded-2xl border border-white/10 px-10 py-4 font-black transition-colors hover:bg-white/5">
              {language === 'en' ? 'Track order' : 'پیگیری سفارش'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (isProcessing || paymentStartedRef.current) return;

    if (!customerName.trim()) {
      toast.error(language === 'en' ? 'Please enter your name.' : 'لطفاً نام خود را وارد کنید.');
      return;
    }

    if (!email.trim() && !phoneNumber.trim() && !whatsApp.trim()) {
      toast.error(language === 'en' ? 'Please enter at least one contact method.' : 'حداقل یک راه تماس وارد کنید.');
      return;
    }

    const normalizedPhone = normalizePhone(phoneNumber.trim());
    const normalizedWhatsApp = normalizePhone(whatsApp.trim());

    if (normalizedPhone && !/^0?7\d{8}$/.test(normalizedPhone)) {
      toast.error(language === 'en' ? 'Enter a valid Afghan mobile number.' : 'شماره موبایل معتبر وارد کنید.');
      return;
    }

    if (normalizedWhatsApp && !/^0?7\d{8}$/.test(normalizedWhatsApp)) {
      toast.error(language === 'en' ? 'Enter a valid WhatsApp number.' : 'شماره واتساپ معتبر وارد کنید.');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(language === 'en' ? 'Enter a valid email address.' : 'ایمیل معتبر وارد کنید.');
      return;
    }

    if (totalInAfn <= 0) {
      toast.error(language === 'en' ? 'Invalid order total.' : 'مجموع سفارش معتبر نیست.');
      return;
    }

    setIsProcessing(true);
    paymentStartedRef.current = true;
    setPaymentError('');

    try {
      const lineItems = items.map((item, index) => {
        const afnUnitPrice = Math.round((Number(item.price.en.replace(/[^0-9]/g, '')) || 0) * (item.price.en.includes('$') ? USD_TO_AFN_RATE : 1));
        return {
          id: item.id || `item-${index + 1}`,
          name: `${item.title[language] || item.title.en} x${item.quantity}`,
          price: Math.max(afnUnitPrice * item.quantity, 1),
          quantity: item.quantity,
        };
      });

      const data = await fetchJson<PaymentCreateResponse>('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          email: email.trim(),
          phone: normalizedPhone,
          whatsapp: normalizedWhatsApp,
          items: lineItems,
        }),
      });

      if (!data?.payment_url) {
        throw new Error(language === 'en' ? 'Payment link was not returned.' : 'لینک پرداخت برنگشت.');
      }

      if (data.tracking_code) {
        const pendingPayment = {
          trackingCode: data.tracking_code,
          createdAt: new Date().toISOString(),
          customerName: customerName.trim(),
          email: email.trim(),
          phone: normalizedPhone,
          whatsapp: normalizedWhatsApp,
          totalInAfn,
        };
        localStorage.setItem(LATEST_TRACKING_KEY, data.tracking_code);
        localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pendingPayment));
        setLatestTrackingCode(data.tracking_code);
      }

      window.location.assign(data.payment_url);
    } catch (error) {
      console.error('Error initiating payment:', error);
      const message = error instanceof Error ? error.message : t('error_order_failed');
      setPaymentError(message);
      toast.error(message);
      setIsProcessing(false);
      paymentStartedRef.current = false;
    }
  };

  return (
    <div className="min-h-screen px-6 pb-32 pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,198,39,0.14),transparent_55%),rgba(255,255,255,0.03)] p-8 shadow-2xl shadow-black/20 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className={cn('space-y-5', isRTL ? 'text-right' : 'text-left')}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-primary">
                <BadgeDollarSign className="h-4 w-4" />
                {language === 'en' ? 'Secure checkout' : 'پرداخت امن'}
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
                {language === 'en' ? 'Finish your order with a cleaner, faster checkout flow.' : 'سفارش خود را با یک فرایند پرداخت سریع و منظم نهایی کنید.'}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
                {language === 'en'
                  ? 'Guest checkout is active. Add your contact details, complete the HesabPay payment, and keep your tracking code for updates.'
                  : 'خرید بدون لاگین فعال است. اطلاعات تماس را وارد کنید، پرداخت HesabPay را انجام دهید، و کد پیگیری را برای دنبال‌کردن سفارش نگه دارید.'}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: CheckCircle2, title: language === 'en' ? 'No login needed' : 'بدون نیاز به لاگین', desc: language === 'en' ? 'Buy as a guest and continue fast.' : 'به‌صورت مهمان و سریع خرید کنید.' },
                  { icon: ShieldCheck, title: language === 'en' ? 'Protected payment' : 'پرداخت امن', desc: language === 'en' ? 'Pay through the configured mobile gateway.' : 'پرداخت از طریق درگاه موبایلی پیکربندی‌شده.' },
                  { icon: Clock3, title: language === 'en' ? 'Instant tracking' : 'پیگیری فوری', desc: language === 'en' ? 'Receive a code after the order is created.' : 'پس از ثبت سفارش، کد پیگیری دریافت کنید.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <item.icon className="mb-3 h-5 w-5 text-primary" />
                    <div className="mb-1 text-sm font-black text-white">{item.title}</div>
                    <div className="text-sm leading-6 text-gray-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[32px] border border-white/10 bg-black/25 p-6">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-gray-500">{language === 'en' ? 'Order total' : 'مجموع سفارش'}</div>
                <div className="text-4xl font-black text-primary">{totalPrice}</div>
                {method === 'afghan_mobile' && rawTotals.usd > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    {t('equivalent')}: {totalInAfn.toLocaleString(language === 'en' ? 'en-US' : 'fa-IR')} {t('currency_afn')}
                  </div>
                )}
              </div>
              <div className="rounded-[32px] border border-white/10 bg-black/25 p-6">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-gray-500">{language === 'en' ? 'Items in cart' : 'تعداد آیتم‌ها'}</div>
                <div className="text-4xl font-black text-white">{totalItems}</div>
                <div className="mt-2 text-sm text-gray-400">{language === 'en' ? 'You can still review all selected services below.' : 'هنوز هم می‌توانید همه خدمات انتخاب‌شده را پایین صفحه بررسی کنید.'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('flex flex-col gap-10 lg:flex-row', isRTL ? 'text-right' : 'text-left')}>
          <div className="flex-grow space-y-8">
            {latestTrackingCode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-primary/20 bg-primary/10 p-6 shadow-xl shadow-primary/5">
                <div className="mb-2 flex items-center gap-3 text-primary">
                  <Search className="h-5 w-5" />
                  <span className="text-sm font-black uppercase tracking-[0.24em]">{language === 'en' ? 'Your tracking code' : 'کد پیگیری شما'}</span>
                </div>
                <p className="mb-3 text-2xl font-black">{latestTrackingCode}</p>
                <p className="mb-4 text-sm text-gray-300">
                  {language === 'en'
                    ? 'Save this code. You can track the order later with your email, phone, or WhatsApp.'
                    : 'این کد را نگه دارید. بعداً با ایمیل، شماره تماس یا واتساپ می‌توانید سفارش را پیگیری کنید.'}
                </p>
                <Link to="/track-order" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-dark">
                  {language === 'en' ? 'Track order now' : 'پیگیری سفارش'}
                </Link>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-8 shadow-2xl shadow-black/20">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    {t('hesab_pay')}
                  </div>
                  <h3 className="text-2xl font-black">{language === 'en' ? 'Contact details & payment method' : 'اطلاعات تماس و روش پرداخت'}</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {language === 'en' ? 'Enter at least one contact method so we can reach you about your order.' : 'حداقل یک راه تماس وارد کنید تا در مورد سفارش بتوانیم با شما ارتباط بگیریم.'}
                  </p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-3">
                  <img src="/images/hesab-pay.png" alt="Hesab Pay" className="h-full w-full object-contain" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-gray-500">
                    {language === 'en' ? 'Full name' : 'نام کامل'}
                  </label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-6 py-4 text-white outline-none transition-colors focus:border-primary" placeholder={language === 'en' ? 'Your name' : 'نام شما'} />
                </div>
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-gray-500">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-6 py-4 text-white outline-none transition-colors focus:border-primary" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-gray-500">{t('phone_number')}</label>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="07XXXXXXXX" className="w-full rounded-2xl border border-white/10 bg-black/20 px-6 py-4 font-mono text-white outline-none transition-colors focus:border-primary" />
                </div>
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-gray-500">WhatsApp</label>
                  <input type="tel" value={whatsApp} onChange={(e) => setWhatsApp(e.target.value)} placeholder="07XXXXXXXX" className="w-full rounded-2xl border border-white/10 bg-black/20 px-6 py-4 font-mono text-white outline-none transition-colors focus:border-primary" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="rounded-[28px] border border-primary/15 bg-primary/10 p-5">
                  <p className="text-sm leading-7 text-gray-200">
                    {isRTL
                      ? 'خرید بدون لاگین فعال است. فقط اطلاعات تماس خود را وارد کنید. پس از پرداخت، می‌توانید با کد پیگیری سفارش را دنبال کنید.'
                      : 'Guest checkout is enabled. Just enter your contact information. After payment, you can track the order with your tracking code.'}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 text-sm text-gray-300">
                  <div className="mb-2 font-black text-white">{language === 'en' ? 'Need help?' : 'نیاز به کمک دارید؟'}</div>
                  <div>{language === 'en' ? 'Review your order summary before you continue to payment.' : 'قبل از رفتن به پرداخت، خلاصه سفارش خود را بررسی کنید.'}</div>
                </div>
              </div>

              {paymentError && (
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                  {paymentError}
                </div>
              )}
            </motion.div>
          </div>

          <div className="w-full shrink-0 lg:w-[420px]">
            <div className="sticky top-32 rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-8 shadow-2xl shadow-black/20">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-gray-500">{language === 'en' ? 'Order summary' : 'خلاصه سفارش'}</div>
                  <h2 className="text-3xl font-black">{t('order_summary_title')} <span className="text-primary">{t('order_summary_accent')}</span></h2>
                </div>
                <div className="rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{language === 'en' ? 'Gateway' : 'درگاه'}</div>
                  <div className="text-sm font-black text-primary">{provider === 'hesab_pay' ? 'HesabPay' : provider}</div>
                </div>
              </div>

              <div className={cn('mb-6 space-y-4 rounded-[28px] border border-white/10 bg-black/20 p-4 max-h-72 overflow-y-auto custom-scrollbar', isRTL ? 'pl-2' : 'pr-2')}>
                {items.map((item) => (
                  <div key={item.id} className={cn('flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3', isRTL ? 'flex-row' : 'flex-row-reverse')}>
                    <div className={cn('flex items-center gap-3', isRTL ? 'flex-row' : 'flex-row-reverse')}>
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        {item.image ? (
                          <img src={item.image} alt={item.title[language]} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-700">
                            <Smartphone className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="line-clamp-1 text-sm font-bold text-white">{item.title[language]}</p>
                        <p className="text-[11px] text-gray-500">{item.quantity} {t('unit')}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-primary">{item.price[language]}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-gray-500">{t('total_items')}</div>
                  <div className="mt-2 text-2xl font-black text-white">{totalItems}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-gray-500">{t('total_payable')}</div>
                  <div className="mt-2 text-2xl font-black text-primary">{totalPrice}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className={cn(
                  'mb-4 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-black shadow-xl transition-all',
                  isProcessing ? 'cursor-not-allowed bg-gray-800 text-gray-500' : 'bg-primary text-dark shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                {isProcessing ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    {t('processing')}
                  </motion.div>
                ) : (
                  <>
                    <ShieldCheck className="h-6 w-6" />
                    {t('confirm_payment')}
                  </>
                )}
              </button>

              <Link to="/track-order" className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-black transition-colors hover:bg-white/5">
                <Search className="h-5 w-5" />
                {language === 'en' ? 'Track an existing order' : 'پیگیری سفارش موجود'}
              </Link>

              <button
                type="button"
                onClick={handleClearCheckout}
                className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-black text-red-200 transition-colors hover:bg-red-500/15"
              >
                <Search className="h-5 w-5" />
                {language === 'en' ? 'Clear cart' : 'خالی کردن سبد'}
              </button>

              <div className="rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-center text-[11px] uppercase tracking-[0.24em] text-gray-200">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  {t('secure_transaction')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
