/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { cn } from '@/lib/utils';

export default function PostJobForm() {
  const { token } = useAuth();
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

      if (!res.ok) throw new Error(data.message || 'Failed to post job');

      setShowConfetti(true);
      toast.success('Job posted successfully! Waiting for admin approval 🎉', { 
        theme: 'dark', 
        position: 'top-center',
        autoClose: 4000 
      });

      setForm({
        title: '', company: '', location: '', salary: '', 
        type: 'full-time', description: '', requirements: ''
      });

      setTimeout(() => setShowConfetti(false), 3500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to post job. Please try again.', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.15} />}

      <div className="mb-10">
        <motion.h1 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-center"
        >
          Post a New Job
        </motion.h1>
        <p className="text-center text-base-content/70 mt-1 text-lg">
          Reach thousands of talented candidates instantly
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-base-100 border border-base-300 rounded-3xl p-8 md:p-12 shadow-xl w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-base-content">Job Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-base-200 focus:border-primary text-base"
              placeholder="Senior React Developer (Next.js 15)"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-2 text-base-content">Company Name *</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-base-200 focus:border-primary text-base"
              placeholder="TechNova Solutions"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2 text-base-content">Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-base-200 focus:border-primary text-base"
              placeholder="Dhaka, Bangladesh • Remote"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium mb-2 text-base-content">Salary Range *</label>
            <input
              type="text"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-base-200 focus:border-primary text-base"
              placeholder="৳80,000 - ৳150,000 BDT"
            />
          </div>
        </div>

        {/* Job Type */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-2 text-base-content">Job Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="select select-bordered w-full bg-base-200 focus:border-primary text-base"
            required
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Description */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-2 text-base-content">Job Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={7}
            className="textarea textarea-bordered w-full bg-base-200 focus:border-primary resize-y text-base"
            placeholder="Describe the role, responsibilities, qualifications, and what makes this opportunity exciting..."
          />
        </div>

        {/* Requirements */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-2 text-base-content">Requirements (one per line)</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={6}
            className="textarea textarea-bordered w-full bg-base-200 focus:border-primary resize-y text-base"
            placeholder="• React 18+ with TypeScript&#10;• Next.js 15 experience&#10;• Strong knowledge of Tailwind & Framer Motion"
          />
        </div>

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
  );
}