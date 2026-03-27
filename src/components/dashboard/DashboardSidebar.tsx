/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  visibleFor?: string[];
};

export default function DashboardSidebar({
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: <Icons.Briefcase className="w-5 h-5" /> },
    { id: 'recommended-jobs', label: 'Recommended Jobs', icon: <Icons.Search className="w-5 h-5" />, visibleFor: ['jobseeker'] },
    { id: 'ai-coach', label: 'AI Coach', icon: <Icons.Bot className="w-5 h-5" />, visibleFor: ['jobseeker'] },
    { id: 'my-applications', label: 'My Applications', icon: <Icons.Send className="w-5 h-5" />, visibleFor: ['jobseeker'] },

    { id: 'post-job', label: 'Post New Job', icon: <Icons.Building className="w-5 h-5" />, visibleFor: ['employer'] },
    { id: 'my-postings', label: 'My Postings', icon: <Icons.Briefcase className="w-5 h-5" />, visibleFor: ['employer'] },
    { id: 'applications', label: 'Applications', icon: <Icons.Send className="w-5 h-5" />, visibleFor: ['employer'] },

    { id: 'manage-users', label: 'Manage Users', icon: <Icons.UserCircle className="w-5 h-5" />, visibleFor: ['admin'] },
    { id: 'manage-jobs', label: 'Manage Jobs', icon: <Icons.Briefcase className="w-5 h-5" />, visibleFor: ['admin'] },
    { id: 'broadcast', label: 'Broadcast', icon: <Icons.Send className="w-5 h-5" />, visibleFor: ['admin'] },
    { id: 'messages', label: 'Messages', icon: <Icons.Send className="w-5 h-5" />, visibleFor: ['jobseeker', 'employer'] },
  ];

  const visibleItems = menuItems.filter(item => 
    !item.visibleFor || item.visibleFor.includes(user?.role || '')
  );

  const handleClick = (item: MenuItem) => {
    setActiveView(item.id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <motion.div
      initial={false}
      animate={{ x: sidebarOpen ? 0 : -280 }}
      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
      className="w-72 bg-base-200 border-r border-base-300 fixed h-full z-50 lg:static lg:translate-x-0 overflow-y-auto shadow-2xl"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">JobPulse AI</Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="lg:hidden text-3xl text-base-content/70"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className="space-y-1">
          {visibleItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClick(item)}
              className={cn(
                "flex items-center gap-3 w-full p-4 rounded-xl transition-all font-medium",
                activeView === item.id
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-base-300"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="flex items-center gap-3 w-full p-4 rounded-xl mt-8 text-red-400 hover:bg-red-500/10"
          >
            <Icons.Logout className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}