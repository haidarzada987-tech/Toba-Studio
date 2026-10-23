import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageProvider';
import { useCart } from '../context/CartContext';
import type { Service } from '../constants';
import { fetchJson } from '../lib/api';

type Category = 'ai' | 'card' | 'graphic';

export default function ServicePage({ category }: { category: Category }) {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    fetchJson<{ services: Service[] }>(`/api/public/services?category=${category}`)
      .then((data) => {
        if (isActive) setServices(data.services || []);
      })
      .catch(() => {
        if (isActive) setServices([]);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [category]);

  const title = useMemo(() => {
    if (category === 'ai') return language === 'en' ? 'AI Services' : 'خدمات هوش مصنوعی';
    if (category === 'card') return language === 'en' ? 'Virtual Cards' : 'کارت‌های مجازی';
    return language === 'en' ? 'Graphic Services' : 'خدمات گرافیک';
  }, [category, language]);

  return (
    <div className="pt-36 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-3">Catalog</div>
          <h1 className="text-5xl font-black tracking-tight">{title}</h1>
        </div>

        {loading ? (
          <div className="py-24 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="glass rounded-[32px] overflow-hidden border border-white/10">
                <div className="h-56 bg-white/5 overflow-hidden">
                  <img src={service.image} alt={service.title.en} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-sm uppercase tracking-[0.25em] text-primary font-black">{service.category}</div>
                  <h3 className="text-2xl font-black">{service.title[language]}</h3>
                  <p className="text-gray-400 leading-7">{service.description[language]}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-primary font-black text-lg">{service.price[language]}</div>
                    <button type="button" onClick={() => addToCart(service)} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-dark hover:scale-105 transition-transform">
                      <ShoppingCart className="w-4 h-4" />
                      {language === 'en' ? 'Add to cart' : 'افزودن به سبد'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
