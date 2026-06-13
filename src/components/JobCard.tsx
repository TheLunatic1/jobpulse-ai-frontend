/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@/components/icons';

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  image: string;
};

export default function JobCard({ job, index = 0, onApply }: { job: Job; index?: number; onApply?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{
        scale: 1.08,
        transition: { duration: 0.4, type: 'spring' },
      }}
      className="card bg-base-100 border border-base-300 hover:border-primary shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col group-hover:ring-2 group-hover:ring-primary/30 transition-all duration-300"
    >
      {/* Company Cover Placeholder */}
      <div className="w-full h-32 bg-linear-to-br from-primary/10 to-primary/30 flex items-center justify-center border-b border-base-300">
        <div className="w-16 h-16 rounded-2xl bg-base-100 shadow-md flex items-center justify-center border border-base-200">
          <span className="text-2xl font-bold text-primary">
            {job.company.substring(0, 2).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="text-primary font-medium mt-2">{job.company}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-3 mt-6 text-sm text-base-content/70 flex-1">
          <div className="flex items-center gap-2">
            <Icons.Location className="w-4 h-4" /> {job.location}
          </div>
          <div className="flex items-center gap-2 font-medium text-primary">
            <Icons.Salary className="w-4 h-4" /> {job.salary}
          </div>
          <div className="flex items-center gap-2">
            <Icons.Clock className="w-4 h-4" /> {job.type}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onApply}
          className="btn btn-primary mt-auto w-full text-base py-3 shadow-md group-hover:shadow-primary/40"
        >
          View Details & Apply
        </motion.button>
      </div>
    </motion.div>
  );
}