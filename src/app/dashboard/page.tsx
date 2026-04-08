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
import AdminPanel from '@/components/dashboard/AdminPanel';
import Link from 'next/link';
import { Icons } from '@/components/icons';

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
              <motion.div 
                key="overview" 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="mb-10">
                  <h1 className="text-5xl font-bold tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
                  </h1>
                  <p className="text-2xl text-base-content/70 mt-3">
                    {user?.role === 'jobseeker' && "Here's what's happening with your job hunt today"}
                    {user?.role === 'employer' && "Here's what's happening with your hiring today"}
                    {user?.role === 'admin' && "Platform overview at a glance"}
                  </p>
                </div>
                        
                {/* Role-Specific Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {user?.role === 'jobseeker' && (
                    <>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-primary">12</div>
                        <div className="text-sm text-base-content/70 mt-2">Jobs Applied</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-green-400">3</div>
                        <div className="text-sm text-base-content/70 mt-2">Interviews</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-purple-400">8</div>
                        <div className="text-sm text-base-content/70 mt-2">New Matches</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-amber-400">94%</div>
                        <div className="text-sm text-base-content/70 mt-2">Profile Strength</div>
                      </div>
                    </>
                  )}
            
                  {user?.role === 'employer' && (
                    <>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-primary">7</div>
                        <div className="text-sm text-base-content/70 mt-2">Active Postings</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-green-400">19</div>
                        <div className="text-sm text-base-content/70 mt-2">Applications Received</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-purple-400">4</div>
                        <div className="text-sm text-base-content/70 mt-2">Pending Review</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-amber-400">3</div>
                        <div className="text-sm text-base-content/70 mt-2">Hired This Month</div>
                      </div>
                    </>
                  )}
            
                  {user?.role === 'admin' && (
                    <>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-primary">248</div>
                        <div className="text-sm text-base-content/70 mt-2">Total Users</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-red-400">5</div>
                        <div className="text-sm text-base-content/70 mt-2">Pending Jobs</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-purple-400">42</div>
                        <div className="text-sm text-base-content/70 mt-2">Total Jobs</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-green-400">19</div>
                        <div className="text-sm text-base-content/70 mt-2">Applications Today</div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Role-Specific Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                  {user?.role === 'jobseeker' && (
                    <>
                      <Link href="/jobs" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Search className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Find New Jobs</h3>
                          <p className="text-base-content/70 mt-3">Browse latest opportunities matched for you</p>
                        </motion.div>
                      </Link>
                  
                      <Link href="/ai-coach" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Bot className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Talk to AI Coach</h3>
                          <p className="text-base-content/70 mt-3">Get instant career advice right now</p>
                        </motion.div>
                      </Link>
                  
                      <Link href="/dashboard?view=my-applications" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Send className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Track Applications</h3>
                          <p className="text-base-content/70 mt-3">See status of all your applications</p>
                        </motion.div>
                      </Link>
                    </>
                  )}
            
                  {user?.role === 'employer' && (
                    <>
                      <Link href="/dashboard?view=post-job" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Building className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Post New Job</h3>
                          <p className="text-base-content/70 mt-3">Reach thousands of talented candidates</p>
                        </motion.div>
                      </Link>
                  
                      <Link href="/dashboard?view=my-postings" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Briefcase className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">My Postings</h3>
                          <p className="text-base-content/70 mt-3">Manage all your active job listings</p>
                        </motion.div>
                      </Link>
                  
                      <Link href="/dashboard?view=applications" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Send className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Applications Received</h3>
                          <p className="text-base-content/70 mt-3">Review candidates who applied</p>
                        </motion.div>
                      </Link>
                    </>
                  )}
            
                  {user?.role === 'admin' && (
                    <>
                      <Link href="/dashboard?view=manage-users" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.UserCircle className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Manage Users</h3>
                          <p className="text-base-content/70 mt-3">View and manage all platform users</p>
                        </motion.div>
                      </Link>
                  
                      <Link href="/dashboard?view=manage-jobs" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Briefcase className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Manage Jobs</h3>
                          <p className="text-base-content/70 mt-3">Review and approve pending jobs</p>
                        </motion.div>
                      </Link>
                  
                      <div className="bg-base-200 p-8 rounded-3xl border border-base-300">
                        <Icons.Send className="w-10 h-10 text-primary mb-6" />
                        <h3 className="font-semibold text-2xl">Platform Stats</h3>
                        <p className="text-base-content/70 mt-3">Everything is running smoothly</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'ai-coach' && <DashboardAICoach />}

            {activeView === 'post-job' && <PostJobForm />}

            {activeView === 'my-applications' && <MyApplications />}

            {activeView === 'my-postings' && <MyPostings />}

            {activeView === 'applications' && <EmployerApplications />}

            {activeView === 'manage-users' && <AdminPanel activeView={activeView} />}
            {activeView === 'manage-jobs' && <AdminPanel activeView={activeView} />}

            {/* Add more views here later */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}