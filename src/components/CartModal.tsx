import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageProvider';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleRemove = (id: string, title: { dr: string; ps: string; en: string }) => {
    removeFromCart(id);
    const translatedTitle = title[language as keyof typeof title] || title.en;
    toast.error(`${translatedTitle} ${isRTL ? 'از سبد خرید حذف شد' : 'removed from cart'}`);
  };

  const handleClear = () => {
    clearCart();
    toast.info(t('cart_clear_success') || (isRTL ? 'سبد خرید خالی شد' : 'Cart cleared'));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md"
          />

          <motion.aside
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 210 }}
            className={cn(
              'fixed top-0 z-[70] flex h-full w-full flex-col overflow-hidden border-white/10 bg-[#06070b] shadow-2xl shadow-black/40 md:w-[560px]',
              isRTL ? 'right-0 border-l' : 'left-0 border-r'
            )}
          >
            <div className="relative overflow-hidden border-b border-white/10 px-6 py-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,198,39,0.16),transparent_55%)]" />
              <div className="absolute -right-16 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-lg shadow-primary/10">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
                      <Sparkles className="h-3 w-3" />
                      {isRTL ? 'سبد فعال' : 'Active cart'}
                    </div>
                    <h2 className="text-2xl font-black text-white">{t('cart_title')}</h2>
                    <p className="text-sm text-gray-400">{totalItems} {t('cart_items')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-b border-white/10 bg-white/[0.03] px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-gray-500">{isRTL ? 'جمع سفارش' : 'Order snapshot'}</div>
                    <div className="mt-1 text-lg font-black text-white">{totalPrice}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 transition-colors hover:bg-red-500/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('cart_clear')}
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-600">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <h3 className="mb-2 text-xl font-black text-white">{t('cart_empty')}</h3>
                  <p className="mb-6 max-w-sm text-sm leading-7 text-gray-400">{t('cart_empty_desc')}</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-dark"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {t('view_all')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.06]">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-inner shadow-black/20">
                          {item.image ? (
                            <img src={item.image} alt={item.title[language]} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-700">
                              <ShoppingBag className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                              <h4 className="line-clamp-2 text-base font-black text-white">{item.title[language]}</h4>
                              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-500">
                                {isRTL ? 'آیتم سفارش' : 'Selected service'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id, item.title)}
                              className="rounded-xl border border-white/10 p-2 text-gray-500 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="text-lg font-black text-primary">{item.price[language]}</div>
                            <div className="text-xs text-gray-500">{isRTL ? 'قابل ویرایش' : 'Adjust quantity'}</div>
                          </div>
                          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-10 text-center text-base font-black text-white">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                              {isRTL ? 'آماده پرداخت' : 'Ready'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.04))] p-6">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-gray-500">{isRTL ? 'آیتم‌ها' : 'Items'}</div>
                    <div className="mt-2 text-2xl font-black text-white">{totalItems}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.24em] text-gray-500">{t('cart_total')}</div>
                    <div className="mt-2 text-2xl font-black text-primary">{totalPrice}</div>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-gray-200">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>{isRTL ? 'پس از پرداخت، سفارش شما با کد پیگیری ثبت می‌شود.' : 'After payment, your order is stored with a tracking code.'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-2xl border border-white/10 px-4 py-4 font-bold text-white transition-colors hover:bg-white/5"
                  >
                    {t('cart_clear')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-black text-dark shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
                  >
                    <CreditCard className="h-5 w-5" />
                    {t('cart_checkout')}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
