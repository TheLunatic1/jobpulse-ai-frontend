/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Bot, X } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function DashboardAICoach() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 Ask me anything about your career!` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !token) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    const current = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: current }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      toast.error(err.message || 'Coach is offline', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] px-5 py-4 rounded-3xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && <div className="flex items-center gap-2 text-gray-400">Coach is thinking...</div>}
      </div>

      <div className="p-6 border-t border-base-300 bg-base-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about resume, interview prep..."
            className="flex-1 input input-bordered"
            disabled={loading}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn btn-primary px-8"
          >
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}