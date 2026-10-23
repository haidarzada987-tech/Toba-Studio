import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Send as TelegramIcon, Phone, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageProvider';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { t, language, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('consult_welcome') || (isRTL ? 'سلام! من مشاور هوشمند TOBA STUDIO هستم. چطور می‌توانم به شما در انتخاب بهترین سرویس‌های دیجیتال کمک کنم؟' : 'Hello! I am TOBA STUDIO smart consultant. How can I help you choose the best digital services?') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: `You are a professional digital consultant for "TOBA STUDIO". 
          TOBA STUDIO provides:
          1. AI Premium Accounts (ChatGPT, Midjourney, etc.)
          2. Virtual Cards (Visa/Mastercard) for international payments.
          3. Graphic Design services (Logo, Video Editing, UI/UX).
          
          Your tone should be professional, helpful, and luxury. 
          Always respond in the user's current language: ${language === 'en' ? 'English' : language === 'ps' ? 'Pashto' : 'Dari/Persian'}. 
          If the user asks for direct human contact, mention that they can click the WhatsApp or Telegram buttons at the top of the chat.
          Keep responses concise and focused on helping the user choose the right service.`,
        },
      });

      // Send the whole history to maintain context
      const response = await chat.sendMessage({ message: userMessage });
      const aiText = response.text || (isRTL ? "متاسفم، مشکلی در پاسخگویی پیش آمد. لطفا دوباره تلاش کنید." : "Sorry, something went wrong. Please try again.");
      
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: isRTL ? "در حال حاضر ارتباط با هوش مصنوعی برقرار نشد. می‌توانید از دکمه‌های تماس مستقیم استفاده کنید." : "Could not connect to AI right now. You can use direct contact buttons." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-background border border-foreground/10 rounded-[32px] overflow-hidden flex flex-col h-[85vh] md:h-[80vh] shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-foreground/10 flex items-center justify-between bg-foreground/5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-foreground">{t('consult_title')}</h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">AI Digital Consultant</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-colors text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Direct Contact Bar */}
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/5 border-b border-foreground/5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold">{t('contact_call')}:</span>
              <a href="https://wa.me/93777689141" target="_blank" rel="noreferrer" className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#25D366] hover:scale-105 transition-transform">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" /> {t('contact_whatsapp')}
              </a>
              <div className="hidden sm:block w-[1px] h-3 bg-foreground/10" />
              <a href="https://t.me/+13239902586" target="_blank" rel="noreferrer" className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#0088cc] hover:scale-105 transition-transform">
                <TelegramIcon className="w-3 h-3 sm:w-4 sm:h-4" /> {t('contact_telegram')}
              </a>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? (isRTL ? 20 : -20) : (isRTL ? -20 : 20) }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? (isRTL ? "ml-auto flex-row-reverse" : "mr-auto flex-row-reverse") : (isRTL ? "mr-auto" : "ml-auto")
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' ? "bg-foreground/5 text-foreground rounded-tr-none" : "bg-primary/10 text-foreground rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className={cn("flex gap-3", isRTL ? "mr-auto" : "ml-auto")}>
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/10 text-gray-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isRTL ? 'در حال فکر کردن...' : 'Thinking...'}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-foreground/10 bg-foreground/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('consult_placeholder')}
                  className={cn(
                    "w-full bg-background border border-foreground/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary/50 transition-colors text-sm text-foreground",
                    isRTL ? "pl-16" : "pr-16"
                  )}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-dark rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100",
                    isRTL ? "left-3" : "right-3"
                  )}
                >
                  <Send className={cn("w-5 h-5", !isRTL && "rotate-180")} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
