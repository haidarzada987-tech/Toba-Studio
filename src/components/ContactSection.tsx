import React from 'react';
import { MessageCircle, Send, Phone, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageProvider';

interface ContactSectionProps {
  onConsultationClick?: () => void;
}

export default function ContactSection({ onConsultationClick }: ContactSectionProps) {
  const { t, isRTL } = useLanguage();

  const contacts = [
    {
      name: t('consult_title'),
      icon: <Bot className="w-8 h-8" />,
      color: 'bg-primary text-dark',
      onClick: onConsultationClick,
      description: t('contact_ai_desc')
    },
    {
      name: t('contact_whatsapp'),
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'bg-[#25D366]',
      link: 'https://wa.me/93777689141',
      description: '+93 777 689 141'
    },
    {
      name: t('contact_telegram'),
      icon: <Send className="w-8 h-8" />,
      color: 'bg-[#0088cc]',
      link: 'https://t.me/+13239902586',
      description: '+1 (323) 990-2586'
    },
    {
      name: t('contact_call'),
      icon: <Phone className="w-8 h-8" />,
      color: 'bg-primary',
      link: 'tel:+93777689141',
      description: '+93 777 689 141'
    }
  ];

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-6"
        >
          {t('contact_title')} <span className="gradient-text">{t('contact_title_2')}</span>
        </motion.h2>
        <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
          {t('contact_desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contacts.map((contact, index) => {
            const commonProps = {
              initial: { opacity: 0, scale: 0.9 },
              whileInView: { opacity: 1, scale: 1 },
              transition: { delay: index * 0.1 },
              whileHover: { y: -10 },
              className: "glass p-8 rounded-3xl flex flex-col items-center gap-6 group cursor-pointer w-full text-center"
            };

            const content = (
              <>
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-transform group-hover:rotate-12",
                  contact.color
                )}>
                  {contact.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{contact.name}</h3>
                  <p className="text-gray-400 text-sm">{contact.description}</p>
                </div>
                <div className="mt-4 text-primary font-bold flex items-center gap-2">
                  {contact.onClick ? t('contact_start_chat') : t('contact_click_here')}
                  <span className={cn("text-xl", !isRTL && "rotate-180")}>←</span>
                </div>
              </>
            );

            if (contact.link) {
              return (
                <motion.a
                  key={contact.name}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...commonProps}
                >
                  {content}
                </motion.a>
              );
            }

            return (
              <motion.button
                key={contact.name}
                onClick={contact.onClick}
                {...commonProps}
              >
                {content}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 blur-3xl rounded-full -z-10" />
    </section>
  );
}
