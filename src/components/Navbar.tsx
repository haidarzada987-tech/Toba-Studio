import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, ShoppingCart, Sun, X, Globe, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageProvider';
import { useTheme } from '../context/ThemeProvider';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsLangOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLangOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isLangOpen]);

  const navLinks = useMemo(() => [
    { path: '/', name: t('home') },
    { path: '/ai', name: t('ai_services') },
    { path: '/cards', name: t('virtual_cards') },
    { path: '/graphics', name: t('graphics') },
    { path: '/track-order', name: language === 'en' ? 'Track Order' : 'پیگیری سفارش' },
  ], [t, language]);

  const languages = [
    { code: 'dr', name: 'دری' },
    { code: 'ps', name: 'پښتو' },
    { code: 'en', name: 'English' },
  ];

  const adminLoggedIn = Boolean(localStorage.getItem('admin_token'));

  const AdminButton = adminLoggedIn ? (
    <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-black text-dark hover:scale-105 transition-transform">
      <ShieldCheck className="w-4 h-4" />
      {language === 'en' ? 'Admin Panel' : 'پنل مدیریت'}
    </Link>
  ) : null;

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out', scrolled ? 'glass py-2 px-6 border-b border-white/10 shadow-xl backdrop-blur-xl' : 'bg-transparent py-6 px-8 border-b border-transparent')}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
            <img src="/images/logo.svg" alt="TOBA STUDIO" className="w-full h-full object-contain" />
          </div>
          <span className="gradient-text uppercase tracking-tighter">TOBA STUDIO</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={cn('text-sm font-medium transition-colors hover:text-primary', location.pathname === link.path ? 'text-primary' : scrolled ? 'text-foreground/80' : 'text-gray-400')}>
              {link.name}
            </Link>
          ))}

          <button type="button" onClick={() => navigate('/checkout')} className={cn('relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors border', scrolled ? 'bg-foreground/5 hover:bg-foreground/10 border-foreground/10 text-foreground/80 hover:text-primary' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-primary')}>
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-dark text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
          </button>

          <button type="button" onClick={toggleTheme} className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-colors border', scrolled ? 'bg-foreground/5 hover:bg-foreground/10 border-foreground/10 text-foreground/80 hover:text-primary' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-primary')}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div ref={langMenuRef} className="relative">
            <button type="button" onClick={() => setIsLangOpen((v) => !v)} className={cn('flex items-center gap-2 text-sm font-medium transition-colors', scrolled ? 'text-foreground/80 hover:text-primary' : 'text-gray-400 hover:text-primary')}>
              <Globe className="w-4 h-4" />
              {languages.find((l) => l.code === language)?.name}
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 right-0 glass border border-white/10 rounded-xl overflow-hidden min-w-[120px]">
                  {languages.map((lang) => (
                    <button key={lang.code} type="button" onClick={() => { setLanguage(lang.code as any); setIsLangOpen(false); }} className={cn('w-full px-4 py-2 text-sm text-right hover:bg-white/5 transition-colors', language === lang.code ? 'text-primary font-bold' : 'text-gray-400')}>
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {AdminButton}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button type="button" onClick={() => navigate('/checkout')} className="relative w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
            <ShoppingCart className="w-4 h-4" />
            {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-dark text-[8px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
          </button>
          <button type="button" onClick={toggleTheme} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 text-gray-400">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button type="button" className="text-foreground" onClick={() => setIsOpen((v) => !v)}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden mt-4 glass rounded-3xl border border-white/10 p-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={cn('block rounded-2xl px-4 py-3 font-bold transition-colors', location.pathname === link.path ? 'bg-primary text-dark' : 'hover:bg-white/5')}>
                {link.name}
              </Link>
            ))}
            {adminLoggedIn && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block rounded-2xl bg-primary px-4 py-3 font-black text-dark">
                {language === 'en' ? 'Admin Panel' : 'پنل مدیریت'}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
