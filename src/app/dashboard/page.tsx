/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';


import Messaging from '@/components/dashboard/Messaging';
import type { Message } from '@/components/dashboard/Messaging';   // if you exported it, otherwise define locally
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Record<string, Message[]>>({});

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  // Dynamic stats
  const [stats, setStats] = useState({
    jobsApplied: 0,
    interviews: 0,
    newMatches: 0,
    activePostings: 0,
    applicationsReceived: 0,
    pendingReview: 0,
    totalUsers: 0,
    pendingJobs: 0,
    totalJobs: 0,
    applicationsToday: 0,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) {
      toast.info('Please login to access dashboard', { theme: 'dark' });
      router.push('/login');
    }
  }, [loading, token, router]);

  // Fetch role-specific stats
  useEffect(() => {
    if (!token || !user) return;

    const fetchStats = async () => {
      try {
        if (user.role === 'jobseeker') {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/my`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            setStats(prev => ({ ...prev, jobsApplied: data.applications?.length || 0 }));
          }
        } 
        else if (user.role === 'employer') {
          const postingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/my`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const postingsData = await postingsRes.json();

          const appsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/employer`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const appsData = await appsRes.json();

          setStats(prev => ({
            ...prev,
            activePostings: postingsData.jobs?.length || 0,
            applicationsReceived: appsData.applications?.length || 0,
          }));
        } 
        else if (user.role === 'admin') {
          const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(prev => ({
              ...prev,
              totalUsers: statsData.stats.totalUsers || 0,
              pendingJobs: statsData.stats.pendingJobs || 0,
              totalJobs: statsData.stats.totalJobs || 0,
              applicationsToday: statsData.stats.applicationsToday || 0,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load stats');
      }
    };

    fetchStats();
  }, [token, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
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

                {/* Dynamic Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {user?.role === 'jobseeker' && (
                    <>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-primary">{stats.jobsApplied}</div>
                        <div className="text-sm text-base-content/70 mt-2">Jobs Applied</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-green-400">3</div>
                        <div className="text-sm text-base-content/70 mt-2">Interviews Scheduled</div>
                      </div>
                    </>
                  )}

                  {user?.role === 'employer' && (
                    <>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-primary">{stats.activePostings}</div>
                        <div className="text-sm text-base-content/70 mt-2">Active Postings</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-green-400">{stats.applicationsReceived}</div>
                        <div className="text-sm text-base-content/70 mt-2">Applications Received</div>
                      </div>
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-primary">{stats.totalUsers}</div>
                        <div className="text-sm text-base-content/70 mt-2">Total Users</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-red-400">{stats.pendingJobs}</div>
                        <div className="text-sm text-base-content/70 mt-2">Pending Jobs</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-purple-400">{stats.totalJobs}</div>
                        <div className="text-sm text-base-content/70 mt-2">Total Jobs</div>
                      </div>
                      <div className="bg-base-200 rounded-3xl p-8 text-center border border-base-300">
                        <div className="text-4xl font-bold text-green-400">{stats.applicationsToday}</div>
                        <div className="text-sm text-base-content/70 mt-2">Applications Today</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                  {user?.role === 'jobseeker' && (
                    <>
                      <Link href="/jobs" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Search className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Find New Jobs</h3>
                          <p className="text-base-content/70 mt-3">Browse latest opportunities</p>
                        </motion.div>
                      </Link>

                      <Link href="/ai-coach" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Bot className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Talk to AI Coach</h3>
                          <p className="text-base-content/70 mt-3">Get instant career advice</p>
                        </motion.div>
                      </Link>

                      <Link href="/dashboard?view=my-applications" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Send className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Track Applications</h3>
                          <p className="text-base-content/70 mt-3">See status of all applications</p>
                        </motion.div>
                      </Link>
                    </>
                  )}

                  {/* Employer & Admin quick actions remain the same as before */}
                  {user?.role === 'employer' && (
                    <>
                      <Link href="/dashboard?view=post-job" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Building className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Post New Job</h3>
                          <p className="text-base-content/70 mt-3">Reach thousands of candidates</p>
                        </motion.div>
                      </Link>
                      {/* ... other employer actions */}
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <Link href="/dashboard?view=manage-users" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.UserCircle className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Manage Users</h3>
                          <p className="text-base-content/70 mt-3">View and manage users</p>
                        </motion.div>
                      </Link>
                      <Link href="/dashboard?view=manage-jobs" className="block">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-base-200 p-8 rounded-3xl border border-base-300 hover:border-primary h-full">
                          <Icons.Briefcase className="w-10 h-10 text-primary mb-6" />
                          <h3 className="font-semibold text-2xl">Manage Jobs</h3>
                          <p className="text-base-content/70 mt-3">Review pending jobs</p>
                        </motion.div>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Other views remain the same */}
            {activeView === 'ai-coach' && <DashboardAICoach />}
            {activeView === 'post-job' && <PostJobForm />}
            {activeView === 'my-applications' && <MyApplications />}
            {activeView === 'my-postings' && <MyPostings />}
            {activeView === 'applications' && <EmployerApplications />}
            {activeView === 'manage-users' && <AdminPanel activeView={activeView} />}
            {activeView === 'manage-jobs' && <AdminPanel activeView={activeView} />}
            {activeView === 'messages' && <Messaging />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}