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
  };
  applicant: {
    name: string;
    email: string;
  };
  coverLetter: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
}

export default function EmployerApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/employer`, {
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

  const updateStatus = async (applicationId: string, newStatus: 'shortlisted' | 'accepted' | 'rejected') => {
    setUpdatingId(applicationId);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Application ${newStatus}`, { theme: 'dark' });
        // Refresh list
        setApplications(prev => 
          prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
        );
      } else {
        toast.error(data.message || 'Failed to update', { theme: 'dark' });
      }
    } catch (err) {
      toast.error('Something went wrong', { theme: 'dark' });
    } finally {
      setUpdatingId(null);
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
          Applications Received
        </h1>
        <p className="text-base-content/70 mt-3">Review and manage candidates who applied to your jobs</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20">
          <Icons.Send className="w-20 h-20 mx-auto text-base-content/30 mb-6" />
          <h3 className="text-2xl font-semibold mb-2">No applications yet</h3>
          <p className="text-base-content/60">When candidates apply to your jobs, they will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
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
                  <p className="text-sm text-base-content/70 mt-1">Applicant: {app.applicant.name} ({app.applicant.email})</p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="bg-base-100 rounded-2xl p-6 mb-8">
                <p className="font-medium text-base-content/70 mb-2">Cover Letter:</p>
                <p className="text-base-content/80 leading-relaxed">{app.coverLetter}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {app.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(app._id, 'shortlisted')}
                      disabled={updatingId === app._id}
                      className="btn btn-success btn-sm flex-1"
                    >
                      Shortlist
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(app._id, 'accepted')}
                      disabled={updatingId === app._id}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(app._id, 'rejected')}
                      disabled={updatingId === app._id}
                      className="btn btn-error btn-sm flex-1"
                    >
                      Reject
                    </motion.button>
                  </>
                )}
                {app.status !== 'pending' && (
                  <div className="text-sm text-base-content/60 py-2">
                    Status updated on {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}