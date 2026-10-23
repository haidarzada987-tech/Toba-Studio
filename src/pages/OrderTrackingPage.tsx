import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, PackageCheck, CircleAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageProvider';
import { cn } from '../lib/utils';
import { fetchJson } from '../lib/api';

type OrderResponse = {
  tracking_code: string;
  customer_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  amount_afn: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  items: { id: string; name: string; price: number }[];
};

export default function OrderTrackingPage() {
  const { language, isRTL } = useLanguage();
  const [tracking, setTracking] = useState(localStorage.getItem('latest_tracking_code') || '');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const params = new URLSearchParams({ tracking: tracking.trim(), contact: contact.trim() });
      const data = await fetchJson<{ order: OrderResponse }>(`/api/orders/track?${params.toString()}`);
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to track order');
    } finally {
      setLoading(false);
    }
  };

  const paymentStatusLabel = (status: string) => {
    if (status === 'paid') return language === 'en' ? 'Paid' : 'پرداخت شده';
    if (status === 'failed') return language === 'en' ? 'Failed' : 'ناموفق';
    return language === 'en' ? 'Pending' : 'در انتظار';
  };

  return (
    <div className="pt-40 pb-32 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className={cn(isRTL ? 'text-right' : 'text-left')}>
          <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3">
            {language === 'en' ? 'Track order' : 'پیگیری سفارش'}
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            {language === 'en' ? 'Follow your order' : 'سفارش خود را پیگیری کنید'}
          </h1>
          <p className="text-gray-400 max-w-2xl">
            {language === 'en'
              ? 'Enter your tracking code and one of your contact details to see the current payment and work status.'
              : 'کد پیگیری و یکی از راه‌های تماس خود را وارد کنید تا وضعیت پرداخت و پیشرفت کار را ببینید.'}
          </p>
        </div>

        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={search} className="glass rounded-[32px] p-8 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
              {language === 'en' ? 'Tracking code' : 'کد پیگیری'}
            </label>
            <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
              {language === 'en' ? 'Email, phone, or WhatsApp' : 'ایمیل، شماره تماس یا واتساپ'}
            </label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus:outline-none focus:border-primary" />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            <button disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-dark disabled:opacity-60">
              <Search className="w-5 h-5" />
              {loading ? (language === 'en' ? 'Checking...' : 'در حال بررسی...') : (language === 'en' ? 'Track order' : 'پیگیری سفارش')}
            </button>
            <Link to="/checkout" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-4 font-black hover:bg-white/5">
              {language === 'en' ? 'Back to checkout' : 'بازگشت به پرداخت'}
            </Link>
          </div>
        </motion.form>

        {error && (
          <div className="rounded-[28px] border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-200 flex items-start gap-3">
            <CircleAlert className="w-5 h-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[32px] p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">{language === 'en' ? 'Tracking code' : 'کد پیگیری'}</div>
                <div className="text-3xl font-black">{order.tracking_code}</div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="rounded-full bg-primary px-4 py-2 text-sm font-black text-dark">{paymentStatusLabel(order.payment_status)}</span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-sm font-black">{order.order_status}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 space-y-2">
                <div className="text-gray-500 text-sm">{language === 'en' ? 'Customer' : 'مشتری'}</div>
                <div className="text-xl font-bold">{order.customer_name}</div>
                {order.email && <div>{order.email}</div>}
                {order.phone && <div>{order.phone}</div>}
                {order.whatsapp && <div>WhatsApp: {order.whatsapp}</div>}
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 space-y-2">
                <div className="text-gray-500 text-sm">{language === 'en' ? 'Payment summary' : 'خلاصه پرداخت'}</div>
                <div className="text-xl font-bold">{order.amount_afn.toLocaleString(language === 'en' ? 'en-US' : 'fa-IR')} AFN</div>
                <div>{language === 'en' ? 'Created:' : 'ایجاد شده:'} {new Date(order.created_at).toLocaleString()}</div>
                <div>{language === 'en' ? 'Updated:' : 'به‌روزرسانی:'} {new Date(order.updated_at).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 text-xl font-black">
                <PackageCheck className="w-5 h-5 text-primary" />
                {language === 'en' ? 'Items' : 'موارد سفارش'}
              </div>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-primary font-black">{item.price.toLocaleString(language === 'en' ? 'en-US' : 'fa-IR')} AFN</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
