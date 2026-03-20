/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Icons } from '@/components/icons';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { JSX } from 'react/jsx-runtime';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jobpulse-ai-backend.onrender.com';

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

type DashboardView = 
  | 'overview' 
  | 'recommended-jobs' 
  | 'ai-coach' 
  | 'post-job' 
  | 'manage-users' 
  | 'messages';

export default function DashboardPage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) {
      toast.info('Please login to access dashboard', { theme: 'dark' });
      router.push('/login');
    }
  }, [loading, token, router]);

  // Socket.IO connection
  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io(API_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('joinRoom', 'global-chat');
      setSocket(newSocket);
    });

    newSocket.on('receiveMessage', (data: Message) => {
      setMessages((prev) => [...prev, data]);
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, user, router]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !user) return;

    const msgData: Message = {
      senderId: user.id,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', {
      roomId: 'global-chat',
      ...msgData,
    });

    setNewMessage('');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Menu items with explicit icons
  const menuItems: { id: DashboardView; label: string; icon: JSX.Element; visibleFor?: string[] }[] = [
    { id: 'overview', label: 'Overview', icon: <Icons.Briefcase className="w-5 h-5" /> },
    { id: 'recommended-jobs', label: 'Recommended Jobs', icon: <Icons.Search className="w-5 h-5" />, visibleFor: ['jobseeker'] },
    { id: 'ai-coach', label: 'AI Coach', icon: <Icons.Bot className="w-5 h-5" />, visibleFor: ['jobseeker'] },
    { id: 'post-job', label: 'Post New Job', icon: <Icons.Building className="w-5 h-5" />, visibleFor: ['employer'] },
    { id: 'manage-users', label: 'Manage Users', icon: <Icons.UserCircle className="w-5 h-5" />, visibleFor: ['admin'] },
    { id: 'messages', label: 'Messages', icon: <Icons.Send className="w-5 h-5" /> },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !item.visibleFor || item.visibleFor.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-base-100 overflow-hidden">
      {/* Side Panel – Slide in with spring */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 22, stiffness: 140 }}
        className="w-72 bg-base-200 border-r border-base-300 fixed h-full z-50 lg:static lg:translate-x-0 overflow-y-auto shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors">
              JobPulse
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden text-2xl text-gray-400 hover:text-gray-200"
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>

          <div className="space-y-1">
            {visibleMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 w-full p-4 rounded-lg transition-all duration-300",
                  activeView === item.id 
                    ? "bg-primary/20 text-primary font-medium shadow-sm" 
                    : "hover:bg-base-300 text-base-content/80 hover:shadow-sm"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full p-4 rounded-lg hover:bg-red-500/20 text-red-400 transition-all duration-300 mt-8"
            >
              <Icons.Logout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Dashboard Header (always visible) */}
        <div className="border-b border-base-300 p-6 flex items-center justify-between bg-base-100 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-2xl text-gray-400 hover:text-gray-200">
            {sidebarOpen ? '✕' : '☰'}
          </button>

          <h1 className="text-2xl md:text-3xl font-bold">
            {visibleMenuItems.find(i => i.id === activeView)?.label || 'Dashboard'}
          </h1>

          {/* Avatar + Dropdown – fully clickable */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="avatar">
                <div className="w-10 md:w-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform group-hover:scale-105">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? 'User')}&background=random`}
                    alt={user.name ?? 'User'}
                  />
                </div>
              </div>
              <span className="font-medium text-base-content/80 group-hover:text-primary transition-colors hidden md:block">
                {user.name?.split(' ')[0] ?? 'User'}
              </span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-base-100 border border-base-300 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Icons.UserCircle className="w-5 h-5" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Icons.UserCircle className="w-5 h-5" />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Icons.Logout className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Overview / Dashboard */}
              {activeView === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">Welcome</h3>
                    <p className="text-gray-300">Hello {user.name}! Here&apos;s your quick overview.</p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Quick Stats</h3>
                    <p className="text-gray-300">Active sessions: 3</p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">Notifications</h3>
                    <p className="text-gray-300">2 new messages</p>
                  </motion.div>
                </div>
              )}

              {/* Job Seeker views */}
              {activeView === 'recommended-jobs' && user.role === 'jobseeker' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-4">Recommended Jobs</h3>
                    <p className="text-gray-300 mb-6">You have 12 new matches today!</p>
                  </motion.div>
                </div>
              )}

              {activeView === 'ai-coach' && user.role === 'jobseeker' && (
                <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">AI Career Coach</h3>
                  <p className="text-gray-300">Ready for a career chat? Ask anything!</p>
                </motion.div>
              )}

              {/* Employer view */}
              {activeView === 'post-job' && user.role === 'employer' && (
                <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-green-400 mb-4">Post a New Job</h3>
                  <button className="btn btn-primary btn-lg px-12 mt-6">Create Job Posting</button>
                </motion.div>
              )}

              {/* Admin view */}
              {activeView === 'manage-users' && user.role === 'admin' && (
                <motion.div whileHover={{ scale: 1.03 }} className="card bg-base-100 shadow-xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">Admin Panel</h3>
                  <button className="btn btn-primary btn-lg px-12 mt-6">Manage Users & Jobs</button>
                </motion.div>
              )}

              {/* Messages */}
              {activeView === 'messages' && (
                <div className="bg-base-100 rounded-xl h-[70vh] flex flex-col shadow-xl">
                  <div className="p-4 border-b border-base-300 font-semibold">Global Chat</div>
                  <div ref={chatWindowRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'p-3 rounded-lg max-w-[70%]',
                          msg.senderId === user.id ? 'bg-primary text-white ml-auto' : 'bg-base-200'
                        )}
                      >
                        <p className="font-medium">{msg.senderId === user.id ? 'You' : 'Other'}</p>
                        <p>{msg.message}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 input input-bordered"
                      placeholder="Type message..."
                    />
                    <button onClick={sendMessage} className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}