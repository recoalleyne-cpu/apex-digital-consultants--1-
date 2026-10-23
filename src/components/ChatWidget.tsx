import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Sparkles, PhoneCall } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are the AI assistant for Apex Digital Consultants, a premier digital marketing agency in Nassau, Bahamas.
Your goal is to help potential clients understand our services, which include:
- Strategic Marketing
- Modern Design (Web, Branding, UI/UX)
- Digital Solutions (SEO, Social Media, Content)
- Apex Training Academy (Digital skills training)
- Business Consulting

Be professional, helpful, and concise. If you don't know something specific about pricing or availability, encourage the user to book a consultation or use the contact form.
Our contact info:
- Phone: +1 (242) 805-2739
- Email: info@apexdigitalconsultants.com
- Location: Nassau, Bahamas`;

const WHATSAPP_URL = 'https://wa.me/12468416543';

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
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser: ${userMessage}` }]
        }]
      });

      const text = response.text || "I'm sorry, I couldn't process that request right now.";
      setMessages((prev) => [...prev, { role: 'ai', text }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: "I'm having trouble connecting right now. Please try again later or contact us directly!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pr-[max(env(safe-area-inset-right),0.75rem)]">
      <AnimatePresence>
        {isMinimized && !isOpen && (
          <motion.button
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            whileHover={{ x: -5 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-4 right-0 z-[110] flex flex-col items-center gap-3 rounded-l-2xl border-l border-t border-b border-black/10 bg-apex-yellow py-5 px-3 shadow-2xl transition-transform sm:bottom-8"
            aria-label="Open support tab"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-2 w-2 rounded-full bg-apple-gray-500"
            />
            <div className="flex flex-col items-center gap-2">
              <Sparkles size={16} className="text-apple-gray-500" />
              <div className="h-10 w-[1px] bg-apple-gray-500/20" />
              <span className="[writing-mode:vertical-rl] py-2 text-[11px] font-black uppercase tracking-[0.2em] text-apple-gray-500">
                Support
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3"
          >
            <div className="rounded-lg border border-black/5 bg-white px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-apple-gray-500">Contact us</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openWhatsApp}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xl"
              aria-label="Open WhatsApp support chat"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
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
            className="h-[min(70vh,500px)] w-[min(92vw,350px)] overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-apex-yellow p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-apex-yellow shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-apple-gray-500">Apex AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-apple-gray-500/70">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-black/5"
              >
                <X size={20} className="text-apple-gray-500" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-apple-gray-50/50 p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tr-none bg-apex-yellow text-apple-gray-500'
                        : 'rounded-tl-none border border-black/5 bg-white text-apple-gray-500 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none border border-black/5 bg-white p-4 shadow-sm">
                    <Loader2 size={18} className="animate-spin text-apex-yellow" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-black/5 bg-white p-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full rounded-xl bg-apple-gray-50 py-3 pl-4 pr-12 text-sm font-medium text-apple-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-yellow/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-apex-yellow p-2 text-apple-gray-500 transition-opacity disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen((current) => !current)}
            className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-apex-yellow text-apple-gray-500 shadow-xl"
            aria-label="Toggle support chat"
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            {!isOpen && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
            )}
            {!isOpen && (
              <div className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg border border-black/5 bg-white px-3 py-1.5 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <span className="text-xs font-bold text-apple-gray-500">Chat with Apex AI</span>
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
