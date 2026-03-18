'use client';

import { motion } from 'framer-motion';
import JobCard from './JobCard';
import { staggerContainer } from '@/lib/animations';

export default function FeaturedJobsSection() {
  return (
    <section className="py-24 bg-base-200 relative overflow-hidden">
      {/* Animated subtle background */}
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
            AI has already recommended these to 3,847 candidates today
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <JobCard key={i} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-14"
        >
          <button className="btn btn-primary btn-lg px-16 text-lg shadow-xl">
            View All 18,472 Jobs →
          </button>
        </motion.div>
      </div>
    </section>
  );
}