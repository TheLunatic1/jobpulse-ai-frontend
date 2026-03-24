/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function DashboardHeader({
  activeView,
  setSidebarOpen,
  sidebarOpen,
}: {
  activeView: string;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <div className="border-b border-base-300 p-6 flex items-center justify-between bg-base-100 sticky top-0 z-40">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden text-3xl text-base-content/70 hover:text-base-content"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Page title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold tracking-tight"
      >
        {activeView === 'ai-coach' ? 'AI Career Coach' : 'Dashboard'}
      </motion.h1>

      {/* Clickable Avatar + Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 focus:outline-none group"
        >
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all group-hover:ring-2">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                alt={user?.name || 'User'}
                className="rounded-full"
              />
            </div>
          </div>
          <span className="font-medium text-base-content/80 group-hover:text-primary hidden md:block">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-56 bg-base-100 border border-base-300 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
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
                  className="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-red-500/10 hover:text-red-400 transition-colors"
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
  );
}