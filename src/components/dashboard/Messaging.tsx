'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';
import { Send, X, MessageCircle } from 'lucide-react';

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  senderName?: string;
}

export default function Messaging() {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Socket Connection - Clean & Type-Safe
  useEffect(() => {
    if (!token || !user?.userId) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      reconnection: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected for messaging');
    });

    newSocket.on('receiveMessage', (msg: Message) => {
      if (selectedUserId && (msg.sender === selectedUserId || msg.receiver === selectedUserId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    setSocket(newSocket);

    // Proper cleanup - explicitly return void
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token, user?.userId, selectedUserId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const loadMessages = async (userId: string, userName: string) => {
  if (!token || !user) return;

  setLoading(true);
  setSelectedUserId(userId);
  setSelectedUserName(userName);
  setMessages([]);

  console.log(`🔄 Loading messages for userId: ${userId}`);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    console.log(`📥 Backend response:`, data);

    if (res.ok && data.success) {
      setMessages(data.messages || []);
      console.log(`✅ Loaded ${data.messages?.length || 0} messages from MongoDB`);
    } else {
      console.log('⚠️ Backend returned no messages');
      setMessages([]);
    }
  } catch (err) {
    console.error('❌ Failed to load messages:', err);
    setMessages([]);
  } finally {
    setLoading(false);
  }
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedUserId || !socket || !user?.userId) {
      toast.error("Cannot send message");
      return;
    }

    const roomId = [user.userId, selectedUserId].sort().join('-');

    const newMsg: Message = {
      _id: Date.now().toString(),
      sender: user.userId,
      receiver: selectedUserId,
      content: input.trim(),
      createdAt: new Date().toISOString(),
      senderName: user.name,
    };

    socket.emit('sendMessage', {
      senderId: user.userId,
      receiverId: selectedUserId,
      content: input.trim(),
      roomId,
      senderName: user.name,
    });

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const demoContacts = [
    { id: 'demo-recruiter-1', name: 'TechNova HR', role: 'Recruiter' },
    { id: 'demo-recruiter-2', name: 'Daffodil Talent', role: 'Recruiter' },
  ];

  return (
    <div className="h-full flex flex-col bg-base-100 rounded-3xl overflow-hidden border border-base-300 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-base-300 bg-base-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">Messages</h2>
            <p className="text-sm text-base-content/60">Real-time • Saved in MongoDB</p>
          </div>
        </div>

        <AnimatePresence>
          {selectedUserId && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setSelectedUserId(null);
                setMessages([]);
              }}
              className="btn btn-ghost btn-circle"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts List */}
        <div className="w-80 border-r border-base-300 bg-base-200 p-5 overflow-y-auto">
          <div className="mb-6">
            <input type="text" placeholder="Search contacts..." className="input input-bordered w-full bg-base-100" />
          </div>
          <div className="space-y-3">
            {demoContacts.map((contact) => (
              <motion.button
                key={contact.id}
                whileHover={{ scale: 1.02, x: 6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadMessages(contact.id, contact.name)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                  selectedUserId === contact.id ? 'bg-primary/10 border border-primary/40' : 'hover:bg-base-300'
                }`}
              >
                <div className="avatar placeholder">
                  <div className="bg-primary/20 text-primary w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl">
                    {contact.name.slice(0, 2)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-xs text-base-content/60">{contact.role}</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              <div className="p-5 border-b border-base-300 bg-base-200 flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-gradient-to-br from-primary to-blue-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {selectedUserName.slice(0, 2)}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xl">{selectedUserName}</p>
                  <p className="text-sm text-green-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 bg-base-100">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageCircle className="w-20 h-20 text-base-content/30 mb-6" />
                      <p className="text-2xl font-light">No messages yet</p>
                      <p className="text-base-content/50 mt-2">Be the first to say hello ✨</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={msg._id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`flex ${msg.sender === user?.userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] px-6 py-4 rounded-3xl text-[15.5px] leading-relaxed shadow-sm ${
                          msg.sender === user?.userId
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-base-200 text-base-content rounded-bl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-base-300 bg-base-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="input input-bordered flex-1 bg-base-100"
                  />
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="btn btn-primary px-10"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center px-12">
              <div>
                <MessageCircle className="w-24 h-24 mx-auto text-base-content/30 mb-8" />
                <h3 className="text-3xl font-semibold mb-3">Real-time Messaging</h3>
                <p className="text-base-content/60">Select a contact to start chatting with beautiful animations</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}