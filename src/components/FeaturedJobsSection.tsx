/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard';
import { staggerContainer } from '@/lib/animations';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
}

export default function FeaturedJobsSection() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`);
        const data = await res.json();
        if (data.success) {
          // Take only first 8 approved jobs
          setFeaturedJobs(data.jobs.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to fetch featured jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-base-200 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-bold"
          >
            🔥 Trending Jobs Right Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-base-content/70 mt-3"
          >
            AI has already recommended these to thousands of candidates today
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {featuredJobs.map((job, i) => (
              <JobCard 
                key={job._id} 
                job={{
                  id: job._id,
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  salary: job.salary,
                  type: job.type,
                  image: `https://picsum.photos/id/${50 + i}/400/220`
                }} 
                index={i} 
              />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-14"
        >
          <Link href="/jobs">
            <button className="btn btn-primary btn-lg px-16 text-lg shadow-xl hover:scale-105 transition-transform">
              View All {featuredJobs.length}+ Jobs →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}