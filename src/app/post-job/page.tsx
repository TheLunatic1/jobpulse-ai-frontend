/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function PostJobPage() {
  const { token } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'full-time',
    description: '',
    requirements: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('Submitting job...', { form, token: token ? 'present' : 'missing' })

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.split('\n').filter(r => r.trim()),
        }),
      })

      const data = await res.json()
      console.log('Response status:', res.status, 'Data:', data)

      if (!res.ok) {
        throw new Error(data.message || `Server error ${res.status}`)
      }

      toast.success('Job posted successfully! Waiting for admin approval 🎉', {
        theme: 'dark',
        position: 'top-right',
        autoClose: 4000,
      })

      // Reset form
      setForm({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'full-time',
        description: '',
        requirements: '',
      })

      // Redirect after success
      setTimeout(() => router.push('/dashboard'), 2200)
    } catch (err: any) {
      console.error('Job post error:', err)

      const errorMessage = err.message || 'Failed to post job. Please try again.'
      
      if (err.message.includes('401') || err.message.includes('Not authorized')) {
        toast.error('Session expired. Please login again.', { theme: 'dark' })
        setTimeout(() => router.push('/login'), 2000)
      } else {
        toast.error(errorMessage, { theme: 'dark' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl shadow-blue-900/30 p-8 md:p-12"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Post a New Job
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Title */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Senior React Developer"
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white"
              required
            />
          </motion.div>

          {/* Company */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="TechNova Solutions"
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white"
              required
            />
          </motion.div>

          {/* Location + Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh / Remote"
                className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary Range *</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="৳80,000 - ৳150,000"
                className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white"
                required
              />
            </motion.div>
          </div>

          {/* Job Type */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white"
              required
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed responsibilities, qualifications, benefits..."
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white h-40 resize-none"
              required
            />
          </motion.div>

          {/* Requirements */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder="• React 18+&#10;• TypeScript experience&#10;• Next.js knowledge"
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white h-40 resize-none"
            />
          </motion.div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-5 mt-8 rounded-xl font-bold text-lg shadow-xl transition-all duration-300",
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Posting...
              </span>
            ) : (
              'Submit for Admin Approval'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}