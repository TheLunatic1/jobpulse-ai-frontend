'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Icons } from '@/components/icons';

export default function ProfileSettings() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.user);
        }
      } catch (err) {
        console.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully! 🎉', { theme: 'dark' });
        setProfile(data.user);
      } else {
        toast.error(data.message || 'Failed to update profile', { theme: 'dark' });
      }
    } catch (err) {
      toast.error('Something went wrong', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-base-content/70 mt-2">Manage your account details and resume</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-base-200 p-8 rounded-3xl shadow-xl border border-base-300">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="input input-bordered w-full bg-base-100"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={profile.email || ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="input input-bordered w-full bg-base-100"
            required
            disabled // Often email change requires verification
          />
        </div>

        {user?.role === 'jobseeker' && (
          <div className="mb-8 p-6 bg-base-100 rounded-2xl border border-base-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icons.Briefcase className="w-5 h-5 text-primary" />
              Resume (PDF only)
            </h3>
            
            {profile.resumeUrl ? (
              <div className="mb-4">
                <a 
                  href={`${process.env.NEXT_PUBLIC_API_URL}${profile.resumeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  View Current Resume
                </a>
              </div>
            ) : (
              <p className="text-sm text-base-content/60 mb-4">No resume uploaded yet.</p>
            )}

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg h-14"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </motion.div>
  );
}
