/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      toast.info('Please login to access dashboard', { theme: 'dark' });
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) {
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

  if (!user) return null; // Redirect handled in useEffect

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Welcome back, <span className="text-blue-400">{user.name}</span>!
        </h1>
        <p className="text-gray-400 mb-12">
          Role: <span className="font-medium text-purple-400 capitalize">{user.role}</span>
        </p>

        {/* Role-based content */}
        {user.role === 'jobseeker' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Recommended Jobs</h3>
              <p className="text-gray-300">You have 12 new matches today!</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">AI Coach</h3>
              <p className="text-gray-300">Ready for a career chat?</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-green-400 mb-3">Resume Score</h3>
              <p className="text-gray-300">Your resume is 82% ATS-friendly</p>
            </div>
          </motion.div>
        )}

        {user.role === 'employer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">Employer Dashboard</h3>
            <p className="text-gray-300 mb-6">Post new jobs and manage applicants</p>
            <button className="btn btn-primary btn-lg px-12">Post a New Job</button>
          </motion.div>
        )}

        {user.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Admin Dashboard</h3>
            <p className="text-gray-300 mb-6">Manage users, jobs, and platform stats</p>
            <button className="btn btn-primary btn-lg px-12">View Admin Panel</button>
          </motion.div>
        )}

        {/* Logout button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                useAuth().logout();
                router.push('/login');
              }
            }}
            className="text-red-400 hover:text-red-300 transition-colors text-lg"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}