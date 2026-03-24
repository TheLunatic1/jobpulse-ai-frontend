/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthContext'
import { Bot, X } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function AICoachChat() {
  const { user, token } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Career Coach. How can I help you today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  if (!user || user.role !== 'jobseeker') return null

  const handleSend = async () => {
    if (!input.trim() || loading || !token) return

    const userMsg = { role: 'user' as const, content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    const currentInput = input.trim()
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'AI service error')

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err: any) {
      toast.error(err.message || 'Coach is taking a quick break', { theme: 'dark' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Simple & Reliable Bottom-Right Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-99999 w-16 h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-2xl flex items-center justify-center border border-blue-500/50 transition-all duration-200"
      >
        <Bot className="w-9 h-9 text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-99998 w-full max-w-95 h-130 bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-950">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-white">AI Career Coach</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-950"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Bot className="w-4 h-4" />
                  Thinking...
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about resume, interview..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-6 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white font-medium disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}