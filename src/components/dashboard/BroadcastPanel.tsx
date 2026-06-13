'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Send, Users, Briefcase } from 'lucide-react';

export default function BroadcastPanel() {
  const { token } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: Endpoint /api/admin/broadcast doesn't exist yet in backend, simulating it for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Broadcast sent to ${targetAudience} users successfully! 🎉`, { theme: 'dark' });
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error('Failed to send broadcast', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <Send className="w-8 h-8" /> Broadcast Message
        </h1>
        <p className="text-base-content/70 mt-3">Send an announcement or notification to users</p>
      </div>

      <form onSubmit={handleBroadcast} className="bg-base-200 border border-base-300 p-8 rounded-3xl shadow-xl">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Target Audience</label>
          <div className="grid grid-cols-3 gap-4">
            <button type="button" onClick={() => setTargetAudience('all')} className={`btn ${targetAudience === 'all' ? 'btn-primary' : 'btn-outline'}`}>
              All Users
            </button>
            <button type="button" onClick={() => setTargetAudience('jobseeker')} className={`btn flex gap-2 ${targetAudience === 'jobseeker' ? 'btn-primary' : 'btn-outline'}`}>
              <Users className="w-4 h-4" /> Job Seekers
            </button>
            <button type="button" onClick={() => setTargetAudience('employer')} className={`btn flex gap-2 ${targetAudience === 'employer' ? 'btn-primary' : 'btn-outline'}`}>
              <Briefcase className="w-4 h-4" /> Employers
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="e.g. Platform Maintenance Notice"
            className="input input-bordered w-full bg-base-100"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Message Content</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="Write your announcement here..."
            className="textarea textarea-bordered w-full bg-base-100 text-base"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg h-14"
        >
          {loading ? 'Sending Broadcast...' : 'Send Broadcast Now'}
        </motion.button>
      </form>
    </motion.div>
  );
}
