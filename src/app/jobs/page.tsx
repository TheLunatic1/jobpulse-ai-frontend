/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
}

export default function JobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  // Fetch approved jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        toast.error('Failed to load jobs', { theme: 'dark' });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async () => {
    if (!selectedJob || !coverLetter.trim() || !token) return;

    setApplying(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJob._id,
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Application submitted successfully! 🎉', { theme: 'dark' });
        setSelectedJob(null);
        setCoverLetter('');
      } else {
        toast.error(data.message || 'Failed to apply', { theme: 'dark' });
      }
    } catch (err) {
      toast.error('Something went wrong', { theme: 'dark' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base-100 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All Open Positions
            </h1>
            <p className="mt-4 text-xl text-base-content/70">
              {jobs.length} approved jobs • Updated in real-time
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {jobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={{
                  id: job._id,
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  salary: job.salary,
                  type: job.type,
                  image: `https://picsum.photos/id/${40 + index}/400/220`
                }}
                index={index}
              />
            ))}
          </motion.div>

          {jobs.length === 0 && (
            <div className="text-center py-20 text-2xl text-base-content/60">
              No approved jobs available at the moment.
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-base-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-primary mt-1">{selectedJob.company}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-3xl">✕</button>
              </div>

              <div className="p-8">
                <label className="block text-sm font-medium mb-3">Cover Letter (Why you?)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={8}
                  className="textarea textarea-bordered w-full bg-base-200 focus:border-primary"
                  placeholder="Tell us why you're excited about this role..."
                />
              </div>

              <div className="p-8 border-t flex gap-4">
                <button onClick={() => setSelectedJob(null)} className="btn btn-outline flex-1">Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleApply}
                  disabled={applying || !coverLetter.trim()}
                  className="btn btn-primary flex-1"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}