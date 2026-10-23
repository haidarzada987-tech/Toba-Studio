import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageProvider';
import { Shield, FileText, Info } from 'lucide-react';

export default function InfoPage({ type }: { type: 'terms' | 'privacy' | 'about' }) {
  const { t } = useLanguage();

  const contentMap = {
    terms: {
      title: t('terms'),
      icon: <FileText className="w-12 h-12 text-primary" />,
      content: t('terms_content')
    },
    privacy: {
      title: t('privacy'),
      icon: <Shield className="w-12 h-12 text-secondary" />,
      content: t('privacy_content')
    },
    about: {
      title: t('about_us'),
      icon: <Info className="w-12 h-12 text-accent" />,
      content: t('about_content')
    }
  };

  const current = contentMap[type];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 blur-3xl rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full glass rounded-[40px] p-10 md:p-16 border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
            {current.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{current.title}</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light text-justify">
            {current.content}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
