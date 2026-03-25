/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { cn } from '@/lib/utils';

export default function PostJobPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'full-time',
    description: '',
    requirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login first', { theme: 'dark' });
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.split('\n').filter(r => r.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server error (${res.status})`);
      }

      // Success animation
      setShowConfetti(true);
      toast.success('Job posted successfully! Waiting for admin approval 🎉', {
        theme: 'dark',
        position: 'top-center',
        autoClose: 3000,
      });

      // Reset form
      setForm({
        title: '', company: '', location: '', salary: '',
        type: 'full-time', description: '', requirements: '',
      });

      // Redirect after celebration
      setTimeout(() => {
        setShowConfetti(false);
        router.push('/dashboard');
      }, 2800);

    } catch (err: any) {
      toast.error(err.message || 'Failed to post job. Please try again.', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={600} gravity={0.12} />}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
          >
            Post a New Job
          </motion.h1>
          <p className="text-xl text-base-content/70">Reach thousands of talented candidates</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-base-200 border border-base-300 rounded-3xl p-10 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Title */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full input input-bordered bg-base-100 focus:border-primary"
                placeholder="Senior Frontend Developer"
              />
            </motion.div>

            {/* Company */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-sm font-medium mb-2">Company Name *</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className="w-full input input-bordered bg-base-100 focus:border-primary"
                placeholder="TechNova Solutions"
              />
            </motion.div>

            {/* Location */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full input input-bordered bg-base-100 focus:border-primary"
                placeholder="Dhaka, Bangladesh • Remote"
              />
            </motion.div>

            {/* Salary */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label className="block text-sm font-medium mb-2">Salary Range *</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                required
                className="w-full input input-bordered bg-base-100 focus:border-primary"
                placeholder="৳80,000 - ৳150,000"
              />
            </motion.div>
          </div>

          {/* Job Type */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <label className="block text-sm font-medium mb-2">Job Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full select select-bordered bg-base-100 focus:border-primary"
              required
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="mt-8">
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full textarea textarea-bordered bg-base-100 focus:border-primary resize-y"
              placeholder="Write detailed responsibilities, requirements, and benefits..."
            />
          </motion.div>

          {/* Requirements */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mt-8">
            <label className="block text-sm font-medium mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={5}
              className="w-full textarea textarea-bordered bg-base-100 focus:border-primary resize-y"
              placeholder="• React 18+&#10;• TypeScript experience&#10;• Next.js knowledge"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "mt-12 w-full py-5 text-xl font-bold rounded-2xl shadow-xl transition-all",
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full" />
                Posting Job...
              </span>
            ) : (
              'Submit for Admin Approval'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}