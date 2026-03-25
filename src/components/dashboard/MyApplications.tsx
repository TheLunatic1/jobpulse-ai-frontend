/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Icons } from '@/components/icons';
import StatusBadge from './StatusBadge';

interface Application {
  _id: string;
  job: {
    title: string;
    company: string;
    location: string;
    salary: string;
  };
  coverLetter: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
}

export default function MyApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        toast.error('Failed to load applications', { theme: 'dark' });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'shortlisted': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          My Applications
        </h1>
        <p className="mt-3 text-base-content/70">Track the status of all your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20">
          <Icons.Send className="w-20 h-20 mx-auto text-base-content/30 mb-6" />
          <h3 className="text-2xl font-semibold mb-2">No applications yet</h3>
          <p className="text-base-content/60">Start applying from the Find Jobs page</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card bg-base-200 border border-base-300 shadow-xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">{app.job.title}</h3>
                  <p className="text-primary font-medium mt-1">{app.job.company}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex gap-3">
                  <Icons.Location className="w-4 h-4 mt-0.5" />
                  <span>{app.job.location}</span>
                </div>
                <div className="flex gap-3">
                  <Icons.Salary className="w-4 h-4 mt-0.5" />
                  <span>{app.job.salary}</span>
                </div>
              </div>

              <div className="bg-base-100 rounded-2xl p-5 text-sm">
                <p className="font-medium text-base-content/70 mb-2">Your Cover Letter:</p>
                <p className="line-clamp-4 text-base-content/80">{app.coverLetter}</p>
              </div>

              <div className="text-xs text-base-content/60 mt-6">
                Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}