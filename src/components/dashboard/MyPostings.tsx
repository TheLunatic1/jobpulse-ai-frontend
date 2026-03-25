/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Icons } from '@/components/icons';
import StatusBadge from './StatusBadge';

interface PostedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  applicationsCount?: number;
}

export default function MyPostings() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<PostedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPostings = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        toast.error('Failed to load your postings', { theme: 'dark' });
      } finally {
        setLoading(false);
      }
    };

    fetchMyPostings();
  }, [token]);

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
          My Job Postings
        </h1>
        <p className="text-base-content/70 mt-3">Manage all the jobs you have posted</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20">
          <Icons.Building className="w-20 h-20 mx-auto text-base-content/30 mb-6" />
          <h3 className="text-2xl font-semibold mb-2">No postings yet</h3>
          <p className="text-base-content/60">Click &quot;Post New Job&ldquo; to create your first posting</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card bg-base-200 border border-base-300 shadow-xl p-8 hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-primary font-medium mt-1">{job.company}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="space-y-3 text-sm mb-8">
                <div className="flex gap-3">
                  <Icons.Location className="w-4 h-4 mt-0.5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex gap-3">
                  <Icons.Salary className="w-4 h-4 mt-0.5" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex gap-3">
                  <Icons.Clock className="w-4 h-4 mt-0.5" />
                  <span>{job.type}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-base-content/60">
                <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                <span className="font-medium">{job.applicationsCount || 0} applications</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}