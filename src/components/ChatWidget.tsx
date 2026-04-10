import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Sparkles, PhoneCall } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { trackEvent } from '../integrations/google';

const SYSTEM_INSTRUCTION = `You are the AI assistant for Apex Digital Consultants, a premier digital marketing agency serving Barbados and the wider Caribbean.
Your goal is to help potential clients understand our services, which include:
- Strategic Marketing
- Modern Design (Web, Branding, UI/UX)
- Digital Solutions (SEO, Google Advertising, Content)
- Apex Training Academy (Digital skills training)
- Business Consulting

Be professional, helpful, and concise. If you don't know something specific about pricing or availability, encourage the user to book a consultation or use the contact form.
Our contact info: 
- Phone: +1 (246) 841-6543
- Email: info@apexdigitalconsultants.com
- Location: Bridgetown, Barbados`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! I\'m the Apex AI. How can I help you elevate your brand today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsMinimized(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsMinimized(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      const apiKey =
        import.meta.env.VITE_GEMINI_API_KEY ||
        globalThis.process?.env?.GEMINI_API_KEY ||
        '';

      if (!apiKey) {
        setMessages(prev => [
          ...prev,
          {
            role: 'ai',
            text: 'AI chat is temporarily unavailable. Please use the contact form or email us at info@apexdigitalconsultants.com.'
          }
        ]);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser: ${userMessage}` }] }
        ],
      });

      const response = await model;
      const text = response.text || "I'm sorry, I couldn't process that request.";
      
      setMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now. Please try again later or contact us directly!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    trackEvent('whatsapp_click', {
      source: 'chat-widget',
      link_url: 'https://wa.me/12468416543',
      page_path: window.location.pathname
    });
    window.open('https://wa.me/12468416543', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end gap-3">
      {/* Side Tab (Visible when minimized) */}
      <AnimatePresence>
        {isMinimized && !isOpen && (
          <motion.button
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            whileHover={{ x: -5 }}
            onClick={() => setIsMinimized(false)}
            className="fixed right-0 bottom-24 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 bg-apex-yellow py-4 sm:py-6 px-2 sm:px-3 rounded-l-xl sm:rounded-l-2xl shadow-2xl border-l border-t border-b border-black/10 group z-[110] flex flex-col items-center gap-2 sm:gap-3 cursor-pointer"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-apple-gray-500 rounded-full"
            />
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-apple-gray-500" />
              <div className="h-9 sm:h-12 w-[1px] bg-apple-gray-500/20" />
              <span className="[writing-mode:vertical-rl] text-[10px] sm:text-[12px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-apple-gray-500 py-1 sm:py-2">
                Support
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Bubble */}
      <AnimatePresence>
        {!isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3"
          >
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border border-black/5">
              <span className="text-xs font-bold text-apple-gray-500">Contact us</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openWhatsApp}
              className="w-12 h-12 bg-[#25D366] rounded-xl shadow-xl flex items-center justify-center text-white"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[calc(100vw-1rem)] max-w-[350px] h-[min(500px,78vh)] sm:h-[500px] bg-white rounded-3xl shadow-2xl border border-black/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-apex-yellow p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-apex-yellow shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-apple-gray-500">Apex AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-apple-gray-500/70">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} className="text-apple-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-apple-gray-50/50"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-apex-yellow text-apple-gray-500 rounded-tr-none' 
                      : 'bg-white text-apple-gray-500 shadow-sm border border-black/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 rounded-tl-none">
                    <Loader2 size={18} className="animate-spin text-apex-yellow" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-black/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full pl-4 pr-12 py-3 bg-apple-gray-50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-apex-yellow/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-apex-yellow text-apple-gray-500 rounded-lg disabled:opacity-50 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 bg-apex-yellow rounded-xl shadow-xl flex items-center justify-center text-apple-gray-500 relative group"
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            {!isOpen && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
            
            {/* Tooltip */}
            {!isOpen && (
              <div className="hidden sm:block absolute right-16 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-black/5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-xs font-bold text-apple-gray-500">Chat with Apex AI</span>
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
