'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardAICoach from '@/components/dashboard/DashboardAICoach';
import PostJobForm from '@/components/dashboard/PostJobForm';
import MyApplications from '@/components/dashboard/MyApplications';
import MyPostings from '@/components/dashboard/MyPostings';
import EmployerApplications from '@/components/dashboard/EmployerApplications';

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) {
      toast.info('Please login to access dashboard', { theme: 'dark' });
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar */}
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        <DashboardHeader
          activeView={activeView}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        />

        {/* Content Area - Full space beside sidebar */}
        <div className="p-8 min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-4xl font-bold">Welcome back, {user.name?.split(' ')[0]}!</h2>
                <p className="mt-4 text-lg text-base-content/70">Overview with heavy animations coming soon...</p>
              </motion.div>
            )}

            {activeView === 'ai-coach' && <DashboardAICoach />}

            {activeView === 'post-job' && <PostJobForm />}

            {activeView === 'my-applications' && <MyApplications />}

            {activeView === 'my-postings' && <MyPostings />}

            {activeView === 'applications' && <EmployerApplications />}

            {/* Add more views here later */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}