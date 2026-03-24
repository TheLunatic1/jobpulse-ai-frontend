'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardAICoach from '@/components/dashboard/DashboardAICoach';
// Add more component imports later when we create them

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    if (!loading && !token) {
      toast.info('Please login first', { theme: 'dark' });
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`flex-1 transition-all ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        <DashboardHeader
          activeView={activeView}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        />

        <div className="p-8">
          {activeView === 'ai-coach' && <DashboardAICoach />}
          {activeView === 'overview' && <div className="text-4xl">Overview coming soon with heavy animations</div>}
          {/* Other views will be added in next steps */}
        </div>
      </div>
    </div>
  );
}