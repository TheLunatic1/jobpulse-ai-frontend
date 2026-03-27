/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import StatusBadge from './StatusBadge';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminPanel({ activeView }: { activeView: string }) {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;

      try {
        // === USERS (already correct) ===
        const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        if (usersData.success) setUsers(usersData.users);

        // === JOBS - NOW SENDING TOKEN (this was the bug) ===
        const jobsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const jobsData = await jobsRes.json();
        if (jobsData.success) setJobs(jobsData.jobs || []);
      } catch (err) {
        toast.error('Failed to load admin data', { theme: 'dark' });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  const approveJob = async (jobId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Job approved successfully', { theme: 'dark' });
        setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: 'approved' } : j));
      }
    } catch (err) {
      toast.error('Failed to approve job', { theme: 'dark' });
    }
  };

  const rejectJob = async (jobId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Job rejected', { theme: 'dark' });
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      toast.error('Failed to reject job', { theme: 'dark' });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {activeView === 'manage-users' ? 'Manage Users' : 'Manage Jobs'}
        </h1>
      </div>

      {activeView === 'manage-users' && (
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center bg-base-200 p-6 rounded-2xl border border-base-300"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-base-content/70">{user.email}</p>
              </div>
              <div className="badge badge-outline capitalize">{user.role}</div>
            </motion.div>
          ))}
        </div>
      )}

      {activeView === 'manage-jobs' && (
        <div className="space-y-6">
          {jobs
            .filter(j => j.status === 'pending')
            .map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-base-200 border border-base-300 p-8 rounded-3xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{job.title}</h3>
                    <p className="text-primary mt-1">{job.company}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <div className="mt-8 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => approveJob(job._id)}
                    className="btn btn-success flex-1"
                  >
                    Approve Job
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => rejectJob(job._id)}
                    className="btn btn-error flex-1"
                  >
                    Reject Job
                  </motion.button>
                </div>
              </motion.div>
            ))}

          {jobs.filter(j => j.status === 'pending').length === 0 && (
            <div className="text-center py-12 text-base-content/60">
              No pending jobs to review at the moment.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}